// create mock data of json array
// default card

const MOCK_CARD = {
  "cardStructure" : [
    {
      "id": "1234567", 
      "headline": "Happy Valentine's Day", 
      "bodyText": "Always Bring the Thunder",
      "character": "Storm", // references the array I need to write
     // "signature": "Love, Joe",  // added this because a card should have a signature
     // "publishedAt": 1470011976609 // added in case I want to order cards chronologically per account
      "image": "http://i.annihil.us/u/prod/marvel/i/mg/6/40/526963dad214d/portrait_uncanny.jpg"
    }
  ]
}


// for each card reference the object in the array with character/image
const CHARACTER_LIST = [
  {
    "character": "Storm", 
    "characterImage": "http://i.annihil.us/u/prod/marvel/i/mg/6/40/526963dad214d/portrait_uncanny.jpg",
  }
]

// create function that returns mock data (to verify update in browser)
function getDefaultCard(callbackFn) {
  setTimeout(function(){ callbackFn(MOCK_CARD)}, 1);
}


// function to display default card
function displayDefaultCard(data) {
  for (index in data.cardStructure) { // adapt for showing list of cards? currently only 1 item in array
    // $('body').append(
      $('.contentContainer').append(
      '<p>' + data.cardStructure[index].headline + '</p>',
      '<p>' + data.cardStructure[index].bodyText+ '</p>',
      
      `<img src="`+ data.cardStructure[index].image + `">`, 
      '<p>Inspired by ' + data.cardStructure[index].character + '</p>',
      '<p>"Data provided by Marvel. © 2014 Marvel"</p>',  // link to image, later
      // added data-html2canvas-ignore="true" so button is not copied in screenshot
      '<button class="test" data-html2canvas-ignore="true">Click to screenshot</button>'

    )
  }
}

// function to get the card and display the card
function getAndDisplayCard() {
  getDefaultCard(displayDefaultCard);
}

// function to get called on page load: display default card
$(function() {
  getAndDisplayCard();


  $('.contentContainer').on('click', '.test', event => {
    
    console.log('button clicked');
   
    // interesting because when using this function below with 
    // allowTaint: true option set, error appears that tainted canvases cannot be exported
    // html2canvas(document.body).then(function(canvas) {
    //       // Export the canvas to its data URI representation
    //       var base64image = canvas.toDataURL("image/png");
      
    //       // Open the image in a new window
    //       window.open(base64image , "_blank");
    //   });


    let x = this.getElementById('screenshot-card');
    html2canvas(x, { allowTaint: true}).then(canvas => {
      document.body.appendChild(canvas);
     
    })
  })

  
});