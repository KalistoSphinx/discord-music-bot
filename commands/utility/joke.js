const { SlashCommandBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("joke").setDescription("Get a random joke (No Filter)"),
    async execute(interaction) {

        const getData = async () => {
            const url = "https://v2.keapi.dev/joke/Any";
            try {
                const response = await fetch(url);
                if (!response.ok) return interaction.reply({
                    content: 'Server Response Failed',
                    flags: MessageFlags.Ephemeral
                });

                const result = response.json();
                return result;
            } catch (error) {
                return null
            }
        }

        const joke = await getData();

        if(!joke){
            return interaction.reply({
                content: "Couldn't fetch any joke, server error",
                flags: MessageFlags.Ephemeral
            })
        }

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