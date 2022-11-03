import View from "./View.js";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");

      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const _currentPage = this._data.page;

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and  more pages
    if (_currentPage === 1 && numPages > 1) {
      return ` 
      <button data-goto="${
        _currentPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${_currentPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
    }
    // Page 1 and NO more pages
    if (_currentPage === 1 && numPages === 1) {
      return ``;
    }
    // more pages
    if (_currentPage < numPages) {
      return `
      <button data-goto="${
        _currentPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${_currentPage - 1}</span>
      </button>
      
      <button data-goto="${
        _currentPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${_currentPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
    }
    // Last page and NO more pages
    if (_currentPage === numPages) {
      return `
      <button data-goto="${
        _currentPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${_currentPage - 1}</span>
    </button>`;
    }
    return;
  }
}

export default new PaginationView();
