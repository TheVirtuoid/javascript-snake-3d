import {Color3, Mesh, MeshBuilder, StandardMaterial, Texture, Vector3} from "@babylonjs/core";

export default class Board {
	walls = [];
	board;
	size = 40;
	name;
	game;

	constructor(args) {
		const { name, game, size = 40 } = args;
		this.name = name;
		this.game = game;
		const scene = this.game.scene;
		const material = new StandardMaterial(`${name}Mat`, scene);
		material.emissiveTexture = new Texture("https://www.babylonjs-playground.com/textures/floor.png", scene);
		material.emissiveColor = new Color3(1, 0, 0);
		const wallSetup = [
			{ position: new Vector3(0, 0, 20), width: this.size, height: this.size },
			// { position: new Vector3(0, 0, 20), width: this.size, height: this.size },
/*
			{ position: new Vector3(0, 0, -20), width: this.size, height: this.size },
			{ position: new Vector3(-20, 0, 0), width: this.size, height: this.size },
			{ position: new Vector3(20, 0, 0), width: this.size, height: this.size },
			{ position: new Vector3(0, 20, 0), width: this.size, height: this.size },
			{ position: new Vector3(0, -20, 0), width: this.size, height: this.size }
*/
		]

		wallSetup.forEach( (params, index) => {
			const { position, width, height } = params;
			let wall = MeshBuilder.CreateTiledPlane(`${name}-${index}`, { width, height, sideOrientation: Mesh.DOUBLESIDE, pattern: Mesh.NO_FLIP, tileSize: 1, tileWidth: 1 }, scene);
			wall.material = material;
			// wall.position = position;
			console.log(wall);
			this.walls.push(wall);
		});
	}
}