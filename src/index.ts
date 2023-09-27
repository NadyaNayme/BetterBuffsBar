// alt1 base libs, provides all the commonly used methods for image matching and capture
// also gives your editor info about the window.alt1 api
import * as a1lib from 'alt1';
import * as BuffReader from 'alt1/buffs';
import { Sortable, MultiDrag }  from 'sortablejs';
import html2canvas from 'html2canvas';

Sortable.mount(new MultiDrag());

// tell webpack that this file relies index.html, appconfig.json and icon.png, this makes webpack
// add these files to the output directory
// this works because in /webpack.config.js we told webpack to treat all html, json and imageimports
// as assets
import './index.html';
import './appconfig.json';
import './icon.png';
import './css/betterbuffsbar.css';

var buffs = new BuffReader.default();
var debuffs = new BuffReader.default();
debuffs.debuffs = true;

function getByID(id: string) {
	return document.getElementById(id);
}

let helperItems = {
	Output: getByID('output'),
	settings: getByID('Settings'),
	BetterBuffsBar: getByID('BetterBuffsBar'),
	TrackedBuffs: getByID('Buffs'),
	UntrackedBuffs: getByID('UntrackedBuffs'),
}

let buffsList = {
	OverloadBuff: getByID('OverloadBuff'),
	ElderOverloadBuff: getByID('ElderOverloadBuff'),
	WeaponPoisonBuff: getByID('WeaponPoisonBuff'),
	DarknessBuff: getByID('DarknessBuff'),
	AnimateDeadBuff: getByID('AnimateDeadBuff'),
	BolgStacksBuff: getByID('BolgStacksBuff'),
	BalanceByForceBuff: getByID('BalanceByForceBuff'),
	TimeRiftBuff: getByID('TimeRiftBuff'),
	FsoaSpecBuff: getByID('FsoaSpecBuff'),
	GladiatorsRageBuff: getByID('GladiatorsRageBuff'),
	NecrosisBuff: getByID('NecrosisBuff'),
	LimitlessBuff: getByID('LimitlessBuff'),
};

let debuffsList = {
	DeathGuardDebuff: getByID('DeathGuardDebuff'),
	OmniGuardDebuff: getByID('OmniGuardDebuff'),
	CrystalRainDebuff: getByID('CrystalRainDebuff'),
	AncientElvenRitualShardDebuff: getByID('AncientElvenRitualShardDebuff'),
	EnhancedExcaliburDebuff: getByID('EnhancedExcaliburDebuff'),
	AdrenalinePotionDebuff: getByID('AdrenalinePotionDebuff'),
};

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
	elderOverload: require('./asset/data/Elder_Overload.data.png'),
	fsoaWeaponSpec: require('./asset/data/fsoaSpecBuff.data.png'),
	overloaded: require('./asset/data/Overloaded.data.png'),
	overloadedNoBorder: require('./asset/data/Overloaded-noborder.data.png'),
	perfectEquilibrium: require('./asset/data/Perfect_Equilibrium.data.png'),
	perfectEquilibriumNoBorder: require('./asset/data/Perfect_Equilibrium-noborder.data.png'),
	poisonous: require('./asset/data/Poisonous-top.data.png'),
	prayerRenewActive: require('./asset/data/Prayer_Renew_Active.data.png'),
	superAntifireActive: require('./asset/data/Super_Anti-Fire_Active.data.png'),
	supremeOverloadActive: require('./asset/data/Supreme_Overload_Potion_Active.data.png'),
	timeRift: require('./asset/data/Time_Rift.data.png'),
	gladiatorsRage: require('./asset/data/Gladiators_Rage.data.png'),
	necrosis: require('./asset/data/Necrosis.data.png'),
	limitless: require('./asset/data/Limitless.data.png'),
});

