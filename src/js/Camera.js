import {MeshBuilder, UniversalCamera, Vector3} from "@babylonjs/core";

export default class Camera {
	gameCamera;
	scene;
	mesh;
	speed = 4;

	constructor( args ) {
		const { scene, canvasDom } = args;
		this.scene = scene;
		this.gameCamera = new UniversalCamera("camera", new Vector3(0, 10, 0), this.scene);
		this.gameCamera.attachControl(canvasDom, true);
		this.gameCamera.setTarget(new Vector3(0, 10, 10));
		this.gameCamera.ellipsoid = new Vector3(1, 1, 1);
		// this.gameCamera.checkCollisions = true;
		this.mesh = MeshBuilder.CreateSphere('cameraDude', { diameter: .25 }, this.scene);
		this.mesh.position = new Vector3(0, 10, 0);
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
}