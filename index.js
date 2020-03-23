const Discord = require("discord.js");
const bot     = new Discord.Client();
const token   = 'DISCORD_TOKEN';

bot.on('message', msg => {
    
    const user_input   = msg.content.toLowerCase();
    const user_name    = msg.author;
    
    if (user_input == 'bot?') {
        msg.reply('Ich bin da, ' + user_name + '!');
    }

    if (/^[0-9]*\s*(w|W)[0-9]+/.test(user_input.trim())) {

        const tokens = user_input.split('w');

        // sanity check
        if (tokens.length == 2) {
            var   dice_count = parseInt(tokens[0].trim()); // how many dice?
            const dice_sides = parseInt(tokens[1].trim()); // how many sides?

            if (isNaN(dice_count)) { dice_count = 1; } // handle implicit commands like 'w20' as 1W20

            var bot_answer = "";
            var line_counter = 0;

            for (var i = 0; i < dice_count; i++) {

                bot_answer += Math.floor((Math.random() * dice_sides) + 1);

                // append a ',' after each number BUT the last:
                if   (i != dice_count - 1) { bot_answer += ', '; }
                else { break; }

                // check the line width and insert newlines for readability
                line_counter++;
                if (line_counter > 5) { // TODO make this limit accessable over bot commands?
                    bot_answer  += '\n';
                    line_counter =  0;
                }
            }
    
            // answer should contain the dice rolls; If its empty, the API doesn't send the message to the channel
            msg.channel.send(bot_answer);
        }
    }
})


bot.login(token);
