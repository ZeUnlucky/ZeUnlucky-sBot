const Sheets = require('./sheets.json');
const Base = require('../base.js');
const Discord = require('discord.js')
function EmbedSheet(user, name, commander)
{
	var Sheet = Sheets[user.id][name];
	var Embed = new Discord.MessageEmbed().setTitle(name).setImage(Sheet.Pic).setAuthor(user.tag, user.avatarURL);
	Sheet.Params.forEach(param =>
	{
		if (param != "Pic")
		Embed.addField(param, Sheet[param]);
	});
	Embed.setColor("#FFFFF0").setTimestamp().setFooter(commander.tag,commander.avatarURL);
	return Embed;
}
function ShowSelfSheets(msg)
{
	if (!Sheets[msg.author.id])
		return msg.channel.send("> You don't have any sheets.");
	var arr = Object.entries(Sheets[msg.author.id]);
	if (arr.length == 0)
		return msg.channel.send("> You don't have any sheets.");
	else
	{
		var ToSend = ">>> __" + msg.author.username + "__\n";
		for (var i = 0; i < arr.length; i++)
			ToSend += arr[i][0] + " - " + arr[i][1].Name + "\n";
		return msg.channel.send(ToSend);
	}
}
function ShowUserSheets(msg, args, Ment)
{
	if (!Sheets[Ment.id])
		return msg.channel.send("> User doesn't have any sheets yet.");
	if (!args[0])
	{
		var arr = Object.entries(Sheets[Ment.id]);
		if (arr.length == 0)
			msg.channel.send("> User doesn't have any sheets.");
		else
		{
			var ToSend = ">>> __" + Ment.username + "__\n";
			for (var i = 0; i < arr.length; i++)
				ToSend += arr[i][0] + " - " + arr[i][1].Name + "\n";
			msg.channel.send(ToSend);
		}
	}
	else
	{
		var name = Base.Capitalise(args.shift());
		if (!Sheets[Ment.id][name])
			return msg.channel.send("> No sheets existing with the following name.");
		
		var Embed = EmbedSheet(Ment, name, msg.author)
		msg.channel.send(Embed);
	}
}
function CreateNewSheet(msg, args)
{
	if (!!args[0])
	{
		var name = Base.Capitalise(args.join(' '));
		if (!Sheets[msg.author.id])
			Sheets[msg.author.id] = {}
		Sheets[msg.author.id][Base.Capitalise(args[0])] = {"Params":["Name"], "Name":Base.Capitalise(args.join(' '))};
		Base.CreateFile(Sheets, "/sheets/sheets");
		msg.channel.send("> Successfully created " + name + "!");
	}
	else
		msg.channel.send("> Please enter a name for your profile");
}
function DeleteSheet(msg, args)
{
	if (!Sheets[msg.author.id])
			return msg.channel.send("> You don't have any sheets.");
		var name = Base.Capitalise(args.shift());
		if (!name)
			return msg.channel.send("> Please enter a name to delete.");
		if (!Sheets[msg.author.id][name])
			return msg.channel.send("> You don't have a profile with that name.");
		delete Sheets[msg.author.id][name];
		Base.CreateFile(Sheets, "sheets/sheets");
		return msg.channel.send("> Successfully deleted " + name + ".");
}
function SendHelp(msg)
{
	var Embed = new Discord.MessageEmbed().setTitle("Sheets Help").setDescription("<PARAMETERS> ARE NOT NECESSARY!");
	Embed.addField("sheet <user>", "Lists profiles as ID - Name. Shows your own with no user given.")
	.addField("sheet <user> -id", "Shows description of the profile by given ID. Can be used on yourself without pinging yourself.")
	.addField('\u200B','\u200B' )
	.addField("sheet new -id/firstname", "Creates a profile, in which the id/firstname will act as ID.")
	.addField("sheet delete -id/firstname", "Deletes the profile.")
	.addField("sheet -id -field -value", "Changes the value for the profile in that field. Example: /sheet josh age 17")
	.addField("sheet -id -picture <link>", "Sets the profile's picture. Be sure to attach a link or an image!")
	.setTimestamp()
	.setColor("#13f14c")
	.setFooter(msg.author.tag);
	msg.channel.send(Embed);
}
function EditSheet(msg, args, Command)
{
	if (!Sheets[msg.author.id])
		return msg.channel.send("> You have no profile.");
	var sheet = Base.Capitalise(Command);
	if (!Sheets[msg.author.id][sheet])
			return msg.channel.send("> No profile existing with the following name.");
	if (!args[0])
		return msg.channel.send(EmbedSheet(msg.author, sheet, msg.author));
	
	var Param = Base.Capitalise(args.shift().toLowerCase());			
	if (Param != "Picture")
	{
		if (!args[0])
		{
			delete Sheets[msg.author.id][sheet][Param];
			delete Sheets[msg.author.id][sheet].Params[Sheets[msg.author.id][sheet].Params.indexOf(Param)];
			Base.CreateFile(Sheets, "sheets/sheets");
			return msg.channel.send(">>> " + Param + " has been deleted!");
			
		}
		var Value = args.join(' ');
		Sheets[msg.author.id][sheet][Param] = Value;
		if (!Sheets[msg.author.id][sheet].Params.includes(Param))
			Sheets[msg.author.id][sheet].Params.push(Param);
		Base.CreateFile(Sheets, "sheets/sheets");
		return msg.channel.send("> " + Param + " has changed successfully.");
	}
	else
	{
		if (!args[0] && msg.attachments.array().length == 0)
		{
			if (Sheets[msg.author.id][sheet].Pic == "")
				return msg.channel.send("> " + sheet + " doesn't have a picture.");
			return msg.channel.send("> " + sheet + "'s picture:", {files:Sheets[msg.author.id][sheet].Pic});
		}
		var file = args.shift();
		if (msg.attachments.array().length > 0)
			file = msg.attachments.first().url;
		Sheets[msg.author.id][sheet].Pic = file;
		if (!Sheets[msg.author.id][sheet].Params.includes("Pic"))
			Sheets[msg.author.id][sheet].Params.push("Pic");
		Base.CreateFile(Sheets, "sheets/sheets");
		return msg.channel.send("> Picture has changed successfully.");
	}
}
function HandleSheetMessage(msg, args)
{
	//sheet |
	if (!args[0])
	{
		return ShowSelfSheets(msg);
	}
	
	var Command = args.shift();
	if (Command != null)
		Command.toLowerCase();
	var Ment = msg.author;
	if (Command != "help" && !!Command)
	{
		Ment = msg.mentions.users.first();
		if (!Ment)
			Ment = msg.author;
	}
	
	//sheet <user>
	if ((Command != null && Ment.id == Command.replace('<@', "").replace('>',"")))				
		ShowUserSheets(msg, args, Ment)	
	
	//sheet new <name>
	else if (Command == 'new')			
		CreateNewSheet(msg, args)
	
	//sheet delete <name>
	else if (Command == 'delete')
		DeleteSheet(msg, args)
	
	//sheet help
	else if (Command == 'help')
		SendHelp(msg)
	
	//literally edit or view any profile cuz am cool
	//sheet <name>
	else
	{
		EditSheet(msg,args, Command)
	}
}
module.exports = {EmbedSheet, HandleSheetMessage}
