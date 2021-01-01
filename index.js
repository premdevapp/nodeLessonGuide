import chalk from "chalk";

const { red, blue } = chalk;

console.log(red.bgBlue.underline.bold("HELLO"), blue.bgRed.bold("World"));
