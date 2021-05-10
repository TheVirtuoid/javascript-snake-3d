export default class Marker {
	name;
	game;

	constructor (args) {
		const { name, game } = args;
		this.name = name;
		this.game = game;
	}
}