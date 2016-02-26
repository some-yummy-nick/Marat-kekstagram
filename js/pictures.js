/*global Gallery, Photo */
'use strict';
( function() {
  var doc = document;
  var container = doc.querySelector('.pictures');
  var activeFilter = 'filter-popular';
  var pictures = [];
  var filteredPictures = [];
  var renderedElements = [];
  var gallery = new Gallery();
  var currentPage = 0;
  var PAGE_SIZE = 12;
  var filters = doc.querySelector('.filters');
  function setFilter() {
    filters.addEventListener('click', function(evt) {
      var clickedElement = evt.target;
      if (clickedElement.classList.contains('filters-radio')) {
        setActiveFilter(clickedElement.id);
      }
    });
  }

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
  setFilter();
  function renderPictures(picturesToRender, pageNumber, replace) {
    if (replace) {
      var el;
      while ((el = renderedElements.shift())) {
        container.removeChild(el.element);
        el.onClick = null;
        el.remove();
      }

    }
    var fragment = document.createDocumentFragment();
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pagePictures = picturesToRender.slice(from, to);
    renderedElements = renderedElements.concat(pagePictures.map(function(picture) {
      var photoElement = new Photo();
      photoElement.setData(picture);
      photoElement.render();
      container.appendChild(photoElement.element);
      photoElement.onClick = function() {
        gallery.setData(photoElement.getData());
        gallery.render();
      };
      return photoElement;
    }));
    container.appendChild(fragment);
  }
  var week2 = Number(new Date(new Date() - 14 * 24 * 60 * 60 * 1000));
  filters.classList.remove('hidden');
  function setActiveFilter(id) {
    if ( activeFilter === id) {
      return;
    }
    activeFilter = id;
    currentPage = 0;
    var selectedFilter = document.querySelector('#' + activeFilter);
    if (selectedFilter) {
      selectedFilter.setAttribute('checked', 'false');
    }
    document.querySelector('#' + id).setAttribute('checked', 'true');
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
    gallery.setPictures(filteredPictures);
    renderPictures(filteredPictures, currentPage, true);
    windowLarge();
  }
  function getPictures() {
    container.classList.add('pictures-loading');
    var imageLoadTimeout;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://o0.github.io/assets/json/pictures.json');
    xhr.addEventListener('load', function(evt) {
      clearTimeout(imageLoadTimeout);
      container.classList.remove('pictures-loading');
      var rawData = evt.target.response;
      pictures = JSON.parse(rawData);
      filteredPictures = pictures.slice(0);
      renderPictures(filteredPictures, currentPage);
      windowLarge();
    });
    xhr.addEventListener('error', function() {
      container.classList.add('pictures-failure');
    });
    var IMAGE_TIMEOUT = 10000;
    imageLoadTimeout = setTimeout(function() {
      pictures = '';
      container.classList.add('pictures-failure');
    }, IMAGE_TIMEOUT);
    xhr.send();
  }
})();
