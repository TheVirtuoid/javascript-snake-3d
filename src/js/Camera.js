import {MeshBuilder, UniversalCamera, Vector3} from "@babylonjs/core";

export default class Camera {
	gameCamera;
	scene;
	mesh;
	speed = 4;

	constructor( args ) {
		const { scene, canvasDom, position = new Vector3(0, 10, 0) } = args;
		this.scene = scene;
		this.gameCamera = new UniversalCamera("camera", position, this.scene);
		this.gameCamera.attachControl(canvasDom, true);
		this.gameCamera.setTarget(new Vector3(0, 10, 10));
		this.gameCamera.ellipsoid = new Vector3(1, 1, 1);
		this.mesh = MeshBuilder.CreateSphere('cameraDude', { diameter: .25 }, this.scene);
		this.mesh.position = new Vector3(0, 10, 0);
		this.mesh.isPickable = false;
	}

	setSpeed(newSpeed) {
		this.speed = newSpeed;
	}

	move() {
		const pos = this.gameCamera.position;
		let newDirection = this.gameCamera.getDirection(Vector3.Forward());
		newDirection.x /= this.speed;
		newDirection.y /= this.speed;
		newDirection.z /= this.speed;
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
		const position = this.position.clone();
		position.addInPlace(this.getDirection(Vector3.Forward()));
		return position;
	}

	initialize() {
		return Promise.resolve(true);
	}
}