exports.run = (bot, msg, args) => {

    if (!args || args.length < 1) {
        return msg.reply("Du muss mir sagen, welche Probe du würfeln willst!")
    }

    const full_arg = args.join(' ');      
    if (full_arg) {

        let user_name = msg.author.username.toLowerCase();

        console.log(msg.author.avatar)

        for (var chars = 3; chars < 6; chars++) {
            const talent_key = full_arg.toLowerCase().replace('heilkunde ', '').substring(0, chars);
            console.log("probe", talent_key);
            const talent = bot.talente[talent_key];
    
            if (!talent)
                continue;
            else {
                
                let cmd = bot.commands.get("rolldice");

                
                let is_known_player = null;
                switch (user_name) {
                    case "reflection": 
                        is_known_player = bot.jago
                        break;
                    case "ancaly":
                        is_known_player = bot.estor
                        break;
                    default:
                        break;
                }
                
                var fail_sum = 0;
                var roll_str = "gewürfelt: "

                var answer = talent.name + ":\n";
                for (var i = 0; i < talent.probe.length; ++i) {
                    let attr = talent.probe[i] 

                    if (is_known_player != null) {
                        let player_attr = is_known_player[attr]
                        
                        var roll = Math.floor((Math.random() * 20) + 1);
                        roll_str += roll + ' '
                        
                        var diff = roll - player_attr
                        if (diff > 0) {
                            fail_sum += diff;
                        }

                    } 
                    
                    answer += attr;
                    
                    if (i < 2) {
                        answer += "/";
                    }
                }
                
                
                if (is_known_player != null) {
                    let player_value = is_known_player.talents[talent.code]
                    if (!player_value) {
                        player_value = 0; // if the json blob doesn't has the talent, the player has 0 points invested
                    }

                    let value_diff = player_value - fail_sum

                    answer += "\n"
                    answer += roll_str + "\n"
                    if (value_diff < 0) {
                        answer += "nicht bestanden"
                    } else {
                        // calculate QS

                        let qs = 0
                        if (value_diff >= 16) {
                            qs = 6
                        } else if (value_diff >= 15) {
                            qs = 5
                        } else if (value_diff <= 12 && value_diff >= 10) {
                            qs = 4
                        }else if (value_diff <= 9 && value_diff >= 7) {
                            qs = 3
                        }else if (value_diff <= 6 && value_diff >= 4) {
                            qs = 2
                        }else if (value_diff <= 3) {
                            qs = 1
                        }

                        answer += "bestanden mit QS " + qs
                    }
                    
                    msg.channel.send(answer);

                } else {
                    // unknown player, roll as usual
                    msg.channel.send(answer);
                    cmd.run(bot, msg, ["3", "20"])
                }

                return;
            }

        }

    }
}