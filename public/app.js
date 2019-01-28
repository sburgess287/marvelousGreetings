// create mock data of json array
// default card

const MOCK_CARD = {
  "cardStructure" : [
    {
      "id": "1234567", 
      "headline": "Happy Valentine's Day", 
      "bodyText": "With Great Power Comes Great Responsibility",
      "character": "Spider-Gwen", // references the array I need to write
     // "signature": "Love, Joe",  // added this because a card should have a signature
     // "publishedAt": 1470011976609 // added in case I want to order cards chronologically per account

    }
  ]
}


// for each card reference the object in the array with character/image
const CHARACTER_LIST = [
  {
    "character": "Spider-Gwen", 
    "characterImage": "Image placeholder",
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
      '<p>' + data.cardStructure[index].characterImage + '</p>',
      '<p>' + data.cardStructure[index].signature + '</p>'
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