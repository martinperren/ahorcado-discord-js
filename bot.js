const Discord = require("discord.js");
const client = new Discord.Client();
const { Pyke } = require('pyke');
const pyke = new Pyke(process.env.RIOT_API); // 10 seconds to cache

let tierSD, rankSD, lpSD, winsSD, lossesSD, winrateSD, tierFlex, rankFlex, lpFlex, winsFlex, lossesFlex, winrateFlex, hotStreak, opgg, queueId;



/*
function getLastVersion() {
	request('http://ddragon.leagueoflegends.com/api/versions.json', function (error, response, body) {

		let version = JSON.parse(body);
		console.log("VERSION: " + version)
		return version[0];



	});
}
*/




client.on("ready", () => {
	console.log("Bot iniciado");
	client.user.setActivity(process.env.GAME, { type: 'LISTENING' })
		.then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
		.catch(console.error);

});



function Player(nick, champ, leaguePos, maestria) {
	this.nick = nick;
	this.champ = champ;
	this.tierSD = leaguePos.all.RANKED_SOLO_5x5.tier;
	this.rankSD = leaguePos.all.RANKED_SOLO_5x5.rank;
	this.lpSD = leaguePos.all.RANKED_SOLO_5x5.leaguePoints;
	this.winsSD = leaguePos.all.RANKED_SOLO_5x5.wins;
	this.lossesSD = leaguePos.all.RANKED_SOLO_5x5.losses;
	this.winrateSD = round([this.winsSD / (this.winsSD + this.lossesSD)] * 100, 1);
	this.hotStreak = "";
	this.opgg = opgg;
	this.maestria = maestria;

	if (leaguePos.all.RANKED_SOLO_5x5.hotStreak) {
		this.hotStreak = ":fire:"

	}


	if (this.tierSD.toString() != "Unranked") {



		this.lpSD = "(" + this.lpSD.toString() + " PL)";

	} else {
		this.tierSD = "UNRANKED";
	}


	if (isNaN(this.winrateSD)) {
		this.winrateSD = "ND";
	} else {
		this.winrateSD = this.winrateSD + "%";
	}



}


function getMastriaEmote(key) {

	var Emotes = {


		'0': '724374456616615958',
		'1': '724164725235253248',
		'2': '724164725440643112',
		'3': '724164725348499517',
		'4': '724164725402763274',
		'5': '724164725725986877',
		'6': '724164725809872927',
		'7': '724164725965062185'

	}


	Object.freeze(Emotes);


	return Emotes[key];

}

function getEloEmote(key) {

	var Emotes = {

		'CHALLENGER': '723808761441157162',
		'DIAMOND': '723809276841164811',
		'GOLD': '723809276920856578',
		'IRON': '723809277902323754',
		'PLATINUM': '723809277944528922',
		'GRANDMASTER': '723809278158176266',
		'SILVER': '723809278275616819',
		'MASTER': '723809279135711303',
		'BRONZE': '723809588301791272',
		'UNRANKED': '724078663691403374'

	}


	Object.freeze(Emotes);


	return Emotes[key];

}

