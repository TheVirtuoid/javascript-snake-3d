import {MeshBuilder, SceneLoader, StandardMaterial, Texture, Vector3} from "@babylonjs/core";
import "@babylonjs/loaders";

export default class Marker {
	name;
	game;
	lowMark;
	highMark;
	range;
	mesh;
	hasInitialized;

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
		this.hasInitialized = false;
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

	// (meshes, particleSystems, skeletons, animationGroups, transformNodes, geometries,  lights) => {
	initialize () {
		const self = this;
		return new Promise( (resolve, reject) => {
			if (self.hasInitialized) {
				resolve(true)
			} else {
				self.hasInitialized = true;
				SceneLoader.ImportMesh('SMK_JJ0KQAO2_Watermelon', '/img/watermelon.glb', '', self.game.scene, (meshes) => {
					self.mesh = meshes[1];
					self.mesh.material = self.skin;
					self.mesh.name = self.name;
					self.mesh.scaling = new Vector3(4, 4, 4);
					resolve(true);
				});
			}
		});

	}

}