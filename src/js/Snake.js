import {MeshBuilder, Scalar, SolidParticleSystem, Vector3} from "@babylonjs/core";

export default class Snake {
	sps;
	game;
	diameter = .25;
	maxSegmentsToAdd = 1;
	mesh;
	hit = false;

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