function getChampionEmote(key) {

	var Emotes = {

		'None': '724147103680692277',
		'Challenger': '723808761441157162',
		'Diamond': '723809276841164811',
		'Gold': '723809276920856578',
		'Iron': '723809277902323754',
		'Platinum': '723809277944528922',
		'Grandmaster': '723809278158176266',
		'Silver': '723809278275616819',
		'Master': '723809279135711303',
		'Bronze': '723809588301791272',
		'Aatrox': '723802342453018696',
		'Ahri': '723802348433965067',
		'Alistar': '723802351051472977',
		'Akali': '723802359037165578',
		'Braum': '723802361130385520',
		'Aphelios': '723802362627751966',
		'Ashe': '723802363734917161',
		'Annie': '723802364284370965',
		'Amumu': '723802367736414208',
		'Camille': '723802369262878740',
		'Bard': '723802370466906184',
		'Kindred': '723802371058302978',
		'Azir': '723802372144627732',
		'AurelionSol': '723802372530503740',
		'Elise': '723802372589092895',
		'LeeSin': '723802373042208799',
		'Karthus': '723802374514278423',
		'Cassiopeia': '723802374594101308',
		'Anivia': '723802374673530890',
		'Caitlyn': '723802375059406889',
		'Kled': '723802375110000671',
		'Zac': '723802375453933599',
		'Maokai': '723802375847936072',
		'Fizz': '723802375894073424',
		'Mordekaiser': '723802375982415882',
		'Jayce': '723802376368160798',
		'Diana': '723802376506703912',
		'Kalista': '723802376619950110',
		'TahmKench': '723802377026535494',
		'DrMundo': '723802377311748107',
		'Urgot': '723802377320267857',
		'Ivern': '723802377550954517',
		'Janna': '723802377735634974',
		'Illaoi': '723802377819389952',
		'Ekko': '723802377974448128',
		'Jax': '723802377978773555',
		'Nocturne': '723802378020847676',
		'Yorick': '723802378142482502',
		'Evelynn': '723802378159259688',
		'Draven': '723802378184425482',
		'Khazix': '723802378272243782',
		'Graves': '723802378301866014',
		'Lucian': '723802378465181768',
		'RekSai': '723802378796662854',
		'Swain': '723802378813440010',
		'Lissandra': '723802379043995688',
		'Malphite': '723802379094327336',
		'Orianna': '723802379191058483',
		'Darius': '723802379333664768',
		'Blitzcrank': '723802380071862303',
		'Shen': '724066794356080710',
		'Sion': '724066794905534574',
		'Annie': '723806005359542293',
		'Braum': '723806005686698045',
		'Cassiopeia': '723806006424895529',
		'Brand': '723806008824037506',
		'Chogath': '723806011152138264',
		'Galio': '723806017183285268',
		'Gnar': '723806017326153778',
		'Gragas': '723806017351057488',
		'Jinx': '723806018185855028',
		'JarvanIV': '723806018248769546',
		'Fiora': '723806018269610065',
		'Jhin': '723806018328592386',
		'KogMaw': '723806018479325287',
		'Kennen': '723806018617737227',
		'FiddleSticks': '723806018840035369',
		'Irelia': '723806018957737995',
		'Nidalee': '723806018991030303',
		'Kayle': '723806018995355669',
		'Kayn': '723806019125510174',
		'Pantheon': '723806019167453185',
		'Ornn': '723806019188424765',
		'Karma': '723806019343351878',
		'Kaisa': '723806019347808367',
		'Morgana': '723806019632758784',
		'Nautilus': '723806019838410802',
		'Corki': '723806019846930482',
		'Wukong': '723806019867640081',
		'Garen': '723806020119560192',
		'Nunu': '723806020178018324',
		'MasterYi': '723806020421550101',
		'Nami': '723806020442259496',
		'Quinn': '723806020513824820',
		'Qiyana': '723806020652105759',
		'Lulu': '723806020660494358',
		'Ezreal': '723806020706500719',
		'Leona': '723806020773871678',
		'Hecarim': '723806020895506432',
		'Gangplank': '723806020907958333',
		'Lux': '723806020987650060',
		'Malzahar': '723806021050564651',
		'Nasus': '723806021092638721',
		'Pyke': '723806021159485511',
		'Olaf': '723806021205622836',
		'Kassadin': '723806021264605245',
		'Katarina': '723806021306417172',
		'MissFortune': '723806021323325451',
		'Leblanc': '723806021415469106',
		'Neeko': '723806021440503829',
		'Poppy': '723806021461606450',
		'Heimerdinger': '723806021675384832',
		'Rakan': '723806464174456892',
		'Rammus': '723806464703070230',
		'Renekton': '723806465520959548',
		'Rengar': '723806465864761396',
		'Riven': '723806466212888647',
		'Shaco': '723806474412883979',
		'Singed': '723806475406934026',
		'Sona': '723806475796873217',
		'Sett': '723806475906187274',
		'Senna': '723806476195594330',
		'Volibear': '723806476426280970',
		'Sivir': '723806476526944287',
		'Ryze': '723806476547915798',
		'Tristana': '723806476568887386',
		'Sejuani': '723806476581470249',
		'Syndra': '723806476677677098',
		'Sylas': '723806476795117598',
		'Trundle': '723806476841385987',
		'Warwick': '723806477072072754',
		'Taliyah': '723806477109821440',
		'Rumble': '723806477147570227',
		'TwistedFate': '723806477218873355',
		'Soraka': '723806477285851167',
		'Twitch': '723806477365542994',
		'Skarner': '723806477550354442',
		'Xayah': '723806477567131659',
		'Viktor': '723806477583908927',
		'Udyr': '723806477722320916',
		'Talon': '723806477810139206',
		'Taric': '723806477915127878',
		'Tryndamere': '723806477935968266',
		'Zyra': '723806477990494241',
		'Veigar': '723806478095351828',
		'Varus': '723806478103871498',
		'Zed': '723806478183694356',
		'Vi': '723806478422507570',
		'Ziggs': '723806478506393690',
		'Zilean': '723806478674165790',
		'Yasuo': '723806478753988638',
		'Yuumi': '723806478992932895',
		'Zoe': '723806479018098718',
		'Shyvana': '723806479022293002',
		'Velkoz': '723806479072624662',
		'Xerath': '723806479072886804',
		'Thresh': '723806479081144370',
		'XinZhao': '723806479143927843',
		'Vladimir': '723806479181807666',
		'Vayne': '723806479211167795',
		'Teemo': '723806479307767843',
		'Lillia' : '737445394686148649',
		'Yone' : '742095392258129980'

	}


	Object.freeze(Emotes);


	return Emotes[key];

}

