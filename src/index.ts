// alt1 base libs, provides all the commonly used methods for image matching and capture
// also gives your editor info about the window.alt1 api
import * as a1lib from 'alt1';
import * as BuffReader from 'alt1/buffs';
import html2canvas from 'html2canvas';

// tell webpack that this file relies index.html, appconfig.json and icon.png, this makes webpack
// add these files to the output directory
// this works because in /webpack.config.js we told webpack to treat all html, json and imageimports
// as assets
import './index.html';
import './appconfig.json';
import './icon.png';
import './css/betterbuffsbar.css';

var buffs = new BuffReader.default();
var output = document.getElementById('output');
var settings = document.getElementById('Settings');
var betterBuffsBar = document.getElementById('BetterBuffsBar');

// loads all images as raw pixel data async, images have to be saved as *.data.png
// this also takes care of metadata headers in the image that make browser load the image
// with slightly wrong colors
// this function is async, so you cant acccess the images instantly but generally takes <20ms
// use `await imgs.promise` if you want to use the images as soon as they are loaded
var buffImages = a1lib.webpackImages({
	animateDead: require('./asset/data/Animate_Dead.data.png'),
	antifireActive: require('./asset/data/Anti-Fire_Active.data.png'),
	antipoisonActive: require('./asset/data/Anti-poison_Active.data.png'),
	chronicleAttraction: require('./asset/data/Chronicle_Attraction.data.png'),
	darkness: require('./asset/data/Darkness_top.data.png'),
	overloaded: require('./asset/data/Overloaded.data.png'),
	perfectEquilibrium: require('./asset/data/Perfect_Equilibrium.data.png'),
	poisonous: require('./asset/data/Poisonous.data.png'),
	prayerRenewActive: require('./asset/data/Prayer_Renew_Active.data.png'),
	superAntifireActive: require('./asset/data/Super_Anti-Fire_Active.data.png'),
	supremeOverloadActive: require('./asset/data/Supreme_Overload_Potion_Active.data.png'),
	timeRift: require('./asset/data/Time_Rift.data.png'),
});

export function startBetterBuffsBar() {
	if (!window.alt1) {
		output.insertAdjacentHTML(
			'beforeend',
			`<div>You need to run this page in alt1 to capture the screen</div>`
		);
		return;
	}
	if (!alt1.permissionPixel) {
		output.insertAdjacentHTML(
			'beforeend',
			`<div><p>Page is not installed as app or capture permission is not enabled</p></div>`
		);
		return;
	}
	if (!alt1.permissionOverlay && getSetting('activeOverlay')) {
		output.insertAdjacentHTML(
			'beforeend',
			`<div><p>Attempted to use Overlay but app overlay permission is not enabled. Please enable "Show Overlay" permission in Alt1 settinsg (wrench icon in corner).</p></div>`
		);
		return;
	}

	watchBuffs();
}

function createCanvas() {
	let overlayCanvas = document.createElement('canvas');
	overlayCanvas.id = 'OverlayCanvas';

	let bbb = document.getElementById('BetterBuffsBar');
	let overlayWidth = bbb.offsetWidth;
	let overlayHeight = bbb.offsetHeight;
	overlayCanvas.width = overlayWidth;
	overlayCanvas.height = overlayHeight;
	return overlayCanvas;
}

function captureOverlay() {
	let overlayCanvas = createCanvas();
	html2canvas(document.querySelector('#BetterBuffsBar'), {
		allowTaint: true,
		canvas: overlayCanvas,
		backgroundColor: 'transparent',
		useCORS: true,
		removeContainer: true,
	})
	.then((canvas) => {
		try {
			paintCanvas(canvas);
		} catch (e) {
			console.log('Error saving image? ' + e);
		}
	})
	.catch(() => {
		console.log('Overlay failed to capture.');
	});
}

function paintCanvas(canvas: HTMLCanvasElement) {
		let overlayCanvasOutput = document.getElementById(
			'OverlayCanvasOutput'
		);
		let overlayCanvasContext = overlayCanvasOutput
			.querySelector('canvas')
			.getContext('2d', {'willReadFrequently': true});
		overlayCanvasContext.clearRect(0, 0, canvas.width, canvas.height);
		overlayCanvasContext.drawImage(canvas, 0, 0);
		let overlay = overlayCanvasOutput.querySelector('canvas');
		updateSetting('overlayImage', overlay.toDataURL());
		updateSetting('firstFrame', true);
}

