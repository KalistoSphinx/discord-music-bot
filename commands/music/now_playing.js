const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

function createNowPlayingEmbed(currentTrack) {
    return new EmbedBuilder()
        .setColor(0x0099ff)
        .setFields(
            { name: "Now playing", value: currentTrack.title},
            { name: "By", value: currentTrack.author }
        )
        .setThumbnail(currentTrack.artworkUrl)
}

module.exports = {
    data: new SlashCommandBuilder().setName("nowplaying").setDescription("Get the currently playing track"),
    async execute(interaction) {
        const player = interaction.client.kazagumo.getPlayer(interaction.guildId);

        const currentTrack = player.queue.current.raw.info;

        const myEmbed = createNowPlayingEmbed(currentTrack);

        await interaction.reply({
            embeds: [myEmbed]
        })
    },
    createNowPlayingEmbed,
}