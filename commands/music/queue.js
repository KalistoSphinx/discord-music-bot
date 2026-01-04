const { SlashCommandBuilder, EmbedBuilder, MessageFlags, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require("discord.js");

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

        const tracks = player.queue.map((track, index) => {
            return `${index + 1}. **[${track.rawData.info.author} - ${track.rawData.info.title}](${track.rawData.info.uri})** (${formatTime(track.rawData.info.length)})`
        })

        const tracksPerPage = 10;
        const totalPages = Math.ceil(tracks.length / tracksPerPage);

        function getEmbed(page) {
            const start = page * tracksPerPage;
            const end = start + tracksPerPage;
            const myEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setAuthor({
                    name: interaction.client.user.displayName,
                    iconURL: interaction.client.user.displayAvatarURL()
                })
                .setTitle("Current Queue")
                .setFields({
                    name: "Up Next:",
                    value: tracks.slice(start, end).join("\n")
                })
                .setFooter({ text: `Page ${page + 1} of ${totalPages}` });

            if (player.current) {
                myEmbed.setDescription(`**Now Playing:**\n**[${player.current.rawData.info.author} - ${player.current.rawData.info.title}](${player.current.rawData.info.uri})** (${formatTime(player.current.rawData.info.length)})`)
            }

            return myEmbed;
        }

        if (totalPages > 1) {
            let currentPage = 0;

            const previous = new ButtonBuilder().setCustomId("previous").setLabel("◀").setStyle(ButtonStyle.Primary).setDisabled(true)
            const next = new ButtonBuilder().setCustomId("next").setLabel("▶").setStyle(ButtonStyle.Primary)

            const row = new ActionRowBuilder().addComponents(previous, next);

            const response = await interaction.reply({
                embeds: [getEmbed(currentPage)],
                components: [row],
                withResponse: true
            })

            const collector = response.resource.message.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 6_00_000,
            });

            collector.on("collect", async (i) => {
                if(i.customId == "previous"){
                    currentPage = currentPage - 1;
                } else if (i.customId == "next"){
                    currentPage = currentPage + 1;
                }

                previous.setDisabled(currentPage == 0)
                next.setDisabled(currentPage == totalPages - 1);

                const updatedRow = new ActionRowBuilder().addComponents(previous, next);

                await i.update({
                    embeds: [getEmbed(currentPage)],
                    components: [updatedRow]
                });
            })
        } else {
            await interaction.reply({
                embeds: [getEmbed(0)]
            })
        }
    }
}