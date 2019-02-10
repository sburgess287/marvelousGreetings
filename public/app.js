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
      // "image": "http://i.annihil.us/u/prod/marvel/i/mg/6/40/526963dad214d/portrait_uncanny.jpg"
     // "image": "http://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55/portrait_uncanny.jpg"
    }
  ]
}


// for each card reference the object in the array with character/image
const CHARACTER_LIST = [
  {
    "characterName": "Storm", 
    "characterImage": "http://i.annihil.us/u/prod/marvel/i/mg/6/40/526963dad214d/portrait_uncanny.jpg",
  }
]

// create function that returns mock data (to verify update in browser)
function getDefaultCard(callbackFn) {
  setTimeout(function(){ callbackFn(MOCK_CARD.cardStructure)}, 1);
}

// Returns the html for generating the card form
function generateCardFormString() {
  return `
    <!-- Page 1: fill in card -->
    <div class="newContentContainer css-container"></div>
    <!-- <div class="contentContainer css-container" id="screenshot-card"> -->
      <h2 class="css-h2" >Page 1: Fill in the headline, message, and choose a character!</h2>
      <img class="css-header-image" src="http://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55/landscape_medium.jpg" alt="Iron Man">
        <form class="css-form">
            
            <label for="headline">Headline</label>
            <input id="headline" type="text" name="textfield" class="css-headline-field" required>
            <label for="message">Message</label>
            <input id="message" type="text" name="textfield" class="css-message-field" required>
            <fieldset>
              <legend>Select Character</legend>
              <div class="css-radio">
                <input type="radio" name="character" id="ironman" value="Iron Man" checked="checked">
                <label for="ironman">Iron Man</label>
                <input type="radio" name="character" id="storm" value="Storm">
                <label for="storm">Storm</label>
                <input type="radio" name="character" id="wolverine" value="Wolverine">
                <label for="wolverine">Wolverine</label>
                <input type="radio" name="character" id="jean-grey" value="JeanGrey">
                <label for="jean-grey">Jean Grey</label>
                <input type="radio" name="character" id="thor" value="Thor">
                <label for="thor">Thor</label>
              </div>
            </fieldset>
          <!-- Clicking submit saves the card to db for user and also shows card to user to download -->
          <input type="submit" class="test css-submit" data-html2canvas-ignore="true" value="Save">     
        </form>
        <!-- Move to top of page?  -->
      <button class="css-all-saved-cards-button">Go to Saved Cards</button> 
    </div> 

  `;

}

function getAndDisplayCardForm() {
  const cardForm = generateCardFormString();
  $('.contentContainer').html(cardForm);

}

// PROOF of concept, most likely this will be the Preview card after refactor
// change data to helpful word : characterArray
// function to display default card
function displayDefaultCard(data) {
  // put into own function for findCharacter()
  for (index in data) { // adapt for showing list of cards? currently only 1 item in array
    let character = CHARACTER_LIST.find(function(character) {
      return character.characterName === data[index].character
    });
    // $('body').append(
    $('.contentContainer').append(  // I will have to change this to update html inside .contentContainer
      '<p>' + data[index].headline + '</p>',
      '<p>' + data[index].bodyText+ '</p>',
      
      `<img src="`+ character.characterImage + `">`, 
      '<p>Inspired by ' + character.characterName + '</p>',
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

  // Display Card Form Page
  getAndDisplayCardForm();


  // // Proof of concept for Card Preview
  // getAndDisplayCard();

  // $('.contentContainer').on('click', '.test', event => {
    
  //   console.log('button clicked');
   
  //   // interesting because when using this function below with: remove 122-130 if I don't need it
  //   // allowTaint: true option set, error appears that tainted canvases cannot be exported
  //   // html2canvas(document.body).then(function(canvas) {
  //   //       // Export the canvas to its data URI representation
  //   //       var base64image = canvas.toDataURL("image/png");
      
  //   //       // Open the image in a new window
  //   //       window.open(base64image , "_blank");
  //   //   });

  //   let x = this.getElementById('screenshot-card');
  //   html2canvas(x, { allowTaint: true}).then(canvas => {
  //     document.body.appendChild(canvas);
     
  //   })
  // })
  // end proof of concept

  
});