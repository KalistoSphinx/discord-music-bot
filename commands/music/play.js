const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song in a voice channel")
        .addStringOption(
            (option) => option
                .setName("song")
                .setDescription("The song to play")
                .setRequired(true),
        ),
    async execute(interaction, client) {
        const shoukaku = interaction.client.shoukaku;
        const query = interaction.options.getString("song", true);

        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({
                content: 'You need to be in a voice channel to play music!',
                flags: MessageFlags.Ephemeral
            });
        }

        const player = await shoukaku.joinVoiceChannel({
            guildId: `${interaction.guildId}`,
            channelId: `${interaction.member.voice.channel.id}`,
            shardId: 0,
        })

        setTimeout(() => shoukaku.leaveVoiceChannel(player.guildId), 30000).unref();
    },
};
