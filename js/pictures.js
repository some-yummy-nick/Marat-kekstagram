/*global Photo, Gallery*/
'use strict';
( function() {
  var doc = document;
  var container = doc.querySelector('.pictures');
  var activeFilter = 'filter-popular';
  var pictures = [];
  var filteredPictures = [];
  var gallery = new Gallery();
  var currentPage = 0;
  var PAGE_SIZE = 12;
  var filters = doc.querySelector('.filters');
  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;

    if (clickedElement.classList.contains('filters-radio')) {
      setActiveFilter(clickedElement.id);
    }
  });
  var scrollTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      var containerCoordinates = container.getBoundingClientRect();
      var viewportSize = window.innerHeight;
      if (containerCoordinates.top <= viewportSize ) {
        if (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)) {
          renderPictures(filteredPictures, ++currentPage);
        }
      }
    }, 100);
  });
  var LARGE_SCREEN_SIZE = 1367;
  var windowLarge = function() {
    if (document.body.clientWidth > LARGE_SCREEN_SIZE) {
      if (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)) {
        renderPictures(filteredPictures, ++currentPage);
      }
    }
  };
  getPictures();
  function renderPictures(picturesToRender, pageNumber, replace) {
    if (replace) {
      var renderedElements = doc.querySelectorAll('.picture');
      [].forEach.call(renderedElements, function(el) {
        el.removeEventListener('click', _onPhotoClick);
        container.removeChild(el);
      });
    }
    var fragment = doc.createDocumentFragment();
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pagePictures = picturesToRender.slice(from, to);
    pagePictures.forEach(function( photo ) {
      var photoElement = new Photo(photo);
      photoElement.render();
      fragment.appendChild(photoElement.element);
      photoElement.element.addEventListener('click', _onPhotoClick);
    });
    container.appendChild(fragment);
  }
  function _onPhotoClick(evt) {
    evt.preventDefault();
    gallery.show();
  }
  var week2 = Number(new Date(new Date() - 14 * 24 * 60 * 60 * 1000));
  filters.classList.remove('hidden');
  function setActiveFilter( id ) {
    if ( activeFilter === id ) {
      return;
    }
    doc.querySelector('#' + activeFilter).removeAttribute('checked', '');
    doc.querySelector('#' + id).setAttribute('checked', '');
    filteredPictures = pictures.slice(0);
    switch (id) {
      case 'filter-discussed':
        filteredPictures = filteredPictures.sort(function( a, b ) {
          return b.comments - a.comments;
        });
        activeFilter = 'filter-discussed';
        break;
      case 'filter-new':
        filteredPictures = filteredPictures.sort(function(a, b) {
          return new Date(b.date).valueOf() - new Date(a.date).valueOf();
        });
        filteredPictures = filteredPictures.filter(function(picture) {
          return new Date(picture.date).valueOf() >= week2;
        });
        activeFilter = 'filter-new';
        break;
    }
    currentPage = 0;
    renderPictures(filteredPictures, currentPage, true);
    windowLarge();
  }
  function getPictures() {
    container.classList.add('pictures-loading');
    var imageLoadTimeout;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://o0.github.io/assets/json/pictures.json');
    xhr.onload = function(evt) {
      clearTimeout(imageLoadTimeout);
      container.classList.remove('pictures-loading');
      var rawData = evt.target.response;
      pictures = JSON.parse(rawData);
      filteredPictures = pictures.slice(0);
      renderPictures(filteredPictures, currentPage);
      windowLarge();
    };
    xhr.onerror = function() {
      container.classList.add('pictures-failure');
    };
    var IMAGE_TIMEOUT = 10000;
    imageLoadTimeout = setTimeout(function() {
      pictures = '';
      container.classList.add('pictures-failure');
    }, IMAGE_TIMEOUT);
    xhr.send();
  }
})();
