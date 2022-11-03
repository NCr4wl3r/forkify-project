import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmaksView from "./views/bookmarksView";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

// if (module.hot) {
//   module.hot.accept();
// }

async function controlRecipes() {
  try {
    // get the hash of the url
    const id = window.location.hash.slice(1);

    // guard clause
    if (!id) return;
    recipeView.renderSpinner();

    // step0: results view mark selected result
    resultsView.update(model.getSearchResultPage());

    // step1: update bookmark
    bookmaksView.update(model.state.bookmarks);

    // step2: loading recipe
    await model.loadRecipe(id);

    // step3: Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (e) {
    console.log("controlRecipes error", e);
    recipeView.renderError();
  }
}

async function controlSearchResults() {
  try {
    resultsView.renderSpinner();

    // 1 Get search query and clear input later
    const query = searchView.getQuery();
    if (!query) return;

    // 2 load search results
    await model.loadSearchResults(query);

    // 3 render search results
    resultsView.render(model.getSearchResultPage());
    // resultsView.render(model.state.search.results);

    // 4 render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(`ControlSearchResult ${err}`);
  }
}

function controlPagination(goToPage) {
  console.log(goToPage);
  //  render new results
  resultsView.render(model.getSearchResultPage(goToPage));

  //  render new pagination buttons
  paginationView.render(model.state.search);
}

function controlServing(newServings) {
  // Update the recpe servings (in state)
  model.updateServings(newServings);

  // Update then the recipeView
  // recipeView.render(model.state.recipe);

  recipeView.update(model.state.recipe);
}

function controlBookmaks() {
  bookmaksView.render(model.state.bookmarks);
}

function controlAddBookmark() {
  // 1.- Add/Remove bookmarks
  if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  else model.addBookmark(model.state.recipe);

  // 2.- Update page
  recipeView.update(model.state.recipe);

  // 3.- Render bookmarks
  bookmaksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload recipe
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Display success message
    addRecipeView.renderMessage();

    // Render bookmarks
    bookmaksView.render(model.state.bookmarks);

    // Change Id in the Url hash: pushState(state, title, url)
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
}

function init() {
  bookmaksView.addHandlerRender(controlBookmaks);
  // publisheer-subscriber patter (linked to recipeviews & searchView)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServing);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);

  model.restoreBookmaks();
}

init();
