var ChanName = 'general';

module.exports.run = async (bot, message, channel, args) => {

    if(!message.member.hasPermission("MANAGE_MESSAGES", "MANAGE_CHANNELS")) return message.reply("you cannot nuke this channel!");
    bot.channels.cache.find(c => c.name === "general");
    message.channel.delete(ChanName);
    message.guild.channels.create(ChanName)
    message.channel.send('Successfully nuked!');
}

module.exports.help = {
    name: "nuke",
    aliases: []
}