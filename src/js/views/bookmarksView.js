import PreviewView from "./previewView.js";
import View from "./View.js";

class BookmaksView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMsg = `No bookmarks yet. Find a nice recipe and bookmark it :)`;
  _message = "";

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }
  _generateMarkup() {
    return this._data
      .map((bookmark) => PreviewView.render(bookmark, false))
      .join("");
  }
}

export default new BookmaksView();
