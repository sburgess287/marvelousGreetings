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


// Function to Post signup Credentials to API
function postSignupCredsToApi(username, password, callback) {
  const params = {
    username,
    password
  }
  $.ajax(
    {
      url: '/users',
      data: JSON.stringify(params),
      method: 'POST',
      headers : {
        "content-type": "application/json",
      },
      success : callback,
      error : function (a,b,c) {
        console.log("Error message: ", a.responseJSON.message, b, c);
        $('#invalid-signup-alert').text(a.responseJSON.message).show();

      }
    }
  )
}


// Function to Post valid credentials to API (Login to app)
function loginPostToApi(username, password, callback) {
  const params = {
    username,
    password
  }

  $.ajax(
    {
      url: '/auth/login', 
      data: JSON.stringify(params),
      method : 'POST',
      headers : {
        "content-type": "application/json", 
  
      },
      success : callback, 
      error : function (a,b,c) {
        // alert(`Error: ${c}`);
        console.log("Error message: ", c);
      }
    }
  )

}



// Function to Post Card to Api
function postCardToApi(headlineInput, messageInput, characterInput, callback){
  const params = {
    headline : headlineInput, 
    bodyText : messageInput, 
    character : characterInput
    
  }
  const authToken = window.localStorage.getItem("authToken")

  $.ajax(
    {
      url : '/cards',
      data : JSON.stringify(params), 
      method : 'POST', 
      headers : {
        "content-type": "application/json",
        "authorization" : `Bearer ${authToken}`
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
  
  const authToken = window.localStorage.getItem("authToken")

  $.ajax(
    {
      url : '/cards', 
      method : 'GET', 
      headers : {
        "content-type": "application/json",
        "authorization" : `Bearer ${authToken}`
      }, 
      success : callback,
      error : function(a,b,c) {
        console.log("Error message: ", c);
      }
    }
  )
}

// Function to Delete card by id from API using '/cards/:id' endpoint
// need to pass in the id of the card to go to correct endpoint and delete
// error says cardListResponse is undefined

function deleteCardById(cardIdValue, callback) {
  const authToken = window.localStorage.getItem("authToken")

  $.ajax(
    {
      url: `cards/${cardIdValue}`,
      // url: `cards/:id`,
      method : 'DELETE',
      headers : {
        "content-type": "application/json",
        "authorization" : `Bearer ${authToken}`
      },
      success : callback,
      error : function(a,b,c) {
        console.log("Error message: ", c);
      }
    }
  )
}

// Function to Retrieve card by ID (GET) using '/cards/:id' endpoint
function getCardById(cardIdValue, callback) {

  const authToken = window.localStorage.getItem("authToken")
  
  $.ajax(
    {
      url : `/cards/${cardIdValue}`, 
      method : 'GET', 
      headers : {
        "content-type": "application/json",
        "authorization" : `Bearer ${authToken}`
      }, 
      success : callback,
      error : function(a,b,c) {
        console.log("Error message: ", c);
      }
    }
  )

}

// Function to Edit card by id (PUT) using '/cards/:id' endpoint
function editCardById(id, headline, bodyText, character, callback) {
  console.log('editCardbyID ran');
  console.log(id);
  const authToken = window.localStorage.getItem("authToken")
  console.log(authToken);

  $.ajax(
    {
      url: `cards/${id}`,
      method : 'PUT',
      data: JSON.stringify({ headline, bodyText, character, id, }),
      headers : {
        "content-type": "application/json",
        "authorization" : `Bearer ${authToken}`
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
              <div class="css-radio character-radio-list">
              <div>
              <input type="radio" name="character" id="ironman" value="Iron Man" checked="checked">
              <label for="ironman" class="radio-text">Iron Man</label>
              </div>
              <div>
                <input type="radio" name="character" id="storm" value="Storm">
                <label for="storm" class="radio-text" >Storm</label>
              </div>
              <div>
                <input type="radio" name="character" id="wolverine" value="Wolverine">
                <label for="wolverine" class="radio-text">Wolverine</label>
              </div>
              <div>
                <input type="radio" name="character" id="jean-grey" value="Jean Grey">
                <label for="jean-grey" class="radio-text">Jean Grey</label>
              </div>
              <div>
                <input type="radio" name="character" id="thor" value="Thor">
                <label for="thor" class="radio-text">Thor</label>
              </div> 
            </fieldset>
          <!-- Clicking submit saves the card to db for user and also shows card to user to download -->
          <input type="submit" class="form-submit-btn css-submit" data-html2canvas-ignore="true" value="Go to Card Preview">     
        </form>
        <!-- Move to top of page?  -->
      <button class="css-all-saved-cards-button js-saved-cards-button">Go to Saved Cards</button>
      <button class="css-all-saved-cards-button logout-button">Logout</button> 
    </div> 

  `;

}

// Function to display Create card form (Page 1)
function getAndDisplayCardForm() {
  const cardForm = generateCardFormString();
  $('.contentContainer').html(cardForm);
  // $('.character-radio-list').html('hello!') // experiment

}

// Function to show Card Preview (Page 2)
function displayCard(cardResponse){

  let character = CHARACTER_LIST.find(function(character) {
    return character.characterName === cardResponse.character
  });
  
  $('.contentContainer').html(
    
    `
     <!-- Page 2: Preview/Edit card -->
     <div class="newContentContainer css-container">
       <h2>Page 2: Card Preview</h2>
       <!--<h3>Click to Edit or save (not sure I need this text)</h3> -->
       <!-- Move to top of page?  -->
       <button class="css-all-saved-cards-button js-saved-cards-button">Go to Saved Cards</button>
       <button class="css-all-saved-cards-button logout-button">Logout</button>
       <!-- Note: the below image will be a canvas element -->
       <div class="css-preview-content-container card" id="screenshot-card" data-card-id="${cardResponse.id}">
         <p>${cardResponse.headline}</p>
         <p>${cardResponse.bodyText}</p> 
         <img src=${character.characterImage} alt="image of ${cardResponse.character}>
         <p>"Data provided by Marvel. © 2014 Marvel"</p>
         <input type="submit" class="test download-card-btn css-submit" data-html2canvas-ignore="true" value="Save">
 
       </div>
     </div>
   `
  )
}

// PROOF of concept
// change data to helpful word : characterArray
// function to display default card
// function displayDefaultCard(data) {
//   // put into own function for findCharacter()
//   for (index in data) { // adapt for showing list of cards? currently only 1 item in array
//     let character = CHARACTER_LIST.find(function(character) {
//       return character.characterName === data[index].character
//     });
//     // $('body').append(
//     $('.contentContainer').append(  // I will have to change this to update html inside .contentContainer
//       '<p>' + data[index].headline + '</p>',
//       '<p>' + data[index].bodyText+ '</p>',
      
//       `<img src="`+ character.characterImage + `">`, 
//       '<p>Inspired by ' + character.characterName + '</p>',
//       '<p>"Data provided by Marvel. © 2014 Marvel"</p>',  // link to image, later
//       // added data-html2canvas-ignore="true" so button is not copied in screenshot
//       '<button class="test" data-html2canvas-ignore="true">Click to screenshot</button>'

//     )
//   }
// }

// // function to get the card and display the card
// function getAndDisplayCard() {
//   getDefaultCard(displayDefaultCard);
// }

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
// maybe add default image?
// Note: add this to style.html and update here as well
function generateNoCardsFoundPageString() {
  return `
  <!-- Page 6: No cards created page -->
  <div class="newContentContainer css-container">
    <div>
      <h2>No Cards Found! Please go to the Create card page to Create new card</h2>
      <button class="css-create-card-button js-create-card-btn">Go to Create Page</button>
      <button class="css-all-saved-cards-button logout-button">Logout</button>
    </div>
  </div>
  `
}

function getAndDisplayCardList(cardListResponse) {
  
  // console.log(cardListResponse);
  // console.log(cardListResponse.length);
  
  // Handle no cards/results found
  // Note need to update: data-card-id="${cardResponse[i].id}
  if (cardListResponse.length === 0) {
    const noCardsFoundPage = generateNoCardsFoundPageString();
    $('.contentContainer').html(noCardsFoundPage);
  } else {
    const cardList = []
    const resultArrayLength = cardListResponse.length;

    for (let i = 0; i < resultArrayLength; i++) {
      cardList.push(
        ` 
        <div class="css-previous-saved-card-container card-container" data-card-id="${cardListResponse[i].id}"'>
        <h3>${cardListResponse[i].headline}</h3>
        <!-- change this to first 30 characters -->
        <p>${cardListResponse[i].bodyText}</p>
        <p>${cardListResponse[i].id}</p>
        <p>${cardListResponse[i].character}</p>
        
        <!-- update css selector and do I need an edit card for the project requirements? -->
        <button class="css-edit-card-button js-edit-card-button">Edit</button>
        <button class="css-view-card-button js-preview-card-button">View</button>
        <button class="css-delete-card-button js-delete-card-button">Delete</button> 
      </div>

        `
      )
    }
  
    $('.contentContainer').html(
      `
      <!-- Page 4: Saved Cards List -->
      <div class="newContentContainer css-container">
        <h2>Page 4: Saved Cards</h2>
        <button class="css-all-saved-cards-button logout-button">Logout</button>
        <button class="css-create-card-button js-create-card-btn">Go to Create Page</button>
        <p>Edit, View, or Delete Your Cards!</p>
          ${cardList.join('')}
      </div>

      `
    );
  }
}

// Function which iterates through the array of characters;
// if the cardResponse.character is = name of the character in the array
// then set checked="checked"
// function setCharacterChecked(cardResponse) {
//   console.log('1st line of setCharacterChecked')
//   console.log(cardResponse);

//   const characterListArray = CHARACTER_LIST.map(
//     character => character.characterName)
//     console.log(characterListArray);  // returns list of characters! woo!
  
//   let results = []
//   for ( let i = 0; i <= characterListArray.length; i++) {
//     if ( cardResponse.character === characterListArray[i]) {
//       console.log('successfully found match, see below');
//       console.log(cardResponse.character);
//       console.log(characterListArray[i]);
      
//       // how do I create a second event listener on the content container for this?

//       // results.push($('[name=character]').val([`${cardResponse.character}`]));
//       $(`input:radio[name="character"][value="${characterListArray[i]}"]`).prop('checked', true);

//     }
  
//   }
  
// }

// Returns the html for generating the card form on Edit
function generateCardFormStringEdit(cardResponse, list) {
  console.log(list);
  // setCharacterChecked(cardResponse); // this has to be called inside the generate cardformStringEdit
  // renderCharacterRadioListForm();

  return `
    <!-- Page 1: fill in card -->
    <div class="newContentContainer css-container">
    <!-- <div class="contentContainer css-container" id="screenshot-card"> -->
      <h2 class="css-h2" >Edit your card</h2>
      
        <form class="card-update-form css-form" data-card-id="${cardResponse.id}">
            
            <label for="headline">Headline</label>
            <input value="${cardResponse.headline}" placeholder="foo" id="headline" type="text" name="textfield" class="css-headline-field" required>
            <label for="message">Message</label>
            <input value="${cardResponse.bodyText}" placeholder="bar" id="message" type="text" name="textfield" class="css-message-field" required>
            <fieldset>
              <legend>Select Character</legend>
              
              <div class="css-radio list">
              ${CHARACTER_LIST.map(character => 
                `<div>
                  <input  
                    type="radio" 
                    name="character" 
                    ${cardResponse.character === character.characterName ? "checked" : ""}
                    id="${character.characterName}" 
                    value="${character.characterName}">
                  <label for="${character.characterName}">${character.characterName}</label>
                </div>`
              ).join('')}
                
              </div>
            </fieldset>
          <!-- Clicking submit saves the card to db for user and also shows card to user to download -->
          <input type="submit" class="js-update-card-button css-submit" data-html2canvas-ignore="true" value="View Updated Card">     
        </form>
        <!-- Move to top of page?  -->
      <button class="css-all-saved-cards-button js-saved-cards-button">Go to Saved Cards</button> 
      <button class="css-all-saved-cards-button logout-button">Logout</button>
    </div> 

  `;

}

// Function to display Edit card form (Page 1)
function getAndDisplayCardFormEdit(cardResponse) {
  
  const cardForm = generateCardFormStringEdit(cardResponse);
  $('.contentContainer').html(cardForm);
  
}

function generateSignUpFormString() {
  
  return `
    <!-- Sign Up -->
    <div class="newContentContainer css-container">
      <h2>Sign Up Page</h2>
      <form class="css-signup-form css-form sign-up-form">
        <div class="username-section entry-field">
          <label for="username">Username</label>
          <input id="username" type="text" name="textfield" class="css-signup-input" required>
        </div>
        <div class="password-section entry-field">
          <label for="password">Password</label>
          <input id="password" type="password" name="textfield" class="css-pw-signup-input" required>
        </div>
        <input type="submit" class="css-submit enter-creds-button" value="Click to Enter New Credentials">
        <div>
          <p role="alert" class="hidden" id="invalid-signup-alert">Invalid signup credentials, 
          please try again</p>
        </div>
      </form>
    
      <button class="css-submit go-to-login-button">Go To Login</button>

    </div>
  `
}

function getAndDisplaySignUpForm() {
  const signUpForm = generateSignUpFormString();
  $('.contentContainer').html(signUpForm);
};

function generateLoginFormString() {
  return `
    <!-- Login -->
    <div class="newContentContainer css-container">
      <h2>Login</h2>
      <form class="css-login-form css-form login-form">
        <div class="username-section entry-field"> 
          <label for="username">Username</label>
          <input id="username" type="text" name="textfield" class="css-login-input" required>
        </div>
        <div class="password-section entry-field">
          <label for="password">Password</label>
          <input id="password" type="password" name="textfield" class="css-pw-input" required>
        </div>
        <input type="submit" class="css-submit login-button" value="Click to Login">
        <div>
          <p role="alert" class="hidden" id="invalid-login-alert">Invalid login, 
          please use valid credentials or go to Signup Form</p>
        </div>
      </form>
      <button class="css-submit signup-form-button">Go To Signup Form</button>
    </div>
  `
}

function getAndDisplayLoginForm() {
  const loginForm = generateLoginFormString();
  $('.contentContainer').html(loginForm);
}

$(function() {
  // Display Login page
  getAndDisplayLoginForm();

  // On page load, get the auth token and if it's valid, load the 
  // create card page (this way the display card page shows on refresh)
  let checkToken = window.localStorage.getItem("authToken"); 
  if (checkToken === null) {
    getAndDisplayLoginForm();
  } else if (!(checkToken === undefined)) {
    getAndDisplayCardForm(); 
  } 
  

  // Event listener for clicking "Go to signup form" button on the login page
  // Then shows the signup page
  $('.contentContainer').on('click', '.signup-form-button', event => {
    
    getAndDisplaySignUpForm();
  })

  // Event listener for clicking "Go to Login page" button on the signup page
  // then shows the login page
  $('.contentContainer').on('click', '.go-to-login-button', event => {
    
    getAndDisplayLoginForm();
  })

  // Enter valid credentials to signup page
  $('.contentContainer').on('submit', '.sign-up-form', event => {
    event.preventDefault();
    const usernameVal = $('#username').val();
    const passwordVal = $('#password').val();
    $('#invalid-signup-alert').hide();
    postSignupCredsToApi(usernameVal, passwordVal, function(data) {

      loginPostToApi(usernameVal, passwordVal, function(data) {
        window.localStorage.setItem("authToken", data.authToken)
      })
      getAndDisplayCardForm();
    })
  })

  // Function to login with valid credentials
  // Display Card Form Page on successful login
  // Function to refresh JWT, do I put this logic in the login API post?
  $('.contentContainer').on('submit', '.login-form', event => {
    event.preventDefault();
    const usernameVal = $('#username').val();
    const passwordVal = $('#password').val();

    $('#invalid-login-alert').show();
    loginPostToApi(usernameVal, passwordVal, function(data) {
      window.localStorage.setItem("authToken", data.authToken)
      getAndDisplayCardForm(); 
    })

  })

  // Listen for click of "Go to Saved Cards" button. 
  // Then get the card list from the GET endpoint, display the Card list.
  $('.contentContainer').on('click', '.js-saved-cards-button', event => {
    getCardListFromApi(getAndDisplayCardList)
  })

  // Listen for form submit on '.card-submit-form' and pass to POST API endpoint
  $('.contentContainer').on('submit', '.card-submit-form', event => {
    event.preventDefault();
    
    const headlineInput = $('#headline').val();
    const messageInput = $('#message').val();
    const characterInput = $('input[name="character"]:checked').val();
    postCardToApi(headlineInput, messageInput, characterInput, displayCard)

  })

  // Listen for form submit on '.card-update-form' and pass to PUT API endpoint
  
  $('.contentContainer').on('submit', '.card-update-form', event => {
    event.preventDefault();
    const headlineInput = $('#headline').val();
    const messageInput = $('#message').val();
    const characterInput = $('input[name="character"]:checked').val();
    const cardId = $('.card-update-form').data("card-id");

    editCardById(cardId, headlineInput, messageInput, characterInput, function() {
      displayCard({ id: cardId, headline: headlineInput, bodyText: messageInput, character: characterInput})
    })

  })

  // Listen for click on '.download-card-btn' then convert html image to canvas and download it
  $('.contentContainer').on('click', '.download-card-btn', event => { 
    
    let x = this.getElementById('screenshot-card');
    // html2canvas(x, { allowTaint: true}).then(canvas => {
    html2canvas(x).then(canvas => {
    
      var a = document.createElement('a');
      a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
      a.download = 'marvelousGreetings.jpg';
      // a.download = `${data.headline}`; update the filename later, 
      a.click();

    })
      .then(() => {
        // After downloading card, navigates to Cards List page (Page 3)
        getCardListFromApi(getAndDisplayCardList);
      })
  })

  // Listen for click on '.create-card-btn' and load Create page
  $('.contentContainer').on('click', '.js-create-card-btn', event => {
    getAndDisplayCardForm();
  })

  // Listen for click on '.js-delete-card-button and Delete card
  $('.contentContainer').on('click', '.js-delete-card-button', event => {
    const card = $(event.currentTarget).closest(".card-container")
    deleteCardById(card.data("card-id"), function(){
      card.remove()
    });
  })
  
  // Listen for click on '.js-edit-card-button' to go to Edit the card
  $('.contentContainer').on('click', '.js-edit-card-button', event => {
    // retrieve the card by id
    const card = $(event.currentTarget).closest(".card-container")
    getCardById(card.data("card-id"), getAndDisplayCardFormEdit);
  })

  // Listen for click on '.js-preview-card-button' to view card from cards list
  $('.contentContainer').on('click', '.js-preview-card-button', event => {
    // retrieve the card by id
    const card = $(event.currentTarget).closest(".card-container")
    getCardById(card.data("card-id"), displayCard);
    
  })

  // Listen for click on '.logout-button' then logs user out, shows login page
  $('.contentContainer').on('click', '.logout-button', event => {
    window.localStorage.removeItem("authToken");
    getAndDisplayLoginForm();

  })


});