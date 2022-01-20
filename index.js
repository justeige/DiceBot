const Discord = require("discord.js");
const Config  = require("./config.json");
const FileSys = require("fs");
const Enmap   = require("enmap");

const Talente = require("./talente.json");

// TODO uploads should be usable from the fly, not hardcoded:
const Jago = require("./heros/Jago.json");
const Estor = require("./heros/Estor.json");

// create the bot via Discords API
const bot      = new Discord.Client();
bot.config     = Config;
bot.commands   = new Enmap();
bot.line_width = Config.line_width;
bot.dice_sums  = [6];
bot.npc_list   = [];
bot.bank       = new Enmap();
bot.talente    = Talente;
bot.jago = new Enmap();
bot.estor = new Enmap();

function load_hero(data, hero) {
    let attr = data['attr']
    let values = attr['values']
    let talents = data['talents']
    // talents are a list like this:
    // TAL_3: 3,
    // TAL_4: 6,

    hero.talents = talents

    // client 1.0.2. version
    // values is a list like this:
    // [ 'ATTR_1', 15, 0 ]
    // [ 'ATTR_2', 10, 0 ]
    // ....

    
    if (data.clientVersion === "1.0.2") {
        hero.MU = values[0][1]
        hero.KL = values[1][1]
        hero.IN = values[2][1]
        hero.CH = values[3][1]
        hero.FF = values[4][1]
        hero.GE = values[5][1]
        hero.KO = values[6][1]
        hero.KK = values[7][1]
    } else {
        // client 1.4.2 = values [{"id":"ATTR_1", "value": "14"} ...]
        hero.MU = values[0].value
        hero.KL = values[1].value
        hero.IN = values[2].value
        hero.CH = values[7].value
        hero.FF = values[6].value
        hero.GE = values[5].value
        hero.KO = values[4].value
        hero.KK = values[3].value
    }
    
    //console.log(hero)
}


bot.on("ready", () => {
    console.log(`${bot.user.username} is online!`);

    load_hero(Jago, bot.jago)
    load_hero(Estor, bot.estor)

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