function getChampionName(key) {

	var Champions = {
		'-1': 'None',
		'1': 'Annie',
		'2': 'Olaf',
		'3': 'Galio',
		'4': 'TwistedFate',
		'5': 'XinZhao',
		'6': 'Urgot',
		'7': 'Leblanc',
		'8': 'Vladimir',
		'9': 'FiddleSticks',
		'10': 'Kayle',
		'11': 'MasterYi',
		'12': 'Alistar',
		'13': 'Ryze',
		'14': 'Sion',
		'15': 'Sivir',
		'16': 'Soraka',
		'17': 'Teemo',
		'18': 'Tristana',
		'19': 'Warwick',
		'20': 'Nunu',
		'21': 'MissFortune',
		'22': 'Ashe',
		'23': 'Tryndamere',
		'24': 'Jax',
		'25': 'Morgana',
		'26': 'Zilean',
		'27': 'Singed',
		'28': 'Evelynn',
		'29': 'Twitch',
		'30': 'Karthus',
		'31': 'Chogath',
		'32': 'Amumu',
		'33': 'Rammus',
		'34': 'Anivia',
		'35': 'Shaco',
		'36': 'DrMundo',
		'37': 'Sona',
		'38': 'Kassadin',
		'39': 'Irelia',
		'40': 'Janna',
		'41': 'Gangplank',
		'42': 'Corki',
		'43': 'Karma',
		'44': 'Taric',
		'45': 'Veigar',
		'48': 'Trundle',
		'50': 'Swain',
		'51': 'Caitlyn',
		'53': 'Blitzcrank',
		'54': 'Malphite',
		'55': 'Katarina',
		'56': 'Nocturne',
		'57': 'Maokai',
		'58': 'Renekton',
		'59': 'JarvanIV',
		'60': 'Elise',
		'61': 'Orianna',
		'62': 'Wukong',
		'63': 'Brand',
		'64': 'LeeSin',
		'67': 'Vayne',
		'68': 'Rumble',
		'69': 'Cassiopeia',
		'72': 'Skarner',
		'74': 'Heimerdinger',
		'75': 'Nasus',
		'76': 'Nidalee',
		'77': 'Udyr',
		'78': 'Poppy',
		'79': 'Gragas',
		'80': 'Pantheon',
		'81': 'Ezreal',
		'82': 'Mordekaiser',
		'83': 'Yorick',
		'84': 'Akali',
		'85': 'Kennen',
		'86': 'Garen',
		'89': 'Leona',
		'90': 'Malzahar',
		'91': 'Talon',
		'92': 'Riven',
		'96': 'KogMaw',
		'98': 'Shen',
		'99': 'Lux',
		'101': 'Xerath',
		'102': 'Shyvana',
		'103': 'Ahri',
		'104': 'Graves',
		'105': 'Fizz',
		'106': 'Volibear',
		'107': 'Rengar',
		'110': 'Varus',
		'111': 'Nautilus',
		'112': 'Viktor',
		'113': 'Sejuani',
		'114': 'Fiora',
		'115': 'Ziggs',
		'117': 'Lulu',
		'119': 'Draven',
		'120': 'Hecarim',
		'121': 'Khazix',
		'122': 'Darius',
		'126': 'Jayce',
		'127': 'Lissandra',
		'131': 'Diana',
		'133': 'Quinn',
		'134': 'Syndra',
		'136': 'AurelionSol',
		'141': 'Kayn',
		'142': 'Zoe',
		'143': 'Zyra',
		'145': 'Kaisa',
		'150': 'Gnar',
		'154': 'Zac',
		'157': 'Yasuo',
		'161': 'Velkoz',
		'163': 'Taliyah',
		'164': 'Camille',
		'201': 'Braum',
		'202': 'Jhin',
		'203': 'Kindred',
		'222': 'Jinx',
		'223': 'TahmKench',
		'236': 'Lucian',
		'238': 'Zed',
		'240': 'Kled',
		'245': 'Ekko',
		'246': 'Qiyana',
		'254': 'Vi',
		'266': 'Aatrox',
		'267': 'Nami',
		'268': 'Azir',
		'350': 'Yuumi',
		'412': 'Thresh',
		'420': 'Illaoi',
		'421': 'RekSai',
		'427': 'Ivern',
		'429': 'Kalista',
		'432': 'Bard',
		'497': 'Rakan',
		'498': 'Xayah',
		'516': 'Ornn',
		'517': 'Sylas',
		'518': 'Neeko',
		'523': 'Aphelios',
		'555': 'Pyke',
		'235': 'Senna',
		'875': 'Sett',
		'876' : 'Lillia',
		'777' : 'Yone'
	}



	Object.freeze(Champions);


	return Champions[key];

}

