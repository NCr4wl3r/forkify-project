import PreviewView from "./previewView.js";
import View from "./View.js";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMsg = `No recipes found for your query! Please try again`;
  _message = "";

  _generateMarkup() {
    return this._data
      .map((results) => PreviewView.render(results, false))
      .join("");
  }
}

export default new ResultsView();
