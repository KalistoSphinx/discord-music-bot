const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require("discord.js");
const ytdl = require("ytdl-core")
const { useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("play a song in a voice channel")
        .addStringOption(
            (option) => option.setName("song")
                .setDescription("The song to play")
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const player = useMainPlayer();

        let query = interaction.options.getString('song', true)

        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({
                content: "You need to be in a voice channel to play music",
                flags: MessageFlags.Ephemeral
            })
        }

        if (interaction.guild.members.me.voice.channel && interaction.guild.members.me.voice.channel !== voiceChannel) {
            return interaction.reply(
                "I am already playing in a different voice channel"
            );
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.Connect)) {
            return interaction.reply(
                'I do not have permission to join your voice channel!',
            );
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.Speak)) {
            return interaction.reply(
                'I do not have permission to speak in voice channel!',
            );
        }

        await interaction.deferReply();

        if(ytdl.validateURL(query)){
            const info = await ytdl.getBasicInfo(query);
            const videoTitle = info.videoDetails.title

            query = videoTitle;
        }

        try {
            const result = await player.play(voiceChannel, query, {
                nodeOptions: {
                    metadata: { channel: interaction.channel }
                }
            })

            return interaction.editReply(
                `${result.track.title} has been added to the queue!`
            )
        } catch (error) {
            console.error(error);
            return interaction.editReply('An error occurred while playing the song!');
        }
    }
};
