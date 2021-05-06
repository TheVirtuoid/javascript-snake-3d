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

	constructor (canvasDom) {
		this.engine = new Engine(canvasDom);
		this.scene = new Scene(this.engine);
		this.camera = new Camera( { scene: this.scene, canvasDom });
		this.light = new HemisphericLight("light", new Vector3(0,1,0), this.scene);
		const startingPosition = new Vector3(0, 10, 10);
		this.snake = new Snake({ game: this, startingPosition });
	}

	go () {
		const self = this;
		setTimeout( () => {
			self.snake.addSegmentToSnake();
		}, 5000);
		this.engine.runRenderLoop( () => {
			this.scene.render();
		});
	}

	stop () {
		this.engine.stopRenderLoop();
	}
}