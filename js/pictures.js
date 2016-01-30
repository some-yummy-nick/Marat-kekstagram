'use strict';
/* global pictures */
( function() {
  var doc = document;
  var container = doc.querySelector('.pictures');
  var filters = doc.querySelector('.filters');
  filters.classList.remove('hidden');
  pictures.forEach(function( picture ) {
    var element = getElementFromTemplate(picture);
    container.appendChild(element);
  });

  function getElementFromTemplate( data ) {
    var template = doc.querySelector('#picture-template');
    if ('content' in template ) {
      var element = template.content.children[0].cloneNode(true);
    } else {
      var element = template.children[0].cloneNode(true);
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
