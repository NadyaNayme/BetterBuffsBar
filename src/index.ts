// alt1 base libs, provides all the commonly used methods for image matching and capture
// also gives your editor info about the window.alt1 api
import * as a1lib from 'alt1';
import * as BuffReader from 'alt1/buffs';
import Sortable from 'sortablejs';
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

/* Buffs */
let OverloadBuff = document.getElementById('OverloadBuff');
let WeaponPoisonBuff = document.getElementById('WeaponPoisonBuff');
let DarknessBuff = document.getElementById('DarknessBuff');
let AnimateDeadBuff = document.getElementById('AnimateDeadBuff');
let BolgStacksBuff = document.getElementById('BolgStacksBuff');
let TimeRiftBuff = document.getElementById('TimeRiftBuff');
let FsoaSpecBuff = document.getElementById('FsoaSpecBuff');

// loads all images as raw pixel data async, images have to be saved as *.data.png
// this also takes care of metadata headers in the image that make browser load the image
// with slightly wrong colors
// this function is async, so you cant acccess the images instantly but generally takes <20ms
// use `await imgs.promise` if you want to use the images as soon as they are loaded
var buffImages = a1lib.webpackImages({
	animateDead: require('./asset/data/Animate_Dead-top.data.png'),
	antifireActive: require('./asset/data/Anti-Fire_Active.data.png'),
	antipoisonActive: require('./asset/data/Anti-poison_Active.data.png'),
	chronicleAttraction: require('./asset/data/Chronicle_Attraction.data.png'),
	darkness: require('./asset/data/Darkness_top.data.png'),
	fsoaWeaponSpec: require('./asset/data/fsoaSpecBuff.data.png'),
	overloaded: require('./asset/data/Overloaded.data.png'),
	perfectEquilibrium: require('./asset/data/Perfect_Equilibrium.data.png'),
	poisonous: require('./asset/data/Poisonous-top.data.png'),
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

	let bbb = document.getElementById('Buffs');
	let overlayWidth = bbb.offsetWidth;
	let overlayHeight = bbb.offsetHeight;
	overlayCanvas.width = overlayWidth;
	overlayCanvas.height = overlayHeight;
	return overlayCanvas;
}

function captureOverlay() {
	let overlayCanvas = createCanvas();
	html2canvas(document.querySelector('#Buffs'), {
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
			findPoisonous(buffs);
			// findPrayerRenewal(buffs);
			// findAntipoison(buffs);
			findFsoaBuff(buffs);
			findDarkness(buffs);
			findAnimateDead(buffs);
			findJasProc(buffs);
			findBolgStacks(buffs);
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
			if (overloadData.time > 59) {
				OverloadBuff.dataset.time = (value.readArg('timearg').time / 60).toString() + "m";
				await new Promise((done) => setTimeout(done, 10000));
			} else if (overloadData.time == 11) {
				OverloadBuff.dataset.time = '<10s'
				await new Promise((done) => setTimeout(done, 10000));
				OverloadBuff.dataset.time = '';
			}else {
				OverloadBuff.dataset.time = value
					.readArg('timearg')
					.time.toString();
			}
		}
	}
	if (overloadData == undefined) {
		OverloadBuff.classList.add('inactive');
	} else {
		OverloadBuff.classList.remove('inactive');
	}
	await new Promise((done) => setTimeout(done, 10));
	return overloadData;
}

async function findPoisonous(buffs: BuffReader.Buff[]) {
	let poisonousData;
	for (let [_key, value] of Object.entries(buffs)) {
		let poisonousBuff = value.countMatch(buffImages.poisonous, false);
		if (poisonousBuff.passed > 161) {
			poisonousData = value.readArg('timearg');
			if (poisonousData.time > 59) {
				WeaponPoisonBuff.dataset.time =
					(value.readArg('timearg').time / 60).toString() + 'm';
				await new Promise((done) => setTimeout(done, 10000));
			} else if (poisonousData.time == 11) {
				WeaponPoisonBuff.dataset.time = '<10s';
				await new Promise((done) => setTimeout(done, 10000));
				WeaponPoisonBuff.dataset.time = '';
			} else {
				WeaponPoisonBuff.dataset.time = value
					.readArg('timearg')
					.time.toString();
			}
		}
	}
	if (poisonousData == undefined) {
		WeaponPoisonBuff.classList.add('inactive');
	} else {
		WeaponPoisonBuff.classList.remove('inactive');
	}
	await new Promise((done) => setTimeout(done, 10));
	return poisonousData;
}

async function findDarkness(buffs: BuffReader.Buff[]) {
	let darknessData;
	for (let [_key, value] of Object.entries(buffs)) {
		let darknessBuff = value.countMatch(buffImages.darkness, false);
		if (darknessBuff.passed > 120) {
			darknessData = value.readArg('timearg');
			if (darknessData.time > 59) {
				DarknessBuff.dataset.time =
					(value.readArg('timearg').time / 60).toString() + 'm';
				await new Promise((done) => setTimeout(done, 10000));
			} else if (darknessData.time == 11) {
				DarknessBuff.dataset.time = '<10s';
				await new Promise((done) => setTimeout(done, 10000));
				DarknessBuff.dataset.time = '';
			} else {
				DarknessBuff.dataset.time = value
					.readArg('timearg')
					.time.toString();
			}
		}
	}
	if (darknessData == undefined) {
		DarknessBuff.classList.add('inactive');
		await new Promise((done) => setTimeout(done, 10000));
		DarknessBuff.dataset.time = '';
	} else {
		DarknessBuff.classList.remove('inactive');
	}
	await new Promise((done) => setTimeout(done, 10));
	return darknessData;
}

async function findAnimateDead(buffs: BuffReader.Buff[]) {
	let animateDeadData;
	for (let [_key, value] of Object.entries(buffs)) {
		let animeDeadBuff = value.countMatch(buffImages.animateDead, false);
		if (animeDeadBuff.passed > 50) {
			animateDeadData = value.readArg('timearg');
			if (animateDeadData.time > 59) {
				AnimateDeadBuff.dataset.time =
					(value.readArg('timearg').time / 60).toString() + 'm';
				await new Promise((done) => setTimeout(done, 10000));
			} else if (animateDeadData.time == 11) {
				AnimateDeadBuff.dataset.time = '<10s';
				await new Promise((done) => setTimeout(done, 10000));
				AnimateDeadBuff.dataset.time = '';
			} else {
				AnimateDeadBuff.dataset.time = value
					.readArg('timearg')
					.time.toString();
			}
		}
	}
	if (animateDeadData == undefined) {
		AnimateDeadBuff.classList.add('inactive');
		await new Promise((done) => setTimeout(done, 10000));
		AnimateDeadBuff.dataset.time = '';
	} else {
		AnimateDeadBuff.classList.remove('inactive');
	}
	await new Promise((done) => setTimeout(done, 10));
	return animateDeadData;
}

async function findJasProc(buffs: BuffReader.Buff[]) {
	let jasProcData;
	for (let [_key, value] of Object.entries(buffs)) {
		let jasProcBuff = value.countMatch(buffImages.timeRift, false);
		if (jasProcBuff.passed > 50) {
			jasProcData = value.readArg('timearg');
			TimeRiftBuff.dataset.time = value
				.readArg('timearg')
				.time.toString();
			await new Promise((done) => setTimeout(done, 600));
		}
	}
	if (jasProcData == undefined) {
		TimeRiftBuff.classList.add('inactive');
		await new Promise((done) => setTimeout(done, 1000));
		TimeRiftBuff.dataset.time = '';
	} else {
		TimeRiftBuff.classList.remove('inactive');
	}
	await new Promise((done) => setTimeout(done, 10));
	return jasProcData;
}

async function findFsoaBuff(buffs: BuffReader.Buff[]) {
	let fsoaBuffData;
	for (let [_key, value] of Object.entries(buffs)) {
		let fsoaBuff = value.countMatch(
			buffImages.fsoaWeaponSpec,
			false
		);
		console.log(fsoaBuff);
		if (fsoaBuff.passed >= 15) {
			fsoaBuffData = value.readArg('timearg');
			FsoaSpecBuff.dataset.time = value
				.readArg('timearg')
				.time.toString();
		}
	}
	if (fsoaBuffData == undefined) {
		FsoaSpecBuff.classList.add('inactive');
		await new Promise((done) => setTimeout(done, 600));
		FsoaSpecBuff.dataset.time = '';
	} else {
		FsoaSpecBuff.classList.remove('inactive');
	}
	await new Promise((done) => setTimeout(done, 10));
	return fsoaBuffData;
}

async function findBolgStacks(buffs: BuffReader.Buff[]) {
	let bolgStacksData;
	for (let [_key, value] of Object.entries(buffs)) {
		let bolgStacksBuff = value.countMatch(buffImages.perfectEquilibrium, false);
		if (bolgStacksBuff.passed > 100) {
			bolgStacksData = value.readArg('timearg');
			BolgStacksBuff.dataset.time = value
				.readArg('timearg')
				.time.toString();
		}
	}
	if (bolgStacksData == undefined) {
		BolgStacksBuff.classList.add('inactive');
		await new Promise((done) => setTimeout(done, 600));
		BolgStacksBuff.dataset.time = '';
	} else {
		BolgStacksBuff.classList.remove('inactive');
	}
	await new Promise((done) => setTimeout(done, 10));
	return bolgStacksData;
}

let posBtn = document.getElementById('OverlayPosition');
posBtn.addEventListener('click', setOverlayPosition);
async function setOverlayPosition() {
	let bbb = document.getElementById('Buffs');
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
	let bbb = document.getElementById('Buffs');
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

		let bbb = document.getElementById('Buffs');
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
			activeOverlay: true,
			buffsLocation: findPlayerBuffs,
			buffsPerRow: 5,
			uiScale: 100,
			updatingOverlayPosition: false,
		})
	);
}

