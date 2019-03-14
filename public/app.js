
// Character List Array: reference the object in the array with character/image
const CHARACTER_LIST = [
  {
    "characterName": "Black Panther", 
    "characterImage": "../images/black_panther_portrait_uncanny.jpg",
    
  },
  
  {
    "characterName": "Captain America", 
    "characterImage": "../images/captain_america_portrait_uncanny.jpg",
    
  },

  {
    "characterName": "Captain Marvel", 
    "characterImage": "../images/captain_marvel_portrait_uncanny.jpg",
    
  },

  {
    "characterName": "Deadpool", 
    "characterImage": "../images/deadpool_portrait_uncanny.jpg",
    
  },

  {
    "characterName": "Iron Man", 
    "characterImage": "../images/iron_man_portrait_uncanny.jpg",
    
  },

  {
    "characterName": "Jean Grey", 
    "characterImage": "../images/jean_grey_portrait_uncanny.jpg",
    
  },

  {
    "characterName": "Loki", 
    "characterImage": "../images/loki_portrait_uncanny.jpg",
    
  },

  {
    "characterName": "Storm", 
    "characterImage": "../images/storm_portrait_uncanny.jpg",
    
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
        console.log("Error messag: ", a, b, c);
        $('#invalid-login-alert').text(`${c}: Please try again,
        or Sign Up to create your account.`).show();
      }
    }
  )
}



// Function to Post Card to Api, and associate with logged in user
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

// Function to Get all cards from API, per authorized user
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

