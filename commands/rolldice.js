exports.run = (bot, msg, args) => {
    // sanity check
    if (args.length == 2) {
        var   dice_count = parseInt(args[0].trim()); // how many dice?
        const dice_sides = parseInt(args[1].trim()); // how many sides?

        if (isNaN(dice_count)) { dice_count = 1; } // handle implicit commands like 'w20' as 1W20

        var bot_answer   = "";
        var line_counter = 0;
        var sum = 0;

        for (var i = 0; i < dice_count; i++) {

            var roll = Math.floor((Math.random() * dice_sides) + 1);
            bot_answer += roll;
            sum += roll;

            // append a ',' after each number BUT the last:
            if   (i != dice_count - 1) { bot_answer += ', '; }
            else { break; }

            // check the line width and insert newlines for readability
            line_counter++;
            if (line_counter > (bot.line_width - 1)) {
                bot_answer  += '\n';
                line_counter =  0;
            }
        }

        console.log(bot.dice_sums);

        // add a dice sum if the dice type should behave like this
        if (bot.dice_sums.indexOf(dice_sides) > -1 && dice_count > 1) {
            bot_answer += " (= " + sum + ")";
        }

        // colorfull commentary
        if (bot_answer.trim() == "20") {
            return msg.reply("haha, epic fail! 20");
        }

        // answer should contain the dice rolls; If its empty, the API doesn't send the message to the channel
        msg.channel.send(bot_answer);
    } else {
        console.error(`regex failed for the dice check? Input: ${msg.content}`)
    }
}