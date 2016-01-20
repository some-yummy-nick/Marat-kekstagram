function getMessage(a, b) {
    "use strict";
    if (a === true) {
        return "Переданное GIF-изображение анимировано и содержит " + b + " кадров";
    } else if (a === false) {
        return "Переданное GIF-изображение не анимировано";
    } else if (typeof a === "number") {
        return "Переданное SVG-изображение содержит " + a + " объектов и " + b * 4 + " аттрибутов";
    } else if (typeof a === "object") {

        for (var i = 0, sum = 0; i < a.length; i++) {
            sum += [i];
        }
        return "Количество красных точек во всех строчках изображения: " + sum;
    }
}