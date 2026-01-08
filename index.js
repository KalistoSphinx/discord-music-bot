const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits, GatewayDispatchEvents } = require("discord.js");
const { Riffy } = require("riffy");
require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const nodes = [
    {
        name: "embotic",
        host: "46.202.82.147",
        port: 1026,
        password: "jmlitev4",
        secure: false,
    }
];

const riffy = new Riffy(client, nodes, {
    send: (payload) => {
        const guild = client.guilds.cache.get(payload.d.guild_id);
        if(guild) guild.shard.send(payload);
    },
    defaultSearchPlatform: "spsearch",
    restVersion: "v4"
})

client.commands = new Collection();
client.riffy = riffy;

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            );
        }
    }
}

// Client Events
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
});

client.once(Events.ClientReady, async (readyClient) => {
    client.riffy.init(client.user.id);
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("raw", (d) => {
    if (![GatewayDispatchEvents.VoiceStateUpdate, GatewayDispatchEvents.VoiceServerUpdate,].includes(d.t)) return;
    riffy.updateVoiceState(d);
});

client.on(Events.VoiceStateUpdate, (oldState, newState) => {
    const botVoiceChannel = oldState.guild.members.me.voice.channel;
    
    if (!botVoiceChannel) return;

    if (oldState.channelId === botVoiceChannel.id || newState.channelId === botVoiceChannel.id) {
        const members = botVoiceChannel.members.filter(member => !member.user.bot);
        
        if (members.size === 0) {
            const player = client.riffy.players.get(oldState.guild.id);
            if (player) {
                player.destroy();
                const channel = client.channels.cache.get(player.textChannel);
                if (channel) {
                    channel.send("Left the voice channel because no members are present.");
                }
            }
        }
    }
});

// Riffy Events

riffy.on("nodeConnect", node => {
    console.log(`Node "${node.name}" connected.`)
})
 
riffy.on("nodeError", (node, error) => {
    console.log(`Node "${node.name}" encountered an error: ${error.message}.`)
})

riffy.on("trackStart", async (player, track) => {
    const channel = client.channels.cache.get(player.textChannel);

    if(channel){
        const { createNowPlayingEmbed } = require("./commands/music/now_playing.js");
        const myEmbed = await createNowPlayingEmbed(track.rawData, track.info.requester);
        channel.send({embeds: [myEmbed]})
    }
})

riffy.on("queueEnd", (player) => {
    const channel = client.channels.cache.get(player.textChannel);
    if(channel){
        channel.send("Queue Ended. Disconnecting in 30 seconds if no new tracks are added.")
    }

    setTimeout(() => {
        if(!player.playing && player.queue.size == 0){
            player.destroy();
            if(channel){
                channel.send("Disconnected due to inactivity");
            }
        }
    }, 30000)
})

riffy.on("playerDisconnect", (player) => {
    const member = player.get("DJuser");
    const role = player.get("DJrole");

    player.clearData();
    member.roles.remove(role);
})

client.login(process.env.BOT_TOKEN);
