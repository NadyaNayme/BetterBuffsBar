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
	ToggleOverlayButton: getByID('ToggleOverlayButton')
}

let buffsList = {
	AnimateDeadBuff: getByID('AnimateDeadBuff'),
	BalanceByForceBuff: getByID('BalanceByForceBuff'),
	BolgStacksBuff: getByID('BolgStacksBuff'),
	DarknessBuff: getByID('DarknessBuff'),
	ElderOverloadBuff: getByID('ElderOverloadBuff'),
	FsoaSpecBuff: getByID('FsoaSpecBuff'),
	GladiatorsRageBuff: getByID('GladiatorsRageBuff'),
	NecrosisBuff: getByID('NecrosisBuff'),
	OverloadBuff: getByID('OverloadBuff'),
	TimeRiftBuff: getByID('TimeRiftBuff'),
	WeaponPoisonBuff: getByID('WeaponPoisonBuff'),
	Aura: getByID('Aura'),
	BonfireBoost: getByID('BonfireBoost'),
	ErethdorsGrimoire: getByID('ErethdorsGrimoire'),
	LantadymeIncense: getByID('LantadymeIncense'),
	DwarfWeedIncense: getByID('DwarfWeedIncense'),
	FellstalkIncense: getByID('FellstalkIncense'),
	KwuarmIncense: getByID('KwuarmIncense'),
};

let debuffsList = {
	AdrenalinePotionDebuff: getByID('AdrenalinePotionDebuff'),
	AncientElvenRitualShardDebuff: getByID('AncientElvenRitualShardDebuff'),
	CrystalRainDebuff: getByID('CrystalRainDebuff'),
	DeathGuardDebuff: getByID('DeathGuardDebuff'),
	EnhancedExcaliburDebuff: getByID('EnhancedExcaliburDebuff'),
	OmniGuardDebuff: getByID('OmniGuardDebuff'),
};

let sigilsList = {
	DemonSlayer: getByID('DemonSlayerSigil'),
	DragonSlayer: getByID('DragonSlayerSigil'),
	IngenuityOfTheHumans: getByID('IngenuityOfTheHumansSigil'),
	LimitlessSigil: getByID('LimitlessSigil'),
	UndeadSlayer: getByID('UndeadSlayerSigil'),
};

let prayersList = {
	DpsPrayer: getByID('DpsPrayer'),
	OverheadPrayer: getByID('OverheadPrayer'),
};

let ultimatesList = {
	Berserk: getByID('BerserkUltimate'),
	DeathsSwiftness: getByID('DeathsSwiftnessUltimate'),
	GreaterDeathsSwiftness: getByID('GreaterDeathsSwiftnessUltimate'),
	GreaterSunshine: getByID('GreaterSunshineUltimate'),
	LivingDeath: getByID('LivingDeathUltimate'),
	Sunshine: getByID('SunshineUltimate'),
};

// loads all images as raw pixel data async, images have to be saved as *.data.png
// this also takes care of metadata headers in the image that make browser load the image
// with slightly wrong colors
// this function is async, so you cant acccess the images instantly but generally takes <20ms
// use `await imgs.promise` if you want to use the images as soon as they are loaded
var buffImages = a1lib.webpackImages({
	animateDead: require('./asset/data/Animate_Dead-noborder.data.png'),
	antifireActive: require('./asset/data/Anti-Fire_Active-noborder.data.png'),
	antipoisonActive: require('./asset/data/Anti-poison_Active-noborder.data.png'),
	chronicleAttraction: require('./asset/data/Chronicle_Attraction-noborder.data.png'),
	darkness: require('./asset/data/Darkness-noborder.data.png'),
	elderOverload: require('./asset/data/Elder_Overload-noborder.data.png'),
	fsoaWeaponSpec: require('./asset/data/fsoaSpecBuff-noborder.data.png'),
	gladiatorsRage: require('./asset/data/Gladiators_Rage-noborder.data.png'),
	necrosis: require('./asset/data/Necrosis-noborder.data.png'),
	overloaded: require('./asset/data/Overloaded-noborder.data.png'),
	overloadedNoBorder: require('./asset/data/Overloaded-noborder.data.png'),
	perfectEquilibrium: require('./asset/data/Perfect_Equilibrium-noborder.data.png'),
	perfectEquilibriumNoBorder: require('./asset/data/Perfect_Equilibrium-noborder.data.png'),
	poisonous: require('./asset/data/Poisonous-top-noborder.data.png'),
	prayerRenewActive: require('./asset/data/Prayer_Renew_Active-noborder.data.png'),
	superAntifireActive: require('./asset/data/Super_Anti-Fire_Active-noborder.data.png'),
	supremeOverloadActive: require('./asset/data/Supreme_Overload_Potion_Active-noborder.data.png'),
	timeRift: require('./asset/data/Time_Rift-noborder.data.png'),
	aura: require('./asset/data/Aura-noborder.data.png'),
	bonfireBoost: require('./asset/data/Bonfire_Boost-noborder.data.png'),
	grimoire: require("./asset/data/Erethdor's_grimoire-noborder.data.png"),
});

