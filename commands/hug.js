const Discord = require("discord.js");
const colors = require("../colours.json");

module.exports.run = async (bot, message, args) => {

    let gifs = [
        "https://media.giphy.com/media/wnsgren9NtITS/giphy.gif",
        "https://i.imgur.com/r9aU2xv.gif",
        "https://acegif.com/wp-content/uploads/anime-hug.gif",
    ];
    let pick = gifs[Math.floor(Math.random() * gifs.length)];

    let embed = new Discord.MessageEmbed();
    embed.setColor(colors.Purple);
    embed.setImage(pick);

    if(args[0]) {
        let user = message.mentions.members.first();
        embed.setTitle(`${message.author.username} hugs ${bot.users.cache.get(user.id).username}!`);
    } else {
        embed.setTitle(`${message.author.username} wants a hug.`);
    }

    return message.channel.send(embed);
}

module.exports.help = {
    name: "hug",
    aliases: []
}