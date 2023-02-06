const Base = require('../base.js');
const Discord = require('discord.js')
const Mods = require('./mods.json');

function isAdmin(member)
{
    return (member.hasPermission("ADMINISTRATOR"))
}
function isMod(member)
{
    if (!Mods[member.guild.id] && !isAdmin(member))
        return false
    return isAdmin(member) || member.roles.cache.some(role => role.id === Mods[member.guild.id].ModRole)
}
function HandleMessage(msg, args)
{
	if (args[0] == "role")
        SetModRole(msg, args[1])
}

function SetModRole(msg, role)
{
    if (isAdmin(msg.member))
    {
        if (!role)
            return msg.channel.send("> Please mention a roleID!")
        if (!Mods[msg.guild.id])
            Mods[msg.guild.id] = {};
        Mods[msg.guild.id]["ModRole"] = role;
        msg.channel.send("> Mod role changed successfully.")
        Base.CreateFile(Mods, "/mods/mods");
    }
    else
        msg.channel.send("> No premissions!")
}




module.exports = { HandleMessage, isMod, isAdmin }