var incenseImages = a1lib.webpackImages({
	lantadyme: require('./asset/data/Lantadyme.data.png'),
	dwarfWeed: require('./asset/data/Dwarf_Weed.data.png'),
	fellstalk: require('./asset/data/Fellstalk.data.png'),
	kwuarm: require('./asset/data/Kwuarm.data.png'),
});

var debuffImages = a1lib.webpackImages({
	adrenalinePotion: require('./asset/data/Adrenaline_Potion-noborder.data.png'),
	crystalRainMinimal: require('./asset/data/Crystal_Rain-minimal-noborder.data.png'),
	deathEssenceDebuff: require('./asset/data/Omni_Guard_Special-top-noborder.data.png'),
	deathGraspDebuff: require('./asset/data/Death_Guard_Special-top-noborder.data.png'),
	elvenRitualShard: require('./asset/data/Ancient_Elven_Ritual_Shard-noborder.data.png'),
	enhancedExcaliburDebuff: require('./asset/data/EE_scuffed-top-noborder.data.png'),
});

var ultimateImages = a1lib.webpackImages({
	berserk: require('./asset/data/Berserk-noborder.data.png'),
	deathsSwiftness: require("./asset/data/Death's_Swiftness-noborder.data.png"),
	greaterDeathsSwiftness: require("./asset/data/Greater_Death's_Swiftness-noborder.data.png"),
	greaterSunshine: require('./asset/data/Greater_Sunshine-noborder.data.png'),
	livingDeath: require('./asset/data/Living_Death-noborder.data.png'),
	sunshine: require('./asset/data/Sunshine-noborder.data.png'),
});

var sigilImages = a1lib.webpackImages({
	demonSlayer: require('./asset/data/Demon_Slayer-noborder.data.png'),
	dragonSlayer: require('./asset/data/Dragon_Slayer-noborder.data.png'),
	ingenuityOfTheHumans: require('./asset/data/Ingenuity_of_the_Humans-noborder.data.png'),
	limitless: require('./asset/data/Limitless-noborder.data.png'),
	undeadSlayer: require('./asset/data/Undead_Slayer-noborder.data.png'),
});

