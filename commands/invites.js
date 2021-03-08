const discord = require("discord.js");

module.exports = {
    commands: ["invites", "inv"],
    /**
     * 
     * @param {string[]} args 
     * @param {discord.Message} message 
     * @param {discord.Client} client 
     */
    async execute(args, message, client) {

        var embed = new discord.MessageEmbed()
        .setColor("RED")
        .setFooter(`Command Executor: ${message.author.tag} | Bot Developer: Elior#0590`)
        .setTimestamp();

        var user = message.author;

        if(args.length === 1) user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]) || message.author;


        if(user.bot) {
            embed.setDescription(`${user.username} have \`1mil\` Invites (\`1mil\` Total, \`0\` Leaves, \`0\` Fakes)`)
            return message.channel.send(embed);
        }

        var userData = await client.database.get(`${message.guild.id}_${user.id}`);

        if(userData === undefined || userData === null) {
            await client.database.set(`${message.guild.id}_${user.id}`, {invitesAmount: 0, leftAmount: 0, fakeAmount: 0});
            userData = await client.database.get(`${message.guild.id}_${user.id}`);
        }

        var realInvites = userData.invitesAmount - userData.leftAmount - userData.fakeAmount;

        embed.setAuthor(`Elior King | ${user.tag} Invites`)
        embed.setDescription(`${user.username} have \`${realInvites}\` Legit Invite${userData.invitesAmount === 1 ? "" : "s"} (\`${userData.invitesAmount}\` Total, \`${userData.leftAmount}\` ${userData.leftAmount === 1 ? "Left" : "Leaves"}, \`${userData.fakeAmount}\` Fake${userData.fakeAmount === 1 ? "" : "s"})`)

        message.channel.send(embed);
    }
}