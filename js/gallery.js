'use strict';
(function() {
  var Gallery = function() {
    this.element = document.querySelector('.gallery-overlay');
    this._closeButton = this.element.querySelector('.gallery-overlay-close');
    this._image = this.element.querySelector('.gallery-overlay-image');
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onPhotoClick = this._onPhotoClick.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);
  };
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    this._image.addEventListener('click', this._onPhotoClick);
    this._closeButton.addEventListener('click', this._onCloseClick);
    window.addEventListener( 'keydown', this._onDocumentKeyDown );
  };
  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
    this._image.removeEventListener('click', this._onPhotoClick);
    this._closeButton.removeEventListener('click', this._onCloseClick);
    window.removeEventListener( 'keydown', this._onDocumentKeyDown );
  };
  Gallery.prototype._onDocumentKeyDown = function(evt) {
    if (evt.keyCode === 27) {
      this.hide();
    }
  };
  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };
  Gallery.prototype._onPhotoClick = function() {
  };
  window.Gallery = Gallery;
})();
