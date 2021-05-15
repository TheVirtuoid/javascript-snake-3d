export default class Configuration {
	screen;
	closeButton;
	game;
	items;
	changeBinding;
	setConfiguration;

	constructor (args) {
		const { game, launcher } = args;
		this.game = game;
		this.screen = document.getElementById('configuration');
		this.closeButton = document.getElementById('close');
		this.setConfiguration = launcher;
		this.setConfiguration.addEventListener('click', this.open.bind(this));
		this.items = {};
		this.changeBinding = this.changeValue.bind(this);
	}

	open () {
		this.game.startButton.setAttribute('disabled', '');
		this.setConfiguration.setAttribute('disabled', '');
		this.closeButton.addEventListener('click', this.close.bind(this), { once: true });
		this.screen.addEventListener('change', this.changeBinding);
		this.screen.classList.add('show');
	}

	close () {
		this.game.startButton.removeAttribute('disabled');
		this.setConfiguration.removeAttribute('disabled');
		this.screen.classList.remove('show');
		this.screen.removeEventListener('change', this.changeBinding);
		this.game.screens.dispatchEvent(new CustomEvent('snake-reinitialize', {detail: null}));
	}

	changeValue(event) {
		console.log(event);
		const element = event.target;
		const item = element.id.substring(7);
		let value;
		if (element.type === "checkbox") {
			if (element.hasAttribute('checked')) {
				value = false;
				element.removeAttribute('checked');
			} else {
				value = true;
				element.setAttribute('checked', '');
			}
		} else {
			value = parseInt(element.value, 10);
		}
		const setter = {};
		setter[item] = value;
		this.set(setter);
	}

	get () {
		return this.items;
	}

	set (items) {
		for(const item in items) {
			this.items[item] = items[item];
		}
		localStorage.setItem('javascript-snake-3d', JSON.stringify(this.items));
	}

	initialize (data) {
		const configuration = localStorage.getItem('javascript-snake-3d');
		if (configuration) {
			this.items = JSON.parse(configuration);
		} else {
			this.set(data);
			localStorage.setItem('javascript-snake-3d', JSON.stringify(this.items));
		}
		this.setInForm();
		return this.get();
	}

	setInForm () {
		for(const item in this.items) {
			const input = document.getElementById(`config-${item}`);
			if (input) {
				if (typeof(this.items[item]) === "boolean") {
					if (this.items[item]) {
						input.setAttribute('checked', '');
					} else {
						input.removeAttribute('checked');
					}
				} else {
					input.value = this.items[item];
				}
			}
		}
	}
}