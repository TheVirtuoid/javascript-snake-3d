import {
	Color3,
	Engine,
	HemisphericLight, Mesh, MeshBuilder,
	Scene, StandardMaterial, Texture,
	Vector3
} from "@babylonjs/core";
import Snake from "./Snake";
import Camera from "./Camera";
import Board from "./Board";
import Light from "./Light";
import Marker from "./Marker";
import Configuration from "./Configuration";
import GameSound from "./GameSound";

export default class Game {
	scene;					// BabylonJS scene
	engine;					// BabylonJS engine
	camera;					// Camera class instance
	light;					// Light class instance
	snake;					// Snake class instance
	board;					// Board class instance
	gameSound;			// GameSound class instance
	marker;					// Marker class instance
	configuration;	// Configuration class instance

	canvas;					// instance of canvas (from start())


	snakeSpeed = 2;									// initial speed of the snake
	diameter = .5;									// diameter of a snake segment
	size = 40;											// size of board

	screens;												// pointer to DOM node for screens Id
	startButton;										// button to start the game
	configurationButton;						// button to launch configuration window

	startingSegments = 20;					// starting number of segments at beginning of game
	segmentsPerMarker = 20;					// segments to add when marker is hit
	increasingSpeed = false;				// increase speed as time goes on
	soundOnOff = true;							// turn sound on or off

	// finish up
	fps;														// pointer to FPS dom,
	score;													// The score of the game
	frameRate = 3;									// number of frames between renderings
	growNextSegment = false;				// flag for determining if the snake is to grow
	runningFrameRate = 0;						// countdown variable for framerate


	constructor (canvasDom) {
		// BabylonJS initialization
		this.canvas = canvasDom;
		this.engine = new Engine(canvasDom);
		this.scene = new Scene(this.engine);
		this.scene.clearColor = Color3.Black();

		// internal data
		this.startButton = document.getElementById('start');
		this.screens = document.getElementById('screens');


		// set the configuration
		this.configurationButton = document.getElementById('set-configuration');
		this.configuration = new Configuration({ game: this, launcher: this.configurationButton });
		const { startingSegments, segmentsPerMarker, increasingSpeed, soundOnOff } = this.configuration.initialize({
			startingSegments: this.startingSegments,
			segmentsPerMarker: this.segmentsPerMarker,
			increasingSpeed: this.increasingSpeed,
			soundOnOff: this.soundOnOff });
		this.startingSegments = startingSegments;
		this.segmentsPerMarker = segmentsPerMarker;
		this.increasingSpeed = increasingSpeed;
		this.soundOnOff = soundOnOff;
		this.screens.addEventListener('snake-reinitialize', this.changeConfiguration.bind(this));



		// setup camera
		this.camera = new Camera( { game: this, canvasDom });

		// setup the light
		this.light = new Light( {name: "light", game: this });

		// setup the snake
		const startingPosition = new Vector3(0, 10, 10);
		this.snake = new Snake({ game: this, name: 'snake', speed: this.snakeSpeed,
			startingPosition, startingSegments: this.startingSegments, diameter: this.diameter });

		// setup the board
		this.board = new Board({ name: "board", game: this, size: this.size });

		// setup the gameSound
		this.gameSound = new GameSound({ game: this });

		// setup the marker
		this.marker = new Marker({ name: "marker", game: this });

		// finish up
		this.fps = document.getElementById('fps');
		this.scene.registerBeforeRender(this.gameRunner.bind(this));

	}

	start() {
		const initializers = [];
		initializers.push(this.camera.initialize());
		initializers.push(this.light.initialize());
		initializers.push(this.snake.initialize());
		initializers.push(this.board.initialize());
		initializers.push(this.marker.initialize());
		initializers.push(this.gameSound.initialize());
		Promise.all(initializers)
				.then(this.initialize.bind(this));
	}

	initialize() {
		this.runningFrameRate = this.frameRate;
		this.growNextSegment = false;
		this.score = 0;
		this.startButton.removeAttribute('disabled');
		this.startButton.textContent = "Start"
		this.startButton.addEventListener('click', this.go.bind(this), { once: true });
		this.scene.render();
	}

	changeConfiguration(event) {
		const { startingSegments, segmentsPerMarker, increasingSpeed, soundOnOff } = this.configuration.get();
		if (this.startingSegments !== startingSegments) {
			this.snake.initialize( { startingSegments });
		}
		this.startingSegments = startingSegments;
		this.segmentsPerMarker = segmentsPerMarker;
		this.increasingSpeed = increasingSpeed;
		this.soundOnOff = soundOnOff;
	}

	go () {
		this.startButton.setAttribute('disabled', '');
		this.configurationButton.setAttribute('disabled', '');
		this.startButton.classList.add('hide');
		this.startButton.textContent = "Please Wait";
		this.marker.setPosition();
		this.canvas.requestPointerLock();
		Engine.audioEngine.unlock();
		this.engine.runRenderLoop( () => {
			this.scene.render();
		});
	}

	stop () {
		this.engine.stopRenderLoop();
		document.exitPointerLock();
		this.startButton.textContent = "Play Again";
		this.startButton.addEventListener('click', this.start.bind(this), { once: true });
		this.startButton.removeAttribute('disabled');
		this.configurationButton.removeAttribute('disabled');
		this.startButton.classList.remove('hide');
	}

	gameRunner () {
		this.runningFrameRate--;
		if (this.runningFrameRate === 0) {
			this.runningFrameRate = this.frameRate;
			this.growNextSegment = false;
			const gotAHit = this.snake.move(this.growNextSegment);
			if (gotAHit.other) {
				this.gameSound.play(gotAHit.other);
				this.stop();
			} else if (gotAHit.marker) {
				this.marker.setPosition();
				this.score++;
				this.gameSound.play("marker");
				this.growNextSegment = true;
				document.getElementById('score').textContent = this.score.toString();
			}
			this.fps.textContent = this.engine.getFps().toFixed();
		}
	}

}