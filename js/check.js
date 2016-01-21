function getMessage(a, b) {
    "use strict";
    if (a === true) {
        return "Переданное GIF-изображение анимировано и содержит " + b + " кадров";
    } else if (a === false) {
        return "Переданное GIF-изображение не анимировано";
    } else if (typeof a === "number") {
        return "Переданное SVG-изображение содержит " + a + " объектов и " + b * 4 + " аттрибутов";
    } else if ((typeof b !== "object") && (typeof a === "object")) {

        for (var i = 0, sum = 0; i < a.length; i++) {
            sum += a[i];
        }
        return "Количество красных точек во всех строчках изображения: " + sum;

    } else if ((typeof a === "object") && (typeof b === "object")) {
        for (var k = 0, j = 0, square = 0; k < a.length, j < b.length; k++, j++) {
            square += a[k] * b[j];
        }
        return "Общая площадь артефактов сжатия: " + square + " пикселей";
    }
}