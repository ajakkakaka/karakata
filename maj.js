const version = "1.0.0"
function date(){
	var d = new Date();
	var h = d.getHours();
	if(h < 10) h = "0"+h
	var m = d.getMinutes();
	if(m < 10) m = "0"+m
	var s = d.getSeconds();
	if(s < 10) s = "0"+s
	
	return h+":"+m+":"+s
}
function verifflags(x){
const discordFlags = [
{name: "Discord_Employee",field: 1},
{name: "Partnered_Server_Owner",field: 2},
{name: "HypeSquad_Events",field: 4},
{name: "Bug_Hunter_Level_1",field: 8},
{name: "House_Bravery",field: 64},
{name: "House_Brilliance",field: 128},
{name: "House_Balance",field: 256},
{name: "Early_Supporter",field: 512},
{name: "Bug_Hunter_Level_2",field: 16384},
{name: "Early_Verified_Bot_Developer",field: 131072},
{name: "Discord_Certified_Moderateur",field: 262144},
{name: "Bot_HTTPS_Interactions", field: 524288},
{name: "Active_Developer", field: 4194304}
]

const flagsfetch = []
discordFlags.forEach(f => {
	if((x & f.field) == f.field){
   	flagsfetch.push(f.name)
	}
})
return flagsfetch;
}

const EPOCH = 1420070400000;
			
function idToBinary(num) {
	let bin = '';
	let high = parseInt(num.slice(0, -10)) || 0;
	let low = parseInt(num.slice(-10));
	while (low > 0 || high > 0) {
		bin = String(low & 1) + bin;
		low = Math.floor(low / 2);
		if (high > 0) {
			low += 5000000000 * (high % 2);
			high = Math.floor(high / 2);
		}
	}
	return bin;
}

const deconstruct = function(snowflake) {
	const BINARY = idToBinary(snowflake).toString(2).padStart(64, '0');
	const res = {
		timestamp: parseInt(BINARY.substring(0, 42), 2) + EPOCH,
		workerID: parseInt(BINARY.substring(42, 47), 2),
		processID: parseInt(BINARY.substring(47, 52), 2),
		increment: parseInt(BINARY.substring(52, 64), 2),
		binary: BINARY
	};
	Object.defineProperty(res, 'date', {
		get: function get() {
			return new Date(this.timestamp);
		},
		enumerable: true,
	});
	return res;
}

