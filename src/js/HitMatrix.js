export default class HitMatrix {
	matrix;
	diameter;
	radiusRange;

	constructor (args) {
		const { diameter } = args;
		this.diameter = diameter;
		this.matrix = new Map();
		this.radiusRange = this.diameter * 100 / 2;
	}

	getRange(position) {
		let { x, y, z } = position;
		x = Math.floor(x * 100);
		y = Math.floor(y * 100);
		z = Math.floor(z * 100);
		return { x, y, z,
			xLow: x - this.radiusRange, xHigh: x + this.radiusRange,
			yLow: y - this.radiusRange, yHigh: y + this.radiusRange,
			zLow: z - this.radiusRange, zHigh: z + this.radiusRange
		};
	}

	add(mesh) {
		const range = this.getRange(mesh.position);
		const { x, y, z } = range;
		let xMatrix = this.matrix.get(x);
		if (!xMatrix) {
			xMatrix = new Map();
			this.matrix.set(x, xMatrix);
		}
		let yMatrix = xMatrix.get(y);
		if (!yMatrix) {
			yMatrix = new Map();
			xMatrix.set(y, yMatrix);
		}
		let zMatrix = yMatrix.get(z);
		if (!zMatrix) {
			zMatrix = new Map();
			yMatrix.set(z, zMatrix);
		}
		zMatrix.set(mesh.name, range);
	}

	remove(mesh) {
		const { x, y, z } = this.getRange(mesh.position);
		this.matrix.get(x).get(y).get(z).remove(mesh.name);
	}
}