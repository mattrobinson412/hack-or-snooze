"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
    localStorage.setItem("favoriteStories", favoriteStories)
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  $allStoriesList.show();

  updateNavOnLogin();
}

/** allows user to favorite and un-favorite a story. 
 * This data will remain even when the page refreshes. */



  $("body").on("click", function (e) {
    if (e.target.className === 'far fa-star') {
      let icon = e.target;
      $(icon).toggleClass( "favorited" );
      let story = $(icon).closest("li");
      currentUser.favorites.push(story);
      console.log(currentUser.favorites);
    }
  });

$("body").on("dblclick", function (e) {
  if (e.target.className === 'far fa-star favorited') {
    let icon = e.target;
    $(icon).toggleClass("favorited");
    let story = $(icon).closest("li");
    currentUser.favorites.pop(story);
    console.log(currentUser.favorites);
    }
  })

$("body").on("click", function (e) {
  if (e.target.className === 'fas fa-trash-alt') {
    let icon = e.target;
    $(icon).closest("li").remove();
  }
});

function createFavoritesList () {
  console.debug("createFavoritesList");
  console.log(currentUser.favorites);

  for (const fav of currentUser.favorites) {
    let newFav = $(`
      <li id>
        <button id="removeBtn" class="btn"><i class="fas fa-trash-alt"></i></button>
        <a href="${fav[0].children[2].innerText}" target="a_blank" class="story-link">
          ${fav[0].children[2].innerText} 
        </a>
        <small class="story-hostname">${fav[0].children[3].innerText}</small>
        <small class="story-author">${fav[0].children[4].innerText}</small>
        <small class="story-user">${fav[0].children[5].innerText}</small>
      </li>
    `);
    $("#all-favorites-list").append(newFav);
    $("#all-favorites-list").show();
  };
  $("#all-favorites-list").show();
}

