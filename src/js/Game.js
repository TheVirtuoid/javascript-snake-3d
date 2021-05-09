import {
	Engine,
	HemisphericLight,
	Scene,
	Vector3
} from "@babylonjs/core";
import Snake from "./Snake";
import Camera from "./Camera";
import Board from "./Board";

export default class Game {
	scene;
	engine;
	camera;
	light;
	snake;
	board;
	frameRate = 2;
	stopGame = true;
	runningFrameRate = 0;
	speed = 1;

	constructor (canvasDom) {
		this.engine = new Engine(canvasDom);
		this.scene = new Scene(this.engine);
		// this.scene.collisionsEnabled = true;
		const startingPosition = new Vector3(0, 10, 10);
		this.camera = new Camera( { scene: this.scene, canvasDom });
		this.light = new HemisphericLight("light", new Vector3(0,1,0), this.scene);
		this.snake = new Snake({ game: this, speed: this.speed, startingPosition, startingSegments: 10 });
		this.board = new Board({ name: "board", game: this });
	}

	go () {
		this.runningFrameRate = this.frameRate;
		// this.scene.registerBeforeRender(this.gameRunner.bind(this));
		this.engine.runRenderLoop( () => {
			this.scene.render();
		});
	}

	stop () {
		console.log('stopping');
		this.engine.stopRenderLoop();
	}

	gameRunner () {
		if (this.stopGame) {
			this.stop();
			return;
		}
		this.runningFrameRate--;
		if (this.runningFrameRate === 0) {
			this.runningFrameRate = this.frameRate;
			const position = this.camera.gameCamera.position.clone();
			const direction = this.camera.gameCamera.getDirection(Vector3.Forward());
			this.camera.move();
			this.snake.move(position, direction);
			if (this.snake.hit) {
				this.stopGame = true;
			}
		}
	}

}