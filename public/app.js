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
  },
  {
    "characterName": "Jean Grey", 
    "characterImage": "http://i.annihil.us/u/prod/marvel/i/mg/6/40/526963dad214d/portrait_uncanny.jpg",
  },


]

// Function to Post Card to Api
function postCardToApi(headlineInput, messageInput, characterInput, callback){
  const params = {
    headline : headlineInput, 
    bodyText : messageInput, 
    character : characterInput
  }
  $.ajax(
    {
      url : '/cards',
      data : JSON.stringify(params), 
      method : 'POST', 
      headers : {
        "content-type": "application/json"
      }, 
      success : callback,
      error : function (a,b,c) {
        console.log("Error message: ", c);
      }

    }
  )

}


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
        <form class="card-submit-form css-form">
            
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
                <input type="radio" name="character" id="jean-grey" value="Jean Grey">
                <label for="jean-grey">Jean Grey</label>
                <input type="radio" name="character" id="thor" value="Thor">
                <label for="thor">Thor</label>
              </div>
            </fieldset>
          <!-- Clicking submit saves the card to db for user and also shows card to user to download -->
          <input type="submit" class="form-submit-btn css-submit" data-html2canvas-ignore="true" value="Save">     
        </form>
        <!-- Move to top of page?  -->
      <button class="css-all-saved-cards-button">Go to Saved Cards</button> 
    </div> 

  `;

}

// Function to display create card form (1st page of app)
function getAndDisplayCardForm() {
  const cardForm = generateCardFormString();
  $('.contentContainer').html(cardForm);

}

// Function to show the new card submitted on the create card form
function displayNewCard(data){

   // adapt for showing list of cards? currently only 1 item in array
    let character = CHARACTER_LIST.find(function(character) {
      return character.characterName === data.character
    });
  // rename data to cardResponse...
  // 
  // make data-attribute
  $('.contentContainer').html(
    
    `
     <!-- Page 2: Preview/Edit card -->
     <div class="newContentContainer css-container">
       <h2>Page 2: Card Preview</h2>
       <h3>Click to Edit or save</h3>
       <!-- Move to top of page?  -->
       <button class="css-all-saved-cards-button">Go to Saved Cards</button>
       <!-- Note: the below image will be a canvas element -->
       <div class="css-preview-content-container card" data-card-id="${data.id}">
         <p>${data.headline}</p>
         <p>${data.bodyText}</p> 
         <img src=${character.characterImage}> 
         <img src="http://i.annihil.us/u/prod/marvel/i/mg/6/40/526963dad214d/portrait_uncanny.jpg" alt="Iron Man">
         <p>"Data provided by Marvel. © 2014 Marvel"</p>
         <!-- Should this be a button? -->
         <input type="submit" class="test css-submit" data-html2canvas-ignore="true" value="Save">
 
       </div>
     </div>
     
 
   `
  )  
  
    

}

// PROOF of concept, most likely this will be the Display of Card after refactor
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

  // Listen for form submit on '.card-submit-form' and pass to POST API endpoint
  $('.contentContainer').on('submit', '.card-submit-form', event => {
    event.preventDefault();
    console.log('card submit form success!');
    const headlineInput = $('#headline').val();
    const messageInput = $('#message').val();
    const characterInput = $('input[name="character"]:checked').val();
    console.log(headlineInput);
    console.log(messageInput);
    console.log(characterInput);
    // post not making it to database and also not showing up on displayNewCard()
    postCardToApi(headlineInput, messageInput, characterInput, displayNewCard)

  })


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