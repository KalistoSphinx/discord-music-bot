const {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionsBitField,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    MessageFlags,
} = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Get all bot commands")
        .addStringOption((option) =>
            option.setName("command").setDescription("Enter command name to get more info")
        ),
    async execute(interaction) {
        const utilityCommands = [];
        const musicCommands = [];
        const allFiles = fs.readdirSync(__dirname);
        const musicFiles = fs.readdirSync("./commands/music");
        const query = interaction.options.getString("command")

        for (const file of allFiles) {
            const filePath = path.join(__dirname, file);
            const command = require(filePath);
            if ("data" in command && "execute" in command) {
                utilityCommands.push({
                    name: command.data.name,
                    description: command.data.description,
                });
            }
        }

        for (const file of musicFiles) {
            const filePath = path.join(__dirname, "../music", file);
            const command = require(filePath);
            if ("data" in command && "execute" in command) {
                musicCommands.push({
                    name: command.data.name,
                    description: command.data.description,
                });
            }
        }

        if(query){
            const command = [...utilityCommands, ...musicCommands].find(cmd => cmd.name == query);
            
            if (command) {
                return interaction.reply(`**${command.name}:** ${command.description}`)
            } else {
                return interaction.reply({content: "No results found", flags: MessageFlags.Ephemeral})
            }
        }

        const utilityCommandsString = utilityCommands.map(command => `\`${command.name}\``).join(", ")
        const musicCommandsString = musicCommands.map(command => `\`${command.name}\``).join(", ")

        // Embeds
        const myEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setDescription("To use a command, type \`/<command_name>\`\nFor more information about a command, type \`/help <command_name>\`")
            .setAuthor({
                name: `${interaction.client.user.displayName}'s Commands`,
                iconURL: interaction.client.user.displayAvatarURL(),
            })
            .setFields(
                {name: "🛠️   Utility", value: utilityCommandsString},
                {name: "🎵   Music", value: musicCommandsString}
            )

        await interaction.reply({
            embeds: [myEmbed],
        });
    },
};
