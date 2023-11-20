// alt1 base libs, provides all the commonly used methods for image matching and capture
// also gives your editor info about the window.alt1 api
import * as a1lib from 'alt1';
import * as BuffReader from 'alt1/buffs';
import * as TargetMob from 'alt1/targetmob';
import * as sauce from './a1sauce';
import { Sortable, MultiDrag } from 'sortablejs';
import * as htmlToImage from 'html-to-image';

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

var targetDisplay = new TargetMob.default();

var debugMode = sauce.getSetting('debugMode');
var betaTesting = sauce.getSetting('beta');
var currentOverlayPosition = sauce.getSetting('overlayPosition');
var currentOverlay2Position = sauce.getSetting('overlay2Position');
var currentOverlay3Position = sauce.getSetting('overlay3Position');
var buffsVisible;

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
	TrackedBuffs: <HTMLUListElement>getByID('Buffs'),
	TrackedBuffs2: <HTMLUListElement>getByID('Buffs2'),
	TrackedBuffs3: <HTMLUListElement>getByID('Buffs3'),
	UntrackedBuffs: <HTMLUListElement>getByID('UntrackedBuffs'),
	ToggleOverlayButton: getByID('ToggleOverlayButton'),
	NameOutput: getByID('NameOutput'),
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
	SplitSoulBuff: getByID('SplitSoulBuff'),
	AntiFire: getByID('AntifireBuff'),
	PrayerRenewal: getByID('PrayerRenewalBuff'),
	DeathSpark: getByID('DeathSparkBuff'),
	ThreadsOfFate: getByID('ThreadsOfFateBuff'),
	ConjureSkeleton: getByID('ConjureSkeleton'),
	ConjureZombie: getByID('ConjureZombie'),
	ConjureGhost: getByID('ConjureGhost'),
};

let debuffsList = {
	AdrenalinePotionDebuff: getByID('AdrenalinePotionDebuff'),
	AncientElvenRitualShardDebuff: getByID('AncientElvenRitualShardDebuff'),
	CrystalRainDebuff: getByID('CrystalRainDebuff'),
	DeathGuardDebuff: getByID('DeathGuardDebuff'),
	EnhancedExcaliburDebuff: getByID('EnhancedExcaliburDebuff'),
	OmniGuardDebuff: getByID('OmniGuardDebuff'),
	StunnedDebuff: getByID('StunnedDebuff'),
	SignOfLifeDebuff: getByID('SignOfLifeDebuff'),
	Virus: getByID('VirusDebuff'),
	PowerburstPrevention: getByID('PowerburstPreventionDebuff'),
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
	SplitSoul: require('./asset/data/Split_Soul.data.png'),
	Antifire: require('./asset/data/antifire_top.data.png'),
	PrayerRenewal: require('./asset/data/Prayer_Renew_Active-noborder.data.png'),
	DeathSpark: require('./asset/data/Death_Spark.data.png'),
	ThreadsOfFate: require('./asset/data/Threads_Of_Fate.data.png'),
	ConjureSkeleton: require('./asset/data/skeleton_warrior.data.png'),
	ConjureZombie: require('./asset/data/putrid_zombie.data.png'),
	ConjureGhost: require('./asset/data/vengeful_ghost.data.png'),
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
	signOfLifeDebuff: require('./asset/data/Sign_of_Life-top.data.png'),
	blackVirus: require('./asset/data/Black_virus.data.png'),
	redVirus: require('./asset/data/Red_virus.data.png'),
	blueVirus: require('./asset/data/Blue_virus.data.png'),
	greenVirus: require('./asset/data/Green_virus.data.png'),
	powerburstPrevention: require('./asset/data/Powerburst_prevention.data.png'),
});

