import View from "./View.js";
import icons from "url:../../img/icons.svg";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _message = "Recipe was succesfully uploaded!";

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");

  _uploadBtn = document.querySelector(".upload__btn");
  _closeBtn = document.querySelector(".btn--close-modal");
  _openBtn = document.querySelector(".nav__btn--add-recipe");

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    // this.addHandlerUpload();
  }

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  _addHandlerShowWindow() {
    this._openBtn.addEventListener("click", this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    [this._overlay, this._closeBtn].forEach((el) =>
      el.addEventListener("click", this.toggleWindow.bind(this))
    );
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();

      // inside the handler function, this now is _parentElement, the element calling the function
      // FormData is going to pick all the data of the form
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
