// Importation des dependances
const Discord = require('discord.js');
const Exec = require('ssh-exec');
require('dotenv').config()

// Imppoortation des variables d'environnement
const idDiscordChanel = process.env.IDDISCORDCHANEL;
const valheimIpServer = process.env.VALHEIMIPSERVER;
const valheimUser = process.env.VALHEIMUSER;
const valheimPwd = process.env.VALHEIMPWD;

// Création des variables d'environnement
const callBot = '$!';

const client = new Discord.Client();
client.login('ODE1MjA4NTA3OTE3MDc0NDQ0.YDpEFg.B9HxZmGSfgnrkqu9IXr3FrWakdo');

client.on('ready', () => {
    console.log('Discord bot ready!!');
});

client.on('message', msg => {
    console.log(msg.content);
    if (msg.content === callBot+'hello' && msg.channel.id === idDiscordChanel) {
        msg.channel.send('Par la puissance de mon sceptre, je te salue viking');
    }
    if (msg.content === callBot+'status' && msg.channel.id === idDiscordChanel) {
        msg.channel.send('Fonction : status');
        execCommand(msg,'./vhserver details',valheimUser,valheimIpServer,valheimPwd);
    }
    if (msg.content === callBot+'restart' && msg.channel.id === idDiscordChanel) {
        msg.channel.send('Fonction : restart');
        execCommand(msg,'./vhserver restart',valheimUser,valheimIpServer,valheimPwd);
    }
    if (msg.content === callBot+'update' && msg.channel.id === idDiscordChanel) {
        msg.channel.send('Fonction : update');
        execCommand(msg,'./vhserver update',valheimUser,valheimIpServer,valheimPwd);
    }
    if (msg.content === callBot+'reboot' && msg.channel.id === idDiscordChanel) {
        msg.channel.send('Fonction : reboot');
        execCommand(msg,'./vhserver reboot',valheimUser,valheimIpServer,valheimPwd);
    }
});


function execCommand(msg, command, user, ip, pwd) {
    Exec(command, {
        user:       user,
        host:       ip,
        password:   pwd
    },function (err, stdout, stderr) {
        if (err){
            msg.channel.send("l'erreur suivante est survenue :" + err);
            console.log(err, stdout, stderr);    
        }
        // else{
        //     msg.channel.send("retour suivant :" + stdout);
        // }
    });
}