var ultimateImages = a1lib.webpackImages({
	berserk: require('./asset/data/Berserk-noborder.data.png'),
	deathsSwiftness: require('./asset/data/Deaths_Swiftness-top.data.png'),
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

var enemyImages = a1lib.webpackImages({
	DeathMark: require('./asset/data/Death_Mark.data.png'),
	Vulnerability: require('./asset/data/Vulnerability_bordered.data.png'),
	Bloat: require('./asset/data/bloated.data.png'),
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
	if (sauce.getSetting('activeOverlay')) {
		startOverlay(getByID('Buffs'), '');
		if (sauce.getSetting('beta')) {
			startOverlay(getByID('Buffs2'), '2');
			startOverlay(getByID('Buffs3'), '3');
		}
	} else {
		helperItems.BetterBuffsBar.classList.add('overlay-disabled');
	}
}

let inCombat = false;
let checkForCombat = true;
let updatingOverlayPosition = false;
let timeUntilHide = 2;
let checkCombatState = () => {

	if (updatingOverlayPosition) {
		inCombat = true;
		return;
	}

	let haveBuffs = buffs.read().length;
	//If we don't have a target we aren't in combat (except for target cycle bug...)
	if (targetDisplay && checkForCombat) {
		targetDisplay.read();
		if (targetDisplay.state === null) {
			timeUntilHide = 0;
			inCombat = false;
		} else {
			timeUntilHide = 2;
			inCombat = true;
		}
	}
	// If we aren't checking to see if we have a target - pretend we always do
	if (!checkForCombat && haveBuffs) {
		timeUntilHide = 2;
		inCombat = true;
	}
	if (!haveBuffs) {
		// We either have no buffs or they aren't visible (eg. banking) so aren't in combat
		if (timeUntilHide == 0) {
			inCombat = false;
		} else {
			setTimeout(() => {
				if (timeUntilHide > 0) {
					timeUntilHide--;
				}
			}, 1000);
		}
	}
};

let maxAttempts = 0;
function watchBuffs() {
	let loopSpeed = sauce.getSetting('loopSpeed');
	const interval = setInterval(() => {
		let buffs = getActiveBuffs();
		let debuffs = getActiveDebuffs();
		checkCombatState();
		if (sauce.getSetting('buffsLocation')) {
			maxAttempts = 0;

			findStatus(buffs, buffImages.overloaded, buffsList.OverloadBuff, {
				threshold: 300,
				expirationPulse: true,
			});

			findStatus(
				buffs,
				buffImages.elderOverload,
				buffsList.ElderOverloadBuff,
				{
					threshold: 60,
					expirationPulse: true,
				}
			);

			findStatus(
				buffs,
				buffImages.poisonous,
				buffsList.WeaponPoisonBuff,
				{
					threshold: 300,
					expirationPulse: true,
				}
			);

			findStatus(buffs, buffImages.darkness, buffsList.DarknessBuff, {
				threshold: 400,
				maxRange: 43260,
			});

			findStatus(
				buffs,
				buffImages.animateDead,
				buffsList.AnimateDeadBuff,
				{
					threshold: 90,
				}
			);

			findStatus(
				buffs,
				buffImages.fsoaWeaponSpec,
				buffsList.FsoaSpecBuff,
				{
					threshold: 80,
					maxRange: 31,
				}
			);

			findStatus(buffs, buffImages.timeRift, buffsList.TimeRiftBuff, {
				threshold: 450,
			});

			findStatus(
				buffs,
				buffImages.gladiatorsRage,
				buffsList.GladiatorsRageBuff,
				{
					threshold: 50,
					expirationPulse: false,
					minRange: 0,
					maxRange: 16,
				}
			);

			findStatus(buffs, buffImages.necrosis, buffsList.NecrosisBuff, {
				threshold: 150,
			});

			findStatus(buffs.reverse(), buffImages.aura, buffsList.Aura, {
				threshold: 400,
			});

			findStatus(buffs, buffImages.bonfireBoost, buffsList.BonfireBoost, {
				threshold: 400,
			});

			findStatus(
				buffs,
				buffImages.grimoire,
				buffsList.ErethdorsGrimoire,
				{
					threshold: 55,
				}
			);

			findStatus(
				buffs.reverse(),
				incenseImages.lantadyme,
				buffsList.LantadymeIncense,
				{
					threshold: 119,
				}
			);

			findStatus(
				buffs.reverse(),
				incenseImages.dwarfWeed,
				buffsList.DwarfWeedIncense,
				{
					threshold: 150,
				}
			);

			findStatus(
				buffs.reverse(),
				incenseImages.fellstalk,
				buffsList.FellstalkIncense,
				{
					threshold: 150,
				}
			);

			findStatus(
				buffs.reverse(),
				incenseImages.kwuarm,
				buffsList.KwuarmIncense,
				{
					threshold: 150,
				}
			);

			findStatus(buffs, buffImages.Antifire, buffsList.AntiFire, {
				threshold: 225,
			});

			findStatus(
				buffs,
				buffImages.prayerRenewActive,
				buffsList.PrayerRenewal,
				{ threshold: 225 }
			);

			findStatus(buffs, buffImages.DeathSpark, buffsList.DeathSpark, {
				threshold: 300,
			});

			findStatus(buffs, buffImages.Anticipation, buffsList.Anticipation, {
				threshold: 300,
				showCooldown: true,
				cooldownTimer: 12,
			});

			findStatus(buffs, buffImages.Barricade, buffsList.Barricade, {
				threshold: 300,
				showCooldown: true,
				cooldownTimer: 48,
			});

			findStatus(buffs, buffImages.Devotion, buffsList.Devotion, {
				threshold: 300,
				showCooldown: true,
				cooldownTimer: 48,
			});

			findStatus(buffs, buffImages.Divert, buffsList.Divert, {
				threshold: 300,
				showCooldown: true,
				cooldownTimer: 22,
			});

			findStatus(buffs, buffImages.Freedom, buffsList.Freedom, {
				threshold: 300,
				showCooldown: true,
				cooldownTimer: 22,
			});

			findStatus(buffs, buffImages.Immortality, buffsList.Immortality, {
				threshold: 300,
				showCooldown: true,
				cooldownTimer: 88,
			});

			findStatus(buffs, buffImages.Reflect, buffsList.Reflect, {
				threshold: 300,
				showCooldown: true,
				cooldownTimer: 18,
			});

			findStatus(buffs, buffImages.Resonance, buffsList.Resonance, {
				threshold: 300,
				showCooldown: true,
				cooldownTimer: 22,
			});

			findStatus(buffs, buffImages.SplitSoul, buffsList.SplitSoulBuff, {
				threshold: 350,
				showCooldown: true,
				cooldownTimer: 38,
			});

			findStatus(
				buffs.reverse(),
				sigilImages.limitless,
				sigilsList.LimitlessSigil,
				{
					threshold: 250,
					showCooldown: true,
					cooldownTimer: 82,
				}
			);

			findStatus(
				buffs.reverse(),
				sigilImages.demonSlayer,
				sigilsList.DemonSlayer,
				{
					threshold: 400,
					showCooldown: true,
					cooldownTimer: 49,
				}
			);

			findStatus(
				buffs.reverse(),
				sigilImages.dragonSlayer,
				sigilsList.DragonSlayer,
				{
					threshold: 400,
					showCooldown: true,
					cooldownTimer: 49,
				}
			);

			findStatus(
				buffs.reverse(),
				sigilImages.undeadSlayer,
				sigilsList.UndeadSlayer,
				{
					threshold: 400,
					showCooldown: true,
					cooldownTimer: 49,
				}
			);

			findStatus(
				buffs.reverse(),
				sigilImages.ingenuityOfTheHumans,
				sigilsList.IngenuityOfTheHumans,
				{
					threshold: 400,
					showCooldown: true,
					cooldownTimer: 82,
				}
			);

			/* BOLG is currently still special */
			if (
				document.querySelectorAll('#Buffs #BolgStacksBuff').length ||
				document.querySelectorAll('#Buffs2 #BolgStacksBuff').length ||
				document.querySelectorAll('#Buffs3 #BolgStacksBuff').length
			) {
				findBolgStacks(buffs);
			}

			findStatus(buffs, ultimateImages.berserk, ultimatesList.Berserk, {
				threshold: 200,
				showCooldown: true,
				cooldownTimer: 39,
			});

			findStatus(
				buffs,
				ultimateImages.deathsSwiftness,
				ultimatesList.DeathsSwiftness,
				{
					threshold: 270,
					showCooldown: true,
					cooldownTimer: 29,
				}
			);

			findStatus(
				buffs,
				ultimateImages.greaterDeathsSwiftness,
				ultimatesList.GreaterDeathsSwiftness,
				{
					threshold: 450,
					showCooldown: true,
					cooldownTimer: 22,
				}
			);

			findStatus(buffs, ultimateImages.sunshine, ultimatesList.Sunshine, {
				threshold: 500,
				showCooldown: true,
				cooldownTimer: 29,
			});

			findStatus(
				buffs,
				ultimateImages.greaterSunshine,
				ultimatesList.GreaterSunshine,
				{
					threshold: 100,
					showCooldown: true,
					cooldownTimer: 22,
				}
			);

			findStatus(
				buffs,
				ultimateImages.livingDeath,
				ultimatesList.LivingDeath,
				{
					threshold: 400,
					showCooldown: true,
					cooldownTimer: 58,
				}
			);

			findStatus(
				buffs,
				buffImages.ThreadsOfFate,
				buffsList.ThreadsOfFate,
				{
					threshold: 300,
					showCooldown: true,
					cooldownTimer: 36,
				}
			);

			findStatus(
				buffs,
				buffImages.ConjureSkeleton,
				buffsList.ConjureSkeleton,
				{
					threshold: 300,
					expirationPulse: true,
				}
			);

			findStatus(
				buffs,
				buffImages.ConjureZombie,
				buffsList.ConjureZombie,
				{
					threshold: 300,
					expirationPulse: true,
				}
			);

			findStatus(buffs, buffImages.ConjureGhost, buffsList.ConjureGhost, {
				threshold: 300,
				expirationPulse: true,
			});

			checkBuffsForHidingOverlay(buffs);

			if (buffs?.length == 0) {
				for (let [_key, buff] of Object.entries(buffsList)) {
					setInactive(buff);
				}
			}
		} else {
			noDetection(maxAttempts, interval, 'buff');
		}
		if (sauce.getSetting('debuffsLocation')) {
			maxAttempts = 0;
			findStatus(
				debuffs,
				debuffImages.elvenRitualShard,
				debuffsList.AncientElvenRitualShardDebuff,
				{
					threshold: 90,
				}
			);
			findStatus(
				debuffs,
				debuffImages.adrenalinePotion,
				debuffsList.AdrenalinePotionDebuff,
				{ threshold: 300 }
			);
			findStatus(
				debuffs,
				debuffImages.deathGraspDebuff,
				debuffsList.DeathGuardDebuff,
				{ threshold: 90 }
			);
			findStatus(
				debuffs,
				debuffImages.deathEssenceDebuff,
				debuffsList.OmniGuardDebuff,
				{ threshold: 60 }
			);
			findStatus(
				debuffs,
				debuffImages.enhancedExcaliburDebuff,
				debuffsList.EnhancedExcaliburDebuff,
				{ threshold: 15 }
			);
			findStatus(
				debuffs,
				debuffImages.crystalRainMinimal,
				debuffsList.CrystalRainDebuff,
				{ threshold: 60 }
			);
			findStatus(
				debuffs,
				debuffImages.stunnedDebuff,
				debuffsList.StunnedDebuff,
				{ threshold: 60 }
			);
			findStatus(
				debuffs,
				debuffImages.signOfLifeDebuff,
				debuffsList.SignOfLifeDebuff,
				{ threshold: 20 }
			);

			findStatus(
				debuffs,
				debuffImages.powerburstPrevention,
				debuffsList.PowerburstPrevention,
				{ threshold: 20 }
			);

			findVirus(debuffs);

			findPrayer(buffs.reverse(), debuffs);

			if (debuffs?.length == 0) {
				for (let [_key, debuff] of Object.entries(debuffsList)) {
					setInactive(debuff);
				}
			}
		} else {
			noDetection(maxAttempts, interval, 'debuff');
		}
		findEnemyDebuffs();
	}, loopSpeed);
	const timerWatcher = setInterval(() => {
		watchTimers();
	}, 3000);
}

async function checkBuffsForHidingOverlay(buffsReader: BuffReader.Buff[]) {
	// If we don't have an overlay visible - hide it
	if (buffsReader == undefined) {
		helperItems.BetterBuffsBar.classList.add('hide-overlay');
	} else if (Object.entries(buffsReader).length == 0) {
		helperItems.BetterBuffsBar.classList.add('hide-overlay');
	} else {
		helperItems.BetterBuffsBar.classList.remove('hide-overlay');
	}
}

async function noDetection(maxAttempts: number, interval: any, bar: string) {
	if (maxAttempts == 10) {
		helperItems.Output.insertAdjacentHTML(
			'beforeend',
			`<p>Unable to find ${bar} bar location.\nPlease login to the game or make sure that Alt1 can detect your ${bar} bar then reload the app.\nRemember - the Buffs setting must be set to "Small" and you must have at least 1 ${bar}. \nTo reload, right click this interface and select Reload.</p>`
		);
		clearInterval(interval);
		return;
	}
	if (maxAttempts < 10) {
		setTimeout(() => {}, 1000 * maxAttempts ** 2);
		maxAttempts++;
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
	options: {
		threshold: number;
		expirationPulse?: boolean;
		minRange?: number;
		maxRange?: number;
		showCooldown?: boolean;
		cooldownTimer?: number;
		debug?: boolean;
	}
) {
	let {
		threshold = options.threshold ?? 100,
		expirationPulse = options.expirationPulse ?? false,
		minRange = options.minRange ?? 0,
		maxRange = options.maxRange ?? Infinity,
		showCooldown = options.showCooldown ?? false,
		cooldownTimer = options.cooldownTimer,
		debug = options.debug ?? false,
	} = options;
	// Exit early if our buff isn't in the Tracked Buffs list
	if (
		!getByID('Buffs').contains(element) &&
		!getByID('Buffs2').contains(element) &&
		!getByID('Buffs3').contains(element) ||
		!buffsReader
	) {
		return;
	}

	// Declared outside of the loop so that it can be checked to be Undefined if no buffs are found
	let timearg;
	let foundBuff = false;
	let onCooldown = false;
	let cooldownAdjustment = parseInt(sauce.getSetting('delayAdjustment'), 10);
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

		// If the buff has been found do an early return
		if (foundBuff) {
			return;
		}

		// If Ful book is being used and there is not also a proc found set the proc to inactive
		if (highlander.length == 1) {
			setInactive(buffsList.GladiatorsRageBuff);
		}

		// Only bother scanning for proc if we have both the book and proc active
		if (highlander.length != 2 && buffImage == buffImages.gladiatorsRage) {
			return;
		}

		let findBuffImage = value.countMatch(buffImage, false);

		// Death Spark doesn't have a readarg so if it is found set it to active and stop evaluating it
		if (
			findBuffImage.passed > threshold &&
			buffImage == buffImages.DeathSpark
		) {
			setActive(element);
			return;
		}

		if (
			findBuffImage.passed > threshold ||
			(findBuffImage.failed == 0 && buffImage !== buffImages.DeathSpark)
		) {
			// If we find a match for the buff it will always exceed the threshold
			// the threshold depends largely on which buff is being matched against

			if (sauce.getSetting('debugMode') && debug) {
				console.log(
					`Debugging ${element.id.toString()} | Threshold: ${JSON.stringify(
						findBuffImage
					)}`
				);
			}

			// If a buff has exceeded the threshold or has a 0px failure rate we have a match and want to set it to active
			foundBuff = true;
			await setActive(element);

			timearg = value.readArg('timearg');

			// If the time remaining is 1 and the buff is supposed to show a cooldown - start the cooldown timer and stop evaluating
			if (
				element.dataset.time == '0' ||
				element.dataset.time == '1' &&
				showCooldown &&
				element.dataset.startedTimer == 'false'
			) {
				if (debugMode) {
					console.log(`Starting cooldown timer for ${element.id}`);
				}
				element.dataset.startedTimer = 'true';
				startCooldownTimer(element, cooldownTimer - cooldownAdjustment);
				return;
			}

			// If the timer exceeds 60s show the time in minutes
			if (timearg.time > 59 && timearg.time < maxRange) {
				element.dataset.time =
					Math.floor(value.readArg('timearg').time / 60).toString() +
					'm';

				// Pause the check for a tick since we don't need to rapidly update
				//a buff that won't have a more precise value for 1 minute
				await new Promise((done) => setTimeout(done, 600));
			}
			// If we've reached 11 seconds force the item active for 10s and then set it to inactive
			else if (expirationPulse && timearg.time == 11 && !onCooldown) {
				element.dataset.time = '<10s';
				await setActive(element);
				// This can be desynced from in-game 10s but it's accurate enough
				await new Promise((done) => setTimeout(done, 10000));
				await setInactive(element);
				if (sauce.getSetting('showTooltipReminders')) {
					showTooltip('Overload expired', 3000);
				}
			}
			// If time exceeds the minimum match range and is under the maximum match range
			else if (timearg.time > minRange && timearg.time < maxRange) {
				let buffTimeRemaining = timearg.time - cooldownAdjustment;

				// And the buff has time remaining and is not Necrosis or BOLG Stacks - display the remaining time
				if (
					buffTimeRemaining > 0 &&
					buffImage != buffImages.necrosis &&
					element != buffsList.BolgStacksBuff
				) {
					element.dataset.time = buffTimeRemaining.toString();
				}
				// Otherwise if the buff is Necrosis or BolgStacks display the stacks
				else if (
					buffTimeRemaining > 0 &&
					(buffImage == buffImages.necrosis ||
						element == buffsList.BolgStacksBuff)
				) {
					element.dataset.time = timearg.time;
				}

				// If our time is at 1 second and we are not going to display a cooldown - set the element to inactive
				if (timearg.time - 1 == 0 && !showCooldown) {
					await setInactive(element);
				}
			}
			// Failing all else - as long as we are not displaying a cooldown set the item to inactive
			else if (!showCooldown) {
				await setInactive(element);
			}
		}
		// Failing all else - as long as we are not displaying a cooldown set the item to inactive
		else if (!showCooldown) {
			await setInactive(element);
		}
	}

	if (cooldownTimer > 0 && element.dataset.cooldown == '0' && !element.classList.contains('active')) {
		setInactive(element);
	}

	// If we didn't find the buff try again after a brief timeout
	if (timearg == undefined && foundBuff && !showCooldown) {
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

async function startCooldownTimer(element: HTMLElement, cooldownTimer: number) {
	/*
	 * Wait the final 1s then set buff to 'cooldown' state
	 * After its cooldown has finished set it back to 'inactive' state (actually 'readyToBeUsed')
	 */
	await new Promise((done) => setTimeout(done, 1050));
	await setCooldown(element, cooldownTimer);
	if (element.dataset.cooldown != '0' && element.dataset.startedTimer !== 'true') {
		element.dataset.startedTimer = 'true';
		element.dataset.cooldown = cooldownTimer.toString();
		let timer = setInterval(() => {
			countdown(element, cooldownTimer, timer);
		}, 1000);
	}
}

function countdown(element: HTMLElement, cooldownTimer: number, timer: any) {
	if (parseInt(element.dataset.cooldown, 10) > 0) {
		element.dataset.cooldown = (
			parseInt(element.dataset.cooldown, 10) - 1
		).toString();
	} else if (element.dataset.cooldown == '0') {
		element.dataset.startedTimer = 'false';
		element.dataset.cooldown = '';
		setInactive(element);
		clearInterval(timer);
	}
}

async function findVirus(debuffs: BuffReader.Buff[]) {
	if (!debuffs) {
		return;
	}

	let virusActive: number = 0;
	let currentVirus = '';

	for (let [_key, value] of Object.entries(debuffs)) {
		let checkBlackVirus = value.countMatch(debuffImages.blackVirus, false);
		let checkBlueVirus = value.countMatch(debuffImages.blueVirus, false);
		let checkRedVirus = value.countMatch(debuffImages.redVirus, false);
		let checkGreenVirus = value.countMatch(debuffImages.greenVirus, false);

		if (checkBlackVirus.failed == 0 || checkBlackVirus.passed > 275) {
			currentVirus = 'BLK';
			virusActive++;
		}
		if (checkBlueVirus.failed == 0 || checkBlueVirus.passed > 275) {
			currentVirus = 'BLU';
			virusActive++;
		}
		if (checkRedVirus.failed == 0 || checkRedVirus.passed > 275) {
			currentVirus = 'RED';
			virusActive++;
		}
		if (checkGreenVirus.failed == 0 || checkGreenVirus.passed > 275) {
			currentVirus = 'GRN';
			virusActive++;
		}
	}

	if (!virusActive) {
		debuffsList.Virus.dataset.virus = '';
		debuffsList.Virus.classList.add('inactive');
	} else {
		debuffsList.Virus.dataset.virus = currentVirus;
		debuffsList.Virus.classList.add('active');
	}
}

function findEnemyDebuffs() {
	targetDisplay.read();
	if (!targetDisplay.read()) {
		return;
	}
	if (targetDisplay.lastpos === null) {
		setInactive(getByID('VulnerabilityDebuff'));
	}

	if (!targetDisplay.state?.name) {
		setInactive(getByID('VulnerabilityDebuff'));
	}

	if (
		(!getByID('Buffs').contains(getByID('DeathMarkDebuff')) &&
			!getByID('Buffs2').contains(getByID('DeathMarkDebuff')) &&
			!getByID('Buffs3').contains(getByID('DeathMarkDebuff'))) &&
		(!getByID('Buffs').contains(getByID('VulnerabilityDebuff')) &&
			!getByID('Buffs2').contains(getByID('VulnerabilityDebuff')) &&
			!getByID('Buffs3').contains(getByID('VulnerabilityDebuff'))) &&
		(!getByID('Buffs').contains(getByID('Bloat')) &&
			!getByID('Buffs2').contains(getByID('Bloat')) &&
			!getByID('Buffs3').contains(getByID('Bloat')))
	) {
		return;
	}

	var target_display_loc = {
		x: targetDisplay?.lastpos.x - 120,
		y: targetDisplay?.lastpos.y + 20,
		w: 150,
		h: 60,
	};
	var targetDebuffs = a1lib.captureHold(
		target_display_loc.x,
		target_display_loc.y,
		target_display_loc.w,
		target_display_loc.h
	);
	var targetIsDeathMarked = targetDebuffs.findSubimage(enemyImages.DeathMark).length;
	if (targetIsDeathMarked) {
		setActive(getByID('DeathMarkDebuff'));
	} else if (!targetIsDeathMarked) {
		setInactive(getByID('DeathMarkDebuff'));
	}

	var targetIsBloated = targetDebuffs.findSubimage(enemyImages.Bloat).length;
	if (targetIsBloated) {
		setActive(getByID('Bloat'));
	} else if (!targetIsBloated) {
		setInactive(getByID('Bloat'));
	}

	var targetIsVulnerable = targetDebuffs.findSubimage(
		enemyImages.Vulnerability
	).length;

	var targetIsVulnerable = targetDebuffs.findSubimage(
		enemyImages.Vulnerability
	).length;
	if (targetIsVulnerable) {
		setActive(getByID('VulnerabilityDebuff'));
		setTimeout(() => {
			setInactive(getByID('VulnerabilityDebuff'));
		}, 60000);
	} else if (!targetIsBloated) {
		setInactive(getByID('Bloat'));
	}
}


async function findPrayer(
	buffsList: BuffReader.Buff[],
	debuffsList: BuffReader.Buff[]
) {
	if (!buffsList || !debuffsList) {
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

	if (
		(prayersActive > 0 &&
			getByID('Buffs').contains(prayersList.DpsPrayer)) ||
		getByID('Buffs2').contains(prayersList.DpsPrayer) ||
		getByID('Buffs3').contains(prayersList.DpsPrayer)
	) {
		for (let [_key, value] of Object.entries(buffsList)) {
			lastActiveDPS = testDpsPrayers(value);
		}
	} else {
		prayersList.DpsPrayer.dataset.prayer = '';
		prayersList.DpsPrayer.classList.add('inactive');
	}

	if (
		(prayersActive > 0 &&
			getByID('Buffs').contains(prayersList.OverheadPrayer)) ||
			getByID('Buffs2').contains(prayersList.OverheadPrayer) ||
			getByID('Buffs3').contains(prayersList.OverheadPrayer)
	) {
		for (let [_key, value] of Object.entries(buffsList)) {
			lastActiveOverhead = testOverheadPrayers(value);
		}
	} else {
		prayersList.OverheadPrayer.dataset.prayer = '';
		prayersList.OverheadPrayer.classList.add('inactive');
	}
}

async function testDpsPrayers(buff: BuffReader.Buff) {
	if (
		getByID('Buffs').contains(prayersList.DpsPrayer) ||
		getByID('Buffs2').contains(prayersList.DpsPrayer) ||
		getByID('Buffs3').contains(prayersList.DpsPrayer)
	) {
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
				return prayerTests[key].toString();
			}
		}
	}
}

async function testOverheadPrayers(buff: BuffReader.Buff) {
	if (
		getByID('Buffs').contains(prayersList.OverheadPrayer) ||
		getByID('Buffs2').contains(prayersList.OverheadPrayer) ||
		getByID('Buffs3').contains(prayersList.OverheadPrayer)
	) {
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

var timersCollection = {};
async function watchTimers() {
	let items = helperItems.TrackedBuffs.querySelectorAll('li');
	items.forEach((item) => {
		var time =  '0';
		if (item.dataset.time !== undefined || item.dataset.time !== null) {
			time = item.dataset.time;
		}
		if (
			timersCollection[item.dataset.name] == item.dataset.time &&
			item.classList.contains('active') &&
			item.dataset.startedTimer.length
		) {
			startCooldownTimer(item, (parseInt(item.dataset.cooldownTime, 10)) + parseInt(item.dataset.time, 10) - 3);
		} else if (
			timersCollection[item.dataset.name] == item.dataset.time &&
			item.classList.contains('active')
		) {
			setInactive(item);
		} else {
			timersCollection[item.dataset.name] = time;
		}
		console.log(timersCollection);
	});
}

async function setCooldown(element: HTMLElement, cooldownTimer: number) {
	element.classList.add('cooldown');
	element.classList.remove('inactive');
	element.classList.remove('active');
	element.dataset.time = '';
	element.dataset.startedTimer = 'false';
	element.dataset.cooldown = cooldownTimer.toString();
	await new Promise((done) => setTimeout(done, 2000));
}

async function setInactive(element: HTMLElement) {
	if (!(element.dataset.startedTimer == 'true')) {
		element.classList.add('inactive');
		element.classList.remove('active');
		element.dataset.time = '';
	} else if (element.dataset.startedFimer == 'false') {
		element.classList.remove('cooldown');
		element.dataset.cooldown = '';
	}
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
		let canvas = <HTMLCanvasElement>document.getElementById('bolgCanvas');
		let ctx = canvas.getContext('2d');
		ctx.drawImage(
			buffImages.perfectEquilibriumNoBorder.toImage(),
			0,
			0,
			canvas.width,
			canvas.height
		);
		for (let a in buffs.reverse()) {
			if (
				buffs[a].compareBuffer(buffImages.perfectEquilibriumNoBorder) &&
				bolgFound == false
			) {
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
				setActive(buffsList.BolgStacksBuff);
				buffsList.BolgStacksBuff.style.backgroundImage =
					'url("data:image/png;base64,' +
					bolgBuffImage.toPngBase64() +
					'")';
			}
		}
	} else if (sauce.getSetting('singleBOLG')) {
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
			bolgSpecTime = results[0].groups.time ?? 0;
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
				bolgStacks = results[0].groups.time ?? 0;
			}
		}
	}
	if (bolgSpecTime == undefined || bolgStacks == undefined) {
		return ['', ''];
	}
	return [bolgSpecTime, bolgStacks];
}

async function setOverlayPosition() {
	a1lib.once('alt1pressed', updateLocation);
	let oldPosition = sauce.getSetting('overlayPosition');
	sauce.updateSetting('oldOverlayPosition', oldPosition);
	updatingOverlayPosition = true;
	helperItems.BetterBuffsBar.classList.toggle(
		'positioning',
		updatingOverlayPosition
	);
	while (updatingOverlayPosition) {
		alt1.setTooltip('Press Alt+1 to save position');
		let bbb = getByID('Buffs');
		sauce.updateSetting('overlayPosition', {
			x: Math.floor(
				a1lib.getMousePosition().x -
					(sauce.getSetting('uiScale') / 100) * (bbb.offsetWidth / 2)
			),
			y: Math.floor(
				a1lib.getMousePosition().y -
					(sauce.getSetting('uiScale') / 100) * (bbb.offsetHeight / 2)
			),
		});
		currentOverlayPosition = sauce.getSetting('overlayPosition');
		alt1.overLayRefreshGroup('group1');
		await new Promise((done) => setTimeout(done, 200));
	}
	alt1.clearTooltip();
	return;
}

async function setOverlayPosition2() {
	a1lib.once('alt1pressed', updateLocation2);
	let oldPosition = sauce.getSetting('overlay2Position');
	sauce.updateSetting('oldOverlay2Position', oldPosition);
	updatingOverlayPosition = true;
	helperItems.BetterBuffsBar.classList.toggle(
		'positioning',
		updatingOverlayPosition
	);
	while (updatingOverlayPosition) {
		alt1.setTooltip('Press Alt+1 to save position');
		let bbb = getByID('Buffs2');
		sauce.updateSetting('overlay2Position', {
			x: Math.floor(
				a1lib.getMousePosition().x -
					(sauce.getSetting('uiScale') / 100) * (bbb.offsetWidth / 2)
			),
			y: Math.floor(
				a1lib.getMousePosition().y -
					(sauce.getSetting('uiScale') / 100) * (bbb.offsetHeight / 2)
			),
		});
		currentOverlay2Position = sauce.getSetting('overlay2Position');
		alt1.overLayRefreshGroup('group2');
		await new Promise((done) => setTimeout(done, 200));
	}
	alt1.clearTooltip();
	return;
}

async function setOverlayPosition3() {
	a1lib.once('alt1pressed', updateLocation3);
	let oldPosition = sauce.getSetting('overlay3Position');
	sauce.updateSetting('oldOverlay3Position', oldPosition);
	updatingOverlayPosition = true;
	helperItems.BetterBuffsBar.classList.toggle(
		'positioning',
		updatingOverlayPosition
	);
	while (updatingOverlayPosition) {
		alt1.setTooltip('Press Alt+1 to save position');
		let bbb = getByID('Buffs3');
		sauce.updateSetting('overlay3Position', {
			x: Math.floor(
				a1lib.getMousePosition().x -
					(sauce.getSetting('uiScale') / 100) * (bbb.offsetWidth / 2)
			),
			y: Math.floor(
				a1lib.getMousePosition().y -
					(sauce.getSetting('uiScale') / 100) * (bbb.offsetHeight / 2)
			),
		});
		currentOverlay3Position = sauce.getSetting('overlay3Position');
		alt1.overLayRefreshGroup('group3');
		await new Promise((done) => setTimeout(done, 200));
	}
	alt1.clearTooltip();
	return;
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
	updatingOverlayPosition = false;
	helperItems.BetterBuffsBar.classList.toggle(
		'positioning',
		updatingOverlayPosition
	);
}

function updateLocation2(e) {
	let bbb = getByID('Buffs2');
	sauce.updateSetting('overlay2Position', {
		x: Math.floor(
			e.x - (sauce.getSetting('uiScale') / 100) * (bbb.offsetWidth / 2)
		),
		y: Math.floor(
			e.y - (sauce.getSetting('uiScale') / 100) * (bbb.offsetHeight / 2)
		),
	});
	updatingOverlayPosition = false;
	helperItems.BetterBuffsBar.classList.toggle(
		'positioning',
		updatingOverlayPosition
	);
}

function updateLocation3(e) {
	let bbb = getByID('Buffs3');
	sauce.updateSetting('overlay3Position', {
		x: Math.floor(
			e.x - (sauce.getSetting('uiScale') / 100) * (bbb.offsetWidth / 2)
		),
		y: Math.floor(
			e.y - (sauce.getSetting('uiScale') / 100) * (bbb.offsetHeight / 2)
		),
	});
	updatingOverlayPosition = false;
	helperItems.BetterBuffsBar.classList.toggle(
		'positioning',
		updatingOverlayPosition
	);
}

async function startOverlay(element: HTMLElement, region?: string) {
	let overlay = element;
	let styles = getComputedStyle(overlay);
	let totalTrackeDItems = sauce.getSetting('totalTrackedItems');
	let buffsPerRow = sauce.getSetting('buffsPerrow');
	let refreshRate = parseInt(sauce.getSetting('overlayRefreshRate'), 10);
	let overlayPosition;
	await new Promise((done) => setTimeout(done, 1000));
	while (true) {
		let uiScale = sauce.getSetting('uiScale' + region);
		if (region == '') {
			overlayPosition = currentOverlayPosition;
		} else if (region == '2') {
			overlayPosition = currentOverlay2Position;
		} else if (region == '3') {
			overlayPosition = currentOverlay3Position;
		}
		htmlToImage
			.toCanvas(overlay, {
				backgroundColor: 'transparent',
				width: parseInt(styles.minWidth, 10),
				height:
					parseInt(styles.minHeight, 10) +
					Math.floor(totalTrackeDItems / buffsPerRow + 1) *
						27 *
						(uiScale / 100),
				quality: 1,
				pixelRatio: uiScale / 100 - 0.00999999999999999999,
				skipAutoScale: true,
			})
			.then((dataUrl) => {
				if (inCombat || element == getByID('Buffs')) {
					let base64ImageString = dataUrl
						.getContext('2d')
						.getImageData(0, 0, dataUrl.width, dataUrl.height);
					alt1.overLaySetGroup('region' + region);
					alt1.overLayFreezeGroup('region' + region);
					alt1.overLayClearGroup('region' + region);
					alt1.overLayImage(
						overlayPosition.x,
						overlayPosition.y,
						a1lib.encodeImageString(base64ImageString),
						base64ImageString.width,
						refreshRate
					);
					alt1.overLayRefreshGroup('region' + region);
				} else {
					alt1.overLayClearGroup('region' + region);
					alt1.overLayRefreshGroup('region' + region);
				}
			})
			.catch((e) => {
				console.error(`html-to-image failed to capture`, e);
			});
		await new Promise((done) => setTimeout(done, refreshRate));
	}
}

function initSettings() {
	if (!localStorage[config.appName]) {
		setDefaultSettings();
	}
	if (sauce.getSetting('betaUpgrade' == undefined)) {
		sauce.updateSetting('betaUpgrade', 'upgraded to 2.0.0');
		sauce.updateSetting('delayAdjustment', 1);
	}
	if (sauce.getSetting('beta') == true) {
		helperItems.BetterBuffsBar.classList.add('beta-tester');
		document.querySelector('html').classList.add('beta');
	}
	loadSettings();
}

function deleteLocalStorage() {
	localStorage.removeItem(config.appName);
	localStorage.removeItem('Buffs');
	localStorage.removeItem('Buffs2');
	localStorage.removeItem('Buffs3');
	localStorage.removeItem('UntrackedBuffs');
	location.reload();
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
			delayAdjustment: 1,
			debuffsLocation: findPlayerDebuffs,
			fadeInactiveBuffs: true,
			loopSpeed: 150,
			singleBOLG: false,
			showMaintainableBlinking: true,
			showTooltipReminders: true,
			overlayPosition: { x: 100, y: 100 },
			overlay2Position: { x: 300, y: 100 },
			overlay3Position: { x: 500, y: 100 },
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
	getByID('Buffs').style.setProperty(
		'--totalitems',
		helperItems.TrackedBuffs.children.length.toString()
	);
	getByID('Buffs2').style.setProperty(
		'--maxcount',
		sauce.getSetting('buffsPerRow')
	);
	getByID('Buffs2').style.setProperty(
		'--totalitems',
		helperItems.TrackedBuffs.children.length.toString()
	);
	getByID('Buffs3').style.setProperty(
		'--maxcount',
		sauce.getSetting('buffsPerRow')
	);
	getByID('Buffs3').style.setProperty(
		'--totalitems',
		helperItems.TrackedBuffs.children.length.toString()
	);
	getByID('Buffs').style.setProperty('--scale', sauce.getSetting('uiScale'));
	getByID('Buffs2').style.setProperty('--scale', sauce.getSetting('uiScale'));
	getByID('Buffs3').style.setProperty('--scale', sauce.getSetting('uiScale'));
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

	setBuffsPerRow();
	setBigHeadMode();
	setSortables();
	findPlayerBuffs();
	findPlayerDebuffs();
	setGridSize();
	setBigHeadGrid();
	disableNameSetting();
}

function setSortables() {
	const sortables = ['Buffs', 'Buffs2', 'Buffs3', 'UntrackedBuffs'];
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

	let allItems = helperItems.BetterBuffsBar.querySelectorAll('[data-name]');
	allItems.forEach((item: HTMLLIElement) => {
		item.addEventListener('mouseenter', (e) => {
			let name = item.dataset.name;
			helperItems.NameOutput.innerHTML = name;
		});
		item.addEventListener('mouseleave', (e) => {
			helperItems.NameOutput.innerHTML = '';
		});
	});
}

function setBuffsPerRow() {
	getByID('Buffs').style.setProperty(
		'--maxcount',
		sauce.getSetting('buffsPerRow')
	);
	getByID('Buffs2').style.setProperty(
		'--maxcount',
		sauce.getSetting('buffsPerRow')
	);
	getByID('Buffs3').style.setProperty(
		'--maxcount',
		sauce.getSetting('buffsPerRow')
	);
	setGridSize();

	helperItems.TrackedBuffs.addEventListener('change', () => {
		getByID('Buffs').style.setProperty(
			'--totalitems',
			helperItems.TrackedBuffs.children.length.toString()
		);
		getByID('Buffs2').style.setProperty(
			'--totalitems',
			helperItems.TrackedBuffs.children.length.toString()
		);
		getByID('Buffs3').style.setProperty(
			'--totalitems',
			helperItems.TrackedBuffs.children.length.toString()
		);
		sauce.updateSetting(
			'totalTrackedItems',
			helperItems.TrackedBuffs.children.length.toString
		);
	});
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
	helperItems.TrackedBuffs2.style.gridTemplateAreas = `"${'. '.repeat(
		sauce.getSetting('buffsPerRow')
	)}"`.repeat(rowsToGenerate);
	helperItems.TrackedBuffs2.style.gridTemplateRows = `repeat(${
		rowsToGenerate + 1
	}, calc(30px * clamp(1, (var(--scale) / 100) / 2, 2)))`;
	helperItems.TrackedBuffs3.style.gridTemplateAreas = `"${'. '.repeat(
		sauce.getSetting('buffsPerRow')
	)}"`.repeat(rowsToGenerate);
	helperItems.TrackedBuffs3.style.gridTemplateRows = `repeat(${
		rowsToGenerate + 1
	}, calc(30px * clamp(1, (var(--scale) / 100) / 2, 2)))`;
}

function setBigHeadMode() {
	let bigHeadMode = sauce.getSetting('bigHeadMode');
	helperItems.TrackedBuffs.classList.toggle('scaled', bigHeadMode);
	helperItems.BetterBuffsBar.classList.toggle('big-head-mode', bigHeadMode);
	setBigHeadGrid();
}

function setBigHeadGrid() {
	let bigHeadModeActive = sauce.getSetting('bigHeadMode');
	let bigHeadPosition = sauce.getSetting('bigHeadPosition');
	let buffsPerRow = sauce.getSetting('buffsPerRow');
	if (bigHeadModeActive && bigHeadPosition == 'start') {
		helperItems.TrackedBuffs.style.gridTemplateAreas = `
		"first first ${'. '.repeat(buffsPerRow)}"
		"first first ${'. '.repeat(buffsPerRow)}"
		". . ${'. '.repeat(buffsPerRow)}"
		". . ${'. '.repeat(buffsPerRow)}"
		". . ${'. '.repeat(buffsPerRow)}"
		`;
	}
	if (bigHeadModeActive && bigHeadPosition == 'end') {
		helperItems.TrackedBuffs.style.gridTemplateAreas = `
		"${'. '.repeat(buffsPerRow)}first first"
		"${'. '.repeat(buffsPerRow)}first first"
		". . ${'. '.repeat(buffsPerRow)}"
		". . ${'. '.repeat(buffsPerRow)}"
		". . ${'. '.repeat(buffsPerRow)}"
		`;
	}
	if (!bigHeadModeActive) {
		helperItems.TrackedBuffs.style.gridTemplateAreas = `
		"${'. '.repeat(buffsPerRow)}"
		"${'. '.repeat(buffsPerRow)}"
		"${'. '.repeat(buffsPerRow)}"
		"${'. '.repeat(buffsPerRow)}"
		"${'. '.repeat(buffsPerRow)}"
		`;
	}
	if (bigHeadModeActive && bigHeadPosition == 'start') {
		helperItems.TrackedBuffs2.style.gridTemplateAreas = `
		"first first ${'. '.repeat(buffsPerRow)}"
		"first first ${'. '.repeat(buffsPerRow)}"
		". . ${'. '.repeat(buffsPerRow)}"
		". . ${'. '.repeat(buffsPerRow)}"
		". . ${'. '.repeat(buffsPerRow)}"
		`;
	}
	if (bigHeadModeActive && bigHeadPosition == 'end') {
		helperItems.TrackedBuffs2.style.gridTemplateAreas = `
		"${'. '.repeat(buffsPerRow)}first first"
		"${'. '.repeat(buffsPerRow)}first first"
		". . ${'. '.repeat(buffsPerRow)}"
		". . ${'. '.repeat(buffsPerRow)}"
		". . ${'. '.repeat(buffsPerRow)}"
		`;
	}
	if (!bigHeadModeActive) {
		helperItems.TrackedBuffs2.style.gridTemplateAreas = `
		"${'. '.repeat(buffsPerRow)}"
		"${'. '.repeat(buffsPerRow)}"
		"${'. '.repeat(buffsPerRow)}"
		"${'. '.repeat(buffsPerRow)}"
		"${'. '.repeat(buffsPerRow)}"
		`;
	}
	if (bigHeadModeActive && bigHeadPosition == 'start') {
		helperItems.TrackedBuffs3.style.gridTemplateAreas = `
		"first first ${'. '.repeat(buffsPerRow)}"
		"first first ${'. '.repeat(buffsPerRow)}"
		". . ${'. '.repeat(buffsPerRow)}"
		". . ${'. '.repeat(buffsPerRow)}"
		". . ${'. '.repeat(buffsPerRow)}"
		`;
	}
	if (bigHeadModeActive && bigHeadPosition == 'end') {
		helperItems.TrackedBuffs3.style.gridTemplateAreas = `
		"${'. '.repeat(buffsPerRow)}first first"
		"${'. '.repeat(buffsPerRow)}first first"
		". . ${'. '.repeat(buffsPerRow)}"
		". . ${'. '.repeat(buffsPerRow)}"
		". . ${'. '.repeat(buffsPerRow)}"
		`;
	}
	if (!bigHeadModeActive) {
		helperItems.TrackedBuffs3.style.gridTemplateAreas = `
		"${'. '.repeat(buffsPerRow)}"
		"${'. '.repeat(buffsPerRow)}"
		"${'. '.repeat(buffsPerRow)}"
		"${'. '.repeat(buffsPerRow)}"
		"${'. '.repeat(buffsPerRow)}"
		`;
	}
}

function disableNameSetting() {
	if (sauce.getSetting('showBuffNames')) {
		sauce.updateSetting('showBuffNames', false);
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
		setTimeout(() => {
			alt1.overLaySetGroup('buffsArea');
			alt1.overLayRect(
				a1lib.mixColor(120, 255, 120),
				buffs.getCaptRect().x,
				buffs.getCaptRect().y,
				buffs.getCaptRect().width,
				buffs.getCaptRect().height,
				3000,
				1
			);
		}, 1000);
		setTimeout(() => {
			alt1.overLayClearGroup('buffsArea');
		}, 4000);
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
const currentVersion = "2.0.5";
const settingsObject = {
	settingsHeader: sauce.createHeading(
		'h2',
		'Better Buffs Bar - v' + currentVersion
	),
	settingDiscord: sauce.createText(
		`Please <a href="https://discord.gg/KJ2SgWyJFF" target="_blank" rel="nofollow">join the Discord</a> for any suggestions or support`
	),
	beginGeneral: sauce.createHeading('h2', 'Settings'),
	BuffsPerRow: sauce.createNumberSetting(
		'buffsPerRow',
		'Number of buffs displayed per row',
		{ defaultValue: 10, min: 1, max: 20 }
	),
	FadeInactiveBuffs: sauce.createCheckboxSetting(
		'fadeInactiveBuffs',
		'<u>Explicitly Inactive</u> Instead of hiding inactive buffs - displays them darker and desaturated',
		sauce.getSetting('fadeInactiveBuffs') ?? true
	),
	Brightness: sauce.createRangeSetting(
		'brightness',
		'<u>Light Level</u> Control how dark inactive buffs should be - lower number being darker',
		{ defaultValue: '75', min: 5, max: 100, unit: '%' }
	),
	BigHeadMode: sauce.createCheckboxSetting(
		'bigHeadMode',
		'<u>Big Head Mode</u> The first buff tracked  is made x4 larger.',
		sauce.getSetting('bigHeadMode') ?? false
	),
	BigHeadPosition: sauce.createDropdownSetting(
		'bigHeadPosition',
		'<u>Big Head Position</u> Set display position to Left or Right side',
		'start',
		[
			{ value: 'start', name: 'Left Side' },
			{ value: 'end', name: 'Right Side' },
		]
	),
	OverloadReminder: sauce.createCheckboxSetting(
		'overloadReminder',
		'<u>Overload Reminder</u> Display a tooltip after Overloads expires which lasts 3 seconds',
		sauce.getSetting('overloadReminder') ?? true
	),
	BlinkExpiredBuffs: sauce.createCheckboxSetting(
		'showMaintainableBlinking',
		'<u>100% Uptime</u> Adds a blinking "!!" effect for inactive buffs that can and should be maintained with 100% uptime',
		sauce.getSetting('showMaintainableBlinking') ?? true
	),
	SingleBOLG: sauce.createCheckboxSetting(
		'singleBOLG',
		'<u>Split BOLG Weapon Special / Stacks</u> Tracks Balance by Force and Perfect Equlibrium stacks as separate buffs',
		sauce.getSetting('singleBOLG') ?? false
	),
	endGeneral: sauce.createSeperator(),
	OverlayHeader: sauce.createHeading('h2', 'Overlay'),
	OverlayActive: sauce.createCheckboxSetting(
		'activeOverlay',
		"<u>Enable Overlay</u> When the overlay is toggled off - the app will hide the entire UI unless your mouse is over the app. This is for users who don't mind having a background and want to avoid the delay the overlay has",
		sauce.getSetting('activeOverlay') ?? false
	),
	OverlaySmallText: sauce.createSmallText(
		`If the overlay does not show - check the "Show overlay" permission is enabled for this plugin in Alt1's settings or try setting the position using the button below.`
	),
	OverlayPositionButton: sauce.createButton(
		'Set Overlay Position',
		setOverlayPosition,
		{ classes: ['nisbutton'] }
	),
	Overlay2PositionButton: sauce.createButton(
		'Set Overlay 2 Position',
		setOverlayPosition2,
		{ classes: ['nisbutton', 'beta-only'] }
	),
	Overlay3PositionButton: sauce.createButton(
		'Set Overlay 3 Position',
		setOverlayPosition3,
		{ classes: ['nisbutton', 'beta-only'] }
	),
	ScaleHeader: sauce.createHeading('h3', 'Scale'),
	UIScale: sauce.createRangeSetting(
		'uiScale',
		'Adjusts the size of the Overlay',
		{
			defaultValue: '100',
			min: 50,
			max: 200,
		}
	),
	UIScale2: sauce.createRangeSetting(
		'uiScale2',
		'Adjusts the size of the second Overlay',
		{
			classes: ['beta-only'],
			defaultValue: '100',
			min: 50,
			max: 200,
		}
	),
	UIScale3: sauce.createRangeSetting(
		'uiScale3',
		'Adjusts the size of the third Overlay',
		{
			classes: ['beta-only'],
			defaultValue: '100',
			min: 50,
			max: 200,
		}
	),
	delayHeader: sauce.createHeading('h3', 'Delay Compensation'),
	DelayAdjustment: sauce.createRangeSetting(
		'delayAdjustment',
		`Subtracts time from visible countdowns to adjust for overlay delay`,
		{
			defaultValue: sauce.getSetting('delayAdjustment') ?? '1',
			min: 0,
			max: 5,
			unit: 's',
		}
	),
	OverlayRefreshHeader: sauce.createHeading('h3', 'Refresh Rate'),
	OverlayRefreshRate: sauce.createRangeSetting(
		'overlayRefreshRate',
		'The rate that the overlay should refresh - in milliseconds. Requires reloading to take effect.',
		{ defaultValue: '50', min: 20, max: 500, unit: 'ms' }
	),
	endOverlay: sauce.createSeperator(),
	SearchHeader: sauce.createHeading('h3', 'Interface Search Speed'),
	SearchSpeed: sauce.createRangeSetting(
		'loopSpeed',
		'Lower value will detect changes faster but may cause hits to overall performance. Adjust at your own risk - the default value should generally be fine. Requires reloading to take effect.',
		{
			defaultValue: '150',
			min: 50,
			max: 300,
			unit: 'ms',
		}
	),
	endSearch: sauce.createSeperator(),
	ProfileManager: sauce.createProfileManager(),
	ResetHeader: sauce.createHeading('h3', 'Reset Config'),
	ResetText: sauce.createText(
		`This will reset your configuration and reload the plugin in an attempt to solve any problems caused by missing or bad values`
	),
	resetButton: sauce.createButton(
		'Reset All Settings',
		deleteLocalStorage,
		{ classes: ['nisbutton'] }
	),
	endreset: sauce.createSeperator(),
	troubleshootingHeader: sauce.createHeading(
		'h3',
		'Here is trouble (Make it double!)'
	),
	debugMode: sauce.createCheckboxSetting('debugMode', 'Debug mode', false),
	beta: sauce.createCheckboxSetting('beta', 'Beta Testing', false),
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

settingsObject.OverlayActive.querySelector('input').addEventListener(
	'click',
	() => {
		setTimeout(function () {}, 100);
		location.reload();
	}
);

settingsObject.Brightness.querySelector('input').addEventListener('change', (e) => {
	document.documentElement.style.setProperty(
		'--brightness',
		(parseInt(settingsObject.Brightness.querySelector('input').value, 10) / 100).toString()
	);
});

settingsObject.debugMode
	.querySelector('input')
	.addEventListener('change', () => {
		setTimeout(function () {}, 100);
		location.reload();
	});

settingsObject.beta.querySelector('input').addEventListener('change', () => {
	setTimeout(function () {}, 100);
	location.reload();
});

window.onload = function () {
	//check if we are running inside alt1 by checking if the alt1 global exists
	if (window.alt1) {
		//tell alt1 about the app
		//this makes alt1 show the add app button when running inside the embedded browser
		//also updates app settings if they are changed
		alt1.identifyAppUrl('./appconfig.json');

		initSettings();
		let settings = document.querySelector('#Settings .container');
		Object.values(settingsObject).forEach((val) => {
			settings.before(val);
		});
		startBetterBuffsBar();

		document.documentElement.style.setProperty(
			'--brightness',
			(
				parseInt(
					settingsObject.Brightness.querySelector(
						'input'
					).value,
					10
				) / 100
			).toString()
		);
		const mutationConfig = { attributes: false, childList: true, subtree: false };
		const callback = (mutationList, observer) => {
			for (const mutation of mutationList) {
				if (mutation.type === 'childList') {
					document.documentElement.style.setProperty(
						'--brightness',
						(
							parseInt(
								settingsObject.Brightness.querySelector(
									'input'
								).value,
								10
							) / 100
						).toString()
					);
				}
			}
		};
		const observer = new MutationObserver(callback);
		observer.observe(helperItems.TrackedBuffs, mutationConfig);
		observer.observe(helperItems.UntrackedBuffs, mutationConfig);
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
