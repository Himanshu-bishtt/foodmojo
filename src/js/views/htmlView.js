class HtmlView {
  _parentElement = document.querySelector('html');

  changeTheme(handler) {
    const themePicker = this._parentElement.querySelector(
      '.btn__theme--select'
    );

    themePicker.addEventListener('change', () => {
      this._parentElement.setAttribute('data-theme', themePicker.value);
      handler(themePicker.value);
    });
  }

  renderErrorOnOffline() {
    window.addEventListener('online', this._updateOnlineStatus.bind(this));
    window.addEventListener('offline', this._updateOnlineStatus.bind(this));
  }

  _updateOnlineStatus() {
    const overlay = this._parentElement.querySelector('.overlay__error');
    const popup = this._parentElement.querySelector('.popup__error');

    if (!navigator.onLine) {
      overlay.classList.remove('hidden');
      popup.classList.remove('hidden');
    } else {
      overlay.classList.add('hidden');
      popup.classList.add('hidden');
    }
  }

  renderSavedTheme(theme) {
    this._parentElement.setAttribute('data-theme', theme);
    const themePicker = this._parentElement.querySelector(
      '.btn__theme--select'
    );
    themePicker.value = theme === 'dark' ? 'dark' : 'light';
  }
}

export default new HtmlView();
