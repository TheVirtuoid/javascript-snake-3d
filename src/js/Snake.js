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
		if (!hit) {
			this.game.camera.move();
			this.addTailSegment();
		}
		return hit;
	}

	hit() {
		let gotAHit = false;
		const origin = this.game.camera.getNextPosition();
		const direction = this.game.camera.getDirection(Vector3.Forward());
		const length = Math.sqrt((this.game.size * this.game.size) * 2);
		const ray = new Ray(origin, direction, length);
		const meshHit = this.game.scene.pickWithRay(ray);
		if (meshHit?.pickedMesh?.name) {
			document.getElementById('camera-direction').textContent = `Mesh hit: ${meshHit.pickedMesh.name}, distance: ${meshHit.distance - this.radius}`;
			if (meshHit.distance - this.radius < this.diameter) {
				console.log(`****HIT: ${meshHit.pickedMesh.name}`);
				gotAHit = true;
			}
		}
		return gotAHit;
	}

}

/*

import {MeshBuilder, Scalar, SolidParticleSystem, Vector3} from "@babylonjs/core";

export default class Snake {
	sps;
	game;
	diameter = .25;
	maxSegmentsToAdd = 1;
	mesh;
	hit = false;
	hits = new Map();

	constructor( args ) {
		const { game, startingPosition, startingSegments = 10 } = args;
		this.game = game;
		const scene = this.game.scene;
		this.sps = new SolidParticleSystem("sps", scene, { expandable: true, particleIntersection: true
		});
		const sphere = MeshBuilder.CreateSphere("sphere", {diameter: this.diameter}, scene);
		this.sps.addShape(sphere, 1);
		this.sps.particles[0].position = startingPosition.clone();
		this.reMesh();
		this.sphere = sphere;
		this.sphere.setEnabled(false);

		this.addSegmentToSnake( { numSegments: startingSegments - 1 });
		this.sps.isAlwaysVisible = true;
		this.sps.initParticles();
		this.sps.setParticles();
		this.sps.updateParticle = this.updateSegment.bind(this);
		scene.registerBeforeRender(this.registerBeforeRender.bind(this));
		this.hit = false;
	}

	registerBeforeRender() {
		this.sps.setParticles();
	}

	updateSegment(segment) {
		if (segment.intersectsMesh(this.game.camera.mesh)) {
			// console.log(segment.position, this.game.camera.mesh.position);
			this.hit = true;
		}
	}

	addSegmentToSnake ( args ) {
		const { numSegments = 1, position = null, direction = null } = args;
		let newPosition = position?.clone() || this.sps.particles[this.sps.nbParticles - 1].position.clone();
		let newDirection = direction?.clone() || new Vector3(0, this.diameter * -1, 0);
		const totalSegments = numSegments * this.maxSegmentsToAdd;
		this.sps.addShape(this.sphere, totalSegments);
		for(let i = this.sps.nbParticles - totalSegments; i < this.sps.nbParticles; i++) {
			newPosition.addInPlace(newDirection);
			this.sps.particles[i].position = newPosition;
			newPosition = newPosition.clone();
		}
		this.reMesh();
	}

	move (position, direction) {
		const newDirection = direction.negate();
		position.addInPlace(newDirection);
		this.addSegmentToSnake({ numSegments: 1, position, newDirection });
	}


	setParticles () {
		this.sps.setParticles();
	}

	reMesh () {
		this.mesh = this.sps.buildMesh();
		this.mesh.checkCollisions = true;
	}
}
*/
