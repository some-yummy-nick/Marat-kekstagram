'use strict';
(function() {
  function Photo(data) {
    this._data = data;
  }
  Photo.prototype.render = function() {
    var template = document.querySelector('#picture-template');
    if ('content' in template ) {
      this.element = template.content.childNodes[1].cloneNode(true);
    } else {
      this.element = template.childNodes[1].cloneNode(true);
    }

    this.element.querySelector('.picture-comments').textContent = this._data.comments;
    this.element.querySelector('.picture-likes').textContent = this._data.likes;
    var backgroundImage = new Image();
    var imageLoadTimeout;
    backgroundImage.onload = function() {
      clearTimeout(imageLoadTimeout);
      var elementImage = this.element.querySelector('img');
      this.element.replaceChild(backgroundImage, elementImage);
      backgroundImage.width = 182;
    }.bind(this);
    backgroundImage.onerror = function() {
      this.element.classList.add('picture-load-failure');
    }.bind(this);
    backgroundImage.src = this._data.url;
    var IMAGE_TIMEOUT = 10000;
    imageLoadTimeout = setTimeout(function() {
      backgroundImage.src = '';
      this.element.classList.add('picture-load-failure');
    }.bind(this), IMAGE_TIMEOUT);
  };
  window.Photo = Photo;
})();


