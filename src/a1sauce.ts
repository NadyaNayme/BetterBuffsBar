// TODO: Figure out why I can't just import { default as config } from './appconfig.json';
let config = {
	appName: 'betterBuffBar',
};

export function createHeading(size: string, content: string) {
	let header = <HTMLElement>document.createElement(size);
	header.innerHTML = content;
	return header;
}

export function createText(content: string) {
	let text = <HTMLElement>document.createElement('p');
	text.innerHTML = content;
	return text;
}

export function createSmallText(content: string) {
	let text = <HTMLElement>document.createElement('small');
	text.innerHTML = content;
	return text;
}

export function createSeperator() {
	return <HTMLElement>document.createElement('hr');
}

export function createButton(content: string, fn: Function) {
	let button = <HTMLButtonElement>document.createElement('button');
	button.innerHTML = content;
	button.addEventListener('click', () => {
		fn();
	});
	return button;
}

export function createDropdownSetting(
	name: string,
	description,
	defaultValue: any,
	options: DropdownOption[]
) {
	let select = createDropdown(name, defaultValue, options);
	let label = createLabel(name, description);
	let container = createFlexContainer();
	container.appendChild(select);
	container.appendChild(label);
	return container;
}

export function createTextSetting(
	name: string,
	description: string,
	defaultValue: any
) {
	let input = createInput('text', name, defaultValue);
	let label = createLabel(name, description);
	label.setAttribute('for', name);
	let container = createFlexContainer();
	container.appendChild(input);
	container.appendChild(label);
	return container;
}

export function createCheckboxSetting(
	name: string,
	description: string,
	defaultValue: any
) {
	let input = createCheckboxInput(name, defaultValue);
	let label = createLabel(name, description);
	let container = createFlexContainer();
	container.appendChild(input);
	container.appendChild(label);
	return container;
}

export function createNumberSetting(
	name: string,
	description: string,
	options: {
		defaultValue?: number;
		min?: number;
		max?: number;
	} = {}
) {
	let {
		defaultValue = options.defaultValue || 10,
		min = options.min || 1,
		max = options.max || 20,
	} = options;
	let input = createInput('number', name, defaultValue);
	input.setAttribute('min', min.toString());
	input.setAttribute('max', max.toString());
	let label = createLabel(name, description);
	let container = createFlexContainer();
	container.appendChild(input);
	container.appendChild(label);
	return container;
}

export function createRangeSetting(
	name: string,
	description: string,
	options: {
		defaultValue?: number;
		min?: number;
		max?: number;
		unit?: string;
	} = {}
) {
	let {
		defaultValue = options.defaultValue || 100,
		min = options.min || 0,
		max = options.max || 100,
		unit = options.unit || '%',
	} = options;
	let input = createInput('range', name, defaultValue);
	input.setAttribute('min', min.toString());
	input.setAttribute('max', max.toString());
	let label = createLabel(name, description);
	label.classList.add('full');
	let output = createOutput();
	output.setAttribute('id', `${name}Output`);
	output.setAttribute('for', name);
	output.innerHTML = input.value + unit;
	output.after(unit);
	let container = createFlexContainer();
	container.classList.add('flex-wrap');
	container.appendChild(label);
	container.appendChild(input);
	container.appendChild(output);
	input.addEventListener('input', () => {
		output.innerHTML = input.value + unit;
	});
	return container;
}

function createLabel(name: string, description: string) {
	let label = <HTMLLabelElement>document.createElement('label');
	label.setAttribute('for', name);
	label.innerHTML = description;
	return label;
}

function createInput(type: string, name: string, defaultValue: any) {
	let input = <HTMLInputElement>document.createElement('input');
	input.id = name;
	input.type = type;
	input.dataset.setting = name;
	input.dataset.defaultValue = defaultValue;
	input.value = input.dataset.defaultValue;
	if (getSetting(name)) {
		input.value = getSetting(name);
	} else {
		updateSetting(name, input.value);
	}
	input.addEventListener('change', () => {
		if (type == 'text') {
			updateSetting(name, input.value);
		} else if (type == 'number' || type == 'range') {
			updateSetting(name, parseInt(input.value, 10));
		}
	});
	return input;
}

function createCheckboxInput(name: string, defaultValue: any) {
	let input = <HTMLInputElement>document.createElement('input');
	input.id = name;
	input.type = 'checkbox';
	input.dataset.setting = name;
	input.dataset.defaultValue = defaultValue;
	input.checked = defaultValue;
	if (getSetting(name)) {
		input.checked = getSetting(name);
	} else {
		updateSetting(name, input.checked);
	}
	input.addEventListener('change', () => {
		updateSetting(name, input.checked);
	});
	return input;
}

type DropdownOption = {
	name: string;
	value: string;
};

function createDropdown(
	name: string,
	defaultValue: any,
	options: DropdownOption[]
) {
	let select = <HTMLSelectElement>document.createElement('select');
	select.id = name;
	select.dataset.setting = name;
	select.dataset.defaultValue = defaultValue;
	select.value = defaultValue;
	if (getSetting(name)) {
		select.value = getSetting(name);
	}
	for (var i = 0; i < options.length; i++) {
		let option = document.createElement('option');
		option.value = options[i].value;
		option.text = options[i].name;
		select.appendChild(option);
	}
	if (getSetting(name)) {
		select.value = getSetting(name);
	} else {
		updateSetting(name, select.value);
	}
	select.addEventListener('change', () => {
		updateSetting(name, select.value);
	});
	return select;
}

function createOutput() {
	let output = <HTMLOutputElement>document.createElement('output');
	return output;
}

function createFlexContainer() {
	let container = <HTMLElement>document.createElement('div');
	container.classList.add('flex');
	container.classList.add('setting');
	return container;
}

export function setDefaultSettings() {
	let settings = document.querySelectorAll('[data-setting]');
	settings.forEach((setting: any) => {
		switch (setting.type) {
			case 'number':
			case 'range':
				updateSetting(
					setting.dataset.setting,
					parseInt(setting.dataset.defaultValue, 10)
				);
				break;
			case 'checkbox':
				if (setting.dataset.defaultValue == "false") {
					updateSetting( setting.dataset.setting, false );
				} else {
					updateSetting(setting.dataset.setting, true);
				}
				break;
			default:
				updateSetting(
					setting.dataset.setting,
					setting.dataset.defaultValue
				);
		}
	});
}

export function loadSettings() {
	let settings = document.querySelectorAll('[data-setting]');
	settings.forEach((setting: any) => {
		switch (setting.type) {
			case 'number':
			case 'range':
				setting.value = getSetting(setting.dataset.setting);
				break;
			case 'checkbox':
				setting.checked = getSetting(setting.dataset.setting);
				break;
			default:
				setting.value = getSetting(setting.dataset.setting);
		}
	});
}

export function settingsExist() {
	if (!localStorage[config.appName]) {
		setDefaultSettings();
	} else {
		loadSettings();
	}
}

export function getSetting(setting) {
	if (!localStorage[config.appName]) {
		setDefaultSettings();
	}
	return JSON.parse(localStorage[config.appName])[setting];
}

export function updateSetting(setting, value) {
	if (!localStorage.getItem(config.appName)) {
		localStorage.setItem(config.appName, JSON.stringify({}));
	}
	var save_data = JSON.parse(localStorage[config.appName]);
	save_data[setting] = value;
	localStorage.setItem(config.appName, JSON.stringify(save_data));
}
