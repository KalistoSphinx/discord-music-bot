const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("clearqueue").setDescription("Clears all the songs in the queue *only DJ"),
    async execute(interaction) {

        const player = interaction.client.riffy.players.get(interaction.guildId);

        if (!player) {
            return interaction.reply({
                content: "❌ No player found in this server.",
                flags: MessageFlags.Ephemeral
            });
        }

        if (!player.current && player.queue.size == 0) {
            return interaction.reply({
                content: "❌ There are no tracks in the queue.",
                flags: MessageFlags.Ephemeral
            });
        }

        if (interaction.member.voice.channel?.id != player.voiceChannel) {
            return interaction.reply({
                content: "❌ You must be in the same voice channel as the bot.",
                flags: MessageFlags.Ephemeral
            })
        }

        if(interaction.member.roles.cache.some(role => role.name == "DJ")){
            const queueSize = player.queue.size;
            await interaction.reply(`Cleared \`${queueSize}\` tracks from the queue`)
            player.queue.clear();
        } else {
            return interaction.reply({
                content: "❌ Only the DJ user can clear the queue.",
                flags: MessageFlags.Ephemeral
            })
        }
    }
}