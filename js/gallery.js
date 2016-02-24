'use strict';
(function() {
  var Gallery = function() {
    this.element = document.querySelector('.gallery-overlay');
    this._closeButton = this.element.querySelector('.gallery-overlay-close');
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onPhotoClick = this._onPhotoClick.bind(this);
  };
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onDocumentKeyDown);
    this._closeButton.addEventListener('click', this._onPhotoClick);
  };
  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onDocumentKeyDown);
    this._closeButton.removeEventListener('click', this._onPhotoClick);
  };
  Gallery.prototype._onDocumentKeyDown = function() {
    this.hide();
  };
  Gallery.prototype._onPhotoClick = function() {
  };
  window.Gallery = Gallery;
})();