var prayerImages = a1lib.webpackImages({
	affliction: require('./asset/data/Affliction-noborder.data.png'),
	anguish: require('./asset/data/Anguish-noborder.data.png'),
	deflectMagic: require('./asset/data/Deflect_Magic-noborder.data.png'),
	deflectMelee: require('./asset/data/Deflect_Melee-noborder.data.png'),
	deflectNecromancy: require('./asset/data/Deflect_Necromancy-noborder.data.png'),
	deflectRanged: require('./asset/data/Deflect_Ranged-noborder.data.png'),
	desolation: require('./asset/data/Desolation-noborder.data.png'),
	malevolence: require('./asset/data/Malevolence-noborder.data.png'),
	prayerActive: require('./asset/data/Prayer_active-noborder.data.png'),
	protectFromMagic: require('./asset/data/Protect_from_Magic-noborder.data.png'),
	protectFromMelee: require('./asset/data/Protect_from_Melee-noborder.data.png'),
	protectFromNecromancy: require('./asset/data/Protect_from_Necromancy-noborder.data.png'),
	protectFromRanged: require('./asset/data/Protect_from_Ranged-noborder.data.png'),
	ruination: require('./asset/data/Ruination-noborder.data.png'),
	sorrow: require('./asset/data/Sorrow-noborder.data.png'),
	soulSplit: require('./asset/data/Soul_Split-noborder.data.png'),
	torment: require('./asset/data/Torment-noborder.data.png'),
	turmoil: require('./asset/data/Turmoil-noborder.data.png'),
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
			findStatus(buffs, buffImages.elderOverload, buffsList.ElderOverloadBuff, 100, true);
			findStatus(buffs, buffImages.poisonous, buffsList.WeaponPoisonBuff, 300, true);
			findStatus(buffs, buffImages.darkness, buffsList.DarknessBuff, 400, false, 0, 43260);
			findStatus(buffs, buffImages.animateDead, buffsList.AnimateDeadBuff, 90);
			findStatus(buffs, buffImages.fsoaWeaponSpec, buffsList.FsoaSpecBuff, 80, false, 0, 31);
			findStatus(buffs, buffImages.timeRift, buffsList.TimeRiftBuff, 450);
			findStatus(buffs, buffImages.gladiatorsRage, buffsList.GladiatorsRageBuff, 50, false, 0, 16);
			findStatus(buffs, buffImages.necrosis, buffsList.NecrosisBuff, 150);
			findStatus(buffs, buffImages.aura, buffsList.Aura, 500);
			findStatus(buffs, buffImages.bonfireBoost, buffsList.BonfireBoost, 400);
			findStatus(buffs, buffImages.grimoire, buffsList.ErethdorsGrimoire, 55);

			findStatus(buffs, incenseImages.lantadyme, buffsList.LantadymeIncense, 119);
			findStatus(buffs, incenseImages.dwarfWeed, buffsList.DwarfWeedIncense, 150);
			findStatus(buffs, incenseImages.fellstalk, buffsList.FellstalkIncense, 150);
			findStatus(buffs, incenseImages.kwuarm, buffsList.KwuarmIncense, 150);

			findStatus(buffs, sigilImages.limitless, sigilsList.LimitlessSigil, 250, false, 0, Infinity, true, 83);
			findStatus(buffs, sigilImages.demonSlayer, sigilsList.DemonSlayer, 400, false, 0, Infinity, true, 50);
			findStatus(buffs, sigilImages.dragonSlayer, sigilsList.DragonSlayer, 400, false, 0, Infinity, true, 50);
			findStatus(buffs, sigilImages.undeadSlayer, sigilsList.UndeadSlayer, 400, false, 0, Infinity, true, 50);
			findStatus(buffs, sigilImages.ingenuityOfTheHumans, sigilsList.IngenuityOfTheHumans, 400, false, 0, Infinity, true, 83);

			/* BOLG is currently still special */
			if (document.querySelectorAll('#Buffs #BolgStacksBuff').length) {
				findBolgStacks(buffs);
			}

			findStatus(buffs, ultimateImages.berserk, ultimatesList.Berserk, 100, false, 0, Infinity, true, 40);
			findStatus(buffs, ultimateImages.deathsSwiftness, ultimatesList.DeathsSwiftness, 110, false, 0, Infinity, true, 30);
			findStatus(buffs, ultimateImages.greaterDeathsSwiftness, ultimatesList.GreaterDeathsSwiftness, 100, false, 0, Infinity, true, 23);
			findStatus(buffs, ultimateImages.sunshine, ultimatesList.Sunshine, 500, false, 0, Infinity, true, 30);
			findStatus(buffs, ultimateImages.greaterSunshine, ultimatesList.GreaterSunshine, 100, false, 0, Infinity, true, 23);
			findStatus(buffs, ultimateImages.livingDeath, ultimatesList.LivingDeath, 400, false, 0, Infinity, true, 60);

			checkBuffsForHidingOverlay(buffs);

		} else {
			noDetection(maxAttempts, interval, "buff");
		}
		if (getSetting('debuffsLocation')) {
			maxAttempts = 10;
			findStatus(debuffs, debuffImages.elvenRitualShard, debuffsList.AncientElvenRitualShardDebuff, 90);
			findStatus(debuffs, debuffImages.adrenalinePotion, debuffsList.AdrenalinePotionDebuff, 300);
			findStatus(debuffs, debuffImages.deathGraspDebuff, debuffsList.DeathGuardDebuff, 90);
			findStatus(debuffs, debuffImages.deathEssenceDebuff, debuffsList.OmniGuardDebuff, 60);
			findStatus(debuffs, debuffImages.enhancedExcaliburDebuff, debuffsList.EnhancedExcaliburDebuff, 15);
			findStatus(debuffs, debuffImages.crystalRainMinimal, debuffsList.CrystalRainDebuff, 60);

			findPrayer(buffs, debuffs); // Not accurate enough to work - Affliction matches Sorrow better than Sorrow matches Sorrow.
		} else {
			noDetection(maxAttempts, interval, "debuff");
		}
	}, loopSpeed);
}

