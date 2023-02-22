const Discord = require("discord.js");
const bot = new Discord.Client({
    DisableEveryone: true
});
const botconfig = require("./botconfig.json");
const fs = require("fs");
var userData = JSON.parse(fs.readFileSync('./userdata.json', 'utf8'));
bot.snipes = new Discord.Collection();
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
const db = require('quick.db');
const {
    MessageEmbed
} = require('discord.js');

function userInfo(user) {
    var finalString;
    let embed = new Discord.MessageEmbed()
    finalString = embed
        .setTitle(`**Data of ${user.username}**`)
        .addField(`**Username**`, `**${user.username} with the id of ${user.id}**`)
        .addField(`**Date of creation**`, '**' + user.createdAt + '**')
        .addField(`**Messages sent in current server**`, '**' + userData[user.id].messagesSent + '**')
        .setThumbnail(user.avatarURL())
    return finalString;
}

bot.on('message', async message => {
  if (message.author.bot) return;
  if (!message.guild) return;
});

// READ COMMANDS FOLDER
fs.readdir("./commands/", (err, files) => {
    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log("Couldn't find any commands!");
        return;
    }

    jsfile.forEach((f) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);

        props.help.aliases.forEach(alias => {
            bot.aliases.set(alias, props.help.name);
        })
    })
})

bot.on('message', (message, args) => {
    var sender = message.author;
    var msg = message.content.toLowerCase();
    let user = message.mentions.users.first()
    if (msg.startsWith(botconfig.prefix + 'userstats')) {
        if (msg === botconfig.prefix + 'userstats') {
            message.channel.send(userInfo(sender));
        }
    }
    if (!userData[sender.id]) userData[sender.id] = {
        messagesSent: 0
    }

    userData[sender.id].messagesSent++;
    fs.writeFile('./userdata.json', JSON.stringify(userData), (err) => {
        if (err) console.log(err)
    });
})

// BOT ONLINE MESSAGE AND ACTIVITY MESSAGE
bot.on("ready", async () => {
    console.log(`${bot.user.username} is online on ${bot.guilds.cache.size} server!`);
    bot.user.setActivity(`with ${bot.guilds.cache.size} servers!`, {
        type: "STREAMING",
        url: "https://www.twitch.tv/fredthebread_"
    });
});


bot.on("message", async message => {

    // CHECK CHANNEL TYPE
    if (message.channel.type === "dm") return;
    if (message.author.bot) return;

    // CHECK PREFIX, DEFINE ARGS & COMMAND
    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
    if (!prefixes[message.guild.id]) {
        prefixes[message.guild.id] = {
            prefix: botconfig.prefix
        }
    }
    let prefix = prefixes[message.guild.id].prefix;

    if (!message.content.startsWith(prefix)) return;

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd;
    cmd = args.shift().toLowerCase();
    let command;
    let commandfile = bot.commands.get(cmd.slice(prefix.length));

    if (commandfile) commandfile.run(bot, message, args);

    if (bot.commands.has(cmd)) {
        command = bot.commands.get(cmd);
    } else if (bot.aliases.has(cmd)) {
        command = bot.commands.get(bot.aliases.get(cmd));
    }
    try {
        command.run(bot, message, args);
    } catch (e) {
        return;
    }
})

bot.login(botconfig.token);