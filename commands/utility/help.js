const {EmbedBuilder, SlashCommandBuilder} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder().setName("help").setDescription("Get all bot commands"),
    async execute(interaction, client){

        const myEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setAuthor({
                name: "Viego Music Bot",
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle("List of available commands")
            .addFields(
                { name: "`/ping`", value: "Replies with pong" },
                { name: "`/hello`", value: "Greets the user" },
            )

        await interaction.reply({
            embeds: [myEmbed]
        })
    }
}