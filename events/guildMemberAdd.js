const discord = require('discord.js');
const moment = require('moment')

module.exports = {
    eventType: "guildMemberAdd",
    /**
     * 
     * @param {discord.GuildMember} member 
     * @param {discord.Client} client 
     */
    async execute(member, client) {

        var newInvites = await member.guild.fetchInvites();

        var message = `**${member.user}, Joined The Server, Can't Find Who Invited Him 🧐**`;

        for(var invite of client.cachedInvites.get(member.guild.id).array()) {
            var inviteCode = newInvites.find(newInvite => newInvite.code === invite.code);
            if(inviteCode !== undefined) {
                if(inviteCode.uses > invite.uses && invite.inviter.id !== member.user.id) {
            
                    var inviter = await client.database.get(`${member.guild.id}_${inviteCode.inviter.id}_invitedData`);
                    if(inviter !== null || inviter !== undefined && inviteCode.inviter.id === inviter.invitedBy) return;

                    var timePassed = moment.duration(new Date().getTime() - member.user.createdAt.getTime()).asDays();

                    // Is User Have Invite Data On Database?

                    var userData = await client.database.get(`${member.guild.id}_${inviteCode.inviter.id}`);
                    if(userData === null) {
                        await client.database.set(`${member.guild.id}_${inviteCode.inviter.id}`, {invitesAmount: 0, leftAmount: 0, fakeAmount: 0});
                        userData = await client.database.get(`${member.guild.id}_${inviteCode.inviter.id}`);
                    }

                    var isFake = false;
                    var newData;

                    var neededDays = await client.database.get(`${member.guild.id}_settings_fakeAmount`) ?? 2;

                    if(timePassed < neededDays) {
                        newData = {invitesAmount: userData.invitesAmount + 1, leftAmount: userData.leftAmount, fakeAmount: userData.fakeAmount + 1};
                        isFake = true;
                        
                        message = `**${member.user}**, Joined The Server. Invited By ${inviteCode.inviter}. **FAKE ACCOUNT**`;
                    } else {

                        newData = {invitesAmount: userData.invitesAmount + 1, leftAmount: userData.leftAmount, fakeAmount: userData.fakeAmount};
                        message = `**${member.user}, Joined The Server. Invited By ${inviteCode.inviter} **(**${userData.invitesAmount + 1} Invite${userData.invitesAmount + 1 !== 0 && userData.invitesAmount + 1 > 1 ? "s" : ""}**)`;
                    
                    }

                    await client.database.set(`${member.guild.id}_${inviteCode.inviter.id}`, newData);
                    await client.database.set(`${member.guild.id}_${member.user.id}_invitedData`, {isFake: isFake, invitedBy: inviteCode.inviter.id});

                }
            }
        }

        client.channels.cache.get("816339089728340028").send(message);

    },
};