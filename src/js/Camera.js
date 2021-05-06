import {UniversalCamera, Vector3} from "@babylonjs/core";

export default class Camera {
	gameCamera;
	scene;

	constructor( args ) {
		const { scene, canvasDom } = args;
		this.scene = scene;
		this.camera = new UniversalCamera("camera", new Vector3(0, 10, 0), this.scene);
		this.camera.attachControl(canvasDom, true);
		this.camera.setTarget(new Vector3(0, 10, 10));
	}
}