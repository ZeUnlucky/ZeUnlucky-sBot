const Base = require('../base.js');
const Mod = require('../mods/mod.js');
const Discord = require('discord.js')
const Events = require('./events.json');

function HandleMessage(msg, args)
{
    if (!args[0])
    {
        if (!Mod.isMod(msg.member)) return msg.channel.send("> No permission!")
        RandomEvent = ChooseRandomEvent(msg)
        if (!RandomEvent)
            return msg.channel.send("> There are no registered events!")
        Severity = Base.getRandomIntEx(100)
        Color = "#529918"
        if (Severity >= 25 && Severity < 50) Color = "#b8b214"
        if (Severity >= 50 && Severity < 75) Color = "#b87c14"
        if (Severity >= 75) Color = "#ba160d"
        var Embed = new Discord.MessageEmbed().setTitle("WARNING!").setDescription("NEW EVENT!");
        Embed.addField(RandomEvent.Name, RandomEvent.Desc)
        .addField("SEVERITY", Severity+"%")
        .setTimestamp()
        .setColor(Color)
        .setFooter(msg.author.tag);
        msg.channel.send(Embed);
        msg.delete()
    }
	else if (args[0] == "new")
    {
        if (!Mod.isMod(msg.member)) return msg.channel.send("> No permission!")
        CreateNewEvent(msg, args)
    }
}


function ChooseRandomEvent(msg)
{
    var totalChance = 0;
	var Entries = [];
	var winner;
    if (!Events[msg.guild.id])
        Events[msg.guild.id] = []
    if (Events[msg.guild.id].length == 0)
        return 
	Events[msg.guild.id].forEach(element => { totalChance += parseInt(element.Chance); Entries.push({'name':element.Name, 'entry':totalChance, 'object':element}); });
    var WinningNumber = Base.getRandomIntEx(totalChance);
	for (i = 0; i < Entries.length; i++)
	{
		if (Entries[i].entry > WinningNumber)
		{
			winner = Entries[i].object;
			break;
		}
	}
	return winner;
}

function CreateNewEvent(msg, args)
{
    args[0] = ""
    FullCommand = args.join(" ")
    newArgs = FullCommand.split(', ')

    Name = newArgs[0]
    Desc = newArgs[1]
    Chance = newArgs[2]
    if (!Name || !Desc || !Chance)
        return msg.channel.send("> Incorrect input! ;event new -name, -desc, -chance")
    if (!Events[msg.guild.id]) Events[msg.guild.id] = []
    EventStruct = {
        "Name" : Name,
        "Desc" : Desc,
        "Chance" : Chance
    }
    Events[msg.guild.id].push(EventStruct)
    Base.CreateFile(Events, "/events/events");
    return msg.channel.send("> Successfully created event " + Name + "!")
}

module.exports = { HandleMessage }