var debuffImages = a1lib.webpackImages({
	elvenRitualShard: require('./asset/data/Ancient_Elven_Ritual_Shard.data.png'),
	adrenalinePotion: require('./asset/data/Adrenaline_Potion.data.png'),
	crystalRainMinimal: require('./asset/data/Crystal_Rain-minimal.data.png'),
	deathGraspDebuff: require('./asset/data/Death_Guard_Special-top.data.png'),
	deathEssenceDebuff: require('./asset/data/Omni_Guard_Special-top.data.png'),
	enhancedExcaliburDebuff: require('./asset/data/EE_scuffed-top.data.png'),
});

export function startBetterBuffsBar() {
	if (!window.alt1) {
		helperItems.Output.insertAdjacentHTML(
			'beforeend',
			`<div>You need to run this page in alt1 to capture the screen</div>`
		);
		return;
	}
	if (!alt1.permissionPixel) {
		helperItems.Output.insertAdjacentHTML(
			'beforeend',
			`<div><p>Page is not installed as app or capture permission is not enabled</p></div>`
		);
		return;
	}
	if (!alt1.permissionOverlay && getSetting('activeOverlay')) {
		helperItems.Output.insertAdjacentHTML(
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

	let bbb = getByID('Buffs');
	let overlayWidth = bbb.offsetWidth;
	let overlayHeight = bbb.offsetHeight;
	overlayCanvas.width = overlayWidth;
	overlayCanvas.height = overlayHeight;
	return overlayCanvas;
}

async function captureOverlay() {
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
		let overlayCanvasOutput = getByID(
			'OverlayCanvasOutput'
		);
		let overlayCanvasContext = overlayCanvasOutput
			.querySelector('canvas')
			.getContext('2d', {'willReadFrequently': true});
		overlayCanvasContext.clearRect(
			0,
			0,
			overlayCanvasContext.canvas.width,
			overlayCanvasContext.canvas.height
		);
		overlayCanvasContext.drawImage(canvas, 0, 0);
		let overlay = overlayCanvasOutput.querySelector('canvas');
		updateSetting('overlayImage', overlay.toDataURL());
		updateSetting('firstFrame', true);
}

let maxAttempts = 10;
function watchBuffs() {
	let loopSpeed = getSetting('loopSpeed');
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
		let debuffs = getActiveDebuffs();
		if (getSetting('buffsLocation')) {
			maxAttempts = 10;

			//TODO: Create buffs object that passes buffImage, element, threshold, expirationPulse, minRange, maxrange, cooldown, and cooldownTimer then loop over the object calling findStatus() on each object
			findStatus(buffs, buffImages.overloaded, buffsList.OverloadBuff, 300, true);
			findStatus(buffs, buffImages.elderOverload, buffsList.ElderOverloadBuff, 44, true);
			findStatus(buffs, buffImages.poisonous, buffsList.WeaponPoisonBuff, 161, true);
			findStatus(buffs, buffImages.darkness, buffsList.DarknessBuff, 120, false, 0, 43260);
			findStatus(buffs, buffImages.animateDead, buffsList.AnimateDeadBuff, 45);
			findStatus(buffs, buffImages.fsoaWeaponSpec, buffsList.FsoaSpecBuff, 12, false, 0, 31);
			findStatus(buffs, buffImages.timeRift, buffsList.TimeRiftBuff, 50);
			findStatus(buffs, buffImages.gladiatorsRage, buffsList.GladiatorsRageBuff, 50, false, 0, 16);
			findStatus(buffs, buffImages.necrosis, buffsList.NecrosisBuff, 150);
			findStatus(buffs, buffImages.limitless, buffsList.LimitlessBuff, 250, false, 0, Infinity, true, 83);

			/* BOLG is currently still special */
			if (document.querySelectorAll('#Buffs #BolgStacksBuff').length) {
				findBolgStacks(buffs);
			}
		} else {
			noDetection(maxAttempts, interval, "buff");
		}
		if (getSetting('debuffsLocation')) {
			maxAttempts = 10;
			findStatus(debuffs, debuffImages.elvenRitualShard, debuffsList.AncientElvenRitualShardDebuff, 50);
			findStatus(debuffs, debuffImages.adrenalinePotion, debuffsList.AdrenalinePotionDebuff, 50);
			findStatus(debuffs, debuffImages.deathGraspDebuff, debuffsList.DeathGuardDebuff, 30);
			findStatus(debuffs, debuffImages.deathEssenceDebuff, debuffsList.OmniGuardDebuff, 14);
			findStatus(debuffs, debuffImages.crystalRainMinimal, debuffsList.CrystalRainDebuff, 6); // Suffers from EE problem
		} else {
			noDetection(maxAttempts, interval, "debuff");
		}
	}, loopSpeed);
}

