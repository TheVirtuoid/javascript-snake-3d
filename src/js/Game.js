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

export default class Game {
	scene;
	engine;
	camera;
	light;
	snake;
	board;
	canvas;
	frameRate = 2;
	stopGame = false;
	runningFrameRate = 0;
	speed = 1;
	diameter = .5;
	size = 40;
	fps;
	marker;
	score;
	gotAHit;
	ready;
	startButton;
	startingSegments = 200;
	segmentsToGrow = 10;
	growNextSegment = false;

	constructor (canvasDom) {
		this.canvas = canvasDom;
		this.engine = new Engine(canvasDom);
		this.scene = new Scene(this.engine);
		this.scene.clearColor = Color3.Black();
		const startingPosition = new Vector3(0, 10, 10);
		this.camera = new Camera( { scene: this.scene, canvasDom });
		this.light = new Light( {name: "light", game: this });
		this.snake = new Snake({ game: this, name: 'snake', speed: this.speed, startingPosition, startingSegments: this.startingSegments, diameter: this.diameter });
		this.board = new Board({ name: "board", game: this, size: this.size });
		this.fps = document.getElementById('fps');
		this.marker = new Marker({ name: "marker", game: this });
		this.score = 0;
		this.ready = false;
		this.startButton = document.getElementById('start');
		this.scene.registerBeforeRender(this.gameRunner.bind(this));
	}

	start() {
		const initializers = [];
		initializers.push(this.camera.initialize());
		initializers.push(this.light.initialize());
		initializers.push(this.snake.initialize());
		initializers.push(this.board.initialize());
		initializers.push(this.marker.initialize());
		Promise.all(initializers)
				.then(this.initialize.bind(this));
	}

	initialize() {
		this.ready = true;
		this.runningFrameRate = this.frameRate;
		this.stopGame = false;
		this.growNextSegment = false;
		this.score = 0;
		this.startButton.removeAttribute('disabled');
		this.startButton.textContent = "Start"
		this.startButton.addEventListener('click', this.go.bind(this), { once: true });
		this.scene.render();
	}

	go () {
		console.log('------------------------GO!!!!!!!!!!!');
		this.startButton.setAttribute('disabled', '');
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
		document.exitPointerLock();
		this.startButton.textContent = "Play Again";
		this.startButton.addEventListener('click', this.start.bind(this), { once: true });
		this.startButton.removeAttribute('disabled');
		this.startButton.classList.remove('hide');
	}

	gameRunner () {
		if (this.stopGame) {
			console.log('-------------stoppping');
			const sound = this.snake.soundMatrix.get(this.stopGame);
			if (sound) {
				console.log(`playing ${this.stopGame}`);
				sound.play();
			}
			this.engine.stopRenderLoop();
			this.stop();
			return;
		}
		this.runningFrameRate--;
		if (this.runningFrameRate === 0) {
			this.runningFrameRate = this.frameRate;
			this.gotAHit = this.snake.move(this.growNextSegment);
			this.growNextSegment = false;
			this.stopGame = this.gotAHit.other;
			if (this.gotAHit.marker) {
				this.marker.setPosition();
				this.score++;
				this.snake.crunch.play();
				this.growNextSegment = true;
				document.getElementById('score').textContent = this.score.toString();
			}
			this.fps.textContent = this.engine.getFps().toFixed();
		}
	}

}