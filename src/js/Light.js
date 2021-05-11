import {Color3, HemisphericLight, PointLight, Vector3} from "@babylonjs/core";

export default class Light {
	name;
	game;
	gameLight;

	constructor (args) {
		const { name, game } = args;
		this.name = name;
		this.game = game;
		const light = new HemisphericLight(name, new Vector3(19,19,19), this.game.scene);
		light.groundColor = new Color3(.3, .3, .3);
		light.diffuse = new Color3(.8, .8, .8);
		light.specular = new Color3(.3, .3, .3);
		this.gameLight = light;
	}

	excludeMesh(mesh) {
		this.gameLight.excludedMeshes.push(mesh);
	}

	isReady() {
		return Promise.resolve(true);
	}
}