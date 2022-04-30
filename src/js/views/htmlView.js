class HtmlView {
  #parentElement = document.querySelector('html');

  changeTheme(handler) {
    const themePicker = this.#parentElement.querySelector(
      '.btn__theme--select'
    );

    themePicker.addEventListener('change', () => {
      this.#parentElement.setAttribute('data-theme', themePicker.value);
      handler(themePicker.value);
    });
  }

  changeThemeOnUserPreference() {
    window
      .matchMedia('(prefers-color-scheme: light)')
      .addEventListener('change', function (e) {
        const theme = e.matches ? 'light' : 'dark';
        this.#parentElement.setAttribute('data-theme', theme);
      });
  }

  renderErrorOnOffline() {
    window.addEventListener('online', this.#updateOnlineStatus.bind(this));
    window.addEventListener('offline', this.#updateOnlineStatus.bind(this));
  }

  #updateOnlineStatus() {
    const overlay = this.#parentElement.querySelector('.overlay__error');
    const popup = this.#parentElement.querySelector('.popup__error');

    if (!navigator.onLine) {
      overlay.classList.remove('hidden');
      popup.classList.remove('hidden');
    } else {
      overlay.classList.add('hidden');
      popup.classList.add('hidden');
    }
  }

  renderSavedTheme(theme) {
    this.#parentElement.setAttribute('data-theme', theme);
    const themePicker = this.#parentElement.querySelector(
      '.btn__theme--select'
    );
    themePicker.value = theme === 'dark' ? 'dark' : 'light';
  }

  clearAppData() {
    this.#parentElement
      .querySelector('.btn__clear-data')
      .addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('state');
        window.location.href = '/index.html';
      });
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }
}

export default new HtmlView();
