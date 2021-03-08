const discord = require("discord.js");
const config = require('../config.json');

module.exports = {
    commands: ["settings"],
    /**
     * 
     * @param {string[]} args 
     * @param {discord.Message} message 
     * @param {discord.Client} client 
     */
    async execute(args, message, client) {

        var embed = new discord.MessageEmbed()
        .setAuthor(`Elior's Test Bot | InviteManager Settings`)
        .setColor("RANDOM")
        .setFooter(`Command Executor: ${message.author.tag} | Bot Developer: Elior#0590`)
        .setTimestamp();

        if(args.length !== 2) {
            embed.setDescription(`Wrong Command Execute, Example: ${config.bot.prefix}settings [setting] [value]`)
            return message.channel.send(embed);
        }

        var setting = args[0].toLowerCase();
        var amount = args[1];

        if(setting === "fakeamount") {
            if(!isNaN(parseInt(amount))) {
                client.database.set(`${message.guild.id}_settings_fakeAmount`, parseInt(amount));
                embed.setDescription(`Fake Amount Has Been Set To ${amount}`);
            } else {
                embed.setDescription(`Invaild Amount!, Need Amount Type Is \`Number\``)
            }
        } else if(setting === "leaveamount") {
            if(!isNaN(parseInt(amount))) {
                client.database.set(`${message.guild.id}_settings_leaveAmount`, parseInt(amount));
                embed.setDescription(`Leave Amount Has Been Set To ${amount}`);
            } else {
                embed.setDescription(`Invaild Amount!, Need Amount Type Is \`Number\``)
            }
            
        } else {
            embed.setDescription(`Unknown Setting..\nAvailable Settings:\nfakeAmount\nleaveAmount`)
        }

        message.channel.send(embed);
    }
}