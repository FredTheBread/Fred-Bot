module.exports.run = async (bot, message, args) => {

    const m = await message.channel.send("Ping?");
    const embed = new 
    m.edit(`Pong! ${m.createdTimestamp - message.createdTimestamp}ms`);

}

module.exports.help = {
    name: "ping",
    aliases: ["p"]
}