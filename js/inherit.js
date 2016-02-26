'use strict';
define(function() {
  /**
   * Наследует один объект от другого
   * @param {function} child - Конструктор потомка
   * @param {function} parent - Конструктор предка
   */
  function inherit(child, parent) {
    var EmptyConstructor = function() {};
    EmptyConstructor.prototype = parent.prototype;
    child.prototype = new EmptyConstructor();
  }
  return inherit;
});
