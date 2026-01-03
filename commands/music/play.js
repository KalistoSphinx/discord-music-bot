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
        const riffy = interaction.client.riffy;

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

        await interaction.deferReply();

        const player = riffy.createConnection({
            guildId: interaction.guildId,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channelId,
            deaf: true
        })

        const result = await riffy.resolve({
            query: query,
            requester: interaction.user,
        })

        const {loadType, tracks} = result;

        if(loadType == "playlist"){

            for(const track of result.tracks){
                track.info.requester = interaction.user;
                player.queue.add(track);
            }

            await interaction.editReply(`Added: \`${tracks.length}\` tracks from **${playlistInfo.name}**`)
            if(!player.playing && !player.paused) player.play();
            
        } else if(loadType == "search" || loadType == "track"){
            const track = tracks.shift();
            track.info.requester = interaction.user;
            
            player.queue.add(track);

            await interaction.editReply(`Queued: **${track.rawData.info.title}** by **${track.rawData.info.author}**`)
            if (!player.playing && !player.paused) player.play();
        } else {
            await interaction.editReply("No results found");
        }
    },
};