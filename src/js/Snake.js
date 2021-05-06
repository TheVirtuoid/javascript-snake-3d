import {MeshBuilder, Scalar, SolidParticleSystem, Vector3} from "@babylonjs/core";

export default class Snake {
	sps;
	game;
	diameter = .25;
	maxSegmentsToAdd = 1;

	constructor( args ) {
		const { game, startingPosition } = args;
		this.game = game;
		const scene = this.game.scene;
		this.sps = new SolidParticleSystem("sps", scene, { expandable: true });
		const sphere = MeshBuilder.CreateSphere("sphere", {diameter: this.diameter}, scene);
		this.sps.addShape(sphere, 1);
		this.sps.particles[0].position = startingPosition.clone();
		this.sps.buildMesh();
		this.sphere = sphere;
		this.sphere.setEnabled(false);

		this.addSegmentToSnake(10);
		this.sps.isAlwaysVisible = true;
		this.sps.initParticles();
		this.sps.setParticles();
		scene.registerBeforeRender(this.registerBeforeRender.bind(this));
	}

	registerBeforeRender() {
		this.sps.setParticles();
	}

	addSegmentToSnake (numSegments = 1) {
		let position = this.sps.particles[this.sps.nbParticles - 1].position.clone();
		const totalSegments = numSegments * this.maxSegmentsToAdd;
		this.sps.addShape(this.sphere, totalSegments);
		for(let i = this.sps.nbParticles - totalSegments; i < this.sps.nbParticles; i++) {
			position.y -= this.diameter;
			this.sps.particles[i].position = position;
			position = position.clone();
		}
		this.sps.buildMesh();
	}


	setParticles () {
		this.sps.setParticles();
	}
}