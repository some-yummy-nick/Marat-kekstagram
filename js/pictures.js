'use strict';
/* global pictures */
( function() {
  var doc = document;
  var container = doc.querySelector('.pictures');
  var filters = doc.querySelector('.filters');
  pictures.forEach(function( picture ) {
    var element = getElementFromTemplate(picture);
    container.appendChild(element);
  });
  filters.classList.remove('hidden');
  function getElementFromTemplate( data ) {
    var template = doc.querySelector('#picture-template');
    var element;
    if ('content' in template ) {
      element = template.content.childNodes[1].cloneNode(true);
    } else {
      element = template.childNodes[1].cloneNode(true);
    }
    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;
    var backgroundImage = new Image();
    var imageLoadTimeout;
    backgroundImage.onload = function() {
      clearTimeout(imageLoadTimeout);
      var elementImage = element.querySelector('img');
      element.replaceChild(backgroundImage, elementImage);
      backgroundImage.width = 182;
    };
    backgroundImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };
    backgroundImage.src = data.url;
    var IMAGE_TIMEOUT = 10000;
    imageLoadTimeout = setTimeout(function() {
      backgroundImage.src = '';
      element.classList.add('picture-load-failure');
    }, IMAGE_TIMEOUT);
    return element;
  }
})();
