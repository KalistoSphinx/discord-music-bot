const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Removes a track from the queue")
        .addNumberOption(option => option.setName("index").setDescription("index of the track to be removed").setRequired(true)),
    async execute(interaction) {
        const player = interaction.client.riffy.players.get(interaction.guildId);
        const index = interaction.options.getNumber("index");

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

        if (interaction.member.voice.channel?.id != player.voiceChannel) {
            return interaction.reply({
                content: "❌ You must be in the same voice channel as the bot.",
                flags: MessageFlags.Ephemeral
            })
        }

        if(index < 0 || index > player.queue.size){
            return interaction.reply({
                content: "❌ Please enter a valid index.",
                flags: MessageFlags.Ephemeral
            })
        } else {
            const track = player.queue.remove(index-1);
            return interaction.reply(`Removed **${track.rawData.info.title}** from the queue.`)
        }
        
    }
}