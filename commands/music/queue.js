const { SlashCommandBuilder } = require("discord.js");

function formatTime(time){
    const seconds = Math.floor((time / 1000) % 60)
    const minutes = Math.floor((time / (1000 * 60)) % 60)
    const hours = Math.floor(time / (1000 * 60 * 60))

    return `${hours ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

module.exports = {
    data: new SlashCommandBuilder().setName("queue").setDescription("Get the current queue"),
    async execute(interaction) {

        const player = interaction.client.riffy.players.get(interaction.guildId);

        if (!player) {
            return interaction.reply({
                content: "❌ No player found in this server.",
                flags: MessageFlags.Ephemeral
            });
        }

        if(player.queue.size === 0){
            return interaction.reply({
                content: "❌ There are no tracks in the queue.",
                flags: MessageFlags.Ephemeral
            });
        }

        
    }
}