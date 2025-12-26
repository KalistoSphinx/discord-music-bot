const { SlashCommandBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("joke").setDescription("Get a random joke (No Filter)"),
    async execute(interaction) {

        const getData = async () => {
            const url = "https://v2.jokeapi.dev/joke/Any";
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Response Status: ${response.status}`);

                const result = response.json();
                return result;
            } catch (error) {
                console.error(error);
            }
        }

        const joke = await getData();
        const { setup, delivery } = joke

        const setupLine = new TextDisplayBuilder().setContent(`${setup}`);
        const separatorLine = new SeparatorBuilder().setDivider(false).setSpacing(SeparatorSpacingSize.Small)
        const deliveryLine = new TextDisplayBuilder().setContent(`${delivery}`)

        await interaction.reply({
            components: [setupLine, separatorLine, deliveryLine],
            flags: MessageFlags.IsComponentsV2
        })
    }
}