let maxAttempts = 10;
function watchBuffs() {
	updateSetting(
		'firstFrame',
		false
	); /* We haven't captured a new frame yet */
	if (getSetting('activeOverlay')) {
		startOverlay();
	} else {
		alt1.overLayContinueGroup('betterBuffsBar');
		alt1.overLayClearGroup('betterBuffsBar');
		alt1.overLaySetGroup('betterBuffsBar');
	}
	const interval = setInterval(() => {
		let buffs = getActiveBuffs();
		if (buffs) {
			findOverloaded(buffs);
			findPrayerRenewal(buffs);
			findAntipoison(buffs);
			findDarkness(buffs);
			findAnimateDead(buffs);
			// If we succesfully found buffs - restart our retries
			maxAttempts = 10;
		} else {
			if (maxAttempts == 0) {
				output.insertAdjacentHTML(
					'beforeend',
					`<p>Unable to find buff bar location.\nPlease login to the game or make sure that Alt1 can detect your buffs then reload the app.\nRemember - the Buffs Bar must be set to "Small". \nTo reload, right click this interface and select Reload.</p>`
				);
				clearInterval(interval);
				return;
			}
			if (maxAttempts > -0) {
				maxAttempts--;
			}
			console.log(
				`Failed to read buffs - attempting again. Attempts left: ${maxAttempts}.`
			);
		}
	}, getSetting('loopSpeed'));
	``;
}

async function findOverloaded(buffs: BuffReader.Buff[]) {
	let overloadData;
	for (let [_key, value] of Object.entries(buffs)) {
		let overloadedBuff = value.countMatch(buffImages.overloaded, false);
		if (overloadedBuff.passed > 300) {
			overloadData = value.readArg('timearg');
		}
	}
	await new Promise((done) => setTimeout(done, 100));
	return overloadData;
}

async function findPrayerRenewal(buffs: BuffReader.Buff[]) {
	let prayerRenewalData;
	for (let [_key, value] of Object.entries(buffs)) {
		let prayerRenewalBuff = value.countMatch(buffImages.prayerRenewActive, false);
		if (prayerRenewalBuff.passed > 300) {
			prayerRenewalData = value.readArg('timearg');
		}
	}
	await new Promise((done) => setTimeout(done, 100));
	return prayerRenewalData;
}

async function findAntipoison(buffs: BuffReader.Buff[]) {
	let antipoisonData;
	for (let [_key, value] of Object.entries(buffs)) {
		let antipoisonBuff = value.countMatch(
			buffImages.antipoisonActive,
			false
		);
		if (antipoisonBuff.passed > 300) {
			antipoisonData = value.readArg('timearg');
		}
	}
	await new Promise((done) => setTimeout(done, 100));
	return antipoisonData;
}

async function findDarkness(buffs: BuffReader.Buff[]) {
	let darknessData;
	for (let [_key, value] of Object.entries(buffs)) {
		let darknessBuff = value.countMatch(
			buffImages.darkness,
			false
		);
		if (darknessBuff.passed > 150) {
			darknessData = value.readArg('timearg');
		}
	}
	await new Promise((done) => setTimeout(done, 100));
	return darknessData;
}

async function findAnimateDead(buffs: BuffReader.Buff[]) {
	let animateDeadData;
	for (let [_key, value] of Object.entries(buffs)) {
		let animeDeadBuff = value.countMatch(buffImages.animateDead, false);
		if (animeDeadBuff.passed > 50) {
			animateDeadData = value.readArg('timearg');
		}
	}
	await new Promise((done) => setTimeout(done, 100));
	return animateDeadData;
}


