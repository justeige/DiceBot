exports.run = (bot, msg, args) => {

    // TODO check if the udpater is an Admin!

    if (!args || args.length < 1) {
        return msg.reply("Welchen Befehl soll ich aktualisieren?")            
    }
    else if (args.length > 1) {
        // this is not an error, DON'T return from here!
        msg.reply("Ich habe zuviele Argumente für diesen Befehl erhalten, ich probier mal das erste...");
    }

    const cmd_name = args[0];
    if (!bot.commands.has(cmd_name)) {
        return msg.reply(`${cmd_name} kenne ich nicht.`);
    }

    // clear the require cache
    delete require.cache[require.resolve(`./${cmd_name}.js`)];
    // clear the bots cache
    bot.commands.delete(cmd_name);

    let properties = require(`./${cmd_name}.js`);
    console.log(`update command ${cmd_name}`);
    bot.commands.set(cmd_name, properties);

    msg.channel.send(`${args[0]} wurde aktualisiert!`);
}