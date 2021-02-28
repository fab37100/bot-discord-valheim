// Importation des dependances
const Discord = require('discord.js');
const Exec = require('ssh-exec');
const YAML = require('yaml');
const fs = require('fs');
require('dotenv').config();

// Importation des variables d'environnement
const IDDISCORDCHANEL = process.env.IDDISCORDCHANEL;
const CLIENTIDDISCORDBOT = process.env.CLIENTIDDISCORDBOT;
const VALHEIMIPSERVER = process.env.VALHEIMIPSERVER;
const VALHEIMUSER = process.env.VALHEIMUSER;
const VALHEIMPWD = process.env.VALHEIMPWD;
const TOKENDISCORDBOT = process.env.TOKENDISCORDBOT;

// Importation de la configuration
const configBot = YAML.parse(fs.readFileSync(`${process.cwd()}/config.yml`, 'utf8'));

const client = new Discord.Client();
client.login(TOKENDISCORDBOT);

client.on('ready', () => {
    console.log('Discord bot ready!!');
});

function execCommand(msg, execConfig, user, ip, pwd) {
    if (execConfig.command) {
        msg.channel.send(execConfig.message_info);
        Exec(execConfig.command, {
            user:       user,
            host:       ip,
            password:   pwd
        },function (err, stdout, stderr) {
            if (err){
                msg.channel.send("ERROR :" + err);
                console.log("ERROR :", err, stdout, stderr);    
            }
            else{
                msg.channel.send(execConfig.message_succes);
            }
        });
    }else{
        msg.channel.send("Humain ! Bois une bière patiemment en attendant que je te forge ce dons");
    }
}



client.on('message', msg => {
    if (msg.content.substring(0,configBot.bot.invokeKey.length) == configBot.bot.invokeKey && msg.channel.id === IDDISCORDCHANEL && ! (msg.author.id === CLIENTIDDISCORDBOT)){
        if (msg.content === configBot.bot.invokeKey+'status') {
            execCommand(msg,configBot.bot.features['status'],VALHEIMUSER,VALHEIMIPSERVER,VALHEIMPWD);
        }
        else if (msg.content === configBot.bot.invokeKey+'reboot') {
            execCommand(msg,configBot.bot.features['reboot'],VALHEIMUSER,VALHEIMIPSERVER,VALHEIMPWD);
        }
        else if (msg.content === configBot.bot.invokeKey+'update') {
            execCommand(msg,configBot.bot.features['update'],VALHEIMUSER,VALHEIMIPSERVER,VALHEIMPWD);
        }
        else{
            msg.channel.send('Humain ! voici les pouvoirs que je te confère sur le monde de Valheim :');
            for (const [key,value] of Object.entries(configBot.bot.features)){
                msg.channel.send(`${configBot.bot.invokeKey}${key}: ${value.help}`);
            }
        }
    }
});