async function checkBuffsForHidingOverlay(buffsReader: BuffReader.Buff[]) {
	// Attempt to hide the overlay if we have 0 buffs
	if (Object.entries(buffsReader).length == 0) {
		helperItems.BetterBuffsBar.classList.add('hide-overlay');
	} else if (helperItems.BetterBuffsBar.classList.contains('hide-overlay')) {
		helperItems.BetterBuffsBar.classList.remove('hide-overlay');
	}
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
	let highlander = [];

	if (buffImage == buffImages.gladiatorsRage) {
		for (let [_key, value] of Object.entries(buffsReader)) {
			let findBuffImage = value.countMatch(buffImage, false);
			if (findBuffImage.passed > threshold) {
				highlander.push(foundBuff);
			}
		}
	}

	for (let [_key, value] of Object.entries(buffsReader)) {
		if (foundBuff) {
			return;
		}

		if (highlander.length == 1) {
			setInactive(buffsList.GladiatorsRageBuff);
		}

		if (highlander.length != 2 && buffImage == buffImages.gladiatorsRage) {
			return;
		}

		let findBuffImage = value.countMatch(buffImage, false);
		if (getSetting('debugLevel') == 1 && buffImage == incenseImages.kwuarm) {
			console.log(findBuffImage)
		}
			if (findBuffImage.passed > threshold || findBuffImage.failed == 0) {
				// If we find a match for the buff it will always exceed the threshold
				// the threshold depends largely on which buff is being matched against
				foundBuff = true;
				await setActive(element);
				timearg = value.readArg('timearg');
				if (getSetting('debugLevel') == 1 && buffImage == incenseImages.dwarfWeed) {
					console.log(timearg.time)
					console.log(timearg);
				}
				if (
					element.dataset.time == '1' &&
					showCooldown &&
					!onCooldown
				) {
					if (getSetting('debugMode')) {
						console.log(
							`Starting cooldown timer for ${element.id}`
						);
					}
					onCooldown = true;
					await startCooldownTimer(element, cooldownTimer);
					return;
				} else if (
					timearg.time > 59 &&
					!onCooldown &&
					timearg.time < maxRange
				) {
					if (getSetting('debugMode')) {
						console.log(`${element.id} has >60s remaining`);
					}
					element.dataset.time =
						Math.floor(
							value.readArg('timearg').time / 60
						).toString() + 'm';

					// Pause the check for a tick since we don't need to rapidly update
					//a buff that won't have a more precise value for 1 minute
					await new Promise((done) => setTimeout(done, 600));
				} else if (
					expirationPulse &&
					timearg.time == 11 &&
					!onCooldown
				) {
					if (getSetting('debugMode')) {
						console.log(
							`${element.id} has <10s remaining - starting 10s countdown`
						);
					}
					element.dataset.time = '<10s';
					await setActive(element);
					// This can be desynced from in-game 10s but it's accurate enough
					await new Promise((done) => setTimeout(done, 10000));
					await setInactive(element);
					if (getSetting('showTooltipReminders')) {
						showTooltip('Overload expired', 3000);
					}
				} else if (timearg.time > minRange && timearg.time < maxRange) {
					if (getSetting('debugMode')) {
						console.log(
							`Cooldown for ${element.id} is between ${minRange} and ${maxRange}`
						);
					}
					element.dataset.time = timearg.time.toString();
					if (timearg.time - 1 == 0 && !showCooldown) {
						await setInactive(element);
					}
				} else {
					if (getSetting('debugMode')) {
						console.log(
							`${element.id} is no longer active - setting inactive.`
						);
					}
					await setInactive(element);
				}
			} else if (!showCooldown) {
				if (getSetting('debugMode')) {
					console.log(
						`${element.id} is no longer active - setting inactive.`
					);
				}
				await setInactive(element);
			}
	}
	// If we didn't find the buff try again after a brief timeout
	if (timearg == undefined && foundBuff) {
		// The FoundBuff ensures we don't wait 10s to add inactive when BBB first loads
		if (expirationPulse) {
			await new Promise((done) => setTimeout(done, 10000));
		}
		await setInactive(element);
	}
	// Give a very brief pause before checking again
	await new Promise((done) => setTimeout(done, 10));
	return timearg;
};

