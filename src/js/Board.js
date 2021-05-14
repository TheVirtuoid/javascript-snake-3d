import {Color3, Color4, Mesh, MeshBuilder, StandardMaterial, Texture, Vector3} from "@babylonjs/core";

export default class Board {
	walls = [];
	board;
	size = 40;
	name;
	game;
	radius;
	halfSize;
	hitLowerLimit;
	hitUpperLimit;

	constructor(args) {
		const { name, game, size = 40 } = args;
		this.name = name;
		this.game = game;
		this.size = size;
		this.radius = this.game.diameter / 2;
		const scene = this.game.scene;
		const material = new StandardMaterial(`${name}Mat`, scene);
		material.emissiveTexture = new Texture("/img/fence-1.jpg", scene);
		material.emissiveColor = new Color3(.1, .1, .1);
		this.halfSize = this.size / 2;
		this.hitLowerLimit = -this.halfSize + this.radius;
		this.hitUpperLimit = this.halfSize - this.radius;
		const wallSetup = [
			{ position: new Vector3(0, 0, this.halfSize), size: this.size, offset: new Vector3(0, 0, .05) },
			{ position: new Vector3(this.halfSize, 0, 0), size: this.size, rotation: new Vector3(0, 1, 0), rotationAmount: Math.PI / 2, offset: new Vector3(.1, 0, 0) },
			{ position: new Vector3(0, 0, -this.halfSize), size: this.size, offset: new Vector3(-.05, 0, 0) },
			{ position: new Vector3(-this.halfSize, 0, 0), size: this.size, rotation: new Vector3(0, 1, 0), rotationAmount: Math.PI / 2, offset: new Vector3(-.1, 0, 0) },

			{ position: new Vector3(0, this.halfSize, 0), size: this.size, offset: new Vector3(0, .1, 0),  rotation: new Vector3(1, 0, 0), rotationAmount: -Math.PI / 2 },
			{ position: new Vector3(0, -this.halfSize, 0), size: this.size, offset: new Vector3(0, -.1, 0),  rotation: new Vector3(1, 0, 0), rotationAmount: -Math.PI / 2 },
		]

		wallSetup.forEach( (params, index) => {
			const { position, size, rotation, rotationAmount, offset } = params;
			let wall = MeshBuilder.CreateTiledPlane(`${name}-${index}`, { size, sideOrientation: Mesh.DOUBLESIDE, pattern: Mesh.NO_FLIP, tileSize: 4 }, scene);
			wall.material = material;
			wall.position = position;
			wall.position.addInPlace(offset);
			wall.enableEdgesRendering();
			wall.edgesWidth = 16;
			wall.edgesColor = new Color4(0, 1, 0, 1);
			if (rotation) {
				wall.rotate(rotation, rotationAmount);
			}
			this.walls.push(wall);
			this.game.light.excludeMesh(wall);
		});
	}

	initialize() {
		return Promise.resolve(true);
	}

}