function deleteCardById(cardIdValue, callback) {
  
  const authToken = window.localStorage.getItem("authToken")

  $.ajax(
    {
      url: `cards/${cardIdValue}`,
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

  const authToken = window.localStorage.getItem("authToken")

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

// Returns the html for Create Card form
function generateCardFormString() {
  return `
    <!-- Page 1: Create Card-->
    <div class="newContentContainer"></div>
    <!-- <div class="contentContainer css-container" id="screenshot-card"> -->
      <h2 class="css-h2" >Create your Marvel-ous Greeting!</h2>
      <h3>Fill in the headline and message, then choose a character!</h3>
      <img class="css-header-image" src="http://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55/landscape_medium.jpg" alt="Iron Man">
        <form class="card-submit-form css-form">
            <label for="headline">Headline</label>
            <input id="headline" type="text" name="textfield" class="css-headline-field" required maxlength="250">
            <label for="message">Message</label>
            <input id="message" type="text" name="textfield" class="css-message-field" required maxlength="350">
            <fieldset>
              <legend>Select Character</legend>
              <div class="css-radio character-radio-list">
              ${CHARACTER_LIST.map(character => 
                `
                <div>
                  <input 
                    type="radio" 
                    name="character" 
                    id="${character.characterName}"
                    value="${character.characterName}"
                    required>
                  <label for="${character.characterName}">${character.characterName}</label>
                </div>`
                ).join('')}
              </div>
            </fieldset>
          <!-- Clicking submit saves the card to db for user and also shows card to user to download -->
          <input type="submit" 
            class="form-submit-btn css-cta" 
            data-html2canvas-ignore="true" 
            value="Go to Card Preview">     
        </form> 
    </div> 
  `
  ;

}

// Function to display Create card form (Page 1)
function getAndDisplayCardForm() {
  $('.js-navbar').show();
  const cardForm = generateCardFormString();
  $('.contentContainer').html(cardForm);
  
}

// Function to show Card Preview (Page 2)
function displayCard(cardResponse){
  // Find the character match from response to the CHARACTER_LIST array, then
  // populate the card with the correct image and alt text
  let character = CHARACTER_LIST.find(function(character) {
    return character.characterName === cardResponse.character
  });
  
  $('.contentContainer').html(
    
    `
     <!-- Page 2: Preview/Edit card -->
     <div class="newContentContainer">
       <h2>Card Preview</h2>
       <h3>Click Save to save image to your machine, then send to a friend!</h3>
       <!-- Note: the below image will be a canvas element -->
       <div class="css-preview-content-container card" id="screenshot-card" data-card-id="${cardResponse.id}">
         <p>${cardResponse.headline}</p>
         <p>${cardResponse.bodyText}</p> 
         <img src=${character.characterImage} alt="image of ${cardResponse.character}">
         <a href="http://marvel.com" target="_blank">Data provided by Marvel. © 2019 MARVEL</a>
         <input type="submit" 
          class="test download-card-btn css-cta" 
          data-html2canvas-ignore="true" 
          value="Save">
       </div>
     </div>
   `
  )
}

// Function which returns no cards found on Card list page
function generateNoCardsFoundPageString() {
  return `
  <!-- Page 6: No cards created page -->
  <div class="newContentContainer">
    <div>
      <h2>No Cards Found!</h2>
      <p> Please go to the Create card page to Create new card</p>
      <button class="css-create-card-cta js-create-card-btn">Create New Card</button>
    </div>
  </div>
  `
}

function getAndDisplayCardList(cardListResponse) {
  // Handles no cards found by showing "No Cards Found" page
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
        <p>${cardListResponse[i].character}</p>
        <!-- Buttons for card operations -->
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
      <div class="newContentContainer">
        <h2>Your Saved Cards</h2>
        <h3>Edit, View, or Delete Your Cards!</h3>
          ${cardList.join('')}
      </div>

      `
    );
  }
}


// Returns the html for generating the card form on Edit
function generateCardFormStringEdit(cardResponse) {
 
  return `
    <!-- Edit card-->
    <div class="newContentContainer">
    <!-- <div class="contentContainer css-container" id="screenshot-card"> -->
      <h2 class="css-h2" >Edit your card</h2>
        <form class="card-update-form css-form" data-card-id="${cardResponse.id}">
            <label for="headline">Headline</label>
            <input value="${cardResponse.headline}" placeholder="Add new headline" id="headline" type="text" name="textfield" class="css-headline-field" required>
            <label for="message">Message</label>
            <input value="${cardResponse.bodyText}" placeholder="Add new message" id="message" type="text" name="textfield" class="css-message-field" required>
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
          <input type="submit" class="js-update-card-button css-cta" data-html2canvas-ignore="true" value="View Updated Card">     
        </form>
    </div> 

  `;
}

// Function to display Edit card form (Page 1)
function getAndDisplayCardFormEdit(cardResponse) {
  const cardForm = generateCardFormStringEdit(cardResponse);
  $('.contentContainer').html(cardForm); 
}

// Returns html for Sign Up Form
function generateSignUpFormString() {
  
  return `
    <!-- Sign Up -->
    <div class="newContentContainer">
      <h2>Sign Up For Your Account</h2>
      <img class="signup-image" 
        src="../images/loki_landscape_medium.jpg" 
        alt="Loki">
      <img class="signup-image" 
      src="../images/storm_landscape_medium.jpg" 
      alt="Storm">
      <img class="signup-image" 
      src="../images/deadpool_landscape_medium.jpg" 
      alt="Deadpool">
      <h3 class="login-h3">Sign up for your Account, and start Creating!</h3>
      <form class="css-signup-form sign-up-form">
        <div class="username-section entry-field">
          <label for="username">Username</label>
          <input id="username" type="text" name="textfield" class="css-signup-input" required>
        </div>
        <div class="password-section entry-field">
          <label for="password">Password</label>
          <input id="password" type="password" name="textfield" class="css-pw-signup-input" required>
        </div>
        <input type="submit" class="css-submit enter-creds-button" value="Enter Credentials">
        <div>
          <p role="alert" class="hidden" id="invalid-signup-alert">Invalid signup credentials, 
          please try again</p>
        </div>
      </form>
      <button class="css-submit go-to-login-button">Go To Sign In</button>
    </div>
  `
}

// Display the Sign Up Form
function getAndDisplaySignUpForm() {
  const signUpForm = generateSignUpFormString();
  $('.contentContainer').html(signUpForm);
};

// Returns html for Login form
function generateLoginFormString() {
  return `
    <!-- Login -->
    <div class="newContentContainer">
      <h2>Sign into Your Account</h2>
      <img class="login-image" 
        src="../images/iron_man_landscape_medium.jpg" 
        alt="Iron Man">
      <img class="login-image" 
      src="../images/captain_marvel_landscape_medium.jpg" 
      alt="Captain Marvel">
      <img class="login-image" 
      src="../images/black_panther_landscape_medium.jpg" 
      alt="Iron Man">
      <h3 class="login-h3">Sign In to Create Customized Greetings cards with your
      favorite Marvel Superheroes and Supervillians!</h3>
      <form class="css-login-form login-form">
        <div class="username-section entry-field"> 
          <label for="username">Username</label>
          <input id="username" type="text" name="textfield" class="css-login-input" required>
        </div>
        <div class="password-section entry-field">
          <label for="password">Password</label>
          <input id="password" type="password" name="textfield" class="css-pw-input" required>
        </div>
        <input type="submit" class="css-submit login-button" value="Sign In">
        <div>
          <p role="alert" class="hidden" id="invalid-login-alert">Invalid login, 
          please use valid credentials or go to Signup Form</p>
        </div>
      </form>
      <p class="footer-text">Try it out first! </p>
      <p class="footer-text">User: testuser1</p>
      <p class="footer-text">PW: Super1234!</p>
      <button class="css-submit signup-form-button">Sign Up</button>
    </div>
  `
}

// Display Login Form
function getAndDisplayLoginForm() {
  $('.js-navbar').hide();
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
    $('.js-navbar').hide();
    getAndDisplaySignUpForm();
  })

  // Event listener for clicking "Go to Login page" button on the signup page
  // then shows the login page
  $('.contentContainer').on('click', '.go-to-login-button', event => {
    $('.js-navbar').hide();
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

  // On submit of Login button, verify valid credentials
  // Display Create Card Page on successful login
  $('.contentContainer').on('submit', '.login-form', event => {
    event.preventDefault();
    const usernameVal = $('#username').val();
    const passwordVal = $('#password').val();
    loginPostToApi(usernameVal, passwordVal, function(data) {
      window.localStorage.setItem("authToken", data.authToken)
      getAndDisplayCardForm(); 
    })
  })

  // Listen for click of "Saved Cards List" button. 
  // Then get the card list from the GET endpoint, display the Card list.
  $('.js-navbar').on('click', '.js-saved-cards-button', event => {
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

  // Listen for click on '.download-card-btn' then convert html image to 
  // canvas and download it to users machine
  $('.contentContainer').on('click', '.download-card-btn', event => { 
    
    let x = this.getElementById('screenshot-card');
    html2canvas(x).then(canvas => {
      var a = document.createElement('a');
      a.href = canvas.toDataURL("image/jpeg")
      a.download = 'marvelousGreetings.jpg';
      document.body.appendChild(a);
      a.click();
    })
      .then(() => {
        // After downloading card, navigates to Cards List page (Page 3)
        getCardListFromApi(getAndDisplayCardList);
      })
  })

  // On "no card found" page, listen for click on "Create Card" button
  $('.contentContainer').on('click', '.js-create-card-btn', event => {
    getAndDisplayCardForm();
  })

  // Listens for click on "Create Card" button in navbar, shows Create form
  $('.js-navbar').on('click', '.js-create-card-btn', event => {
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
  $('.js-navbar').on('click', '.logout-button', event => {
    $('.js-navbar').hide();
    window.localStorage.removeItem("authToken");
    getAndDisplayLoginForm();
  })

});