let runOnlyOnce;
async function startCooldownTimer(element: HTMLElement, cooldownTimer: number) {
		/*
		* Wait the final 1s then set buff to 'cooldown' state
		* After its cooldown has finished set it back to 'inactive' state (actually 'readyToBeUsed')
		*/
		await new Promise((done) => setTimeout(done, 1000));
		await setCooldown(element, cooldownTimer);
		if (element.dataset.cooldown != '' && !runOnlyOnce) {
			runOnlyOnce = true;
			element.dataset.cooldown = (cooldownTimer).toString();
			await new Promise((done) => setTimeout(done, 1000));
			let timer = setInterval(() => {
				countdown(element, cooldownTimer, timer);
			}, 1000);
			await new Promise((done) => setTimeout(done, 3000));
			runOnlyOnce = false;
			await new Promise((done) => setTimeout(done, (cooldownTimer * 1000) - 3000));
			clearInterval(timer);
		}
		return false;
}

function countdown(element: HTMLElement, cooldownTimer: number, timer: any) {
	if (parseInt(element.dataset.cooldown, 10) > 0) {
		element.dataset.cooldown = (
			parseInt(element.dataset.cooldown, 10) - 1
		).toString();
	} else {
		clearInterval(timer);
		runOnlyOnce = false;
		setInactive(element);
	}
}

async function findPrayer(buffsList: BuffReader.Buff[], debuffsList: BuffReader.Buff[]) {
	if (
		!getByID('Buffs').contains(prayersList.OverheadPrayer) ||
		!getByID('Buffs').contains(prayersList.DpsPrayer) ||
		!buffsList ||
		!debuffsList
	) {
		return;
	}

	let prayersActive: number = 0;
	let lastActiveOverhead;
	let lastActiveDPS;

	for (let [_key, value] of Object.entries(debuffsList)) {
		let prayerDraining = value.countMatch(prayerImages.prayerActive, false);
		if (prayerDraining.failed == 0 || prayerDraining.passed > 44) {
			prayersActive++;
		}
	}

	if (prayersActive > 0) {
		for (let [_key, value] of Object.entries(buffsList)) {
			lastActiveDPS = testDpsPrayers(value);
			lastActiveOverhead = testOverheadPrayers(value);
		}
	} else {
		prayersList.DpsPrayer.dataset.prayer = "";
		prayersList.OverheadPrayer.dataset.prayer = '';
		prayersList.DpsPrayer.classList.add('inactive');
		prayersList.OverheadPrayer.classList.add('inactive');
	}
}

async function testDpsPrayers(buff: BuffReader.Buff) {
	if (getByID('Buffs').contains(prayersList.DpsPrayer)) {
		let affliction = buff.countMatch(prayerImages.affliction, false);
		let anguish = buff.countMatch(prayerImages.anguish, false);
		let desolation = buff.countMatch(prayerImages.desolation, false);
		let malevolence = buff.countMatch(prayerImages.malevolence, false);
		let ruination = buff.countMatch(prayerImages.ruination, false);
		let sorrow = buff.countMatch(prayerImages.sorrow, false);
		let torment = buff.countMatch(prayerImages.torment, false);
		let turmoil = buff.countMatch(prayerImages.turmoil, false);
		let prayerTests = {
			affliction: affliction.passed,
			anguish: anguish.passed,
			desolation: desolation.passed,
			malevolence: malevolence.passed,
			ruination: ruination.passed,
			sorrow: sorrow.passed,
			torment: torment.passed,
			turmoil: turmoil.passed,
		};
		for (let [key, value] of Object.entries(prayerTests)) {
			if (value > 300) {
				prayersList.DpsPrayer.dataset.prayer = key.toString().toLowerCase();
				prayersList.DpsPrayer.classList.remove('inactive');
			}
		}
	}
}

