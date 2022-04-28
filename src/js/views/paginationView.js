import icons from '../../icons/icons.svg';

class PaginationView {
  #parentElement = document.querySelector('.results__pagination');

  addHandlerClick(handler) {
    this.#parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn');

      if (!btn) return;

      const goToPage = +btn.dataset.goTo;
      handler(goToPage);
    });
  }

  renderButtons(data, results) {
    this.#parentElement.innerHTML = '';
    console.log(this.#generateMarkup(data, results));
    this.#parentElement.insertAdjacentHTML(
      'beforeend',
      this.#generateMarkup(data, results)
    );
  }

  #generateMarkup(data, results) {
    const curPage = data.page;
    const numPages = Math.ceil(results.length / data.resultsPerPage);

    console.log(curPage);
    console.log(numPages);

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
      <button data-go-to="${curPage + 1}" class="btn pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return `
      <button data-go-to="${curPage - 1}" class="btn pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>`;
    }

    // Other page
    if (curPage < numPages) {
      return `
      <button data-go-to="${curPage - 1}" class="btn pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
      <button data-go-to="${curPage + 1}" class="btn pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
    }

    // Page 1, and there are no other pages
    return '';
  }
}

export default new PaginationView();
