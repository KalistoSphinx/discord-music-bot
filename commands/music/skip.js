const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip Song"),
    async execute(interaction){
        const player = interaction.client.riffy.get(interaction.guildId);
        
    }    
}