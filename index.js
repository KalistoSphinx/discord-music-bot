const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { Connectors } = require("shoukaku");
const { Kazagumo, KazagumoTrack } = require("kazagumo")
require("dotenv").config()

const Nodes = [{
    name: "jirayu",
    url: "lavalink.jirayu.net:13592",
    auth: "youshallnotpass",
    secure: false,
}]

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const kazagumo = new Kazagumo({
    defaultSearchEngine: "youtube",
    send: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
    }
}, new Connectors.DiscordJS(client), Nodes);

client.commands = new Collection();
client.kazagumo = kazagumo;

const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath)
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Events
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.log("Command not found");
        return;
    }

    try {
        await command.execute(interaction);
        console.log(`${interaction.user.displayName} used a command`);
    } catch (e) {
        console.error(e);
    }

})

client.once(Events.ClientReady, async (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

kazagumo.shoukaku.on('ready', (name) => console.log(`Lavalink ${name}: Ready!`));
kazagumo.shoukaku.on('error', (name, error) => console.error(`Lavalink ${name}: Error Caught,`, error));
kazagumo.shoukaku.on('close', (name, code, reason) => console.warn(`Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`));

kazagumo.on("playerStart", (player, track) => {
    const channel = client.channels.cache.get(player.textId);
    if (channel) {
        const { createNowPlayingEmbed } = require("./commands/music/now_playing.js")
        const embed = createNowPlayingEmbed(track.raw.info);
        channel.send({embeds: [embed]})
    }
});


client.login(process.env.BOT_TOKEN);