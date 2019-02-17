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
    "characterImage": "../images/storm_portrait_uncanny.jpg",
  },
  {
    "characterName": "Jean Grey", 
    "characterImage": "../images/jean_grey_portrait_uncanny.jpg",
  },
  {
    "characterName": "Iron Man", 
    "characterImage": "../images/iron_man_portrait_uncanny.jpg",
  },
  {
    "characterName": "Thor", 
    "characterImage": "../images/thor_portrait_uncanny.jpg",
  },
  {
    "characterName": "Wolverine", 
    "characterImage": "../images/wolverine_portrait_uncanny.jpg",
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

// Function to Get all cards from API
function getCardListFromApi(callback) {
  console.log('getCardListFromAPI success');

  $.ajax(
    {
      url : '/cards', 
      method : 'GET', 
      headers : {
        "content-type": "application/json"
      }, 
      success : callback,
      error : function(a,b,c) {
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
                <div>
                  <input type="radio" name="character" id="ironman" value="Iron Man" checked="checked">
                  <label for="ironman">Iron Man</label>
                </div>
                <div>
                  <input type="radio" name="character" id="storm" value="Storm">
                  <label for="storm">Storm</label>
                </div>
                <div>
                  <input type="radio" name="character" id="wolverine" value="Wolverine">
                  <label for="wolverine">Wolverine</label>
                </div>
                <div>
                  <input type="radio" name="character" id="jean-grey" value="Jean Grey">
                  <label for="jean-grey">Jean Grey</label>
                </div>
                <div>
                  <input type="radio" name="character" id="thor" value="Thor">
                  <label for="thor">Thor</label>
                </div>
              </div>
            </fieldset>
          <!-- Clicking submit saves the card to db for user and also shows card to user to download -->
          <input type="submit" class="form-submit-btn css-submit" data-html2canvas-ignore="true" value="Go to Card Preview">     
        </form>
        <!-- Move to top of page?  -->
      <button class="css-all-saved-cards-button js-saved-cards-button">Go to Saved Cards</button> 
    </div> 

  `;

}

// Function to display Create card form (Page 1)
function getAndDisplayCardForm() {
  const cardForm = generateCardFormString();
  $('.contentContainer').html(cardForm);

}

// Function to show Card Preview (Page 2)
function displayNewCard(cardResponse){

  let character = CHARACTER_LIST.find(function(character) {
    return character.characterName === cardResponse.character
  });
  console.log(cardResponse);
  $('.contentContainer').html(
    
    `
     <!-- Page 2: Preview/Edit card -->
     <div class="newContentContainer css-container">
       <h2>Page 2: Card Preview</h2>
       <!--<h3>Click to Edit or save (not sure I need this text)</h3> -->
       <!-- Move to top of page?  -->
       <button class="css-all-saved-cards-button js-saved-cards-button">Go to Saved Cards</button>
       <!-- Note: the below image will be a canvas element -->
       <div class="css-preview-content-container card" id="screenshot-card" data-card-id="${cardResponse.id}">
         <p>${cardResponse.headline}</p>
         <p>${cardResponse.bodyText}</p> 
         <img src=${character.characterImage} alt="image of ${cardResponse.character}>
         <p>"Data provided by Marvel. © 2014 Marvel"</p>
         <!-- Should this be a button? -->
         <input type="submit" class="test download-card-btn css-submit" data-html2canvas-ignore="true" value="Save">
 
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

// function to convert html image to canvas and download it (come back to this)
// function convertCardAndDownload(data) {
//   // Move this into a separate function; this downloads the card to user machine on preview screen
//   let x = this.getElementById('screenshot-card');
//   // html2canvas(x, { allowTaint: true}).then(canvas => {
//   html2canvas(x).then(canvas => {
//     // document.body.appendChild(canvas);
//     var a = document.createElement('a');
//     a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
//     // a.download = 'somefilename.jpg';
//     a.download = `${data.headline}`;  
//     a.click();

//   })

// }


// Function which returns no cards found on Card list page
// Note: add this to style.html and update here as well
function generateNoCardsFoundPageString() {
  return `
    <div>
      <h2>No Cards Found! More buttons needed!!!</h2>
    </div>
  `
}

// Function returns hmtl for generating card List (currently hardcoded, 
// needs to be updated with list of cards by ID and also connected to user)
function generateCardListPageString() {
  return `
    <!-- Page 4: Saved Cards List -->
    <div class="newContentContainer css-container">
      <h2>Page 4: Saved Cards</h2>
      <button class="css-create-card-button">Go to Create Page</button>
      <p></p>
      <div class="css-previous-saved-card-container">
        <h3>Headline1</h3>
        <p>First 30 characters: Lorem ipsum dolor sit amet.</p>
        <button class="css-saved-card-button">Go to Card</button>
        <button class="css-delete-card-button">Delete</button>
        
      </div>
      <div class="css-previous-saved-card-container">
        <h3>Headline2</h3>
        <p>First 30 characters: Lorem ipsum dolor sit amet.</p>
        <!-- update css selector and do I need an edit card for the project requirements? -->
        <button class="css-saved-card-button">Edit card?</button>
        <button class="css-saved-card-button">Go to Card</button>
        <button class="css-delete-card-button">Delete</button>
        
      </div>
      <div class="css-previous-saved-card-container">
          <h3>Headline3</h3>
          <p>First 30 characters: Lorem ipsum dolor sit amet.</p>
          <button class="css-saved-card-button">Go to Card</button>
          <button class="css-delete-card-button">Delete</button>
          
      </div> 
    </div>

  `
}

function getAndDisplayCardList(cardListResponse) {
  // note the list of cards is appearing in the preview but the value of data is undefined
  
  // console.log(cardArrayofObjects);

  // Handle no cards/results found (do I have that designed in style.html?)
  // error says property length of undefined
  // if (cardResponse.collection.items.length === 0) {
  //   const noCardsFoundPage = generateNoCardsFoundPageString();
  //   $('.contentContainer').html(noCardsFoundPage);
  // } else {
  // }
  
  console.log(cardListResponse);

  const cardList = generateCardListPageString();
  $('.contentContainer').html(cardList);

  

}

$(function() {

  // Display Card Form Page
  getAndDisplayCardForm();

  // Listen for Go to Saved cards button. 
  //Then get the card list from the GET endpoint, display the Card list.
  $('.contentContainer').on('click', '.js-saved-cards-button', event => {
    console.log('go to saved cards button clicked');
    getCardListFromApi(getAndDisplayCardList)
    
  })

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


  // Listen for click on '.download-card-btn' then convert html image to canvas and download it
  $('.contentContainer').on('click', '.download-card-btn', event => { 
    console.log('download card button clicked');
    // Move this into a separate function; this downloads the card to user machine on preview screen
    // convertCardAndDownload();
    let x = this.getElementById('screenshot-card');
    // html2canvas(x, { allowTaint: true}).then(canvas => {
    html2canvas(x).then(canvas => {
      // document.body.appendChild(canvas);
      var a = document.createElement('a');
      a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
      a.download = 'somefilename.jpg';
      // a.download = `${data.headline}`; update the filename later, 
      a.click();

    })
      .then(() => {
        // After downloading card, navigates to Cards List page (Page 3)
        getAndDisplayCardList();
      })
  })

  
  

  
});