async function testOverheadPrayers(buff: BuffReader.Buff) {
	if (getByID('Buffs').contains(prayersList.OverheadPrayer)) {
		/* Overhead Prayers */
		let deflectMagic = buff.countMatch(prayerImages.deflectMagic, false);
		let deflectMelee = buff.countMatch(prayerImages.deflectMelee, false);
		let deflectNecromancy = buff.countMatch(prayerImages.deflectNecromancy, false);
		let deflectRanged = buff.countMatch(prayerImages.deflectRanged, false);
		let protectFromMagic = buff.countMatch(prayerImages.protectFromMagic, false);
		let protectFromMelee = buff.countMatch(prayerImages.protectFromMelee, false);
		let protectFromNecromancy = buff.countMatch(prayerImages.protectFromNecromancy, false);
		let protectFromRanged = buff.countMatch(prayerImages.protectFromRanged, false);
		let soulSplit = buff.countMatch(prayerImages.soulSplit, false);
		let prayerTests = {
			deflectMagic: deflectMagic.passed,
			deflectMelee: deflectMelee.passed,
			deflectNecromancy: deflectNecromancy.passed,
			deflectRanged: deflectRanged.passed,
			protectFromMagic: protectFromMagic.passed,
			protectFromMelee: protectFromMelee.passed,
			protectFromNecromancy: protectFromNecromancy.passed,
			protectFromRanged: protectFromRanged.passed,
			soulSplit: soulSplit.passed,
		};

		for (let [key, value] of Object.entries(prayerTests)) {
			if (value > 300) {
				prayersList.OverheadPrayer.dataset.prayer = key
					.toString()
					.toLowerCase();
				prayersList.OverheadPrayer.classList.remove('inactive');
			}
		}
	}
}

function getMaxValueKey(obj: { [key: string]: number }): string {
	return Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b));
}

async function setCooldown(element: HTMLElement, cooldownTimer: number) {
	element.classList.remove('inactive');
	element.classList.remove('active');
	element.classList.add('cooldown');
	element.dataset.time = '';
	element.dataset.cooldown = cooldownTimer.toString();
}

async function setInactive(element: HTMLElement) {
	element.classList.add('inactive');
	element.classList.remove('active');
	element.classList.remove('cooldown');
	element.dataset.time = '';
	element.dataset.cooldown = '';
}

async function setActive(element: HTMLElement) {
	element.classList.remove('cooldown');
	element.classList.remove('inactive');
	element.classList.add('active');
}


