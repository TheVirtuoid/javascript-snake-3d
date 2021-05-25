import {MeshBuilder, UniversalCamera, Vector3} from "@babylonjs/core";

export default class Camera {
	gameCamera;
	game;
	mesh;

	constructor( args ) {
		const { game, canvasDom, speed = 4, position = new Vector3(0, 10, 0) } = args;
		this.game = game;
		this.gameCamera = new UniversalCamera("camera", position, this.game.scene);
		this.gameCamera.attachControl(canvasDom, true);
		// this.gameCamera.ellipsoid = new Vector3(1, 1, 1);
		this.mesh = MeshBuilder.CreateSphere('cameraDude', { diameter: this.game.diameter }, this.game.scene);
		this.mesh.isPickable = false;
	}


	move() {
		const speed = this.game.speed;
		const pos = this.gameCamera.position;
		const newDirection = this.gameCamera.getDirection(Vector3.Forward()).divide(new Vector3(speed, speed, speed));
		pos.addInPlace(newDirection);
		this.mesh.position = pos.clone();
	}

	get position () {
		return this.gameCamera.position;
	}

	set position (position) {
		this.gameCamera.position = position;
	}

	getDirection (arg) {
		return this.gameCamera.getDirection(arg);
	}

	getNextPosition () {
		const speed = this.game.speed;
		const position = this.position.clone();
		position.addInPlace(this.getDirection(Vector3.Forward()).divide(new Vector3(speed, speed, speed)));
		return position;
	}

	initialize() {
		this.gameCamera.setTarget(new Vector3(0, 10, 10));
		this.mesh.position = new Vector3(0, 10, 0);
		return Promise.resolve(true);
	}
}