function getQueue(key) {

	var Queue = {

		'0': 'Custom games',
		'76': 'Ultra Rapid Fire | Grieta del invocador',
		'78': 'One For All: Mirror Mode | Abismo de los lamentos',
		'83': 'Co-op vs AI Ultra Rapid Fire | Grieta del invocador',
		'100': 'ARAM | Butchers Bridge',
		'325': 'All Random games | Grieta del invocador',
		'400': '5v5 Draft Pick | Grieta del invocador',
		'420': 'Ranked Solo | Grieta del invocador',
		'430': 'Blind Pick | Grieta del invocador',
		'440': 'Ranked Flex | Grieta del invocador',
		'450': 'ARAM | Abismo de los lamentos',
		'700': 'Clash | Grieta del invocador',
		'830': 'Co-op vs. Bots | Grieta del invocador',
		'840': 'Co-op vs. Bots | Grieta del invocador',
		'850': 'Co-op vs. Bots | Grieta del invocador',
		'900': 'URF | Grieta del invocador',
		'1010': 'Snow ARURF | Grieta del invocador',
		'1020': 'One for All | Grieta del invocador',
		'2000': 'Tutorial 1 | Grieta del invocador',
		'2010': 'Tutorial 2 | Grieta del invocador',
		'2020': 'Tutorial 3 | Grieta del invocador'


	}


	Object.freeze(Queue);


	return Queue[key];

}



function toMins(s) { return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s }


function round(value, precision) {
	var multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
}


