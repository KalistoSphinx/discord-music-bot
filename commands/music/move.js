const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("move")
        .setDescription("Moves a track in the queue")
        .addNumberOption(option => option.setName("source").setDescription("Index of the track to be moved").setRequired(true))
        .addNumberOption(option => option.setName("destination").setDescription("Index where the track is to be moved").setRequired(true)),
    async execute(interaction) {
        const player = interaction.client.riffy.players.get(interaction.guildId);
        const queue = player.queue;
        const source = interaction.options.getNumber("source");
        const destination = interaction.options.getNumber("destination");

        if (!player) {
            return interaction.reply({
                content: "❌ No player found in this server.",
                flags: MessageFlags.Ephemeral,
            });
        }

        if (!player.current && player.queue.size == 0) {
            return interaction.reply({
                content: "❌ There are no tracks in the queue.",
                flags: MessageFlags.Ephemeral,
            });
        }

        if (interaction.member.voice.channel?.id != player.voiceChannel) {
            return interaction.reply({
                content: "❌ You must be in the same voice channel as the bot.",
                flags: MessageFlags.Ephemeral,
            });
        }

        if((source > 0 && source <= queue.length) && (destination > 0 && destination <= queue.length)){

            [queue[source-1], queue[destination-1]] = [queue[destination-1], queue[source-1]]

        await interaction.reply("Track Moved")
        } else {
            await interaction.reply({
                content: "Enter a valid index",
                flags: MessageFlags.Ephemeral
            });
        }

    },
};