let posBtn = document.getElementById('OverlayPosition');
posBtn.addEventListener('click', setOverlayPosition);
async function setOverlayPosition() {
	let bbb = document.getElementById('BetterBuffsBar');
	let overlayWidth = bbb.offsetWidth;
	let overlayHeight = bbb.offsetHeight;

	a1lib.once('alt1pressed', updateLocation);
	updateSetting('updatingOverlayPosition', true);
	while (getSetting('updatingOverlayPosition')) {
		alt1.overLaySetGroup('overlayPositionHelper');
		alt1.overLayRect(
			a1lib.mixColor(255, 255, 255),
			Math.floor(
				a1lib.getMousePosition().x -
					((getSetting('uiScale') / 100) * overlayWidth) / 2
			),
			Math.floor(
				a1lib.getMousePosition().y -
					((getSetting('uiScale') / 100) * overlayHeight) / 2
			),
			Math.floor((getSetting('uiScale') / 100) * overlayWidth),
			Math.floor((getSetting('uiScale') / 100) * overlayHeight),
			200,
			2
		);
			await new Promise((done) => setTimeout(done, 200));
	}
}

function updateLocation(e) {
	let bbb = document.getElementById('BetterBuffsBar');
	let overlayWidth = bbb.offsetWidth;
	let overlayHeight = bbb.offsetHeight;
	updateSetting('overlayPosition', {
		x: Math.floor(
			e.x - (getSetting('uiScale') / 100) * (overlayWidth / 2)
		),
		y: Math.floor(
			e.y - (getSetting('uiScale') / 100) * (overlayHeight / 2)
		),
	});
	updateSetting('updatingOverlayPosition', false);
	alt1.overLayClearGroup('overlayPositionHelper');
}

export async function startOverlay() {
    let cnv = document.createElement('canvas');
	let ctx = cnv.getContext('2d', {"willReadFrequently": true});

	while (true) {
		captureOverlay();
		let overlay = <HTMLCanvasElement>document.getElementsByTagName('canvas')[0];

		let overlayPosition = getSetting('overlayPosition');

		let bbb = document.getElementById('BetterBuffsBar');
		let overlayWidth = bbb.offsetWidth;
		let overlayHeight = bbb.offsetHeight;

		alt1.overLaySetGroup('betterBuffsBar');
		alt1.overLayFreezeGroup('betterBuffsBar');
		cnv.width = overlayWidth;
		cnv.height = overlayHeight;
		/* If I try and use the overlay instead of copying the overlay it doesn't work. No idea why. */
		ctx.drawImage(overlay, 0, 0);

		let data = ctx.getImageData(0, 0, cnv.width, cnv.height);

		alt1.overLayClearGroup('betterBuffsBar');
		alt1.overLayImage(
			overlayPosition.x,
			overlayPosition.y,
			a1lib.encodeImageString(data),
			data.width,
			125
		)
		alt1.overLayRefreshGroup('betterBuffsBar');
		await new Promise((done) => setTimeout(done, 125));
	}
}

function initSettings() {
	if (!localStorage.betterBuffBar) {
		setDefaultSettings();
		loadSettings();
	} else {
		loadSettings();
	}
}

function setDefaultSettings() {
	localStorage.setItem(
		'betterBuffBar',
		JSON.stringify({
			animateDead: true,
			animateDeadPriority: 7,
			bolgStacks: false,
			bolgStacksPriority: 8,
			buffsLocation: findPlayerBuffs,
			darkness: true,
			darknessPriority: 6,
			fsoaSpec: true,
			fsoaSpecPriority: 9,
			overload: true,
			overloadPriority: 1,
			jasBookProc: true,
			jasBookProcPriority: 6,
			fulBookProc: true,
			fulBookProcPriority: 5,
			weaponPoison: true,
			weaponPoisonPriority: 2,
			uiScale: 100,
			updatingOverlayPosition: false,
		})
	);
}

function loadSettings() {
	setFadeInactiveBuffs();
	setTrackedBuffs();
	setPriorities();
	setLoopSpeed();
}

function setFadeInactiveBuffs() {
	let buff = <HTMLInputElement>document.querySelectorAll('.fade-inactive')[0];
	setCheckboxChecked(buff);
}

function setTrackedBuffs() {
	let buffs = document.querySelectorAll('.buff');
	buffs.forEach((buff: HTMLInputElement) => {
		setCheckboxChecked(buff);
	});
}

function setCheckboxChecked(el: HTMLInputElement) {
	el.checked = Boolean(getSetting(el.dataset.setting));
}

function setPriorities() {
	let priorityInputs = document.querySelectorAll('.priority');
	priorityInputs.forEach((input: HTMLInputElement) => {
		input.value = getSetting(input.dataset.setting.toString());
	});
}

