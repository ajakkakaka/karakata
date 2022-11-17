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


sy("vérification des modules...");
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
	ok("vérification des modules terminée");
	
} else {
	er("il manque "+manque.length+" modules");
	sy("installation des modules manquants");
	manque.forEach(async(m) => {
		sy("installation du module: "+m.split("@")[0]+" ("+ (manque.indexOf(m)+1)+"/"+manque.length+")...");
		await exec("npm install "+m+" --no-bin-links", (error, stdout, stderr) => {
			if(error){
				er(error)
			}
			manque.shift()
			
			ok("installation du module: "+m.split("@")[0]+" terminée");
			
		})
	})
}


//mise a jour
var filles = false
let time = setInterval(() => {
if(manque.length > 0) return;

clearInterval(time);

const fetch = require("node-fetch")


sy("vérification des fichiers...");
const fs = require("node:fs")


const files = [
	{
		name: "files/config.json", 
		content: '{"token": "", "prefixe": ".", "embed": { "image": "","color": "FFFFFF"}}'
	},
	{
		name: "files/version.json",
		content: '{"version": "0.0.0"}'
	},
	{
		name: "files/presence.json",
		content: '{"twitch": "","multi":{"presences": ["j","a","c","o","b"], "type": "STREAMING"}, "activity": "", "emoji": "", "multiactiv": {"activ": ["j", "a", "c", "o", "b"], "emoji": ""} }'
	},
	{
		name: "files/fun.json",
		content: '{"reactusers": [], "reactemojis": ["🐵","🙈","🙉","🙊","👳","🇮🇱","🇿🇼","🇿🇲","🇿🇦","🇹🇷","🤡","😅","👵","🎅","🕵","🤵","👮","👷","⭐","🚿","😹"], "autodelete": []}'
	},
	{
		name: "files/rpc.json",
		content: '{}'
	}
]

try {
	fs.mkdirSync("./files"); 
} catch(e) { 
	if ( e.code != 'EEXIST' ) er(e)
}
var miss = []
files.forEach(f => {
	try {
		const t = require("./"+f.name)
	} catch(err){
		miss.push(f)
	}
})

if(miss.length == 0){
	ok("vérification des fichiers terminée");
	filles = true
} else {
	er("il manque "+miss.length+" fichiers");
	sy("écriture des fichiers manquants");
	miss.forEach(async(m) => {
		sy("écriture du fichier: "+m.name.split("/")[1]+" ("+(miss.indexOf(m)+1)+"/"+miss.length+")...")
		await fs.appendFile(m.name, m.content, function(err){
			if(err) return er(err)
			ok("écriture du fichier: "+m.name.split("/")[1]+" ("+(miss.indexOf(m)+1)+"/"+miss.length+") terminée")
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
sy("vérification du token...")
const config = require("./files/config.json")
const Discord = require("discord.js-selfbot-v13")
const fs = require("node:fs")
const dircfg = "./files/config.json"
const client = new Discord.Client({
	checkUpdate: false                
});
//fonction par email/mdp
function ftoken(){
	er("\x1b[31maucun token valide, suivez les étapes ou tapez 0 pour arrêter le selfbot\x1b[0m")
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
							er("\x1b[31mvotre compte discord est sous authentification a 2 facteurs. Retirez la et puis réessayez\x1b[0m")
							rl.close()
							process.exit()
						}

							if(!resp.message){
								ok("compte trouvé, patientez...")
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
	er("aucun token trouvé")
	ftoken()
}

client.on("ready", () => {
	ok("selfbot connecté à: "+client.user.username+"#"+client.user.discriminator+", avec le prefixe: \x1b[35m"+config.prefixe+"\x1b[0m")
	rl.close()
})


const moment = require("moment")
client.on("messageCreate", async msg => {
	var prefix = config.prefixe
	
	

	
// ---------------#------########---------
	if((msg.author.id != client.user.id) || !msg.content.startsWith(prefix)) return;
	
	const args = msg.content.slice(prefix.length).trim().split(/ +/),
		cmd = args.shift().toLowerCase()
	
	
	if(cmd == "sex"){
		
		msg.edit("`caca`")
	}
	
	if(cmd == "help"){
		
		
		const textes = ["voici les commandes d'aide:\n\n> SETTINGS\nsetPrefix (prefix)\nsetColor (color/hex)\nsetImage (image url)\nrestart\nshutdown",
				"> PRESENCE\nsetTwitch (twitch name)\naddMultiPresence (description)\ndelMultiPresence (presence)\nsetMultiType (STREAMING/LISTEN/WATCHING)\nsetActivity (description)\nsetEmoji (emoji)\naddMultiActivity (description)\naddMultiEmoji (emoji)"
			]
		
		msg.edit("```\n"+textes.join("\n\n")+"```").catch(e => er(e))
	}
	
	if(cmd == "setprefix"){
		if(!args[0]) return msg.edit("`un préfixe est nécessaire`").catch(e => er(e))
		
		config.prefixe = args[0]
		fs.writeFile(dircfg, JSON.stringify(config, null, 2), (err) => {
			if (err) er(err)
			msg.edit("`prefixe modifié avec succès`").catch(e => er(e))
		})
	}
	if(cmd == "setcolor"){
		
		if(!args[0]) return msg.edit("`une couleur hex est nécessaire: https://www.color-hex.com/`").catch(e => er(e))
		var matches = args[0].match(/^#(?:[0-9a-fA-F]{3}){1,2}$/i)
		if(!matches) return msg.edit("`une couleur hex est nécessaire (ex: #FFFFFF): https://www.color-hex.com/`").catch(e => er(e))
		config.embed.color = args[0]
		fs.writeFile(dircfg, JSON.stringify(config, null, 2), (err) => {
			if (err) er(err)
			msg.edit("`couleur modifiée avec succès`").catch(e => er(e))
		})
	}
	if(cmd == "setimage"){
		
		if(!args[0]) return msg.edit("`un lien image est nécessaire (jpeg/png/jpg)`").catch(e => er(e))
		
		var matches = args[0].match(/^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/gmi);
		if(!matches) return msg.edit("`entrez un lien image valide (png/gif/webp/jpeg/jpg)`").catch(e => er(e))
		config.embed.image = matches[0]
		fs.writeFile(dircfg, JSON.stringify(config, null, 2), (err) => {
			if (err) er(err)
			msg.edit("`image modifiée avec succès`").catch(e => er(e))
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
		sy("restart du système en cours...")
	}
})
}, 2000)
}, 2000)