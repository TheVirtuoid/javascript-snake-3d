import {MeshBuilder, Ray, Sound, StandardMaterial, Texture, Vector3} from "@babylonjs/core";

export default class Snake {

	tail = [];
	tailNumber = 0;
	diameter = .25;
	radius;
	game;
	speed = 3;
	skin;					// snake skin found here: https://www.deviantart.com/mildak/art/snake-skin-68052393
	crunch;
	zap;
	tailCrash;
	startingSegments;
	growthCounter = 0;
	soundMatrix = new Map();

	constructor(args) {
		const { name, game, diameter = null, speed = 3, startingSegments = 10 } = args;
		this.name = name;
		this.game = game;
		this.diameter = diameter || this.diameter;
		this.radius = this.diameter / 2;
		this.speed = speed || this.speed;
		this.tailNumber = 0;
		this.startingSegments = startingSegments;
		this.skin = new StandardMaterial(`${name}-skin`, this.game.scene);
		this.skin.diffuseTexture = new Texture("/img/snakeskin.jpg", this.game.scene);
/*
		this.crunch = new Sound("eat-apple", "/sounds/eat-apple.mp3", this.game.scene);
		this.zap = new Sound("electric-zap", "/sounds/zap.mp3", this.game.scene);
		this.tailCrash = new Sound("electric-zap", "/sounds/tail-crash.mp3", this.game.scene);
		this.soundMatrix.set('boa', this.zap);
		this.soundMatrix.set('mar', this.crunch);
		this.soundMatrix.set('sna', this.tailCrash);
*/

	}

	addTailSegment(grow = false) {
		const { camera, scene } = this.game;
		const segment = this.newSegment();
	 	const direction = camera.getDirection(Vector3.Backward()).divide(new Vector3(this.speed, this.speed, this.speed));
		segment.position = camera.position.clone();
		segment.position.addInPlace(direction);
		this.tail.unshift(segment);
		if (!grow) {
			if (this.growthCounter === 0) {
				const lostSegment = this.tail.pop();
				lostSegment.dispose();
			} else {
				this.growthCounter --;
			}
		} else {
			this.growthCounter += this.game.segmentsPerMarker;
		}
		return segment;
	}

	newSegment() {
		const segment = MeshBuilder.CreateSphere(`${this.name}-tail${this.tailNumber}`, { diameter: this.diameter }, this.game.scene);
		this.tailNumber++;
		segment.material = this.skin;
		return segment;
	}

	move(grow = false) {
		const hit = this.hit();
		if (!hit.other && !hit.marker) {
			this.game.camera.move();
			this.addTailSegment(grow);
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
			if (meshHit.distance - this.radius < this.diameter) {
				gotAHit = {marker: name === "marker", other: name !== "marker" ? name : false };
			}
		}
		return gotAHit;
	}

	initialize(args = {}) {
		const { startingSegments } = args;
		if (startingSegments) {
			this.startingSegments = startingSegments;
		}
		this.tail.forEach( segment => {
			this.game.scene.removeMesh(segment);
			segment.dispose();
		});
		this.tail = [];
		this.tailNumber = 0;
		const cameraPosition = this.game.camera.position.clone();
		for(let i = 0; i < this.startingSegments; i++) {
			const segment = this.newSegment();
			// const position = cameraPosition.clone();
			// position.subtractInPlace(new Vector3(0, i * this.diameter, 0));
			segment.position = cameraPosition.clone();
			this.tail.push(segment);
		}
		return Promise.resolve(true);
	}

}
