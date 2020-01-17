"use strict";
exports.__esModule = true;
var data_1 = require("./data");
var sumOfFuel = 0;
for (var _i = 0, data_2 = data_1.data; _i < data_2.length; _i++) {
    var mass = data_2[_i];
    var fuelNeeded = Math.floor(mass / 3) - 2;
    sumOfFuel += fuelNeeded;
}
console.log(sumOfFuel);
