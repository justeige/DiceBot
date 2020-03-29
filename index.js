const Discord = require("discord.js");
const Config  = require("./config.json");
const FileSys = require("fs");
const Enmap   = require("enmap");

// create the bot via Discords API
const bot      = new Discord.Client();
bot.config     = Config;
bot.commands   = new Enmap();
bot.line_width = Config.line_width;
bot.dice_sums  = [6];

bot.on("ready", () => {
    console.log(`${bot.user.username} is online!`);
})

// load commands
FileSys.readdir("./commands/", (err, files) => {
    if (err) {
        return console.error(err);
    }
    files.forEach(file => {
        // check only the script files
        if (!file.endsWith(".js")) { return; }

        let properties = require(`./commands/${file}`);
        let cmd_name = file.split(".")[0];
        console.log(`loading command ${cmd_name}`);
        bot.commands.set(cmd_name, properties);
    })
});



// message handling
bot.on('message', msg => {

    // keep log for debugging
    const user_name  = msg.author.username;    
    const user_input = msg.content.toLowerCase();
    console.log(`${user_name}: ${user_input}`);
    

    // prevent loop effects, so the bot doesn't reply to itself:
    if (user_name == bot.user.username) {
        return;
    }
    
    // check for maintenance/setting commands
    if (user_input.startsWith(Config.prefix)) {
        const args = msg.content.slice(bot.config.prefix.length).trim().split(' ');
        const possible_command = args.shift().toLowerCase();
        // try get the command
        const cmd = bot.commands.get(possible_command);
        if (!cmd) { 
            msg.channel.send(`Ich kenne den Befehl ${cmd} nicht!`);
            return;
        }
        // run the command
        cmd.run(bot, msg, args);
    }

    // check for the dice pattern
    if (/^[0-9]*\s*(w|W)[0-9]+/.test(user_input.trim())) {
        let cmd = bot.commands.get("rolldice"); // TODO check even if its hardcoded? ...
        let args = user_input.split('w');
        cmd.run(bot, msg, args);
    }
})


bot.login(Config.token);