function loadSettings() {
	setSortables();
	setBuffsPerRow();
	setFadeInactiveBuffs();
	setCustomScale();
	setOverlay();
	setLoopSpeed();
}

function setSortables() {
	const sortables = ['Buffs', 'UntrackedBuffs'];

	// Create the sortables
	sortables.forEach((sortable) => {
		const el = document.getElementById(sortable);

		Sortable.create(el, {
			group: 'trackedBuffs',
			dataIdAttr: 'id',
			swapThreshold: 0.85,
			store: {
				set: function (sortable) {
					var order = sortable.toArray();
					localStorage.setItem(sortable.el.id, order.join('|'));
				},
			},
			onSort: function (evt) {
				var currentSortable = evt.to[Object.keys(evt.to)[0]];
				var order = currentSortable.toArray();
				localStorage[currentSortable.el.id] = order.join('|');
			},
		});
	});

	// Re-sort into their saved areas on load
	sortables.forEach((sortable) => {
		const parent = document.getElementById(sortable);
		const itemOrder = localStorage.getItem(sortable);
		const itemOrderArr = itemOrder ? itemOrder.split('|') : [];

		let prevItem;
		itemOrderArr.forEach((item) => {
			const child = document.getElementById(item);
			if (!prevItem) {
				parent.insertBefore(child, parent.firstChild);
			} else {
				const prevChild = document.getElementById(prevItem);
				prevChild.parentNode.insertBefore(child, prevChild.nextSibling);
			}
			prevItem = item;
		});
	});
}