const clean = async (text) => {

if (text && text.constructor.name == "Promise")
  text = await text;


if (typeof text !== "string")
  text = require("node:util").inspect(text, { depth: 1 });

text = text
  .replace(/`/g, "`" + String.fromCharCode(8203))
  .replace(/@/g, "@" + String.fromCharCode(8203));


return text;
}
const ok = function(x){
	console.log("\x1b[32m[\x1b[0m  \x1b[33mok\x1b[0m  \x1b[32m]\x1b[0m["+date()+"] "+x);
},
er = function(x){
	console.log("\x1b[31m[\x1b[0m\x1b[33merreur\x1b[0m\x1b[31m]\x1b[0m["+date()+"] "+x);
}
sy = function(x){
	console.log("\x1b[36m[\x1b[0m\x1b[33msystem\x1b[0m\x1b[36m]\x1b[0m["+date()+"] "+x);
}
// installation des modules

console.log("\n\x1b[35m------------------------------------------------------------------------------------------\n")
sy("v??rification des modules, patientez...");
const { exec } =  require("node:child_process");

const modules = [
	"node-fetch@2.6.6",
	"discord.js-selfbot-v13@latest",
	"moment@latest"
]
var manque = []
modules.forEach(async(m) => {
	try {
		const t = require(m.split("@")[0])
	} catch(err){
	manque.push(m)
	}
})
if(manque.length == 0){
	ok("v??rification des modules termin??e");
	
} else {
	er("il manque "+manque.length+" modules");
	sy("installation des modules manquants, cela peut prendre quelques instants...");
	manque.forEach(async(m) => {
		sy("installation du module: "+m.split("@")[0]+" ("+ (manque.indexOf(m)+1)+"/"+manque.length+")...");
		await exec("npm install "+m+" --no-bin-links --save", (error, stdout, stderr) => {
			if(error){
				er(error)
			}
			manque.shift()
			
			ok("installation du module: "+m.split("@")[0]+" termin??e");
			
		})
	})
	
}


//mise a jour
var filles = false
let time = setInterval(() => {
if(manque.length > 0) return;

clearInterval(time);


console.log("\n\x1b[35m------------------------------------------------------------------------------------------\n")
sy("v??rification des fichiers, patientez...");
const fs = require("node:fs")


const files = [
	{
		name: "files/config.json", 
		content: '{"token": "", "prefixe": "//", "color": "#FFFFFF"}'
	},
	{
		name: "files/version.json",
		content: '{"version": "0.0.0"}'
	},
	{
		name: "files/presence.json",
		content: '{"twitch": "","multi":{"presences": [{"number": 0, "description": "a"},{"number": 1, "description": "b"},{"number": 2, "description": "c"}], "type": "STREAMING"}, "multiactiv": {"activ": [{"number": 0, "description": "a"},{"number": 1, "description": "b"},{"number": 2, "description": "c"}], "emojis": [{"number": 0, "description": "0??????"},{"number": 1, "description": "1??????"},{"number": 2, "description": "2??????"}]} }'
	},
	{
		name: "files/fun.json",
		content: '{"reactusers": [], "reactemojis": ["????","????","????","????","????","????????","????????","????????","????????","????????","????","????","????","????","????","????","????","????","???","????","????"], "autodelete": []}'
	},
	{
		name: "files/rpc.json",
		content: '{}'
	},
	{
		name: "files/backups.json",
		content: '{"servers": []}'
	}
]

try {
	fs.mkdirSync("./files"); 
} catch(e) { 
	if ( e.code != 'EEXIST' ) er(e)
}
var miss = []
files.forEach(async f => {
	try {
		const t = await require("./"+f.name)
	} catch(err){
		await miss.push(f)
	}
})

if(miss.length == 0){
	ok("v??rification des fichiers termin??e");
	filles = true
} else {
	er("il manque "+miss.length+" fichiers");
	sy("??criture des fichiers manquants");
	miss.forEach(async(m) => {
		sy("??criture du fichier: "+m.name.split("/")[1]+" ("+(miss.indexOf(m)+1)+"/"+miss.length+")...")
		await fs.appendFile(m.name, m.content, function(err){
			if(err) return er(err)
			ok("??criture du fichier: "+m.name.split("/")[1]+" ("+(miss.indexOf(m)+1)+"/"+miss.length+") termin??e")
			if(miss.indexOf(m)+1 == miss.length) filles = true;
		})
	})
}

let ff = setInterval(() => {
	if(!filles) return;
	clearInterval(ff);
const readline = require("node:readline")
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: ""
})
console.log("\n\x1b[35m------------------------------------------------------------------------------------------\n")

sy("v??rification du token...")
const config = require("./files/config.json"),
presence = require("./files/presence.json"),
backup = require("./files/backups.json")

const dircfg = "./files/config.json",
dirprs = "./files/presence.json",
dirbck = "./files/backups.json"

const Discord = require("discord.js-selfbot-v13")
const fs = require("node:fs")
const fetch = require("node-fetch")

const client = new Discord.Client({
	checkUpdate: false                
});
//fonction par email/mdp
function ftoken(){
	er("\x1b[31maucun token valide, suivez les ??tapes ou tapez 0 pour arr??ter le selfbot\x1b[0m")
	rl.question("entre ton email: ", email => {
		if(email == "0"){
			rl.close()
			process.exit()
		} else {
			rl.question("entre ton mot de passe: ", mdp => {
				if(mdp == "0"){
					rl.close()
					process.exit()
				} else {
					fetch("https://discord.com/api/v9/auth/login", {
						method: "POST",
						body: JSON.stringify({
							email: email,
							password: mdp,
							undelete:false,
							captcha_key:null,
							login_source:null,
							gift_code_sku_id:null
						}),
						headers: {
							"Content-Type": "application/json",
							"x-fingerprint": "715952977180885042.yskHI7mK4iZWhTX7iXlXIcDovRc",
							"x-super-properties" :Buffer.from(JSON.stringify({"os":"Windows","browser":"Chrome","device":"","browser_user_agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36","browser_version":"83.0.4103.61","os_version":"10","referring_domain":"discord.com","referrer_current":"","referring_domain_current":"","release_channel":"stable","client_build_number":60856,"client_event_source":null}), "utf-8").toString("base64"),
							cookie: '__cfduid=d638ccef388c4ca5a94c97c547c7f0d9e1598555308; __cfruid=4d17c1a957fba3c0a08c74ea83114af675f7ef19-1598796039;'
						 }
					}).then(data => data.json()).then(resp => {
												
						if(resp.mfa) {
							er("\x1b[31mvotre compte discord est sous authentification a 2 facteurs. Retirez la et puis r??essayez\x1b[0m")
							rl.close()
							process.exit()
						}
						if(resp.captcha_key){
							er("\x1b[31mvotre compte discord requiere une captcha, connectez vous a votre application discord et r??essayez\x1b[0m")
							rl.close()
							process.exit()
						}

							if(!resp.message){
								ok("compte trouv??, patientez...")
								client.login(resp.token)
								config.token = resp.token
								fs.writeFile(dircfg, JSON.stringify(config, null, 2), (err) => {
									if (err) er(err)
								})
							} else {
								er("email ou mot de passe invalide ("+resp+")")
								ftoken()
							}
						
					})
					
				}
			})
		}
		
	})
}
if(config.token){
	fetch("https://discord.com/api/v9/users/@me", {
		method: "GET",
		headers: {
			"authorization": config.token,
			"Content-Type": "application/json",
		}
	}).then(data => data.json()).then(resp => {
		if(!resp.message){
			ok("token valide, patientez...")
			client.login(config.token)
		} else {
			er("token invalide")
			ftoken()
		}
	})
} else {
	er("aucun token trouv??")
	ftoken()
}



client.on("ready", () => {
	console.log("\n\x1b[35m------------------------------------------------------------------------------------------\n")
	ok("Bienvenue sur le Chiseled Selfbot, "+client.user.username+"#"+client.user.discriminator+".\n ton pr??fixe est le suivant: \x1b[35m"+config.prefixe+"\x1b[0m")
	rl.close()
	console.log("\n\x1b[35m------------------------------------------------------------------------------------------\n")
	sy("\x1b[35mlogs:\x1b[0m")
})


const allinterval = []
const moment = require("moment")


client.on("messageCreate", async msg => {
	var prefix = config.prefixe
	
	

	
// ---------------#------########---------
	if((msg.author.id != client.user.id) || !msg.content.startsWith(prefix)) return;
	var args, 
	cmd
	if(config.prefixe.length > 0){
		args = msg.content.slice(prefix.length).trim().split(/ +/),
		cmd = args.shift().toLowerCase()
	} else {
		args = msg.content.trim().split(/ +/),
		cmd = args.shift().toLowerCase()
	}
	
	if(cmd == "sex" || cmd == "bite"){
		
		msg.edit("`caca`")
	}
	
	if(cmd == "help"){
		const textes = ["voici les commandes d'aide:\n\n> SETTINGS\nsetPrefix, setColor, restart, shutdown, reset",
				"> HELP\nhelpStatus, helpSettings, helpBackups",
				"> STATUS\nsetPresence, startMultiPresence, setActivity, startMultiActivity, setTwitch, setMultiType, addMultiPresence, delMultiPresence, addMultiActivity, addMultiEmoji, delMultiActivity, delMultiEmoji, listPresence, listActivity, listEmojiActivity, clearStatus",
				"> BACKUPS\nbackupCreate, backupDelete, backupInfos, backupLoad, backupList"
			]
		
		msg.edit("```\n"+textes.join("\n\n")+"```").catch(e => er(e))
	}

// settings

	if(cmd == "setprefix" || cmd == "prefixset"){
		if(!args[0]) return msg.edit("`un pr??fixe est n??cessaire`").catch(e => er(e))
		if(config.prefixe === args[0]) return msg.edit("`prefixe d??j?? configur?? sur "+args[0]+"`").catch(e => er(e))
		if(args[0] === "cringe"){
			config.prefixe = ""
		} else {
		config.prefixe = args[0]
		}
		fs.writeFile(dircfg, JSON.stringify(config, null, 2), (err) => {
			if (err) er(err)
			msg.edit("`prefixe modifi?? avec succ??s ("+config.prefixe+")`").catch(e => er(e))
		})
	}
	if(cmd == "setcolor" || cmd == "colorset"){
		
		if(!args[0]) return msg.edit("`une couleur hex est n??cessaire: https://www.color-hex.com/`").catch(e => er(e))
		var matches = args[0].match(/^#(?:[0-9a-fA-F]{3}){1,2}$/i)
		if(!matches) return msg.edit("`une couleur hex est n??cessaire (ex: #FFFFFF): https://www.color-hex.com/`").catch(e => er(e))
		if(config.color === args[0]) return msg.edit("`couleur d??j?? configur??e sur "+args[0]+"`").catch(e => er(e))
		config.color = args[0]
		fs.writeFile(dircfg, JSON.stringify(config, null, 2), (err) => {
			if (err) er(err)
			msg.edit("`couleur modifi??e avec succ??s ("+args[0]+")`").catch(e => er(e))
		})
	}
	
	if(cmd == "shutdown"){
		sy("shutdown du selfbot...")
		msg.edit("`shutdown du selfbot...`").catch(e => er(e)).then(() => process.exit())
		
	}
	if(cmd == "restart"){
		msg.edit("`restart en cours...`").catch(e => er(e)).then(msg => client.destroy()).then(() => {
			
				client.login(config.token)
			
		})
		sy("restart du syst??me en cours...")
	}

// presence

	if(cmd == "settwitch" || cmd == "twitchset"){
		if(!args[0]) return msg.edit("`un lien twitch est n??cessaire (https://twitch.tv/...)`").catch(e => er(e))
		var matches = args[0].match(/^(?:https?:\/\/)?(?:www\.|go\.)?twitch\.tv\/([a-z0-9_]+)($|\?)/g)
		if(!matches) return msg.edit("`un lien twitch est n??cessaire (https://twitch.tv/...)`").catch(e => er(e));
		if(presence.twitch === args[0]) return msg.edit("`twitch d??j?? configur?? sur "+args[0]+"`").catch(e => er(e))
		
		presence.twitch = args[0]
		fs.writeFile(dirprs, JSON.stringify(presence, null, 2), (err) => {
			if (err) er(err)
			msg.edit("`twitch modifi?? avec succ??s ("+args[0]+")`").catch(e => er(e))
		})
	}
	if(cmd == "addmultipresence"){
		if(!args[0]) return msg.edit("`une description est n??cessaire`").catch(e => er(e))
		if(args.join(" ").split("").length > 30) return msg.edit("`maximum 30 caract??res`").catch(e => er(e))
		presence.multi.presences.push({number: presence.multi.presences.length, description: args.join(" ")})
		fs.writeFile(dirprs, JSON.stringify(presence, null, 2), (err) => {
			if (err) er(err)
			msg.edit("`multi pr??sence ajout??e avec succ??s ("+args.join(" ")+")`").catch(e => er(e))
		})
	}
	if(cmd == "listpresence" || cmd == "presencelist"){
		if(presence.multi.presences.length === 0) return msg.edit("`aucune pr??sence pour le moment`").catch(e => er(e))
		sy("\x1b[35mliste des pr??sences:\x1b[0m")
		presence.multi.presences.forEach(async pr => {
			await sy("[\x1b[35m"+pr.number+"\x1b[0m] "+pr.description)
		})
		msg.edit("`liste affich??e dans la console`").catch(e => er(e))
	}
	if(cmd == "delmultipresence"){
		if(!args[0]) return msg.edit("`entre le num??ro de la pr??sence ?? supprimer (listPresence pour voir la liste)`").catch(e => er(e))
		const arg = parseInt(args[0])
		if(presence.multi.presences.length === 0) return msg.edit("`aucune pr??sence pour le moment`").catch(e => er(e))
		if(arg.isNaN || (presence.multi.presences.length < (arg-1))) return msg.edit("`entre un num??ro de pr??sence ?? supprimer valide (listPresence pour voir la liste)`").catch(e => er(e))
		descr = presence.multi.presences[arg].description
		presence.multi.presences.splice(arg, 1)
		presence.multi.presences.forEach(pr => {
			if(pr.number <= arg) return;
			pr.number = pr.number - 1
		})
		fs.writeFile(dirprs, JSON.stringify(presence, null, 2), (err) => {
			if (err) er(err)
			msg.edit("`multi pr??sence supprim??e avec succ??s ("+descr+")`").catch(e => er(e))
			
		})
	}
	if(cmd == "addmultiactivity"){
		if(!args[0]) return msg.edit("`une description est n??cessaire`").catch(e => er(e))
		if(args.join(" ").split("").length > 30) return msg.edit("`maximum 30 caract??res`").catch(e => er(e))
		presence.multiactiv.activ.push({number: presence.multiactiv.activ.length, description: args.join(" ")})
		fs.writeFile(dirprs, JSON.stringify(presence, null, 2), (err) => {
			if (err) er(err)
			msg.edit("`multi activit?? ajout??e avec succ??s ("+args.join(" ")+")`").catch(e => er(e))
		})
	}
	if(cmd == "listactivity" || cmd == "activitylist"){
		if(presence.multiactiv.activ.length === 0) return msg.edit("`aucune activit?? pour le moment`").catch(e => er(e))
		sy("\x1b[35mliste des activit??s:\x1b[0m")
		presence.multiactiv.activ.forEach(async pr => {
			await sy("[\x1b[35m"+pr.number+"\x1b[0m] "+pr.description)
		})
		msg.edit("`liste affich??e dans la console`").catch(e => er(e))
	}
	if(cmd == "delmultiactivity"){
		if(!args[0]) return msg.edit("`entre le num??ro de l'activit?? ?? supprimer (listActivity pour voir la liste)`").catch(e => er(e))
		const arg = parseInt(args[0])
		if(presence.multiactiv.activ.length === 0) return msg.edit("`aucune activit?? pour le moment`").catch(e => er(e))
		if(arg.isNaN || (presence.multiactiv.activ.length < (arg-1))) return msg.edit("`entre un num??ro d'activit?? ?? supprimer valide (listActivity pour voir la liste)`").catch(e => er(e))
		descr = presence.multiactiv.activ[arg].description
		presence.multiactiv.activ.splice(arg, 1)
		presence.multiactiv.activ.forEach(pr => {
			if(pr.number <= arg) return;
			pr.number = pr.number - 1
		})
		fs.writeFile(dirprs, JSON.stringify(presence, null, 2), (err) => {
			if (err) er(err)
			msg.edit("`multi activit?? supprim??e avec succ??s ("+descr+")`").catch(e => er(e))
			
		})
	}
	if(cmd == "addmultiemoji"){
		if(!args[0]) return msg.edit("`un emoji est n??cessaire`").catch(e => er(e))
		const matches = args[0].match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu)
		if(!matches) return msg.edit("`un emoji de base valide est n??cessaire`").catch(e => er(e))
		presence.multiactiv.emojis.push({number: presence.multiactiv.emojis.length, description: matches[0]})
		fs.writeFile(dirprs, JSON.stringify(presence, null, 2), (err) => {
			if (err) er(err)
			msg.edit("`emoji d'activit?? ajout?? avec succ??s ("+matches[0]+")`").catch(e => er(e))
		})
	}
	if(cmd == "listemojiactivity" || cmd == "emojiactivitylist" || cmd == "activityemojilist"){
		if(presence.multiactiv.emojis.length === 0) return msg.edit("`aucun emojis pour le moment`").catch(e => er(e))
		sy("\x1b[35mliste des emojis:\x1b[0m")
		presence.multiactiv.emojis.forEach(async pr => {
			await sy("[\x1b[35m"+pr.number+"\x1b[0m] "+pr.description)
		})
		msg.edit("`liste affich??e dans la console`").catch(e => er(e))
	}
	if(cmd == "delmultiemoji"){
		if(!args[0]) return msg.edit("`entre le num??ro de l'emoji ?? supprimer (listEmoji pour voir la liste)`").catch(e => er(e))
		const arg = parseInt(args[0])
		if(presence.multiactiv.emojis.length === 0) return msg.edit("`aucun emojis pour le moment`").catch(e => er(e))
		if(arg.isNaN || (presence.multiactiv.emojis.length < (arg-1))) return msg.edit("`entre un num??ro d'emoji ?? supprimer valide (listEmoji pour voir la liste)`").catch(e => er(e))
		descr = presence.multiactiv.emojis[arg].description
		presence.multiactiv.emojis.splice(arg, 1)
		presence.multiactiv.emojis.forEach(pr => {
			if(pr.number <= arg) return;
			pr.number = pr.number - 1
		})
		fs.writeFile(dirprs, JSON.stringify(presence, null, 2), (err) => {
			if (err) er(err)
			msg.edit("`emoji supprim?? avec succ??s ("+descr+")`").catch(e => er(e))
			
		})
	}
	if(cmd == "startmultiactivity"){
		if(presence.multiactiv.activ.length === 0) return msg.edit("`ajoutez des multi activit?? avec la commande addMultiActivity`").catch(e => er(e))
		
		msg.edit("`d??marrage du multi activit??, patientez quelques secondes...`").catch(e => er(e))
		var i = 0
		let interval = setInterval(() => {
			const r = new Discord.CustomStatus()
				.setState(presence.multiactiv.activ[i].description)
				.setEmoji(presence.multiactiv.emojis[Math.floor(Math.random() * (presence.multiactiv.emojis.length-1))].description)
				
				client.user.setActivity(r.toJSON())
				
			if(i === (presence.multiactiv.activ.length-1)){
				i = 0
			} else {
				i++
			}
			
		}, 8000)
		allinterval.push(interval)
	}
	if(cmd == "setmultitype" || cmd == "multitypeset"){
		const list = [
			"STREAMING",
			"PLAYING",
			"WATCHING",
			"LISTENING"
		]
		if(!args[0] || !list.includes(args[0].toUpperCase())) return msg.edit("`veuillez entrer le type poir votre multi pr??sence (STREAMING/LISTENING/WATCHING/PLAYING)`").catch(e => er(e))
		
		presence.multi.type = args[0].toUpperCase()
		fs.writeFile(dirprs, JSON.stringify(presence, null, 2), (err) => {
			if (err) er(err)
			msg.edit("`type de multi pr??sence modifi?? avec succ??s ("+args[0].toUpperCase()+")`").catch(e => er(e))
			
		})
	}
	if(cmd == "startmultipresence"){
		if(presence.multi.presences.length === 0) return msg.edit("`ajoutez des multi activit?? avec la commande addMultiActivity`").catch(e => er(e))
		
		msg.edit("`d??marrage du multi pr??sence, patientez quelques secondes...`").catch(e => er(e))
		var i = 0
		var timestamp = Date.now()
		let time = setInterval(() => {
			timestamp++
			if(allinterval.length === 0){
				clearInterval(time)
			}
		}, 1000)
		let interval = setInterval(() => {
			
			const r = new Discord.RichPresence()
				.setApplicationId('1040390453180235776')
				.setType(presence.multi.type)
				.setName(presence.multi.presences[i].description)
				.setStartTimestamp(timestamp)
				if(presence.twitch) r.setURL(presence.twitch)
			client.user.setActivity(r.toJSON())
			
			if(i === (presence.multi.presences.length-1)){
				i = 0
			} else {
				i++
			}
			
		}, 8000)
		allinterval.push(interval)
	}
	if(cmd == "clearstatus" || cmd == "offstatus"){
		if(allinterval.length > 0){
		allinterval.forEach(async i => {
			await clearInterval(i)
		})
		}
		client.user.setPresence({ activity: null })
		msg.edit("`tous les status ont ??t?? r??initialis??`").catch(e => er(e))
	
	}
	if(cmd == "setpresence" || cmd == "presence" || cmd == "presenceset"){
		
		const list = [
			"STREAMING",
			"PLAYING",
			"WATCHING",
			"LISTENING"
		]
		if(!args[0] || !list.includes(args[0].toUpperCase())) return msg.edit("`veuillez entrer le type pour votre pr??sence suivis de la description (STREAMING/LISTENING/WATCHING/PLAYING)`").catch(e => er(e))
		
		const r = new Discord.RichPresence()
				.setApplicationId('1040390453180235776')
				.setType(args[0])
				.setName(args.slice(1).join(" ") || client.user.username)
				.setStartTimestamp(Date.now())
				if(presence.twitch) r.setURL(presence.twitch)
			client.user.setActivity(r.toJSON())
			msg.edit("`pr??sence mise a jour`").catch(e => er(e))
	}
	if(cmd == "setactivity" || cmd == "activity" || cmd == "activityset"){
		if(!args[0]) return msg.edit("`un emoji est n??cessaire suivis d'une description`").catch(e => er(e))
		const matches = args[0].match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu)
		if(!matches) return msg.edit("`un emoji de base valide est n??cessaire suivis d'une description`").catch(e => er(e))
		const r = new Discord.CustomStatus()
				.setState(args.slice(1).join(" ") || client.user.username)
				.setEmoji(matches[0])
				
				client.user.setActivity(r.toJSON())
				msg.edit("`activit?? mise ?? jour`").catch(e => er(e))
	}

// helps

	if(cmd == "helpstatus" || cmd == "statushelp"){
		msg.edit("```\n> HELP STATUS\nimagine tu sait pas utiliser une commande :cringe:\n\n1 - [setPresence] et [setActivity] s'utilisent pour avoir une pr??sence/activit?? fixe ([setPresence] {type} (description) et [setActivity] {emoji} (description))\n\n2 - [addMultiEmoji] et [delMultiEmoji] pour ajouter ou supprimer un emoji pour la commande [startMultiActivity]\n\n3 - [startMultiActivity] et [startMultiPresence] vont lire les description dans l'ordre ([listPresence] et [listActivity] pour voir l'ordre) cependant, [startMultiActivity] va lire les emojis al??atoirement\n\n4 - [clearStatus] va reset n'importe quel multi status ou status fixe\n\n5 - [setMultiType] {STREAMING-PLAYING-LISTENING-WATCHING} sert a configurer le type de status pour la commande [startMultiPresence].\n\nmerci de votre lecture les merdes```").catch(e => er(e))
	}
	if(cmd == "helpsettings" || cmd == "settingshelp"){
		msg.edit("```\n> HELP SETTINGS\nfin fr??rot ya 3 commandes dans settings\n\n1 - [setPrefix] {prefix} te permet de changer ton prefix (si tu ??cris cringe derri??re la commande ??a supprime le prefixe)\n\n2 - [reset] va comme son nom le dit reset le selfbot (tous les fichiers config etc)\n\n3 - [setColor] ne sert pas ?? grand chose a par pour la commande [embed]\n\n<3 merci d'avoir lu bb```").catch(e => er(e))
	}
	if(cmd == "helpbackups" || cmd == "backupshelp"){
		msg.edit("```\n> HELP BACKUPS\nallez encore des explications\n\n1 - contrairement ?? d'autres bot de backup, celle ci ne se charge pas par un code mais par son emplacement ([backupLoad] {num??ro} pour voir l'emplacement faites [listBackup])\n\noe nan yavait vrmt rien a dire```").catch(e => er(e))
	}
// util



if(cmd == "eval"){
	if(!args[0]) return msg.edit("`un argument est n??cessaire`").catch(e => er(e))
	var cleaned
	try {
      const evaled = eval(args.join(" "));

      cleaned = await clean(evaled)
      msg.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``).catch(e => er(e))
    } catch (err) {
      msg.channel.send(`\`ERROR\` \`\`\`js\n${cleaned}\n\`\`\``).catch(e => er(e))
    }
}

	if(cmd == "userinfos" || cmd == "infosuser"){
		var g;
		if(args[0]){
			g = (msg.mentions.users.first() ? msg.mentions.users.first().id : null) || args[0]
		} else {
			g = msg.author.id
		}
		fetch("https://discord.com/api/v9/users/"+g, {
			method: "GET",
			headers: {
				"authorization": config.token,
				"Content-Type": "application/json"
			}
		}).then(r => r.json()).then(u => {
			if(u.message) return msg.edit("`entre un id ou une mention d'un utilisateur valide`").catch(e => er(e))
			const usertext = []

			const flags = verifflags(u.public_flags)
			var avatar = u.avatar ? (u.avatar.startsWith("a_") ? "https://cdn.discordapp.com/avatars/"+u.id+"/"+u.avatar+".gif?size=2048" : "https://cdn.discordapp.com/avatars/"+u.id+"/"+u.avatar+".webp?size=2048") : "aucun"
			var banner = u.banner ? (u.banner.startsWith("a_") ? "https://cdn.discordapp.com/banners/"+u.id+"/"+u.banner+".gif?size=2048" : "https://cdn.discordapp.com/banners/"+u.id+"/"+u.banner+".webp?size=2048") : "aucune"
			usertext.push((u.bot ? "(compte bot)" : "(compte utilisateur)")+"\n\n- id: "+u.id+"\n- tag: "+u.username+"#"+u.discriminator+"\n- date de cr??ation: "+moment(deconstruct(u.id).timestamp).format("DD/MM/YY hh:mm:ss a")+"\n- avatar: "+avatar+"\n- flags: ["+((flags.length > 0) ? flags.join(", ") : "aucun")+"]\n- banni??re: "+banner+"\n- couleur de banni??re: "+u.banner_color)
			fetch("https://discord.com/api/v9/users/"+g+"/profile", {
					method: "GET",
				headers: {
					"authorization": config.token,
					"Content-Type": "application/json"
				}
			}).then(r => r.json()).then(p => {
				
				if(p.message){
					msg.edit("```\n> INFOS USER\n\n"+usertext.join("\n\n")+"```").catch(e => er(e))
				} else {
					const prem = [
						"Aucun",
						"Nitro Classic",
						"Nitro boost",
						"Nitro"
					]
					if(u.bot){
						usertext.push("- bio: "+(p.user_profile.bio ? p.user_profile.bio : "aucune"))
					} else {
						usertext.push("- bio: "+(p.user_profile.bio ? p.user_profile.bio : "aucune")+"\n- nitro: "+(p.premium_type ? (prem[p.premium_type]+ " depuis "+moment.utc(p.premium_since).format("DD/MM/YY hh:mm:ss a")) : "aucun")+"\n- comptes li??s: ["+(p.connected_accounts.length > 0 ? p.connected_accounts.map(ac => (ac.type+" ("+ac.name+")")).join(", ") : "aucun")+"]")
					}
					if(msg.author.id != u.id){
						usertext.push("- serveurs en commun: ["+(p.mutual_guilds.length > 0 ? p.mutual_guilds.map(gu => client.guilds.cache.get(gu.id).name).join(", ") : "aucun")+"]")
					}
					if(msg.channel.type == "DM" || msg.channel.type == "GROUP_DM" || !msg.guild.members.cache.get(u.id)){
						msg.edit("```\n> INFOS USER\n\n"+usertext.join("\n\n")+"```").catch(e => er(e))
					} else {
						const member = msg.guild.members.cache.get(u.id)
						usertext.push("- permissions: ["+(member.permissions.serialize().ADMINISTRATOR ? "ADMINISTRATOR" : Object.keys(member.permissions.serialize()).filter(p => member.permissions.serialize()[p]))+"]\n- joinedAt: "+moment(member.joinedTimestamp).format("DD/MM/YY hh:mm:ss a")+"\n- roles: ["+(member.roles.cache.size > 1 ? member.roles.cache.filter(r => (r.name != "@everyone")).map(r => r.name) : "aucun")+"]\n- avatar de server: "+(member.avatarURL() ? member.avatarURL() : "aucun"))
						msg.edit("```\n> INFOS USER\n\n"+usertext.join("\n\n")+"```").catch(e => er(e))
					}
				}
			})
		})
		
	}
	if(cmd == "avatar"){
		var g;
		if(args[0]){
			g = (msg.mentions.users.first() ? msg.mentions.users.first().id : null) || args[0]
		} else {
			g = msg.author.id
		}
		fetch("https://discord.com/api/v9/users/"+g, {
			method: "GET",
			headers: {
				"authorization": config.token,
				"Content-Type": "application/json"
			}
		}).then(r => r.json()).then(u => {
			if(u.message) return msg.edit("`entre un id ou une mention d'un utilisateur valide`").catch(e => er(e))
			const avatar = u.avatar ? "https://cdn.discordapp.com/avatars/"+u.id+"/"+u.avatar+".webp?size=2048" : "aucun"
			if(!avatar) return msg.edit("`"+u.username+"#"+u.discriminator+" ne poss??de pas d'avatar`").catch(e => er(e))
			msg.edit("```\n> AVATAR DE: "+u.username+"#"+u.discriminator+"```\n\n"+avatar).catch(e => er(e))
		})
	}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////seulement server commands//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(msg.channel.type === "DM" || msg.channel.type === "GROUP_DM") return;

	if(cmd == "backupcreate" || cmd == "createbackup"){
		msg.edit("`sauvegarde du serveur en cours, patientez...`").catch(e => er(e))
		backup.servers.push({
			number: backup.servers.length,
			roles: [],
			channels: [],
			category: [],
			emojis: [],
			date: Date.now(),
			name: msg.guild.name,
			icon: msg.guild.iconURL(),
			banner: msg.guild.banner ? msg.guild.bannerURL() : null
		})
		const back = backup.servers[backup.servers.length - 1]
		msg.guild.roles.cache.forEach(async(r) => {
			if(r.rawPosition === 0 || r.managed) return;
			await back.roles.push({name: r.name, color: r.color, hoist: r.hoist, rawPosition: r.rawPosition, permissions: r.permissions, managed: r.managed, mentionable: r.mentionable})
		})
		
		const all = []
		msg.guild.channels.cache.forEach(async(c) => {
			if(c.type === "GUILD_CATEGORY"){
				await back.category.push({oldid: c.id, name: c.name, type: c.type, position: c.rawPosition})
			} else {
				await back.channels.push({oldid: c.id, name: c.name, type: c.type, position: c.rawPosition, parent: (c.parentId ? msg.guild.channels.cache.get(c.parentId).name : null)})
			}
			all.push("x")
		})
		msg.guild.emojis.cache.forEach(async(e) => {
			await back.emojis.push({name: e.name, animated: e.animated, image: e.url})
		})
		let interval = setInterval(() => {
			if(all.length != msg.guild.channels.cache.size) return;
			clearInterval(interval);
		
		
		fs.writeFile(dirbck, JSON.stringify(backup, null, 2), (err) => {
			if (err) er(err)
			msg.edit("`backup sauvegard??e ?? l'emplacement ("+back.number+")`").catch(e => er(e))
			sy("backup sauvegard??e ?? l'emplacement: "+back.number)
		})
		
		}, 1000)
	}
	if(cmd == "backupload" || cmd == "loadbackup"){
		if(!args[0]) return msg.edit("`entre le num??ro de la backup ?? charger (listBackup pour voir la liste)`").catch(e => er(e))
		const arg = parseInt(args[0])
		if(backup.servers.length === 0) return msg.edit("`aucune backup pour le moment`").catch(e => er(e))
		if(arg.isNaN || (backup.servers.length < (arg-1))) return msg.edit("`entre un num??ro de backup ?? charger valide (listBackup pour voir la liste)`").catch(e => er(e))
		if(!msg.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return msg.edit("`impossible de charger une backup sans permission admin`").catch(e => er(e))
		
		const back = backup.servers[arg]
		sy("chargement de la backup "+back.name+" en cours...")
		const don = msg.guild.roles.cache.size + (msg.guild.channels.cache.size + msg.guild.emojis.cache.size)
		const all = []
		msg.guild.setName(back.name).catch(e => er(e))
		msg.guild.setIcon(back.icon).catch(e => er(e))
		msg.guild.setBanner(back.banner).catch(e => er(e))
		msg.guild.roles.cache.forEach(async r => {
			all.push("x")
			if(r.name == "@everyone") return;
			await r.delete().catch(e => er(e))
		})
		msg.guild.channels.cache.forEach(async c => {
			await c.delete().catch(e => er(e))
			all.push("x")
		})
		msg.guild.emojis.cache.forEach(async em => {
			await em.delete().catch(e => er(e))
			all.push("x")
		})
		let interval = setInterval(() => {
			
			if(all.length != don) return;
			clearInterval(interval)
			
			back.roles.forEach(async r => {
				await msg.guild.roles.create({
					name: r.name,
					color: r.color,
					hoist: r.hoist,
					position: r.rawPosition,
					permissions: r.permissions,
					mentionable: r.mentionable
				}).catch(e => er(e))
			})
			
			back.category.forEach(async c => {
				await msg.guild.channels.create(c.name,{
					type: c.type,
					position: c.position
				}).catch(e => er(e))
			})
			back.channels.forEach(async c => {
				await msg.guild.channels.create(c.name,{
					type: c.type,
					position: c.position
				}).catch(e => er(e)).then(chan => {
					if(!c.parent) return;
					chan.setParent(msg.guild.channels.cache.find(f => f.name == c.parent).id).catch(e => er(e))
				})
			})
			
		}, 1000)
			
	}
	if(cmd == "listbackup" || cmd == "backuplist"){
		if(backup.servers.length === 0) return msg.edit("`aucune backup pour le moment`").catch(e => er(e))
		
		sy("\x1b[35mliste des backups:\x1b[0m")
		backup.servers.forEach(async s => {
			await sy("[\x1b[35m"+s.number+"\x1b[0m] "+s.name+" ("+moment(s.date).format("DD/MM/YY hh:mm:ss a")+")")
		})
		msg.edit("`liste affich??e dans la console`").catch(e => er(e))
		
	}
	if(cmd == "delbackup"){
		if(!args[0]) return msg.edit("`entre le num??ro de la backup ?? supprimer (listBackup pour voir la liste)`").catch(e => er(e))
		const arg = parseInt(args[0])
		if(backup.servers.length === 0) return msg.edit("`aucune backup pour le moment`").catch(e => er(e))
		if(arg.isNaN || (backup.servers.length < (arg-1))) return msg.edit("`entre un num??ro de backup ?? supprimer valide (listBackup pour voir la liste)`").catch(e => er(e))
		descr = backup.servers[arg].name
		backup.servers.splice(arg, 1)
		backup.servers.forEach(pr => {
			if(pr.number <= arg) return;
			pr.number = pr.number - 1
		})
		fs.writeFile(dirbck, JSON.stringify(backup, null, 2), (err) => {
			if (err) er(err)
			msg.edit("`backup supprim??e avec succ??s ("+descr+")`").catch(e => er(e))
			
		})
	}
	if(cmd == "infosbackup" || cmd == "backupinfos"){
		if(!args[0]) return msg.edit("`entre le num??ro de la backup (listBackup pour voir la liste)`").catch(e => er(e))
		const arg = parseInt(args[0])
		if(backup.servers.length === 0) return msg.edit("`aucune backup pour le moment`").catch(e => er(e))
		if(arg.isNaN || (backup.servers.length < (arg-1))) return msg.edit("`entre un num??ro de backup valide (listBackup pour voir la liste)`").catch(e => er(e))
		const back = backup.servers[arg]
		
		msg.edit("```\n> INFOS BACKUP\n\n- name: "+back.name+"\n- date: "+moment(back.date).format("DD/MM/YY hh:mm:ss a")+"\n\n- roles: "+back.roles.length+"\n- channels: "+back.category.length+" category & "+back.channels.length+" other\n- emojis: "+back.emojis.length+"```").catch(e => er(e))
	}
	if(cmd == "reset"){
		msg.edit("`reset du selfbot en cours, cela peut prendre quelques instants`").catch(e => er(e))
		
			sy("suppression des fichiers...");
			const sexe = []
			files.forEach(async f => {
				await fs.unlink(f.name,function(err){
					sexe.push("x")
        			if(err) return er(err)
        			ok("fichier ("+f.name.split("/")[1]+") supprim?? avec succ??s")
        			
				});  
			})
			let inter = setInterval(() => {
				if(sexe.length != files.length) return;
				clearInterval(inter)
				sy("reset effectu??, arr??t du selfbot...")
				process.exit()
			}, 1000)
	}
	
	
})
}, 2000)
}, 3000)