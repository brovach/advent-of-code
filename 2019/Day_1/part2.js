const { data } = require('./data');

const calcModuleFuel = (mass, arr = []) => {
  let fuel = Math.floor(mass / 3) - 2;
  if (fuel <= 0) {
    return arr;
  } else {
    arr.push(fuel);
    return calcModuleFuel(fuel, arr);
  }
};

calcTotalFuel = mass => {
  return calcModuleFuel(mass).reduce((a, b) => a + b, 0);
};

let fuel = data.map(mass => calcTotalFuel(mass));
const total_fuel = fuel.reduce((a, b) => a + b, 0);

console.log(total_fuel);