let bolgSpecActive = false;
async function findBolgStacks(buffs: BuffReader.Buff[]) {
	let bolgStacksData;
	let bolgFound = false;
	/* Taking from the BOLG Plugin <https://holycoil.nl/alt1/bolg/index.bundle.js>
	   the Zamorak mechanic is always the first so we need to reverse the buffs first
	 */

	if (!getSetting('singleBOLG')) {
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
				if (buffs[a].compareBuffer(buffImages.perfectEquilibriumNoBorder)) {
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
	} else {
		for (let [_key, value] of Object.entries(buffs).reverse()) {
			let bolgStacksBuff = value.countMatch(
				buffImages.perfectEquilibrium,
				false
			);
			if (bolgStacksBuff.passed > 200) {
				bolgFound = true;
				bolgStacksData = value.readArg('arg').arg;
				let bolgData = await parseBolgBuff(bolgStacksData);
				console.log(bolgData);
				let bolgTime = bolgData[0];
				let bolgStacks = bolgData[1];
				buffsList.BolgStacksBuff.dataset.time = bolgStacks;
				buffsList.BalanceByForceBuff.dataset.time = bolgTime;
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
	}
	await new Promise((done) => setTimeout(done, 10));
	return bolgStacksData;
}

async function parseBolgBuff(data: string) {
	let bolgSpecTime;
	let bolgStacks;
	let buffRegexp = /(?<time>\d{1,2})(.*\((?<stacks>\d)\))?/g;
	let results = Array.from(data.matchAll(buffRegexp));
	if (results[0]) {
		console.log(`Results: ${data}`);
		// We have stacks guaranteed
		if (data.indexOf('(') > -1) {
			bolgSpecActive = true;
			bolgSpecTime = results[0].groups.time;
			bolgStacks = results[0].groups.stacks;
		} else if (parseInt(data, 10) == 30) {
			bolgSpecActive = true;
			bolgSpecTime = '30';
			bolgStacks = results[0].groups.stacks;
			await new Promise((done) => setTimeout(done, 30000));
			bolgSpecActive = false;
		} else if (bolgSpecActive) {
			bolgSpecTime = results[0].groups.time || 0;
			bolgStacks = '0';
		} else if (!bolgSpecActive) {
			if (parseInt(results[0].groups.time, 10) > 8) {
				bolgSpecTime = results[0].groups.time;
				bolgStacks = '0';
				bolgSpecActive = true;
				await new Promise((done) =>
					setTimeout(done, parseInt(results[0].groups.time, 10) * 1000)
				);
				bolgSpecActive = false;
			} else {
				bolgSpecTime = '';
				bolgStacks = results[0].groups.time || 0;
			}
		}
	}
	if (bolgSpecTime == undefined || bolgStacks == undefined) {
		return ['', ''];
	}
	return [bolgSpecTime, bolgStacks];
}

let posBtn = getByID('OverlayPosition');
posBtn.addEventListener('click', setOverlayPosition);
async function setOverlayPosition() {
	let bbb = getByID('Buffs');
	a1lib.once('alt1pressed', updateLocation);
	updateSetting('updatingOverlayPosition', true);
	while (getSetting('updatingOverlayPosition')) {
		alt1.setTooltip('Press Alt+1 to set overlay position.')
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
			Math.floor((getSetting('uiScale') / 100) * bbb.offsetWidth / 2),
			Math.floor((getSetting('uiScale') / 100) * bbb.offsetHeight / 1.5),
			200,
			2
		);
			await new Promise((done) => setTimeout(done, 200));
	}
	alt1.clearTooltip();
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
			buffsPerRow: 10,
			debuffsLocation: findPlayerDebuffs,
			fadeInactiveBuffs: true,
			loopSpeed: 150,
			singleBOLG: false,
			showBuffNames: false,
			showMaintainableBlinking: false,
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
	setSingleBolg();
	setBuffNames();
	showMaintainableBlinking();
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
	let buffsCount = helperItems.TrackedBuffs.querySelectorAll('li').length;
	let maxLength = parseInt(helperItems.TrackedBuffs.style.getPropertyValue('--maxcount'), 10);
	let rowsToGenerate = parseInt(roundedToFixed(buffsCount / maxLength, 1) + 1, 10);
	helperItems.TrackedBuffs.style.gridTemplateAreas = `"${'. '.repeat(getSetting('buffsPerRow'))}"`.repeat(rowsToGenerate);
	helperItems.TrackedBuffs.style.gridTemplateRows = `repeat(${rowsToGenerate+1}, calc(30px * clamp(1, (var(--scale) / 100) / 2, 2)))`
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

function setSingleBolg() {
	let singleBolg = <HTMLInputElement>(
		document.querySelectorAll('.single-bolg')[0]
	);
	setCheckboxChecked(singleBolg);
	buffsList.BalanceByForceBuff.classList.toggle(
		'disabled',
		!Boolean(getSetting('singleBOLG'))
	);
	singleBolg.addEventListener('change', function () {
		buffsList.BalanceByForceBuff.classList.toggle(
			'disabled',
			!Boolean(getSetting('singleBOLG'))
		);
		location.reload();
	});
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

function showMaintainableBlinking() {
	let showMaintainableBlinking = <HTMLInputElement>(
		document.querySelectorAll('.show-maintainable-blinking')[0]
	);
	setCheckboxChecked(showMaintainableBlinking);
	helperItems.BetterBuffsBar.classList.toggle(
		'blink-maintainables',
		Boolean(getSetting('showMaintainableBlinking'))
	);
	showMaintainableBlinking.addEventListener('change', function () {
		helperItems.BetterBuffsBar.classList.toggle(
			'blink-maintainables',
			Boolean(getSetting('showMaintainableBlinking'))
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
	helperItems.ToggleOverlayButton.addEventListener('click', (e) => {
		showOverlay.checked = !showOverlay.checked;
		updateSetting('activeOverlay', showOverlay.checked);
		helperItems.BetterBuffsBar.classList.toggle(
			'overlay',
			Boolean(getSetting('activeOverlay'))
		);
		location.reload();
	})
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
