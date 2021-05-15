import {Sound} from "@babylonjs/core";


export default class GameSound {
	soundMatrix = new Map();
	game;

	constructor (args) {
		const { game } = args;
		this.game = game;
		this.soundMatrix.set('board', new Sound("electric-zap", "/sounds/zap.mp3", this.game.scene));
		this.soundMatrix.set('marker', new Sound("eat-apple", "/sounds/eat-apple.mp3", this.game.scene));
		this.soundMatrix.set('snake', new Sound("electric-zap", "/sounds/tail-crash.mp3", this.game.scene));
	}

	play(target) {
		const key = target.split('-')[0];
		const soundToPlay = this.soundMatrix.get(key);
		if (soundToPlay && this.game.soundOnOff) {
			soundToPlay.play();
		}
	}
}