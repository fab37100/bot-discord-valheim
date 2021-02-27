// Importation des dependances
const Discord = require('discord.js');
const Exec = require('ssh-exec');
require('dotenv').config()

// Imppoortation des variables d'environnement
const IDDISCORDCHANEL = process.env.IDDISCORDCHANEL;
const VALHEIMIPSERVER = process.env.VALHEIMIPSERVER;
const VALHEIMUSER = process.env.VALHEIMUSER;
const VALHEIMPWD = process.env.VALHEIMPWD;
const TOKENDISCORDBOT = process.env.TOKENDISCORDBOT;

// Création des variables
const callBot = '$!';

const client = new Discord.Client();
client.login(TOKENDISCORDBOT);

client.on('ready', () => {
    console.log('Discord bot ready!!');
});

client.on('message', msg => {
    console.log(msg.content);
    if (msg.content === callBot+'hello' && msg.channel.id === IDDISCORDCHANEL) {
        msg.channel.send('Par la puissance de mon sceptre, je te salue viking');
    }
    if (msg.content === callBot+'status' && msg.channel.id === IDDISCORDCHANEL) {
        msg.channel.send('Fonction : status');
        execCommand(msg,'./vhserver details',VALHEIMUSER,VALHEIMIPSERVER,VALHEIMPWD);
    }
    if (msg.content === callBot+'restart' && msg.channel.id === IDDISCORDCHANEL) {
        msg.channel.send('Fonction : restart');
        execCommand(msg,'./vhserver restart',VALHEIMUSER,VALHEIMIPSERVER,VALHEIMPWD);
    }
    if (msg.content === callBot+'update' && msg.channel.id === IDDISCORDCHANEL) {
        msg.channel.send('Fonction : update');
        execCommand(msg,'./vhserver update',VALHEIMUSER,VALHEIMIPSERVER,VALHEIMPWD);
    }
    if (msg.content === callBot+'reboot' && msg.channel.id === IDDISCORDCHANEL) {
        msg.channel.send('Fonction : reboot');
        execCommand(msg,'./vhserver reboot',VALHEIMUSER,VALHEIMIPSERVER,VALHEIMPWD);
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