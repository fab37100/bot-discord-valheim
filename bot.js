// Importation des dependances
const Discord = require('discord.js');
const Exec = require('ssh-exec');
const YAML = require('yaml');
const fs = require('fs');
const log4js = require("log4js");
const logger = log4js.getLogger();
require('dotenv').config({path:`${__dirname}/.env`});

// Importation des variables d'environnement
const IDDISCORDCHANEL = process.env.IDDISCORDCHANEL;
const CLIENTIDDISCORDBOT = process.env.CLIENTIDDISCORDBOT;
const VALHEIMIPSERVER = process.env.VALHEIMIPSERVER;
const VALHEIMUSER = process.env.VALHEIMUSER;
const VALHEIMPWD = process.env.VALHEIMPWD;
const TOKENDISCORDBOT = process.env.TOKENDISCORDBOT;
logger.level = process.env.LOGLEVEL;

// Importation de la configuration
var configBot;
logger.debug(`${__dirname}/config.yml`);
try {
    configBot = YAML.parse(fs.readFileSync(`${__dirname}/config.yml`, 'utf8'));
    logger.debug(`Load YAML success`);
} catch (error) {
    logger.error(error)
}

const client = new Discord.Client();
client.login(TOKENDISCORDBOT);

client.on('ready', () => {
    logger.debug("Discord bot ready!!");
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
                logger.error(err, stdout, stderr); 
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
            logger.debug(msg.content);
            execCommand(msg,configBot.bot.features['status'],VALHEIMUSER,VALHEIMIPSERVER,VALHEIMPWD);
        }
        else if (msg.content === configBot.bot.invokeKey+'reboot') {
            execCommand(msg,configBot.bot.features['reboot'],VALHEIMUSER,VALHEIMIPSERVER,VALHEIMPWD);
            logger.debug(msg.content);
        }
        else if (msg.content === configBot.bot.invokeKey+'update') {
            execCommand(msg,configBot.bot.features['update'],VALHEIMUSER,VALHEIMIPSERVER,VALHEIMPWD);
            logger.debug(msg.content);
        }
        else{
            logger.debug(msg.content);
            msg.channel.send('Humain ! voici les pouvoirs que je te confère sur le monde de Valheim :');
            for (const [key,value] of Object.entries(configBot.bot.features)){
                msg.channel.send(`${configBot.bot.invokeKey}${key}: ${value.help}`);
            }
        }
    }
});
