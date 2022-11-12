const ok = function(x){
	console.log("\x1b[32m[\x1b[0m  \x1b[33mok\x1b[0m  \x1b[32m]\x1b[0m "+x);
},
er = function(x){
	console.log("\x1b[31m[\x1b[0m\x1b[33merreur\x1b[0m\x1b[31m]\x1b[0m "+x);
}
sy = function(x){
	console.log("\x1b[36m[\x1b[0m\x1b[33msystem\x1b[0m\x1b[36m]\x1b[0m "+x);
}

const fetch = require("node-fetch")



const readline = require("node:readline")
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: ""
})
sy("vérification du token...")
const config = require("./config.json")
const fetch = require("node-fetch")
const Discord = require("discord.js-selfbot")
const fs = require("node:fs")

const client = new Discord.Client()
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
							email: email,
							password: mdp,
							undelete:false,
							captcha_key:null,
							login_source:null,
							gift_code_sku_id:null
						}),
						headers: {
							"Content-Type": "application/json",
							"x-fingerprint": "715952977180885042.yskHI7mK4iZWhTX7iXlXIcDovRc",
							"x-super-properties" :Buffer.from(JSON.stringify({"os":"Windows","browser":"Chrome","device":"","browser_user_agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36","browser_version":"83.0.4103.61","os_version":"10","referring_domain":"discord.com","referrer_current":"","referring_domain_current":"","release_channel":"stable","client_build_number":60856,"client_event_source":null}), "utf-8").toString("base64"),
							cookie: '__cfduid=d638ccef388c4ca5a94c97c547c7f0d9e1598555308; __cfruid=4d17c1a957fba3c0a08c74ea83114af675f7ef19-1598796039;'
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
								fs.writeFile('./config.json', JSON.stringify(config, null, 2), (err) => {
									if (err) console.log(err)
								})
							} else {
								er("email ou mot de passe invalide ("+resp+")")
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
			"Content-Type": "application/json",
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
	ok("selfbot connecté à: "+client.user.username+"#"+client.user.discriminator+" avec succès")
	
	
})

client.on("message", async msg => {
	
})