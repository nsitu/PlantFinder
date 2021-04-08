// Node.js will request a client-side Trefle token for the frontend
// Tokens are domain-specific so they won't work on other sites
let token 
fetch('/PlantFinder/token/')
  .then(response => response.json())
  .then(result =>  { 
      token = result['token']; 
      // once the token is loaded we can unhide the navigation
      document.getElementById("navigation").style.display = "block";
   })
  .catch(error => console.log('error', error));

// when the form is submitted, run the search
const formSubmit = (event) => {
   event.preventDefault();
   let terms = document.getElementById("search").value;
   search(terms);
}

// runs a search for the given terms
// and trigger a rendering for each one
const search = (terms) => {
  // clear the previous search
  document.getElementById("content").innerHTML = '';
  terms = encodeURIComponent( terms)
  fetch('https://trefle.io/api/v1/plants/search?q='+terms+'&token='+token  )
    .then(response => response.json())
    .then(plants => {
        console.log(plants)
        for (i in plants.data){ 
          render(plants.data[i]); 
        }
     })
    .catch(error => console.log('error', error));
}

// render the plant by fetching additional details
const render = (thePlant) => {
  
  // fetch full details about the plant
  fetch(  'https://trefle.io/api/v1/plants/'+thePlant.id+'?token='+token )
  .then( response => response.json() )
  .then( json => {

    // console.log(json);
    
    // show the common name but only if there is one on record
    let theName = (json.data.common_name)?
      '<div class="card-action">'+
        '<a href="#">'+json.data.common_name+'</a>'+
      '</div>':'';

    // show a default icon if no image is provided.
    let theImg = 'plant.png';
    if (typeof json.data.image_url == "string"){
      // floristic doesnt have a valid cert so we will use plantnet instead
      theImg = json.data.image_url.replace("floristic", "plantnet");
    } 

    // Generate HTML for a plant listing.
    // See https://materializecss.com/cards.html
    document.getElementById("content").innerHTML +=
    '<div class="col s12 m7">'+
      '<h2 class="header">'+json.data.scientific_name+'</h2>'+
      '<div class="card horizontal">'+
        '<div class="card-image">'+
          '<img width="150" src="'+theImg+'">'+
        '</div>'+
        '<div class="card-stacked">'+
          '<div class="card-content">'+
            '<b>Family</b>: '+ json.data.main_species.family+'<br/>'+
            '<b>Genus</b>: '+ json.data.main_species.genus+'</p>'+
          '</div>'+
            theName +
        '</div>'+
      '</div>'+
    '</div>';
  })
 .catch(error => console.log('error', error));
}