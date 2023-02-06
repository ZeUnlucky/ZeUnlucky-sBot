const Base = require('../base.js');
const Mod = require('../mods/mod.js');
const Discord = require('discord.js')
const Dorms = require('./dorms.json');
const Pagination = require('../pagination.js')
const DormStruct = {
    "Name" : "",
    "Size" : 0,
    "Vacancy" : 0, 
    "Residents" : [],

}

function HandleMessage(msg, args)
{
    if (!Dorms[msg.guild.id])
        Dorms[msg.guild.id] = {}
    if (!args[0])
    {
        ShowAllDorms(msg)
    }
    else if (args[0] == "new")
    {
        if (!Mod.isMod(msg.member)) return msg.channel.send("> No Permissions!")
        CreateNewDorms(msg, args)
    }
    else if (args[0] == "stats")
    {
        return msg.channel.send(MakeDormStats(msg, args))
    }
    else if (args[0] == "remove")
    {
        if (!Mod.isMod(msg.member)) return msg.channel.send("> No Permissions!")
        RemoveFromDorm(msg, args)
    }
    else if (args[0] == "delete")
    {
        if (!Mod.isMod(msg.member)) return msg.channel.send("> No Permissions!")
        DeleteDorm(msg, args)
    }
    else if (args[0] == "add")
    {
        if (!Mod.isMod(msg.member)) return msg.channel.send("> No Permissions!")
        AddToDorm(msg, args)
    }
    else if (args[0] == "find")
    {
        FindInDorm(msg, args)
    }
}

function AddToDorm(msg, args)
{
    Name = args[1]
    Dorm = args[2]
    if (!Dorm)
    {
        Object.entries(Dorms[msg.guild.id]).forEach(entry => {
            const [key, value] = entry;
            if (value.Vacancy > 0 && !Dorm) Dorm = key;  
        });
        if (!Dorm) return msg.channel.send("> There are no vacant dorms!")
    }
    if (Dorms[msg.guild.id][Dorm].Vacancy <= 0) return msg.channel.send("> There are no vacant dorms!")
    Dorms[msg.guild.id][Dorm].Residents.push(Name)
    Dorms[msg.guild.id][Dorm].Vacancy--
    Base.CreateFile(Dorms, "/dorms/dorms");
    msg.channel.send("> " + Name + " has been added to dorm " + Dorm + "!")
}

function FindInDorm(msg, args)
{
    if (!args[1]) return msg.channel.send("> Please specify who to find!")
    found = false
    Object.values(Dorms[msg.guild.id]).forEach(val => {
        val.Residents.forEach(element => {
            if (element == args[1]) 
            {
                found = true
                return msg.channel.send("> " + args[1] + " was found in dorm " + val.Name + "!")
            }
        });
      });
      if (!found) return msg.channel.send("> " + args[1] + " wasn't found in any dorm :(")
}

function CreateNewDorms(msg, args)
{
    if (!args[1] || !args[2])
        return msg.channel.send("> Invalid use of command. ~dorm new -name -size")
    NewDorm = DormStruct
    NewDorm.Name = args[1]
    NewDorm.Size = parseInt(args[2])
    NewDorm.Vacancy = NewDorm.Size
    Dorms[msg.guild.id][NewDorm.Name] = NewDorm
    msg.channel.send("> Successfully created dorm " + NewDorm.Name + "!")
    Base.CreateFile(Dorms, "/dorms/dorms");
}

function ShowAllDorms(msg)
{
    if (Object.keys(Dorms[msg.guild.id]).length <= 0) return msg.channel.send("> No dorms!")
    Pages = []
    Object.values(Dorms[msg.guild.id]).forEach(val => {
        Page = {}
        Page.msg = CreateDormEmbed(val.Name, val, msg)
        
        console.log("!" + Pages.length)
        if (Pages.length > 0) 
        {
            Pages[Pages.length-1].FPage = Page
        }
        Pages.push(Page)
    });
    Pagination.SendPaginatedMessage(Pages[0], msg)
}

function MakeDormStats(msg, args)
{

}

function RemoveFromDorm(msg, args)
{

}

function DeleteDorm(msg, args)
{

}

function CreateDormEmbed(key, value, msg)
{
    var Embed = new Discord.MessageEmbed().setTitle("Dorm list").setDescription(key);
	Embed.addField("Size", value.Size)
	.addField("Vacancy", value.Vacancy)
	

    for (i = 1; i <= value.Residents.length; i++)
    {
	    Embed.addField("Resident "+i, value.Residents[i-1] ? value.Residents[i-1] : "Vacant")
    }
    Embed.setTimestamp()
	.setColor("#13f14c")
	return Embed;
}

module.exports = { HandleMessage }