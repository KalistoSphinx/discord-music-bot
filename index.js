const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags, Guild } = require('discord.js');
const { Player, QueryType, GuildQueueEvent } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
require("dotenv").config()

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const player = new Player(client);

client.once(Events.ClientReady, async (readyClient) => {
    try {
        await player.extractors.loadMulti(DefaultExtractors);
    } catch (e) {
        console.error('Failed to load extractors', e);
    }
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath)
        if('data' in command && 'execute' in command){
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.on(Events.InteractionCreate, async (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if(!command){
        console.log("Command not found");
        return;
    }

    try{
        await command.execute(interaction, client);
        console.log(`${interaction.user.displayName} used a command`);
    } catch(e){
        console.error(e);
    }

})

player.events.on(GuildQueueEvent.PlayerStart, async (queue, track) => {
    const {channel} = queue.metadata;
    await channel.send(`Now Playing: ${track.title}`)
})

client.login(process.env.BOT_TOKEN);

