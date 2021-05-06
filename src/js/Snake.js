import {MeshBuilder, Scalar, SolidParticleSystem, Vector3} from "@babylonjs/core";

export default class Snake {
	sps;
	game;
	mesh;
	diameter = 1;
	segments = 1;

	constructor( args ) {
		const { game, startingPosition } = args;
		this.game = game;
		const scene = this.game.scene;
		this.sps = new SolidParticleSystem("sps", scene, { expandable: true });
		const sphere = MeshBuilder.CreateSphere("sphere", {diameter: this.diameter}, scene);
		this.sps.addShape(sphere, 1);
		this.sps.particles[0].position = startingPosition.clone();
		console.log('start');
		console.log(startingPosition);
		console.log(this.sps.particles[0].position);
		console.log('----end');
		this.sps.buildMesh();
		console.log(this.sps.particles[0].position);
		console.log('----after first buildMesh');
		this.sphere = sphere;
		this.sphere.setEnabled(false);

		this.addSegmentToSnake();

/*
		const newPosition = startingPosition.clone();
		newPosition.z -= this.diameter;
		newSegment.position = newPosition;
*/

		// this.mesh = this.sps.buildMesh();
		this.sps.isAlwaysVisible = true;
		this.sps.initParticles();
		this.sps.setParticles();
		scene.registerBeforeRender(this.registerBeforeRender.bind(this));
	}

	registerBeforeRender() {
		this.sps.setParticles();
	}

	addSegmentToSnake (rebuild = true) {
		const position = this.sps.particles[this.sps.nbParticles - 1].position.clone();
		const segment = this.addSegment();
		console.log('clone');
		console.log(position);
		position.y -= this.diameter;
		segment.position = position;
		console.log('segment');
		console.log(segment.position);
		// console.log(this.sps.particles[0].position);
		// console.log(this.sps.particles[1].position);
		if (rebuild) {
			// console.log(this.sps.particles[0].position);
			// console.log(this.sps.particles[1].position);
			// console.log(this.sps.particles[2].position);
			this.sps.buildMesh();
		}
	}

	addSegment () {
		this.sps.addShape(this.sphere, 1);
		return this.sps.particles[this.sps.nbParticles - 1];
	}

	setParticles () {
		this.sps.setParticles();
	}
}