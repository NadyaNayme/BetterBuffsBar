// alt1 base libs, provides all the commonly used methods for image matching and capture
// also gives your editor info about the window.alt1 api
import * as a1lib from 'alt1';
import * as BuffReader from 'alt1/buffs';
import * as sauce from './a1sauce';
import { Sortable, MultiDrag } from 'sortablejs';
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

let config = {
	appName: 'betterBuffBar',
};

let helperItems = {
	Output: getByID('output'),
	settings: getByID('Settings'),
	BetterBuffsBar: getByID('BetterBuffsBar'),
	TrackedBuffs: getByID('Buffs'),
	UntrackedBuffs: getByID('UntrackedBuffs'),
	ToggleOverlayButton: getByID('ToggleOverlayButton'),
};

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
	Anticipation: getByID('Anticipation'),
	Barricade: getByID('Barricade'),
	Devotion: getByID('Devotion'),
	Divert: getByID('Divert'),
	Freedom: getByID('Freedom'),
	Immortality: getByID('Immortality'),
	Reflect: getByID('Reflect'),
	Resonance: getByID('Resonance'),
};

let debuffsList = {
	AdrenalinePotionDebuff: getByID('AdrenalinePotionDebuff'),
	AncientElvenRitualShardDebuff: getByID('AncientElvenRitualShardDebuff'),
	CrystalRainDebuff: getByID('CrystalRainDebuff'),
	DeathGuardDebuff: getByID('DeathGuardDebuff'),
	EnhancedExcaliburDebuff: getByID('EnhancedExcaliburDebuff'),
	OmniGuardDebuff: getByID('OmniGuardDebuff'),
	StunnedDebuff: getByID('StunnedDebuff'),
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
	Anticipation: require('./asset/data/Anticipation.data.png'),
	Barricade: require('./asset/data/Barricade.data.png'),
	Devotion: require('./asset/data/Devotion.data.png'),
	Divert: require('./asset/data/Divert.data.png'),
	Freedom: require('./asset/data/Freedom.data.png'),
	Immortality: require('./asset/data/Immortality.data.png'),
	Reflect: require('./asset/data/Reflect.data.png'),
	Resonance: require('./asset/data/Resonance.data.png'),
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
	stunnedDebuff: require('./asset/data/Stunned.data.png'),
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
	if (!alt1.permissionOverlay) {
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
	let overlayCanvasOutput = getByID('OverlayCanvasOutput');
	let overlayCanvasContext = overlayCanvasOutput
		.querySelector('canvas')
		.getContext('2d', { willReadFrequently: true });
	overlayCanvasContext.clearRect(
		0,
		0,
		overlayCanvasContext.canvas.width,
		overlayCanvasContext.canvas.height
	);
	overlayCanvasContext.drawImage(
		canvas,
		0,
		0,
		sauce.getSetting('uiScale') * 4,
		(sauce.getSetting('uiScale') * 4 * canvas.height) / canvas.width
	);
	let overlay = overlayCanvasOutput.querySelector('canvas');
	sauce.updateSetting('overlayImage', overlay.toDataURL());
	sauce.updateSetting('firstFrame', true);
}

let maxAttempts = 10;
function watchBuffs() {
	let loopSpeed = sauce.getSetting('loopSpeed');
	sauce.updateSetting(
		'firstFrame',
		false
	); /* We haven't captured a new frame yet */
	startOverlay();
	const interval = setInterval(() => {
		let buffs = getActiveBuffs();
		let debuffs = getActiveDebuffs();
		if (sauce.getSetting('buffsLocation')) {
			maxAttempts = 10;

			//TODO: Create buffs object that passes buffImage, element, threshold, expirationPulse, minRange, maxrange, cooldown, and cooldownTimer then loop over the object calling findStatus() on each object
			findStatus(
				buffs,
				buffImages.overloaded,
				buffsList.OverloadBuff,
				300,
				true
			);
			findStatus(
				buffs,
				buffImages.elderOverload,
				buffsList.ElderOverloadBuff,
				80,
				true
			);
			findStatus(
				buffs,
				buffImages.poisonous,
				buffsList.WeaponPoisonBuff,
				300,
				true
			);
			findStatus(
				buffs,
				buffImages.darkness,
				buffsList.DarknessBuff,
				400,
				false,
				0,
				43260
			);
			findStatus(
				buffs,
				buffImages.animateDead,
				buffsList.AnimateDeadBuff,
				90
			);
			findStatus(
				buffs,
				buffImages.fsoaWeaponSpec,
				buffsList.FsoaSpecBuff,
				80,
				false,
				0,
				31
			);
			findStatus(buffs, buffImages.timeRift, buffsList.TimeRiftBuff, 450);
			findStatus(
				buffs,
				buffImages.gladiatorsRage,
				buffsList.GladiatorsRageBuff,
				50,
				false,
				0,
				16
			);
			findStatus(buffs, buffImages.necrosis, buffsList.NecrosisBuff, 150);
			findStatus(buffs, buffImages.aura, buffsList.Aura, 500);
			findStatus(
				buffs,
				buffImages.bonfireBoost,
				buffsList.BonfireBoost,
				400
			);
			findStatus(
				buffs,
				buffImages.grimoire,
				buffsList.ErethdorsGrimoire,
				55
			);

			findStatus(
				buffs,
				incenseImages.lantadyme,
				buffsList.LantadymeIncense,
				119
			);
			findStatus(
				buffs,
				incenseImages.dwarfWeed,
				buffsList.DwarfWeedIncense,
				150
			);
			findStatus(
				buffs,
				incenseImages.fellstalk,
				buffsList.FellstalkIncense,
				150
			);
			findStatus(
				buffs,
				incenseImages.kwuarm,
				buffsList.KwuarmIncense,
				150
			);
			findStatus(
				buffs,
				buffImages.Anticipation,
				buffsList.Anticipation,
				150
			);
			findStatus(buffs, buffImages.Barricade, buffsList.Barricade, 150);
			findStatus(buffs, buffImages.Devotion, buffsList.Devotion, 150);
			findStatus(buffs, buffImages.Divert, buffsList.Divert, 150);
			findStatus(buffs, buffImages.Freedom, buffsList.Freedom, 150);
			findStatus(
				buffs,
				buffImages.Immortality,
				buffsList.Immortality,
				150
			);
			findStatus(buffs, buffImages.Reflect, buffsList.Reflect, 150);
			findStatus(buffs, buffImages.Resonance, buffsList.Resonance, 150);

			findStatus(
				buffs,
				sigilImages.limitless,
				sigilsList.LimitlessSigil,
				250,
				false,
				0,
				Infinity,
				true,
				83
			);
			findStatus(
				buffs,
				sigilImages.demonSlayer,
				sigilsList.DemonSlayer,
				400,
				false,
				0,
				Infinity,
				true,
				50
			);
			findStatus(
				buffs,
				sigilImages.dragonSlayer,
				sigilsList.DragonSlayer,
				400,
				false,
				0,
				Infinity,
				true,
				50
			);
			findStatus(
				buffs,
				sigilImages.undeadSlayer,
				sigilsList.UndeadSlayer,
				400,
				false,
				0,
				Infinity,
				true,
				50
			);
			findStatus(
				buffs,
				sigilImages.ingenuityOfTheHumans,
				sigilsList.IngenuityOfTheHumans,
				400,
				false,
				0,
				Infinity,
				true,
				83
			);

			/* BOLG is currently still special */
			if (document.querySelectorAll('#Buffs #BolgStacksBuff').length) {
				findBolgStacks(buffs);
			}

			findStatus(
				buffs,
				ultimateImages.berserk,
				ultimatesList.Berserk,
				100,
				false,
				0,
				Infinity,
				true,
				40
			);
			findStatus(
				buffs,
				ultimateImages.deathsSwiftness,
				ultimatesList.DeathsSwiftness,
				110,
				false,
				0,
				Infinity,
				true,
				30
			);
			findStatus(
				buffs,
				ultimateImages.greaterDeathsSwiftness,
				ultimatesList.GreaterDeathsSwiftness,
				100,
				false,
				0,
				Infinity,
				true,
				23
			);
			findStatus(
				buffs,
				ultimateImages.sunshine,
				ultimatesList.Sunshine,
				500,
				false,
				0,
				Infinity,
				true,
				30
			);
			findStatus(
				buffs,
				ultimateImages.greaterSunshine,
				ultimatesList.GreaterSunshine,
				100,
				false,
				0,
				Infinity,
				true,
				23
			);
			findStatus(
				buffs,
				ultimateImages.livingDeath,
				ultimatesList.LivingDeath,
				400,
				false,
				0,
				Infinity,
				true,
				60
			);

			checkBuffsForHidingOverlay(buffs);

			if (buffs.length == 0) {
				for (let [_key, buff] of Object.entries(buffsList)) {
					setInactive(buff);
				}
			}
		} else {
			noDetection(maxAttempts, interval, 'buff');
		}
		if (sauce.getSetting('debuffsLocation')) {
			maxAttempts = 10;
			findStatus(
				debuffs,
				debuffImages.elvenRitualShard,
				debuffsList.AncientElvenRitualShardDebuff,
				90
			);
			findStatus(
				debuffs,
				debuffImages.adrenalinePotion,
				debuffsList.AdrenalinePotionDebuff,
				300
			);
			findStatus(
				debuffs,
				debuffImages.deathGraspDebuff,
				debuffsList.DeathGuardDebuff,
				90
			);
			findStatus(
				debuffs,
				debuffImages.deathEssenceDebuff,
				debuffsList.OmniGuardDebuff,
				60
			);
			findStatus(
				debuffs,
				debuffImages.enhancedExcaliburDebuff,
				debuffsList.EnhancedExcaliburDebuff,
				15
			);
			findStatus(
				debuffs,
				debuffImages.crystalRainMinimal,
				debuffsList.CrystalRainDebuff,
				60
			);
			findStatus(
				debuffs,
				debuffImages.stunnedDebuff,
				debuffsList.StunnedDebuff,
				60
			);

			findPrayer(buffs, debuffs);

			if (debuffs.length == 0) {
				for (let [_key, debuff] of Object.entries(debuffsList)) {
					setInactive(debuff);
				}
			}
		} else {
			noDetection(maxAttempts, interval, 'debuff');
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
	return;
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
		if (
			sauce.getSetting('debugMode') &&
			buffImage == buffImages.Freedom
		) {
			console.log(findBuffImage);
		}
		if (findBuffImage.passed > threshold || findBuffImage.failed == 0) {
			// If we find a match for the buff it will always exceed the threshold
			// the threshold depends largely on which buff is being matched against
			foundBuff = true;
			await setActive(element);
			timearg = value.readArg('timearg');
			if (element.dataset.time == '1' && showCooldown && !onCooldown) {
				if (sauce.getSetting('debugMode')) {
					console.log(`Starting cooldown timer for ${element.id}`);
				}
				onCooldown = true;
				await startCooldownTimer(element, cooldownTimer);
				return;
			} else if (
				timearg.time > 59 &&
				!onCooldown &&
				timearg.time < maxRange
			) {
				if (sauce.getSetting('debugMode')) {
					console.log(`${element.id} has >60s remaining`);
				}
				element.dataset.time =
					Math.floor(value.readArg('timearg').time / 60).toString() +
					'm';

				// Pause the check for a tick since we don't need to rapidly update
				//a buff that won't have a more precise value for 1 minute
				await new Promise((done) => setTimeout(done, 600));
			} else if (expirationPulse && timearg.time == 11 && !onCooldown) {
				if (sauce.getSetting('debugMode')) {
					console.log(
						`${element.id} has <10s remaining - starting 10s countdown`
					);
				}
				element.dataset.time = '<10s';
				await setActive(element);
				// This can be desynced from in-game 10s but it's accurate enough
				await new Promise((done) => setTimeout(done, 10000));
				await setInactive(element);
				if (sauce.getSetting('showTooltipReminders')) {
					showTooltip('Overload expired', 3000);
				}
			} else if (timearg.time > minRange && timearg.time < maxRange) {
				if (sauce.getSetting('debugMode')) {
					console.log(
						`Cooldown for ${element.id} is between ${minRange} and ${maxRange}`
					);
				}
				element.dataset.time = timearg.time.toString();
				if (timearg.time - 1 == 0 && !showCooldown) {
					await setInactive(element);
				}
			} else {
				if (sauce.getSetting('debugMode')) {
					console.log(
						`${element.id} is no longer active - setting inactive.`
					);
				}
				await setInactive(element);
			}
		} else if (!showCooldown) {
			if (sauce.getSetting('debugMode')) {
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
}

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
		element.dataset.cooldown = cooldownTimer.toString();
		await new Promise((done) => setTimeout(done, 1000));
		let timer = setInterval(() => {
			countdown(element, cooldownTimer, timer);
		}, 1000);
		await new Promise((done) => setTimeout(done, 3000));
		runOnlyOnce = false;
		await new Promise((done) =>
			setTimeout(done, cooldownTimer * 1000 - 3000)
		);
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

async function findPrayer(
	buffsList: BuffReader.Buff[],
	debuffsList: BuffReader.Buff[]
) {
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
		}
	} else {
		prayersList.DpsPrayer.dataset.prayer = '';
		prayersList.DpsPrayer.classList.add('inactive');
	}

	if (prayersActive > 0) {
		for (let [_key, value] of Object.entries(buffsList)) {
			lastActiveOverhead = testOverheadPrayers(value);
		}
	} else {
		prayersList.OverheadPrayer.dataset.prayer = '';
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
			if (value > 180) {
				prayersList.DpsPrayer.dataset.prayer = key
					.toString()
					.toLowerCase();
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
		let deflectNecromancy = buff.countMatch(
			prayerImages.deflectNecromancy,
			false
		);
		let deflectRanged = buff.countMatch(prayerImages.deflectRanged, false);
		let protectFromMagic = buff.countMatch(
			prayerImages.protectFromMagic,
			false
		);
		let protectFromMelee = buff.countMatch(
			prayerImages.protectFromMelee,
			false
		);
		let protectFromNecromancy = buff.countMatch(
			prayerImages.protectFromNecromancy,
			false
		);
		let protectFromRanged = buff.countMatch(
			prayerImages.protectFromRanged,
			false
		);
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

	if (!sauce.getSetting('singleBOLG')) {
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
				setActive(buffsList.BolgStacksBuff);
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
					setTimeout(
						done,
						parseInt(results[0].groups.time, 10) * 1000
					)
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

async function setOverlayPosition() {
	let bbb = getByID('Buffs');
	a1lib.once('alt1pressed', updateLocation);
	sauce.updateSetting('updatingOverlayPosition', true);
	while (sauce.getSetting('updatingOverlayPosition')) {
		alt1.setTooltip('Press Alt+1 to set overlay position.');
		alt1.overLaySetGroup('overlayPositionHelper');
		alt1.overLayRect(
			a1lib.mixColor(255, 255, 255),
			Math.floor(
				a1lib.getMousePosition().x -
					((sauce.getSetting('uiScale') / 100) * bbb.offsetWidth) / 2
			),
			Math.floor(
				a1lib.getMousePosition().y -
					((sauce.getSetting('uiScale') / 100) * bbb.offsetHeight) / 2
			),
			Math.floor(
				((sauce.getSetting('uiScale') / 100) * bbb.offsetWidth) / 2
			),
			Math.floor(
				((sauce.getSetting('uiScale') / 100) * bbb.offsetHeight) / 1.5
			),
			200,
			2
		);
		await new Promise((done) => setTimeout(done, 200));
	}
	alt1.clearTooltip();
}

function updateLocation(e) {
	let bbb = getByID('Buffs');
	sauce.updateSetting('overlayPosition', {
		x: Math.floor(
			e.x - (sauce.getSetting('uiScale') / 100) * (bbb.offsetWidth / 2)
		),
		y: Math.floor(
			e.y - (sauce.getSetting('uiScale') / 100) * (bbb.offsetHeight / 2)
		),
	});
	sauce.updateSetting('updatingOverlayPosition', false);
	alt1.overLayClearGroup('overlayPositionHelper');
}

export async function startOverlay() {
	let cnv = document.createElement('canvas');
	let ctx = cnv.getContext('2d', { willReadFrequently: true });
	let overlay = <HTMLCanvasElement>document.getElementsByTagName('canvas')[0];

	while (true) {
		cnv.width = 1000;
		cnv.height = 1000;

		captureOverlay();

		let overlayPosition = sauce.getSetting('overlayPosition');

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
		);
		alt1.overLayRefreshGroup('betterBuffsBar');
		await new Promise((done) => setTimeout(done, 125));
	}
}

function initSettings() {
	if (!localStorage[config.appName]) {
		setDefaultSettings();
	}
	loadSettings();
}

function setDefaultSettings() {
	localStorage.setItem(
		config.appName,
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
	getByID('Buffs').style.setProperty(
		'--maxcount',
		sauce.getSetting('buffsPerRow')
	);
	getByID('Buffs').style.setProperty('--scale', sauce.getSetting('uiScale'));
	helperItems.BetterBuffsBar.classList.toggle(
		'fade',
		sauce.getSetting('fadeInactiveBuffs')
	);
	helperItems.BetterBuffsBar.classList.toggle(
		'big-head-mode',
		sauce.getSetting('bigHeadMode')
	);
	helperItems.BetterBuffsBar.classList.toggle(
		'blink-maintainables',
		sauce.getSetting('showMaintainableBlinking')
	);
	if (
		parseInt(settingsObject.UIScale.querySelector('input').value, 10) < 100
	) {
		helperItems.TrackedBuffs.classList.add('scaled');
	}
	helperItems.BetterBuffsBar.classList.toggle(
		'show-labels',
		sauce.getSetting('showBuffNames')
	);

	setBuffsPerRow();
	setBigHeadMode();
	setSortables();
	findPlayerBuffs();
	findPlayerDebuffs();
	setGridSize();
	setBigHeadGrid();
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
	getByID('Buffs').style.setProperty(
		'--maxcount',
		sauce.getSetting('buffsPerRow')
	);
	setGridSize();
}

function setGridSize() {
	let buffsCount = helperItems.TrackedBuffs.querySelectorAll('li').length;
	let maxLength = parseInt(
		helperItems.TrackedBuffs.style.getPropertyValue('--maxcount'),
		10
	);
	let rowsToGenerate = parseInt(
		roundedToFixed(buffsCount / maxLength, 1) + 1,
		10
	);
	helperItems.TrackedBuffs.style.gridTemplateAreas = `"${'. '.repeat(
		sauce.getSetting('buffsPerRow')
	)}"`.repeat(rowsToGenerate);
	helperItems.TrackedBuffs.style.gridTemplateRows = `repeat(${
		rowsToGenerate + 1
	}, calc(30px * clamp(1, (var(--scale) / 100) / 2, 2)))`;
}

function setBigHeadMode() {
	helperItems.TrackedBuffs.classList.toggle(
		'scaled',
		sauce.getSetting('bigHeadMode')
	);
	helperItems.BetterBuffsBar.classList.toggle(
		'big-head-mode',
		sauce.getSetting('bigHeadMode')
	);
	setBigHeadGrid();
}

function setBigHeadGrid() {
	if (
		sauce.getSetting('bigHeadMode') &&
		sauce.getSetting('bigHeadPosition') == 'start'
	) {
		helperItems.TrackedBuffs.style.gridTemplateAreas = `
		"first first ${'. '.repeat(sauce.getSetting('buffsPerRow'))}"
		"first first ${'. '.repeat(sauce.getSetting('buffsPerRow'))}"
		". . ${'. '.repeat(sauce.getSetting('buffsPerRow'))}"
		". . ${'. '.repeat(sauce.getSetting('buffsPerRow'))}"
		". . ${'. '.repeat(sauce.getSetting('buffsPerRow'))}"
		`;
	}
	if (
		sauce.getSetting('bigHeadMode') &&
		sauce.getSetting('bigHeadPosition') == 'end'
	) {
		helperItems.TrackedBuffs.style.gridTemplateAreas = `
		"${'. '.repeat(sauce.getSetting('buffsPerRow'))}first first"
		"${'. '.repeat(sauce.getSetting('buffsPerRow'))}first first"
		". . ${'. '.repeat(sauce.getSetting('buffsPerRow'))}"
		". . ${'. '.repeat(sauce.getSetting('buffsPerRow'))}"
		". . ${'. '.repeat(sauce.getSetting('buffsPerRow'))}"
		`;
	}
}

let foundBuffs = false;
function getActiveBuffs() {
	if (foundBuffs && sauce.getSetting('buffsLocation')) {
		return buffs.read();
	} else {
		findPlayerBuffs();
	}
}

function findPlayerBuffs() {
	if (buffs.find()) {
		foundBuffs = true;
		return sauce.updateSetting('buffsLocation', [buffs.pos.x, buffs.pos.y]);
	}
}

let foundDebuffs = false;
function getActiveDebuffs() {
	if (foundDebuffs && sauce.getSetting('debuffsLocation')) {
		return debuffs.read();
	} else {
		findPlayerDebuffs();
	}
}

function findPlayerDebuffs() {
	if (debuffs.find()) {
		foundDebuffs = true;
		return sauce.updateSetting('debuffsLocation', [
			debuffs.pos.x,
			debuffs.pos.y,
		]);
	}
}

function roundedToFixed(input, digits) {
	var rounder = Math.pow(10, digits);
	return (Math.round(input * rounder) / rounder).toFixed(digits);
}

/* Settings */
const settingsObject = {
	settingsHeader: sauce.createHeading('h2', 'Settings'),
	beginGeneral: sauce.createHeading('h3', 'General'),
	BuffsPerRow: sauce.createNumberSetting(
		'buffsPerRow',
		'Number of buffs per row',
		{ defaultValue: 10, min: 1, max: 20 }
	),
	FadeInactiveBuffs: sauce.createCheckboxSetting(
		'fadeInactiveBuffs',
		'Fade Buffs - Fades buffs that are inactive/on cooldown instead of removing them',
		false
	),
	BigHeadMode: sauce.createCheckboxSetting(
		'bigHeadMode',
		'Big Head Mode - The first buff will be made four times as large and take up two rows of buffs',
		false
	),
	BigHeadPosition: sauce.createDropdownSetting(
		'bigHeadPosition',
		'Position of Big Head Mode',
		'start',
		[
			{ value: 'start', name: 'Left Side' },
			{ value: 'end', name: 'Right Side' },
		]
	),
	OverloadReminder: sauce.createCheckboxSetting(
		'overloadReminder',
		'Overload Reminder - Displays a mouse tooltip for 3 seconds after Overloads expire',
		false
	),
	BlinkExpiredBuffs: sauce.createCheckboxSetting(
		'showMaintainableBlinking',
		'Blink "Expired" Buffs - A blinking effect around any inactive buffs that can have 100% uptime (eg. Overloads, Weapon Poison)',
		false
	),
	SingleBOLG: sauce.createCheckboxSetting(
		'singleBOLG',
		'Split BOLG tracking into two separate buffs. One for weapon special timer and one for stacks',
		false
	),
	ShowLabelNames: sauce.createCheckboxSetting(
		'showBuffNames',
		`Show Names - Only use this if you don't recognize the icons`,
		false
	),
	endGeneral: sauce.createSeperator(),
	OverlayHeader: sauce.createHeading('h3', 'Overlay'),
	OverlaySmallText: sauce.createSmallText(
		`Make sure the "Show overlay" permission has been enabled for this plugin. You can check by clicking the wrench icon in the top right.`
	),
	OverlayPositionButton: sauce.createButton(
		'Set Overlay Position',
		setOverlayPosition
	),
	endOverlay: sauce.createSeperator(),
	ScaleHeader: sauce.createHeading('h3', 'UI Scale'),
	UIScale: sauce.createRangeSetting(
		'uiScale',
		'Adjusts the display size of the Overlay.',
		{
			defaultValue: 100,
			min: 50,
			max: 200,
		}
	),
	endScale: sauce.createSeperator(),
	SearchHeader: sauce.createHeading('h3', 'Interface Search Speed'),
	SearchText: sauce.createText(
		`Lower value will detect changes faster but may cause hits to overall performance. Adjust at your own risk - the default value should generally be fine. You must reload the app for the new value to take effect.`
	),
	SearchSpeed: sauce.createRangeSetting('loopSpeed', '', {
		defaultValue: 150,
		min: 50,
		max: 300,
		unit: 'ms',
	}),
	endSearch: sauce.createSeperator(),
	ProfileManager: sauce.createProfileManager(),
	ResetHeader: sauce.createHeading('h3', 'Hard Reset'),
	ResetText: sauce.createText(
		`Bad configuration values can break the plugin. This attempts to reset your configuration and reload the plugin. When troubleshooting this should be the first thing you should try to resolve your problem.`
	),
	resetButton: sauce.createButton(
		'Reset All Settings',
		sauce.setDefaultSettings
	),
	debugMode: sauce.createCheckboxSetting('debugMode', "Don't use this", false),
};

settingsObject.BuffsPerRow.addEventListener('click', () => {
	getByID('Buffs').style.setProperty(
		'--maxcount',
		sauce.getSetting('buffsPerRow')
	);
	setGridSize();
	setBigHeadGrid();
});

settingsObject.FadeInactiveBuffs.addEventListener('change', function () {
	helperItems.BetterBuffsBar.classList.toggle(
		'fade',
		settingsObject.FadeInactiveBuffs.querySelector('input').checked
	);
});

settingsObject.BigHeadMode.addEventListener('change', () => {
	helperItems.BetterBuffsBar.classList.toggle(
		'big-head-mode',
		settingsObject.BigHeadMode.querySelector('input').checked
	);
	setBigHeadMode();
	setBigHeadGrid();
});

settingsObject.BigHeadPosition.addEventListener('change', () => {
	setBigHeadMode();
	setBigHeadGrid();
});

settingsObject.BlinkExpiredBuffs.addEventListener('change', () => {
	helperItems.BetterBuffsBar.classList.toggle(
		'blink-maintainables',
		settingsObject.BlinkExpiredBuffs.querySelector('input').checked
	);
});

settingsObject.UIScale.addEventListener('change', () => {
	getByID('Buffs').style.setProperty('--scale', sauce.getSetting('uiScale'));
	if (
		parseInt(settingsObject.UIScale.querySelector('input').value, 10) < 100
	) {
		helperItems.TrackedBuffs.classList.add('scaled');
	}
});

settingsObject.ShowLabelNames.addEventListener('click', () => {
	helperItems.BetterBuffsBar.classList.toggle(
		'show-labels',
		settingsObject.ShowLabelNames.querySelector('input').checked
	);
});

settingsObject.ProfileManager.querySelector('.profile-list').addEventListener(
	'change',
	() => {
		let name: HTMLInputElement =
			settingsObject.ProfileManager.querySelector('.profile-name');
		let dropdown: HTMLSelectElement =
			settingsObject.ProfileManager.querySelector('.profile-list select');
		name.value = dropdown.value;
	}
);

settingsObject.ProfileManager.querySelector('.load-btn').addEventListener(
	'click',
	() => {
		setTimeout(function () {}, 100);
		location.reload();
	}
);

window.onload = function () {
	//check if we are running inside alt1 by checking if the alt1 global exists
	if (window.alt1) {
		//tell alt1 about the app
		//this makes alt1 show the add app button when running inside the embedded browser
		//also updates app settings if they are changed
		alt1.identifyAppUrl('./appconfig.json');

		let settings = document.querySelector('#Settings .container');
		Object.values(settingsObject).forEach((val) => {
			settings.before(val);
		});
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
