import {MeshBuilder, Vector3} from "@babylonjs/core";

export default class Snake {

	tail = [];
	hits = new Map();
	head;
	diameter = .25;
	game;
	speed = 3;
	hit = false;

	constructor(args) {
		const { name, game, diameter = null, speed = 3, startingSegments = 10 } = args;
		this.name = name;
		this.game = game;
		this.diameter = diameter || this.diameter;
		this.speed = speed || this.speed;
		this.head = new MeshBuilder.CreateSphere(`${name}-head`, { diameter: this.diameter }, this.game.scene);
		this.head.position = this.game.camera.position.clone();
		// build out the first part of the tail
		for(let i = 0; i < startingSegments; i++) {
			const segment = this.newSegment();
			const position = this.head.position.clone();
			position.subtractInPlace(new Vector3(0, i * this.diameter, 0));
			segment.position = position;
			this.tail.push(segment);
		}
	}

	addTailSegment() {
		const { camera, scene } = this.game;
		const segment = MeshBuilder.CreateSphere(`${name}-tail${this.tail.length}`, { diameter: this.diameter }, scene);
	 	const direction = camera.getDirection(Vector3.Backward()).divide(new Vector3(this.speed, this.speed, this.speed));
		segment.position = camera.position.clone();
		segment.position.addInPlace(direction);
		this.tail.unshift(segment);
		const { x, y, z } = this.getRange(segment.position);
		this.hits.set(x, new Map());
		this.hits.get(x).set(y, new Map());
		this.hits.get(x).get(y).set(z, segment.name);
		return segment;
	}

	newSegment() {
		return MeshBuilder.CreateSphere(`${this.name}-tail${this.tail.length}`, { diameter: this.diameter }, this.game.scene);
	}

	move() {

	}

	getRange(position) {
		let { x, y, z } = position;
		x = Math.floor(x * 100);
		y = Math.floor(y * 100);
		z = Math.floor(z * 100);
		const radius = this.diameter * 100 / 2;
		return { x, y, z,
			xLow: x - radius, xHigh: x + radius,
			yLow: y - radius, yHigh: y + radius,
			zLow: z - radius, zHigh: z + radius
		};
	}

	isTailHit() {
		const direction = this.game.camera.getDirection(Vector3.Forward()).clone();
		const positionToCheck = this.game.camera.position.clone().addInPlace(direction);
		const { x, y, xLow, xHigh, yLow, yHigh, zLow, zHigh } = this.getRange(positionToCheck);
		let hit = false;
		let xNum = xLow;
		while (!hit && xNum <= xHigh) {
			const xHit = this.hits.get(xNum);
			if (xHit) {
				let yNum = yLow;
				while (!hit && yNum <= yHigh) {
					const yHit = xHit.get(yNum);
					if (yHit) {
						let zNum = zLow;
						while (!hit && zNum <= zHigh) {
							const zHit = yHit.get(zNum);
							hit = !!zHit;
							zNum++;
						}
					}
					yNum++;
				}
			}
			xNum++;
		}
		return hit;
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