async function noDetection(maxAttempts: number, interval: any, bar: string) {
	if (maxAttempts == 0) {
		helperItems.Output.insertAdjacentHTML(
			'beforeend',
			`<p>Unable to find ${bar} bar location.\nPlease login to the game or make sure that Alt1 can detect your ${bar} bar then reload the app.\nRemember - the Buffs setting must be set to "Small" and you must have at least 1 ${bar}. \nTo reload, right click this interface and select Reload.</p>`
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

async function showTooltip(msg: string, duration: number) {
	alt1.setTooltip(msg);
	await new Promise((done) => setTimeout(done, duration));
	alt1.clearTooltip();
	return
}

/*
 * I'm usually against argument flags and believe they should generally be a separate function
 * but of the buffs we currently check it's really only Overloads & Weapon Poison that do this.
 * If more get added in the future then we can revisit and maybe extract it out into its own function.
 *
 * "The everything function"
 * coolDownTimer should be the remaining cooldown in SECONDS after Active Duration & 1s have elapsed
 */
async function findStatus(
	buffsReader: BuffReader.Buff[],
	buffImage: ImageData,
	element: HTMLElement,
	threshold: number,
	expirationPulse: boolean = false,
	minRange: number = 0,
	maxRange: number = Infinity,
	showCooldown: boolean = false,
	cooldownTimer?: number
) {
	// Exit early if our buff isn't in the Tracked Buffs list
	if (!getByID('Buffs').contains(element) || !buffsReader) {
		return;
	}
	// Declared outside of the loop so that it can be checked to be Undefined if no buffs are found
	let timearg;
	let foundBuff = false;
	let onCooldown = false;
	for (let [_key, value] of Object.entries(buffsReader)) {
		if (foundBuff) {
			return;
		}

		let findBuffImage = value.countMatch(buffImage, false);
			if (buffImage == debuffImages.crystalRainMinimal) {
				console.log(findBuffImage);
			}
		// If we find a match for the buff it will always exceed the threshold
		// the threshold depends largely on which buff is being matched against
		if (findBuffImage.passed > threshold) {
			if (buffImage == debuffImages.crystalRainMinimal) {
				console.log('Matched on new SGB');
			}
			foundBuff = true;
			await setActive(element);
			timearg = value.readArg('timearg');
			if (element.dataset.time == '1' && showCooldown && !onCooldown) {
				if (getSetting('debugMode')) {
					console.log(`Starting cooldown timer for ${element.id}`)
				}
				onCooldown = true;
				await startCooldownTimer(element, cooldownTimer);
				return
			} else if (timearg.time > 59 && !onCooldown && timearg.time < maxRange) {
				if (getSetting('debugMode')) {
					console.log(`${element.id} has >60s remaining`);
				}
				element.dataset.time =
					Math.floor((value.readArg('timearg').time / 60)).toString() + 'm';

				// Pause the check for a tick since we don't need to rapidly update
				//a buff that won't have a more precise value for 1 minute
				await new Promise((done) => setTimeout(done, 600));
			} else if (expirationPulse && timearg.time == 11 && !onCooldown) {
				if (getSetting('debugMode')) {
					console.log(`${element.id} has <10s remaining - starting 10s countdown`);
				}
				element.dataset.time = '<10s';
				await setActive(element);
				// This can be desynced from in-game 10s but it's accurate enough
				await new Promise((done) => setTimeout(done, 10000));
				await removeActive(element);
				if (getSetting('showTooltipReminders')) {
					showTooltip('Overload expired', 3000);
				}
			} else if (timearg.time > minRange && timearg.time < maxRange) {
				if (getSetting('debugMode')) {
					console.log(`Cooldown for ${element.id} is between ${minRange} and ${maxRange}`);
				}
				element.dataset.time = timearg.time.toString();
				if (timearg.time - 1 == 0 && !showCooldown) {
					await removeActive(element);
				}
			} else {
				if (getSetting('debugMode')) {
					console.log(`${element.id} is no longer active - setting inactive.`);
				}
				await removeActive(element);
			}
		} else if (!showCooldown) {
			if (getSetting('debugMode')) {
				console.log(`${element.id} is no longer active - setting inactive.`);
			}
			await removeActive(element);
		}
	}
	// If we didn't find the buff try again after a brief timeout
	if (timearg == undefined && foundBuff) {
		// The FoundBuff ensures we don't wait 10s to add inactive when BBB first loads
		if (expirationPulse) {
			await new Promise((done) => setTimeout(done, 10000));
		}
		await removeActive(element);
	}
	// Give a very brief pause before checking again
	await new Promise((done) => setTimeout(done, 10));
	return timearg;
};

async function startCooldownTimer(element: HTMLElement, cooldownTimer: number) {
		/*
		* Wait the final 1s then set buff to 'cooldown' state
		* After its cooldown has finished set it back to 'inactive' state (actually 'readyToBeUsed')
		*/
		await new Promise((done) => setTimeout(done, 1000));
		element.dataset.time = '';
		element.classList.remove('inactive');
		element.classList.add('cooldown');
		await new Promise((done) => setTimeout(done, cooldownTimer * 1000));
		element.dataset.time = '';
		element.classList.add('inactive');
		await new Promise((done) => setTimeout(done, 1000));
		element.classList.remove('cooldown');
		// Since cooldown has ended - we are no longer onCooldown
		return false;
}

async function removeActive(element: HTMLElement) {
	element.classList.add('inactive');
	element.classList.remove('active');
	element.dataset.time = '';
}

async function setActive(element: HTMLElement) {
	element.classList.remove('inactive');
	element.classList.add('active');
}


async function findBolgStacks(buffs: BuffReader.Buff[]) {
	let bolgStacksData;
	let bolgFound = false;
	/* Taking from the BOLG Plugin <https://holycoil.nl/alt1/bolg/index.bundle.js>
	   the Zamorak mechanic is always the first so we need to reverse the buffs first
	 */
   let canvas = <HTMLCanvasElement>document.getElementById('canvas');
   let ctx = canvas.getContext('2d');
   ctx.drawImage(
		buffImages.perfectEquilibriumNoBorder.toImage(),
		0,
		0,
		canvas.width,
		canvas.height
   );
   for (let a in buffs.reverse()) {
		if (bolgFound) {
			return;
		}
		if (buffs[a].compareBuffer(buffImages.perfectEquilibriumNoBorder)) {
			bolgFound = true;
			let buffsImage = buffs[a].buffer.toImage();
			ctx.drawImage(
				buffsImage,
				buffs[a].bufferx,
				buffs[a].buffery,
				27,
				27,
				0,
				0,
				canvas.width,
				canvas.height
			);
			let bolgBuffImage = ctx.getImageData(
				0,
				0,
				canvas.width,
				canvas.height
			);
			buffsList.BolgStacksBuff.style.backgroundImage =
				'url("data:image/png;base64,' +
				bolgBuffImage.toPngBase64() +
				'")';
		}
   }
	for (let [_key, value] of Object.entries(buffs).reverse()) {
		let bolgStacksBuff = value.countMatch(
			buffImages.perfectEquilibrium,
			false
		);
		if (bolgStacksBuff.passed > 200) {
			bolgStacksData = value.readArg('timearg');
			if (
				value.readArg('timearg').time > 0 &&
				value.readArg('timearg').time
			 < 31 && value.readArg('timearg').arg != "") {
				buffsList.BalanceByForceBuff.dataset.time = value
					.readArg('timearg')
					.time.toString();
			 }
			buffsList.BolgStacksBuff.dataset.time = value
				.readArg('timearg')
				.arg.toString();
			await new Promise((done) => setTimeout(done, 600));
		}
	}
	if (bolgStacksData == undefined) {
		buffsList.BolgStacksBuff.classList.add('inactive');
		buffsList.BalanceByForceBuff.classList.add('inactive');
		await new Promise((done) => setTimeout(done, 600));
		buffsList.BolgStacksBuff.dataset.time = '';
		buffsList.BalanceByForceBuff.dataset.time = '';
	} else {
		buffsList.BolgStacksBuff.classList.remove('inactive');
		buffsList.BalanceByForceBuff.classList.remove('inactive');
	}
	await new Promise((done) => setTimeout(done, 10));
	return bolgStacksData;
}

let posBtn = getByID('OverlayPosition');
posBtn.addEventListener('click', setOverlayPosition);
async function setOverlayPosition() {
	let bbb = getByID('Buffs');
	a1lib.once('alt1pressed', updateLocation);
	updateSetting('updatingOverlayPosition', true);
	while (getSetting('updatingOverlayPosition')) {
		alt1.overLaySetGroup('overlayPositionHelper');
		alt1.overLayRect(
			a1lib.mixColor(255, 255, 255),
			Math.floor(
				a1lib.getMousePosition().x -
					((getSetting('uiScale') / 100) * bbb.offsetWidth) / 2
			),
			Math.floor(
				a1lib.getMousePosition().y -
					((getSetting('uiScale') / 100) * bbb.offsetHeight) / 2
			),
			Math.floor((getSetting('uiScale') / 100) * bbb.offsetWidth),
			Math.floor((getSetting('uiScale') / 100) * bbb.offsetHeight),
			200,
			2
		);
			await new Promise((done) => setTimeout(done, 200));
	}
}

function updateLocation(e) {
	let bbb = getByID('Buffs');
	updateSetting('overlayPosition', {
		x: Math.floor(
			e.x - (getSetting('uiScale') / 100) * (bbb.offsetWidth / 2)
		),
		y: Math.floor(
			e.y - (getSetting('uiScale') / 100) * (bbb.offsetHeight / 2)
		),
	});
	updateSetting('updatingOverlayPosition', false);
	alt1.overLayClearGroup('overlayPositionHelper');
}

export async function startOverlay() {
    let cnv = document.createElement('canvas');
	let ctx = cnv.getContext('2d', {"willReadFrequently": true});
	let overlay = <HTMLCanvasElement>document.getElementsByTagName('canvas')[0];

	while (true) {
		cnv.width = 1000;
		cnv.height = 1000;

		captureOverlay();

		let overlayPosition = getSetting('overlayPosition');

		alt1.overLaySetGroup('betterBuffsBar');
		alt1.overLayFreezeGroup('betterBuffsBar');
		/* If I try and use the overlay instead of copying the overlay it doesn't work. No idea why. */
		ctx.drawImage(overlay, 0, 0);

		let data = ctx.getImageData(
			0,
			0,
			helperItems.BetterBuffsBar.offsetWidth,
			helperItems.BetterBuffsBar.offsetHeight
		);
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
	}
	loadSettings();
}

function setDefaultSettings() {
	localStorage.setItem(
		'betterBuffBar',
		JSON.stringify({
			activeOverlay: true,
			bigHeadMode: false,
			bigHeadPosition: 'start',
			buffsLocation: findPlayerBuffs,
			buffsPerRow: 5,
			debuffsLocation: findPlayerDebuffs,
			fadeInactiveBuffs: true,
			loopSpeed: 150,
			showBuffNames: false,
			showTooltipReminders: true,
			overlayPosition: { x: 100, y: 100 },
			uiScale: 100,
			updatingOverlayPosition: false,
		})
	);
}

function loadSettings() {
	setBuffsPerRow();
	setBigHeadMode();
	setBuffNames();
	showTooltipReminders();
	setSortables();
	setFadeInactiveBuffs();
	setCustomScale();
	setOverlay();
	setLoopSpeed();
	findPlayerBuffs();
	findPlayerDebuffs();
}

function setSortables() {
	const sortables = ['Buffs', 'UntrackedBuffs'];
	// Create the sortables
	sortables.forEach((sortable) => {
		const el = getByID(sortable);

		Sortable.create(el, {
			group: 'trackedBuffs',
			multiDrag: true,
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
		const parent = getByID(sortable);
		const itemOrder = localStorage.getItem(sortable);
		const itemOrderArr = itemOrder ? itemOrder.split('|') : [];

		let prevItem;
		itemOrderArr.forEach((item) => {
			const child = getByID(item);
			if (!prevItem) {
				parent.insertBefore(child, parent.firstChild);
			} else {
				const prevChild = getByID(prevItem);
				prevChild.parentNode.insertBefore(child, prevChild.nextSibling);
			}
			prevItem = item;
		});
	});
}

function setBuffsPerRow() {
	let buffsTracker = getByID('Buffs');
	let buffsPerRowInput = <HTMLInputElement>getByID('BuffsPerRow');
	let buffsPerRow = getSetting('buffsPerRow');
	buffsTracker.style.setProperty('--maxcount', getSetting('buffsPerRow'));
	setGridSize();

	buffsPerRowInput.value = buffsPerRow;
	buffsPerRowInput.addEventListener('change', (e) => {
		updateSetting('buffsPerRow', buffsPerRowInput.value);
		buffsTracker.style.setProperty('--maxcount', getSetting('buffsPerRow'));
		setGridSize();
		setBigHeadGrid();
	});
}

function setGridSize() {
	helperItems.TrackedBuffs.style.gridTemplateAreas = `
	"${'. '.repeat(getSetting('buffsPerRow'))}"
	"${'. '.repeat(getSetting('buffsPerRow'))}"
	"${'. '.repeat(getSetting('buffsPerRow'))}"
	"${'. '.repeat(getSetting('buffsPerRow'))}"
	"${'. '.repeat(getSetting('buffsPerRow'))}"
	`;
}

function setBigHeadMode() {
	let setBigHeadMode = <HTMLInputElement>
		getByID('SetBigHeadMode');
		let bigHeadPosition = <HTMLSelectElement>(
			getByID('BigHeadPosition')
		);
	setCheckboxChecked(setBigHeadMode);
	helperItems.BetterBuffsBar.classList.toggle(
		'big-head-mode',
		Boolean(getSetting('bigHeadMode'))
	);
	setBigHeadGrid();
	setBigHeadMode.addEventListener('change', function () {
		helperItems.BetterBuffsBar.classList.toggle(
			'big-head-mode',
			Boolean(getSetting('bigHeadMode'))
		);
		setBigHeadGrid();
	});
	bigHeadPosition.value = getSetting('bigHeadPosition');
	bigHeadPosition.addEventListener('change', (e) => {
		updateSetting('bigHeadPosition', bigHeadPosition.value);
		setBigHeadGrid();
	});
}

function setBigHeadGrid() {
	if (getSetting('bigHeadMode') && getSetting('bigHeadPosition') == "start") {
		helperItems.TrackedBuffs.style.gridTemplateAreas = `
		"first first ${'. '.repeat(getSetting('buffsPerRow'))}"
		"first first ${'. '.repeat(getSetting('buffsPerRow'))}"
		". . ${'. '.repeat(getSetting('buffsPerRow'))}"
		". . ${'. '.repeat(getSetting('buffsPerRow'))}"
		". . ${'. '.repeat(getSetting('buffsPerRow'))}"
		`;
	}
	if (
		getSetting('bigHeadMode') && getSetting('bigHeadPosition') == 'end'
	) {
		helperItems.TrackedBuffs.style.gridTemplateAreas = `
		"${'. '.repeat(getSetting('buffsPerRow'))}first first"
		"${'. '.repeat(getSetting('buffsPerRow'))}first first"
		". . ${'. '.repeat(getSetting('buffsPerRow'))}"
		". . ${'. '.repeat(getSetting('buffsPerRow'))}"
		". . ${'. '.repeat(getSetting('buffsPerRow'))}"
		`;
	}
}

function setBuffNames() {
	let showBuffNames = <HTMLInputElement>(
		document.querySelectorAll('.show-labels')[0]
	);
	setCheckboxChecked(showBuffNames);
	helperItems.BetterBuffsBar.classList.toggle(
		'show-labels',
		Boolean(getSetting('showBuffNames'))
	);
	showBuffNames.addEventListener('change', function () {
		helperItems.BetterBuffsBar.classList.toggle(
			'show-labels',
			Boolean(getSetting('showBuffNames'))
		);
	});
}

function showTooltipReminders() {
	let showTooltipReminders = <HTMLInputElement>(
		document.querySelectorAll('.show-tooltip-reminders')[0]
	);
	setCheckboxChecked(showTooltipReminders);
}

function setFadeInactiveBuffs() {
	let fadeInactiveBuffs = <HTMLInputElement>document.querySelectorAll('.fade-inactive')[0];
	setCheckboxChecked(fadeInactiveBuffs);
	helperItems.BetterBuffsBar.classList.toggle(
		'fade',
		Boolean(getSetting('fadeInactiveBuffs'))
	);
	fadeInactiveBuffs.addEventListener('change', function () {
		helperItems.BetterBuffsBar.classList.toggle(
			'fade',
			Boolean(getSetting('fadeInactiveBuffs'))
		);
	});
}

function setCustomScale() {
	let buffsTracker = getByID('Buffs');
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
	let showOverlay = <HTMLInputElement>getByID('ShowOverlay');
	setCheckboxChecked(showOverlay);
	helperItems.BetterBuffsBar.classList.toggle(
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

	let loopSpeed = <HTMLInputElement>getByID('LoopSpeed');
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
}


let foundBuffs = false;
function getActiveBuffs() {
	if (foundBuffs && getSetting('buffsLocation')) {
		return buffs.read();
	} else {
		findPlayerBuffs();
	}
}


function findPlayerBuffs() {
	if (buffs.find()) {
		foundBuffs = true;
		return updateSetting('buffsLocation', [buffs.pos.x, buffs.pos.y]);
	}
}

let foundDebuffs = false;
function getActiveDebuffs() {
	if (foundDebuffs && getSetting('debuffsLocation')) {
		return debuffs.read();
	} else {
		findPlayerDebuffs();
	}
}

function findPlayerDebuffs() {
	if (debuffs.find()) {
		foundDebuffs = true;
		return updateSetting('debuffsLocation', [debuffs.pos.x, debuffs.pos.y]);
	}
}

function roundedToFixed(input, digits) {
	var rounder = Math.pow(10, digits);
	return (Math.round(input * rounder) / rounder).toFixed(digits);
}

/* Settings */

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
		loadSettings();
	});
});

var loopSpeed: any = document.querySelector('#LoopSpeed');
loopSpeed.addEventListener('change', (event) => {
	updateSetting('loopSpeed', event.target.value);
});

let resetAllSettingsButton = getByID('ResetAllSettings');
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
		helperItems.Output.insertAdjacentHTML(
			'beforeend',
			`
			Alt1 not detected, click <a href='${addappurl}'>here</a> to add this app to Alt1
		`
		);
	}
};
