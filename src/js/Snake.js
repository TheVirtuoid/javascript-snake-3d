import {MeshBuilder, Ray, StandardMaterial, Texture, Vector3} from "@babylonjs/core";

export default class Snake {

	tail = [];
	tailNumber = 0;
	diameter = .25;
	radius;
	game;
	speed = 3;
	skin;					// snake skin found here: https://www.deviantart.com/mildak/art/snake-skin-68052393

	constructor(args) {
		const { name, game, diameter = null, speed = 3, startingSegments = 10 } = args;
		this.name = name;
		this.game = game;
		this.diameter = diameter || this.diameter;
		this.radius = this.diameter / 2;
		this.speed = speed || this.speed;
		this.tailNumber = 0;
		this.skin = new StandardMaterial(`${name}-skin`, this.game.scene);
		this.skin.diffuseTexture = new Texture("/img/snakeskin.jpg", this.game.scene);

		const cameraPosition = this.game.camera.position.clone();
		// build out the first part of the tail
		for(let i = 0; i < startingSegments; i++) {
			const segment = this.newSegment();
			const position = cameraPosition.clone();
			position.subtractInPlace(new Vector3(0, i * this.diameter, 0));
			segment.position = position;
			this.tail.push(segment);
		}
	}

	addTailSegment(grow = false) {
		const { camera, scene } = this.game;
		const segment = this.newSegment();
	 	const direction = camera.getDirection(Vector3.Backward()).divide(new Vector3(this.speed, this.speed, this.speed));
		segment.position = camera.position.clone();
		segment.position.addInPlace(direction);
		this.tail.unshift(segment);
		if (!grow) {
			const lostSegment = this.tail.pop();
			lostSegment.dispose();
		}
		return segment;
	}

	newSegment() {
		const segment = MeshBuilder.CreateSphere(`${this.name}-tail${this.tailNumber}`, { diameter: this.diameter }, this.game.scene);
		this.tailNumber++;
		segment.material = this.skin;
		return segment;
	}

	move() {
		// const hit = this.game.board.isHit() || this.isTailHit();
		// const hit = this.game.board.isHit() || this.hit();
		const hit = this.hit();
		if (!hit.other && !hit.marker) {
			this.game.camera.move();
			this.addTailSegment();
		}
		return hit;
	}

	hit() {
		let gotAHit = { marker: false, other: false };
		const origin = this.game.camera.getNextPosition();
		const direction = this.game.camera.getDirection(Vector3.Forward());
		const length = Math.sqrt((this.game.size * this.game.size) * 2);
		const ray = new Ray(origin, direction, length);
		const meshHit = this.game.scene.pickWithRay(ray);
		if (meshHit?.pickedMesh?.name) {
			const name = meshHit.pickedMesh.name;
			// document.getElementById('camera-direction').textContent = `Mesh hit: ${name}, distance: ${meshHit.distance - this.radius}`;
			if (!name.includes('board') && !name.includes('snake')) {
				console.log(name);
			}
			if (meshHit.distance - this.radius < this.diameter) {
				console.log(`****HIT: ${name}`);
				gotAHit = {marker: name === "marker", other: name !== "marker" };
			}
		}
		return gotAHit;
	}

	isReady () {
		return Promise.resolve(true);
	}

}
