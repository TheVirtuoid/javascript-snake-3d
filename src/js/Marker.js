import {MeshBuilder, StandardMaterial, Texture, Vector3} from "@babylonjs/core";

export default class Marker {
	name;
	game;
	lowMark;
	highMark;
	range;
	mesh;

	constructor (args) {
		const { name, game } = args;
		this.name = name;
		this.game = game;
		this.lowMark = 0 - this.game.size / 2 + this.game.diameter * 2;
		this.highMark = this.game.size / 2 - this.game.diameter * 2;
		this.range = Math.abs(this.lowMark) + this.highMark;
		this.mesh = MeshBuilder.CreateSphere(`${this.name}`, { diameter: this.game.diameter * 2 }, this.game.scene);
		this.skin = new StandardMaterial(`${name}-skin`, this.game.scene);
		this.skin.diffuseTexture = new Texture("/img/apple1.jpg", this.game.scene);
		this.mesh.material = this.skin;
	}

	setPosition() {
		let hit = true;
		while (hit) {
			const x = Math.random() * this.range + this.lowMark;
			const y = Math.random() * this.range + this.lowMark;
			const z = Math.random() * this.range + this.lowMark;
			this.mesh.position = new Vector3(x, y, z);
			hit = false;
		}
	}

}