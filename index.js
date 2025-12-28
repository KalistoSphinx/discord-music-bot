const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { Shoukaku, Connectors } = require("shoukaku")
require("dotenv").config()

const Nodes = [
    {
        name: "myNode",
        url: "lavalink.jirayu.net:13592",
        auth: "youshallnotpass",
        secure: false,
    },
];

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const shoukaku = new Shoukaku(new Connectors.DiscordJS(client), Nodes);

client.commands = new Collection();
client.shoukaku = shoukaku;

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

shoukaku.on("error", (_, error) => console.error(error));

client.login(process.env.BOT_TOKEN);

