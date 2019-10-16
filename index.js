const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    // console.log('voice channel', msg.member.voiceChannel);
    const voiceChannel = msg.member.voiceChannel;
    // voiceChannel.join().then(res => {
    //     console.log('OK!');
    // });
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    console.log(permissions.has('CONNECT'));
    
    // if (msg.content.startsWith(prefix)) {
    //     msg.reply(msg.content, false).then(res => {
    //     });
    // }
});

client.login(token);