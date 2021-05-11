import {MeshBuilder, SceneLoader, StandardMaterial, Texture, Vector3} from "@babylonjs/core";
import "@babylonjs/loaders";

export default class Marker {
	name;
	game;
	lowMark;
	highMark;
	range;
	mesh;
	ready;

	constructor (args) {
		const { name, game } = args;
		this.name = name;
		this.game = game;
		this.ready = false;
		this.lowMark = 0 - this.game.size / 2 + this.game.diameter * 2;
		this.highMark = this.game.size / 2 - this.game.diameter * 2;
		this.range = Math.abs(this.lowMark) + this.highMark;
		this.skin = new StandardMaterial(`${name}-skin`, this.game.scene);
		this.skin.diffuseTexture = new Texture("/img/apple1.jpg", this.game.scene);
		SceneLoader.ImportMesh('SMK_JJ0KQAO2_Watermelon', '/img/watermelon.glb', '', this.game.scene,
			(meshes, particleSystems, skeletons, animationGroups, transformNodes, geometries,  lights) => {
			// console.log(meshes, particleSystems, skeletons, animationGroups, transformNodes, geometries, lights);
			this.mesh = meshes[1];
			this.mesh.material = this.skin;
			this.ready = true;
		});
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