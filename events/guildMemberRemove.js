const discord = require('discord.js');
const moment = require('moment');

module.exports = {
    eventType: "guildMemberRemove",
    async execute(member, client) {
        var inviterID = await client.database.get(`${member.guild.id}.${member.user.id}.invitedData`);

        var message;
        if(inviterID !== null && inviterID !== undefined) {
            var inviter = client.users.cache.get(inviterID.invitedBy) || await client.users.fetch(inviterID.invitedBy);
    
            var daysWas = moment.duration(new Date().getTime() - member.joinedAt.getTime()).asDays();
            var neededDays = await client.database.get(`${member.guild.id}_settings_leaveAmount`) ?? 2;
    
            if(daysWas < neededDays && !inviterID.isFake) {
                var data = client.database.get(`${member.guild.id}_${inviter.id}`)
                await client.database.set(`${member.guild.id}_${inviter.id}`, {invitesAmount: data.invitesAmount, leftAmount: data.leftAmount + 1, fakeAmount: data.leftAmount})
            }

            message = `**${member.user.tag}, Left The Server, Invited By ${inviter.username}**`;
        } else {
            message = `${member.user.tag} Left The Server, Can't Find Who Invited Him :thinking:`
        }

        client.channels.cache.get("816339089728340028").send(message);

    },
};