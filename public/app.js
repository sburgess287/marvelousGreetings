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
    $('body').append(
      '<p>' + data.cardStructure[index].headline + '</p>',
      '<p>' + data.cardStructure[index].bodyText+ '</p>',
      '<p>' + data.cardStructure[index].character + '</p>',
      `<img src="`+ data.cardStructure[index].image + `">`, 
      '<p>"Data provided by Marvel. © 2014 Marvel"</p>'  // link to image, later
    )
  }
}

// function to get the card and display the card
function getAndDisplayCard() {
  getDefaultCard(displayDefaultCard);
}

// function to get called on page load: display default card: BOOM!!!
$(function() {
  getAndDisplayCard();
});