function setBuffsPerRow() {
	let buffsTracker = document.getElementById('Buffs');
	buffsTracker.style.setProperty('--maxcount', getSetting('buffsPerRow'));
	let buffsPerRow = getSetting('buffsPerRow');
	let buffsPerRowInput = <HTMLInputElement>document.getElementById('BuffsPerRow');
	buffsPerRowInput.value = buffsPerRow;
	buffsPerRowInput.addEventListener('change', (e) => {
		buffsTracker.style.setProperty('--maxcount', getSetting('buffsPerRow'));
		updateSetting('buffsPerRow', buffsPerRowInput.value);
	});

}
function setFadeInactiveBuffs() {
	let buff = <HTMLInputElement>document.querySelectorAll('.fade-inactive')[0];
	setCheckboxChecked(buff);
}

function setCustomScale() {
	let buffsTracker = document.getElementById('Buffs');
	buffsTracker.style.setProperty('--scale', getSetting('uiScale'));

	document
		.getElementById('UIScale')
		.setAttribute('value', getSetting('uiScale'));

	let UIScaleValue = document.querySelector('#UIScaleOutput');
	let UIScaleInput: any = document.querySelector('#UIScale');
	UIScaleValue.textContent = UIScaleInput.value;
}

function setCheckboxChecked(el: HTMLInputElement) {
	el.checked = Boolean(getSetting(el.dataset.setting));
}

function setOverlay() {
	let showOverlay = <HTMLInputElement>document.getElementById('ShowOverlay');
	setCheckboxChecked(showOverlay);
	betterBuffsBar.classList.toggle(
		'overlay',
		Boolean(getSetting('activeOverlay'))
	);
	showOverlay.addEventListener('change', function () {
		location.reload();
	});
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

var scaleSliderFields: any = document.querySelectorAll(
	'input[type="range"].scale'
);
scaleSliderFields.forEach((scaleSlider) => {
	scaleSlider.addEventListener('input', (event) => {
		updateSetting(scaleSlider.dataset.setting, event.target.value);
	});
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
