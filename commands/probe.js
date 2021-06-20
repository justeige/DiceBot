exports.run = (bot, msg, args) => {

    if (!args || args.length < 1) {
        return msg.reply("Du muss mir sagen, welche Probe du würfeln willst!")
    }

    const full_arg = args.join(' ');      
    if (full_arg) {

        console.log(full_arg)

        for (var chars = 3; chars < 6; chars++) {
            const talent_key = full_arg.toLowerCase().replace('heilkunde ', '').substring(0, chars);
            console.log("probe", talent_key);
            const talent = bot.talente[talent_key];
    
            if (!talent)
                continue;
            else {
                
                let cmd = bot.commands.get("rolldice");
                
                var answer = talent.name + ":\n";
                for (var i = 0; i < talent.probe.length; ++i) {
                    answer += talent.probe[i];
                    if (i < 2) {
                        answer += "/";
                    }
                }
                msg.channel.send(answer);
                cmd.run(bot, msg, ["3", "20"])
    
                // TODO find player in db
    
                // TODO calculate limits
    
                // TODO show QS
                return;
            }

        }

    }
}