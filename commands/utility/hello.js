const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("hello").setDescription("Greets the user"),
    async execute(interaction){
        await interaction.reply(`Hello ${interaction.user.displayName}, everything good trim ✌️`);
    }
}