client.on("message", async message => {




	if (message.content.startsWith("!help")) {
	

		message.channel.send("Informacion de partida en vivo !m jugador\nRango del invocador !elo jugador");



	}



	if (message.content.startsWith("!elo")) {


		let args = message.content.substring(1).split(" ");

		args.splice(0, 1);
		const username = args.join(" ");

		const embed = new Discord.RichEmbed();


		var sum;

		var profileImage;
		var regionID = "la2";
		const ayy = client.emojis.get("305818615712579584");

		try {
			sum = await pyke.summoner.getBySummonerName(String(username), regionID);
			profileImage = sum.profileIconId;

		} catch (err) {
			if (err.statuscode == 404) {

				message.channel.send("el jugador " + username + " no existe en LAS. ")
			}
		}

		if (typeof (sum) != "undefined") {

			try {

				let leaguePos;

				leaguePos = await pyke.league.getAllLeaguePositionsForSummoner(sum.id, regionID);


				tierSD = leaguePos.all.RANKED_SOLO_5x5.tier;
				rankSD = leaguePos.all.RANKED_SOLO_5x5.rank;
				lpSD = leaguePos.all.RANKED_SOLO_5x5.leaguePoints;
				winsSD = leaguePos.all.RANKED_SOLO_5x5.wins;
				lossesSD = leaguePos.all.RANKED_SOLO_5x5.losses;
				winrateSD = round([winsSD / (winsSD + lossesSD)] * 100, 1);


				tierFlex = leaguePos.all.RANKED_FLEX_SR.tier;
				rankFlex = leaguePos.all.RANKED_FLEX_SR.rank;
				lpFlex = leaguePos.all.RANKED_FLEX_SR.leaguePoints;
				winsFlex = leaguePos.all.RANKED_FLEX_SR.wins;
				lossesFlex = leaguePos.all.RANKED_FLEX_SR.losses;
				winrateFlex = round([winsFlex / (winsFlex + lossesFlex)] * 100, 1);


				if (tierSD.toString() != "Unranked") {

					lpSD = lpSD.toString() + " PL";

				}


				if (tierFlex.toString() != "Unranked") {

					lpFlex = lpFlex.toString() + " PL";

				}

				if (isNaN(winrateFlex)) {
					winrateFlex = "ND";
				} else {
					winrateFlex = winrateFlex + "%";
				}

				if (isNaN(winrateSD)) {
					winrateSD = "ND";
				} else {
					winrateSD = winrateSD + "%";
				}



				hotStreak = "";
				if (leaguePos.all.RANKED_SOLO_5x5.hotStreak) {
					hotStreak = "Racha de victorias :fire:"
				}



				embed.setAuthor(username, "http://ddragon.leagueoflegends.com/cdn/10.12.1/img/profileicon/" + profileImage + ".png")
					.setColor(0x26caf5)
					.setDescription(
						"**Solo/Duo:** " + tierSD + " " + rankSD + " " + lpSD + " **Winrate: **" + winrateSD +
						"\n**Flex: **" + tierFlex + " " + rankFlex + " " + lpFlex + "** Winrate: **" + winrateFlex +
						"\n" + hotStreak)
					.setThumbnail("http://ddragon.leagueoflegends.com/cdn/10.12.1/img/profileicon/" + profileImage + ".png");




				message.channel.send({ embed });

			} catch (err) {
				//	console.log(err);



			}

		}


	}


	if (message.content.startsWith("!m")) {


		console.time("livematch");
		let data;
		let sumAux, queue;
		let args = message.content.substring(1).split(" ");
		args.splice(0, 1);
		const username = args.join(" ");
		let leaguePos;
		let championName;
		let champEmoji;
		var i;
		var players = new Array();
		var sum;
		var regionID = "la2";
		let maestria;

		const embed = new Discord.RichEmbed().setColor(0x26caf5);

		//get summoner ID


		try {
			sum = await pyke.summoner.getBySummonerName(String(username), regionID);

		} catch (err) {
			if (err.statuscode == 404) {
				message.channel.send("el jugador " + username + " no existe en LAS.")
			}
		}

		//get current game info
		try {



			data = await pyke.spectator.getCurrentGameInfoBySummoner(sum.id, regionID);


			//	console.log(bannedChampions);

			if (data.gameType == "CUSTOM_GAME") {
				queue = getQueue(0);
			} else {
				queueId = data.gameQueueConfigId;
				queue = getQueue(queueId);
			}

			embed.setTitle("Partida de " + username + " | " + queue + " " + "(" + toMins(data.gameLength) + ")");

		} catch (err) {


			if (err.statuscode == 404) {
				message.channel.send(username + " no está en una partida.")
			}


		}

		if (typeof (data) != "undefined") {
			for (i = 0; i < 10; i++) {

				sumAux = data.participants[i].summonerId;


				//test de maestria
				try {

					maestria = await pyke.masteries.getChampionMastery(sumAux, regionID, data.participants[i].championId);

					maestria = maestria.championLevel;


				} catch (err) {
					//En el caso de alguien con maestria 0 loguea el error, por eso comento la linea.
					//console.log(err);
					maestria = 0;

				}


				//get ranks

				try {

					leaguePos = await pyke.league.getAllLeaguePositionsForSummoner(sumAux, regionID);

					//	opgg = data.participants[i].summonerName.split(' ').join('+');

					championName = getChampionName(data.participants[i].championId);
					champEmoji = client.emojis.get(getChampionEmote(championName));
					opgg = "https://las.op.gg/summoner/userName=" + data.participants[i].summonerName.split(' ').join('+');

					players.push(new Player(data.participants[i].summonerName, championName, leaguePos, maestria, opgg));

				} catch (err) {
					//console.log(err);
				}



			}



			embed.addField(client.emojis.get("724061793147813990") + " Blue Team",
				client.emojis.get(getMastriaEmote(players[0].maestria)) + " " + client.emojis.get(getChampionEmote(players[0].champ)) + " [" + players[0].nick + "](" + players[0].opgg + ") " + players[0].hotStreak + "\n" +
				client.emojis.get(getMastriaEmote(players[1].maestria)) + " " + client.emojis.get(getChampionEmote(players[1].champ)) + " [" + players[1].nick + "](" + players[1].opgg + ") " + players[1].hotStreak + "\n" +
				client.emojis.get(getMastriaEmote(players[2].maestria)) + " " + client.emojis.get(getChampionEmote(players[2].champ)) + " [" + players[2].nick + "](" + players[2].opgg + ") " + players[2].hotStreak + "\n" +
				client.emojis.get(getMastriaEmote(players[3].maestria)) + " " + client.emojis.get(getChampionEmote(players[3].champ)) + " [" + players[3].nick + "](" + players[3].opgg + ") " + players[3].hotStreak + "\n" +
				client.emojis.get(getMastriaEmote(players[4].maestria)) + " " + client.emojis.get(getChampionEmote(players[4].champ)) + " [" + players[4].nick + "](" + players[4].opgg + ") " + players[4].hotStreak + "\n"
				, true);
			embed.addField("Rank",
				client.emojis.get(getEloEmote(players[0].tierSD)) + " " + players[0].tierSD + " " + players[0].rankSD + " " + players[0].lpSD + "\n" +
				client.emojis.get(getEloEmote(players[1].tierSD)) + " " + players[1].tierSD + " " + players[1].rankSD + " " + players[1].lpSD + "\n" +
				client.emojis.get(getEloEmote(players[2].tierSD)) + " " + players[2].tierSD + " " + players[2].rankSD + " " + players[2].lpSD + "\n" +
				client.emojis.get(getEloEmote(players[3].tierSD)) + " " + players[3].tierSD + " " + players[3].rankSD + " " + players[3].lpSD + "\n" +
				client.emojis.get(getEloEmote(players[4].tierSD)) + " " + players[4].tierSD + " " + players[4].rankSD + " " + players[4].lpSD + "\n"
				, true);
			embed.addField("Winrate",
				"  " + players[0].winrateSD + "\n" +
				"  " + players[1].winrateSD + "\n" +
				"  " + players[2].winrateSD + "\n" +
				"  " + players[3].winrateSD + "\n" +
				"  " + players[4].winrateSD + "\n"
				, true);


			embed.addField(client.emojis.get("724060843670503474") + " Red Team",
				client.emojis.get(getMastriaEmote(players[5].maestria)) + " " + client.emojis.get(getChampionEmote(players[5].champ)) + " [" + players[5].nick + "](" + players[5].opgg + ") " + players[5].hotStreak + "\n" +
				client.emojis.get(getMastriaEmote(players[6].maestria)) + " " + client.emojis.get(getChampionEmote(players[6].champ)) + " [" + players[6].nick + "](" + players[6].opgg + ") " + players[6].hotStreak + "\n" +
				client.emojis.get(getMastriaEmote(players[7].maestria)) + " " + client.emojis.get(getChampionEmote(players[7].champ)) + " [" + players[7].nick + "](" + players[7].opgg + ") " + players[7].hotStreak + "\n" +
				client.emojis.get(getMastriaEmote(players[8].maestria)) + " " + client.emojis.get(getChampionEmote(players[8].champ)) + " [" + players[8].nick + "](" + players[8].opgg + ") " + players[8].hotStreak + "\n" +
				client.emojis.get(getMastriaEmote(players[9].maestria)) + " " + client.emojis.get(getChampionEmote(players[9].champ)) + " [" + players[9].nick + "](" + players[9].opgg + ") " + players[9].hotStreak + "\n"
				, true);
			embed.addField("Rank",
				client.emojis.get(getEloEmote(players[5].tierSD)) + " " + players[5].tierSD + " " + players[5].rankSD + " " + players[5].lpSD + "\n" +
				client.emojis.get(getEloEmote(players[6].tierSD)) + " " + players[6].tierSD + " " + players[6].rankSD + " " + players[6].lpSD + "\n" +
				client.emojis.get(getEloEmote(players[7].tierSD)) + " " + players[7].tierSD + " " + players[7].rankSD + " " + players[7].lpSD + "\n" +
				client.emojis.get(getEloEmote(players[8].tierSD)) + " " + players[8].tierSD + " " + players[8].rankSD + " " + players[8].lpSD + "\n" +
				client.emojis.get(getEloEmote(players[9].tierSD)) + " " + players[9].tierSD + " " + players[9].rankSD + " " + players[9].lpSD + "\n"
				, true);
			embed.addField("Winrate",
				"  " + players[5].winrateSD + "\n" +
				"  " + players[6].winrateSD + "\n" +
				"  " + players[7].winrateSD + "\n" +
				"  " + players[8].winrateSD + "\n" +
				"  " + players[9].winrateSD + "\n"
				, true);



			if (queueId != 430) {

				embed.addField("Banned Champions",
					client.emojis.get("724061793147813990") + " " +
					client.emojis.get(getChampionEmote(getChampionName(data.bannedChampions[0].championId))) + " " +
					client.emojis.get(getChampionEmote(getChampionName(data.bannedChampions[1].championId))) + " " +
					client.emojis.get(getChampionEmote(getChampionName(data.bannedChampions[2].championId))) + " " +
					client.emojis.get(getChampionEmote(getChampionName(data.bannedChampions[3].championId))) + " " +
					client.emojis.get(getChampionEmote(getChampionName(data.bannedChampions[4].championId))) + " " +
					client.emojis.get("724060843670503474") + " " +
					client.emojis.get(getChampionEmote(getChampionName(data.bannedChampions[5].championId))) + " " +
					client.emojis.get(getChampionEmote(getChampionName(data.bannedChampions[6].championId))) + " " +
					client.emojis.get(getChampionEmote(getChampionName(data.bannedChampions[7].championId))) + " " +
					client.emojis.get(getChampionEmote(getChampionName(data.bannedChampions[8].championId))) + " " +
					client.emojis.get(getChampionEmote(getChampionName(data.bannedChampions[9].championId))) + " "
					, false);

			}
			console.timeEnd("livematch");
			message.channel.send({ embed });
		}

	}

	if (message.content.includes("huevo")) {
		message.react("537716624296378399");
	}



});




client.login(process.env.BOT_TOKEN);
