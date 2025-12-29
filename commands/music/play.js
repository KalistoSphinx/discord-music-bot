const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require("discord.js");

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
    async execute(interaction) {
        const query = interaction.options.getString("song", true);
        const kazagumo = interaction.client.kazagumo

        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({
                content: 'You need to be in a voice channel to play music!',
                flags: MessageFlags.Ephemeral
            });
        }

        if(interaction.guild.members.me.voice.channel && interaction.guild.members.me.voice.channel !== voiceChannel){
            return interaction.reply("I am already playing in a different voice channel!")
        }

        if(!voiceChannel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.Connect)){
            return interaction.reply("I dont have permission to join your voice channel");
        }

        if(!voiceChannel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.Speak)){
            return interaction.reply("I dont have permission to speak in your voice channel");
        }

        const player = await kazagumo.createPlayer({
            guildId: interaction.guildId,
            textId: interaction.channelId,
            voiceId: interaction.member.voice.channel.id,
        })

        await interaction.deferReply();

        const result = await kazagumo.search(query, {source: "ytmsearch:", requester: interaction.member})

        player.queue.add(result.tracks[0]);

        await interaction.editReply(`Queued: **${result.tracks[0].raw.info.title}**`)

        if(!player.playing && !player.paused){
            player.play();
        }
    },
};