let priorityInputs = document.querySelectorAll('.priority');
priorityInputs.forEach((input: HTMLInputElement) => {
	input.addEventListener('change', (e) => {
		updateSetting(input.dataset.setting, input.value.toString());
	})
});

function setOverlay() {
	let showOverlay = <HTMLInputElement>(
		document.getElementById('ShowOverlay')
	);
	setCheckboxChecked(showOverlay);
	betterBuffsBar.classList.toggle('overlay', Boolean(getSetting('activeOverlay')));
	showOverlay.addEventListener('change', function() {
		location.reload();
	})
}

function setLoopSpeed() {

	if (getSetting('loopSpeed') == '') {
		updateSetting('loopSpeed', 125);
	}

	let loopSpeed = <HTMLInputElement>document.getElementById('LoopSpeed');
	loopSpeed.value = getSetting('loopSpeed');

	document
		.getElementById('LoopSpeed')
		.setAttribute('value', getSetting('loopSoeed'));

	let LoopSpeedValue = document.querySelector('#LoopSpeedOutput');
	let LoopSpeedInput: any = document.querySelector('#LoopSpeed');
	LoopSpeedValue.textContent = LoopSpeedInput.value;
}

function getSetting(setting) {
	if (!localStorage.betterBuffBar) {
		initSettings();
	}
	return JSON.parse(localStorage.getItem('betterBuffBar'))[setting];
}

function updateSetting(setting, value) {
	if (!localStorage.getItem('betterBuffBar')) {
		localStorage.setItem('betterBuffBar', JSON.stringify({}));
	}
	var save_data = JSON.parse(localStorage.getItem('betterBuffBar'));
	save_data[setting] = value;
	localStorage.setItem('betterBuffBar', JSON.stringify(save_data));
	loadSettings();
}

let foundBuffs = false;
function findPlayerBuffs() {
	if (buffs.find()) {
		foundBuffs = true;
		if (getSetting('debugMode')) {
			alt1.overLayRect(
				a1lib.mixColor(255, 255, 255),
				getSetting('buffsLocation')[0],
				getSetting('buffsLocation')[1],
				250,
				100,
				50,
				1
			);
		}
		return updateSetting('buffsLocation', [buffs.pos.x, buffs.pos.y]);
	}
}

function getActiveBuffs() {
	if (foundBuffs && getSetting('buffsLocation')) {
		return buffs.read();
	} else {
		findPlayerBuffs();
	}
}

function roundedToFixed(input, digits) {
	var rounder = Math.pow(10, digits);
	return (Math.round(input * rounder) / rounder).toFixed(digits);
}

/* Settings */

function toggleSettings() {
	settings.classList.toggle('visible');
}

let settingsButton = document.getElementById('SettingsButton');
settingsButton.addEventListener('click', toggleSettings);

let checkboxFields: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[type="checkbox"]');
checkboxFields.forEach((checkbox) => {
	checkbox.addEventListener('click', (e) => {
			updateSetting(checkbox.dataset.setting, checkbox.checked);
		})
});


var loopSpeed: any = document.querySelector('#LoopSpeed');
loopSpeed.addEventListener('change', (event) => {
	updateSetting('loopSpeed', event.target.value);
});

let resetAllSettingsButton = document.getElementById('ResetAllSettings');
resetAllSettingsButton.addEventListener('click', () => {
	localStorage.removeItem('betterBuffBar');
	localStorage.clear();
	initSettings();
	location.reload();
});

/* End Settings */

window.onload = function () {
	//check if we are running inside alt1 by checking if the alt1 global exists
	if (window.alt1) {
		//tell alt1 about the app
		//this makes alt1 show the add app button when running inside the embedded browser
		//also updates app settings if they are changed
		alt1.identifyAppUrl('./appconfig.json');
		initSettings();
		startBetterBuffsBar();
	} else {
		let addappurl = `alt1://addapp/${
			new URL('./appconfig.json', document.location.href).href
		}`;
		output.insertAdjacentHTML(
			'beforeend',
			`
			Alt1 not detected, click <a href='${addappurl}'>here</a> to add this app to Alt1
		`
		);
	}
};
