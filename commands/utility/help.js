const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js")
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder().setName("help").setDescription("Get all bot commands"),
    async execute(interaction, client) {

        const utilityCommands = []
        const allFiles = fs.readdirSync(__dirname);

        for(const file of allFiles){
            const filePath = path.join(__dirname, file);
            const command = require(filePath);
            if('data' in command && 'execute' in command){
                fields.push({
                    name: `\`/${command.data.name}\``,
                    value: command.data.description
                })
            }
        }

        const myEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Utility Commands")
            .setAuthor({
                name: "Viego Music Bot",
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle("List of available commands")
            .addFields(...fields)

        await interaction.reply({
            embeds: [myEmbed],
        })
    }
}