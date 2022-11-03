import { API_URL, KEY } from "./config";
import { RES_PER_PAGE } from "./config";
import { getJSON, sendJSON, AJAX } from "./helpers";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

function createRecipeObject(data) {
  const { recipe } = data.data;
  return (state.recipe = {
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    servings: recipe.servings,
    title: recipe.title,
    image: recipe.image_url,
    sourceUrl: recipe.source_url,
    publisher: recipe.publisher,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  });
}
export async function loadRecipe(id) {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    // Check if the recipe ID it's on bookmarks array. if it is, add the attribute so recipeView can mark the icon as bookmarked
    if (state.bookmarks.some((bookmark) => bookmark.id == id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    // Temp error
    console.error(`model: ${err}`);
    throw err;
  }
}

export async function loadSearchResults(query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    const searchRecipes = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image_url,
        publisher: recipe.publisher,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.query = query;
    state.search.results = searchRecipes;
    state.search.page = 1;
  } catch (err) {
    // console.error(`model: ${err}`);
    throw err;
  }
}

export function getSearchResultPage(page = 1) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //9;
  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
}

function persistBookmarks() {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

export function addBookmark(recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark:
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // Add to local storage
  persistBookmarks();
}

export function deleteBookmark(id) {
  // Delete bookmark
  const index = this.state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);
  // Remove current recipe as bookmark:
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  // Add to local storage
  persistBookmarks();
}

export function restoreBookmaks() {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
}

function clearBookmaks() {
  localStorage.clear("bookmaks");
}

// This function reformat all the data to upload to the API
export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient format! Please the correct format!"
          );

        const [quantity, unit, description] = ingArr;
        return { description, quantity: quantity ? +quantity : null, unit };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients: ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    // const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
}
