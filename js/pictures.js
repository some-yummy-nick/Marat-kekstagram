'use strict';
( function() {
  var doc = document;
  var container = doc.querySelector('.pictures');
  var activeFilter = 'filter-popular';
  var pictures = [];
  var filters = doc.querySelector('.filters');
  var filtersRadio = filters.querySelectorAll('.filters-radio');
  for ( var i = 0; i < filtersRadio.length; i++) {
    filtersRadio[i].onclick = function(evt) {
      var clickedElementID = evt.target.id;
      setActiveFilter(clickedElementID);
    };
  }
  getPictures();
  function renderPictures(picturesToRender) {
    container.innerHTML = '';
    var fragment = doc.createDocumentFragment();
    picturesToRender.forEach(function( picture ) {
      var element = getElementFromTemplate(picture);
      fragment.appendChild(element);
    });
    container.appendChild(fragment);
  }
  var week2 = Number(new Date(new Date() - 14 * 24 * 60 * 60 * 1000));
  function filterByDate(obj) {
    var arrDate = obj.date;
    if (Number(new Date(arrDate)) < week2) {
      return true;
    }
  }
  filters.classList.remove('hidden');
  function setActiveFilter( id ) {
    if ( activeFilter === id ) {
      return;
    }
    doc.querySelector('#' + activeFilter).removeAttribute('checked', '');
    doc.querySelector('#' + id).setAttribute('checked', '');
    var filteredPictures = pictures.slice(0);
    switch (id) {
      case 'filter-new':
        var ourWeek = filteredPictures.filter(filterByDate);
        filteredPictures = ourWeek.sort(function( a, b ) {
          return b.date - a.date;
        });
        activeFilter = 'filter-new';
        break;
      case 'filter-discussed':
        filteredPictures = filteredPictures.sort(function( a, b ) {
          return b.comments - a.comments;
        });
        activeFilter = 'filter-discussed';
        break;
    }
    renderPictures(filteredPictures);
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
      var loadedPictures = JSON.parse(rawData);
      pictures = loadedPictures;
      renderPictures(loadedPictures);
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
      var image = doc.querySelector('.pictures');
      image.classList.remove('pictures-loading');
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
