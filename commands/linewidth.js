exports.run = (bot, msg, args) => {
        if (!args || args.length < 1) {
            return msg.reply("Ich kann die max. dargestellten Zahlen nicht ändern, ohne das mir eine neue Zahl gegeben wird. :(")            
        }
        else if (args.length > 1) {
            // this is not an error, DON'T return from here!
            msg.reply("Ich habe zuviele Argumente für diesen Befehl erhalten, ich probier mal das erste...");
        }

        if (isNaN(args[0])) {
            return msg.reply("Das erste argument ist keine Zahl... sry :(");
        }

        msg.channel.send(`Ab sofort stelle ich ${args[0]} Zahlen nebeneinander dar!`);
        bot.line_width = args[0];
}