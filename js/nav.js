"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $("#navUserFavorites").show();
}

$body.on("click", "#nav-submit", navSubmitClick);

// A user clicks on the 'submit' link in the nav in order to access the submission form. 

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $("#addstory-form").show();
}

$body.on("click", "#navUserFavorites", navShowFavorites);

function navShowFavorites(e) {
  console.debug("navShowFavorites", e);
  createFavoritesList();
  hidePageComponents();
  $("#all-favorites-list").show();
  
}
