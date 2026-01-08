const {SlashCommandBuilder, MessageFlags, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("getlyrics").setDescription("Get the lyrics of the current song"),
    async execute(interaction){
        const player = interaction.client.riffy.players.get(interaction.guildId);
        const track = player.current;

        if (!player) {
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

        if (interaction.member.voice.channel?.id != player.voiceChannel) {
            return interaction.reply({
                content: "❌ You must be in the same voice channel as the bot.",
                flags: MessageFlags.Ephemeral
            })
        }

        async function getLyrics(trackName, artistName){
            const url = `https://lrclib.net/api/search?track_name=${encodeURIComponent(trackName)}&artist_name=${encodeURIComponent(artistName)}`

            try {
                const response = await fetch(url)
                if (!response.ok) return interaction.reply({
                    content: 'Server Response Failed',
                    flags: MessageFlags.Ephemeral
                });

                const result = await response.json()
                
                return result;
            } catch (error) {
                return null
            }
        }

        await interaction.deferReply();

        const allLyrics = await getLyrics(track.rawData.info.title, track.rawData.info.author);  

        const lyrics = allLyrics.shift(); 
        
        if(!lyrics){
            return interaction.reply({
                content: "Couldn't fetch any lyrics, server Error",
                flags: MessageFlags.Ephemeral
            })
        }

        const {trackName, artistName, plainLyrics} = lyrics;

        const myEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`${artistName} - ${trackName}`)
            .setURL(track.rawData.info.uri)
            .setThumbnail(track.rawData.info.artworkUrl)
            .setDescription(`\`\`\`${plainLyrics}\`\`\``)
            .setFooter({text: `Requested by ${track.info.requester.displayName}`, iconURL: track.info.requester.displayAvatarURL()})

        await interaction.editReply({
            embeds: [myEmbed]
        })
    }
}