const {SlashCommandBuilder, MessageFlags} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("shuffle").setDescription("Just what it says"),
    async execute(interaction){
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

        if (interaction.member.voice.channel?.id != player.voiceChannel) {
            return interaction.reply({
                content: "❌ You must be in the same voice channel as the bot.",
                flags: MessageFlags.Ephemeral
            })
        }

        if(interaction.member.roles.cache.some(role => role.name == "DJ")){
            player.queue.shuffle();
            await interaction.reply("Shuffled the queue")
        } else {
            return interaction.reply({
                content: "❌ Only the DJ user can shuffle the queue.",
                flags: MessageFlags.Ephemeral
            })
        }
    }
}