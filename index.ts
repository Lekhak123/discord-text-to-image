require('dotenv').config();
const {REST, Routes} = require('discord.js');
const {Client, GatewayIntentBits, Events, EmbedBuilder, AttachmentBuilder} = require('discord.js');
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});
const base64Img = require('base64-img');
const find = require("text-to-img-craiyon-scrapper");
const rest = new REST({version: '10'}).setToken(process.env.discord_token);

(async() => {
    try {
        console.log('Started refreshing application (/) commands.');
        const commands = [
            {
                name: 'draw',
                description: 'Receive the image',
                options: [
                    {
                        name: "draw_input",
                        description: "What do you want to draw",
                        type: 3,
                        required: true
                    }
                ]
            }
        ];
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {body: commands});

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.once(Events.ClientReady, (c: { user: { tag: any; }; }) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction: { isChatInputCommand: () => any; commandName: string; options: { getString: (arg0: string) => any; }; reply: (arg0: { embeds: any[]; }) => any; editReply: (arg0: { embeds: any[]; files: any[]; }) => any; }) => {
    if (!interaction.isChatInputCommand()) 
        return;
    
    if (interaction.commandName === 'draw') {
        let draw_input = interaction
            .options
            .getString("draw_input")
        // console.log(draw_input)
        const newembed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(draw_input)
            .setDescription("An image will appear here shortly.")
        await interaction.reply({embeds: [newembed]});
        let draw_img:String = await find(draw_input)
        base64Img.img(draw_img, __dirname, "out", (err: any) => {}); // Asynchronous using
        function random(colors:String[]) {
            return colors[Math.floor(Math.random() * colors.length)];
        };
        let color:String = random(['#008000', '#E50000']);
        const attachment:any = new AttachmentBuilder(__dirname + "/out.webp");
        const embed:any = new EmbedBuilder()
            .setColor(color)
            .setTitle(draw_input)
            .setImage('attachment://out.webp');

        await interaction.editReply({embeds: [embed], files: [attachment]}) //editReply

    }
});

client.login(process.env.discord_token);