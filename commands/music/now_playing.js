const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

function formatTime(time){
    const seconds = Math.floor((time / 1000) % 60)
    const minutes = Math.floor((time / (1000 * 60)) % 60)
    const hours = Math.floor(time / (1000 * 60 * 60))

    return `${hours ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

async function createNowPlayingEmbed(currentTrack, requester) {
    return new EmbedBuilder()
        .setColor(0x0099ff)
        .setAuthor({
            name: "Now Playing",
            iconURL: "https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUybzU0MWlxbnBkMGpxeDJ5dHlwaTg2MGZweTFsYTRlb2Vxa25meWp5aiZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/LwBTamVefKJxmYwDba/source.gif"
        })
        .setTitle(currentTrack.info.title)
        .setURL(currentTrack.info.uri)
        .setThumbnail(currentTrack.info.artworkUrl)
        .setFields(
            {name: "Artist", value: currentTrack.info.author},
            {name: "Album", value: currentTrack.pluginInfo.albumName ?? "-", inline: true},
            {name: "Duration", value: formatTime(currentTrack.info.length), inline: true}
        )
        .setFooter({text: `Requested by ${requester.displayName}`, iconURL: requester.displayAvatarURL()})
        
}

module.exports = {
    data: new SlashCommandBuilder().setName("nowplaying").setDescription("Get the current playing track"),
    async execute(interaction) {

        const player = interaction.client.riffy.get(interaction.guildId);

        const currentTrack = player.current

        const myEmbed = createNowPlayingEmbed(currentTrack.rawData, currentTrack.info.requester);

        await interaction.reply({
            embeds: [myEmbed]
        })
    },
    createNowPlayingEmbed,
}