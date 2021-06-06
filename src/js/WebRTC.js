import adapter from 'webrtc-adapter';

export default class WebRTC {

	connected = false;
	game;
	peer;
	id;

	constructor (args) {
		const { game } = args;
		this.game = game;
		this.connected = false;
	}

	initialize() {
		return Promise.resolve(true);
	}

	connect () {
		const self = this;
		return new Promise( (resolve, reject ) => {
			this.connected = true;
			resolve(true);
		});
	}

	disconnect () {
		return new Promise( (resolve, reject ) => {
			this.connected = false;
			resolve(true);
		});
	}
}