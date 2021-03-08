const discord = require('discord.js');
const client = new discord.Client({partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"]});
const fs = require('fs');
const config = require('./config.json');
const db = require('quick.db');

client.on("ready", async () => {

    // Database

    client.database = db;

    // Command Handler

    client.commands = new discord.Collection();

    const commandsDir = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
    for(const command of commandsDir) {
        var commandreq = require(`./commands/${command}`);
        for(var i of commandreq.commands) {
            client.commands.set(i, commandreq);
        }
    }

    // Invites Manager

    client.cachedInvites = new discord.Collection();

    for(var guild of client.guilds.cache.array()) {
        client.cachedInvites.set(guild.id, await guild.fetchInvites())
    }

    // All Bots Systems Are Loaded

    console.log(`The Bot Is Ready, Logged In As ${client.user.tag}\nLoaded ${commandsDir.length} Commands\nCached Invites Of ${client.guilds.cache.size} Servers`)
});

client.on("message", (message) => {

    // Check If The Message Starts With Prefix Or The User Is Bot Or Text Channel Isn't text

    if(!message.content.startsWith(config.bot.prefix) || message.author.bot || message.channel.type !== "text") return;

    
    const args = message.content.slice(config.bot.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(!client.commands.has(command)) return;

    client.commands.get(command).execute(args, message, client);
});

// Events

client.on("guildMemberAdd", (member) => require('./events/guildMemberAdd').execute(member, client))

client.on("guildMemberRemove", (member) => require('./events/guildMemberRemove').execute(member, client))

client.on("inviteCreate", async (invite) => client.cachedInvites.set(invite.guild.id, await invite.guild.fetchInvites()));

client.on("inviteDelete", async (invite) => client.cachedInvites.set(invite.guild.id, await invite.guild.fetchInvites()));

// Login

client.login(config.bot.token)