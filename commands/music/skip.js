const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip Song"),
    async execute(interaction) {

        const player = interaction.client.riffy.players.get(interaction.guildId);

        if(!player){
            return interaction.reply({
                content: "❌ No player found in this server.",
                flags: MessageFlags.Ephemeral
            });
        }

        if (!player.playing) {
            return interaction.reply({
                content: "❌ No track is currently playing",
                flags: MessageFlags.Ephemeral
            });
        }

        if(interaction.member.voice.channel?.id != player.voiceChannel){
            return interaction.reply({
                content: "❌ You must be in the same voice channel as the bot",
                flags: MessageFlags.Ephemeral
            })
        }

        player.stop();
        await interaction.reply("Skipped current song");
    }
}