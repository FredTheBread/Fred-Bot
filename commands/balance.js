const fs = require("fs");
const money = require("../money.json");
const mongoose = require("mongoose");
const botconfig = require("../botconfig.json");
const Discord = require('discord.js');

// CONNECT TO DATABASE
mongoose.connect(botconfig.mongoPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// MODELS
const Data = require("../models/data.js");

module.exports.run = async (bot, message, args) => {

    if (!args[0]) {
        var user = message.author;
    } else {
        var user = message.mentions.users.first() || bot.users.cache.get(args[0]);
    }

    Data.findOne({
        userID: user.id
    }, (err, data) => {
        if (err) console.log(err);
        if (!data) {
            const newData = new Data({
                name: bot.users.cache.get(user.id).username,
                userID: user.id,
                lb: "all",
                money: 0,
                daily: 0,
            })
            newData.save().catch(err => console.log(err));
            let wembed = new Discord.MessageEmbed()
                .setTitle(`${user.username}'s balance`)
                .setDescription(`Balance: $0`)
            return message.channel.send(wembed)
        } else {
            let embed = new Discord.MessageEmbed()
                .setTitle(`${user.username}'s balance`)
                .setDescription(`Balance: $${data.money}`)
            return message.channel.send(embed)
        }
    })
}

module.exports.help = {
    name: "balance",
    aliases: ["bal", "money"]
}