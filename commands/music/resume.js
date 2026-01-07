const {SlashCommandBuilder, MessageFlags} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("resume").setDescription("Resumes the player"),
    async execute(interaction){
        const player = interaction.client.riffy.players.get(interaction.guildId);

        if (!player) {
            return interaction.reply({
                content: "❌ No player found in this server.",
                flags: MessageFlags.Ephemeral
            });
        }

        if (interaction.member.voice.channel?.id != player.voiceChannel) {
            return interaction.reply({
                content: "❌ You must be in the same voice channel as the bot.",
                flags: MessageFlags.Ephemeral
            })
        }

        if(player.paused){
            player.pause(false);
            return interaction.reply("Player Resumed")
        } else {
            return interaction.reply({
                content: "❌ Player is already playing",
                flags: MessageFlags.Ephemeral
            })
        }
    }
}