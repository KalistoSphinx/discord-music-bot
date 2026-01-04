const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

function formatTime(time) {
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

        if (!player.current && player.queue.size == 0) {
            return interaction.reply({
                content: "❌ There are no tracks in the queue.",
                flags: MessageFlags.Ephemeral
            });
        }

        const myEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setAuthor({
                name: interaction.client.user.displayName,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setTitle("Current Queue")

        if (player.current) {
            myEmbed.setDescription(`**Now Playing:**\n**[${player.current.rawData.info.author} - ${player.current.rawData.info.title}](${player.current.rawData.info.uri})** (${formatTime(player.current.rawData.info.length)})`)
        }     
        
        const tracks = player.queue.map((track, index) => {
            return `${index + 1}. **[${track.rawData.info.author} - ${track.rawData.info.title}](${track.rawData.info.uri})** (${formatTime(track.rawData.info.length)})`
        })

        myEmbed.addFields({
            name: "Up Next:",
            value: tracks.join("\n")
        })

        await interaction.reply({
            embeds: [myEmbed]
        })
    }
}