module.exports.run = async (bot, message, args) => {

    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("you cannot clear messages!");
    if(!args[0]) return message.reply("how many messages do you want to clear?");
    if(parseInt(args[0]) > 100) return message.reply("you cannot delete more than 100 messages at a time!");

    message.channel.bulkDelete(parseInt(args[0]) + 1).then(() => {
        message.channel.send(`Cleared ${args[0]} messages.`).then(msg => msg.delete({timeout: 3000}));
    }).catch((err) => {
        return message.reply("an error occured!");
    })

}

module.exports.help = {
    name: "clear",
    aliases: []
}