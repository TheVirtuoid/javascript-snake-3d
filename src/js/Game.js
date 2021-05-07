import {
	Engine,
	HemisphericLight,
	Scene,
	Vector3
} from "@babylonjs/core";
import Snake from "./Snake";
import Camera from "./Camera";

export default class Game {
	scene;
	engine;
	camera;
	light;
	snake;
	frameRate = 2;
	stopGame = false;
	runningFrameRate = 0;

	constructor (canvasDom) {
		this.engine = new Engine(canvasDom);
		this.scene = new Scene(this.engine);
		this.scene.collisionsEnabled = true;
		this.camera = new Camera( { scene: this.scene, canvasDom });
		this.light = new HemisphericLight("light", new Vector3(0,1,0), this.scene);
		const startingPosition = new Vector3(0, 10, 10);
		this.snake = new Snake({ game: this, startingPosition, startingSegments: 5 });
	}

	go () {
		this.runningFrameRate = this.frameRate;
		this.scene.registerBeforeRender(this.gameRunner.bind(this));
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
			// console.log('-----game runner');
			this.runningFrameRate = this.frameRate;
			const position = this.camera.gameCamera.position.clone();
			const direction = this.camera.gameCamera.getDirection(Vector3.Forward());
			this.camera.move();
			// console.log('--------new camera ', this.camera.gameCamera.position);
			this.snake.move(position, direction);
			if (this.snake.hit) {
				this.stopGame = true;
			}
		}
	}

}