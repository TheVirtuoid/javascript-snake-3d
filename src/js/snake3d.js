// main snake3d file

import Game from "./Game";

const canvasDom = document.getElementById('board');
const game = new Game(canvasDom);
game.start();
