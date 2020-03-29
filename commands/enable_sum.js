exports.run = (bot, msg, args) => {
    if (!args || args.length < 1) {
        return msg.reply("Auf welchen Würfeltyp soll ich Summen aktivieren? !enable_sum W6  <- ich summiere für alle W6...")            
    }
    else if (args.length > 1) {
        // this is not an error, DON'T return from here!
        msg.reply("Ich habe zuviele Argumente für diesen Befehl erhalten, ich probier mal das erste...");
    }

    // check if the argument is a dice type:
    const input = args[0].toLowerCase();
    if (/(w|W)[0-9]+/.test(input.trim()) == false) {
        return msg.reply("Das ist kein Würfel den ich verstehe...");
    }

    
    const dice_sides_to_sum = parseInt(input.slice(1));

    
    // toggle the dice
    const index = bot.dice_sums.indexOf(dice_sides_to_sum);
    if (index > -1) {
        bot.dice_sums = bot.dice_sums.slice(index, 1);
        msg.channel.send(`${args[0]} werden nicht mehr summiert!`);
    } else {
        bot.dice_sums.push(dice_sides_to_sum)
        msg.channel.send(`${args[0]} werden jetzt summiert!`);
    }

    console.log(bot.dice_sums);
}