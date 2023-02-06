const setupFile = require('./includes.js');
const base = require("./files/base.js")
const Sheets = require("./files/sheets/sheet.js")
const Events = require("./files/events/event.js")
const Mods = require("./files/mods/mod.js")
const Dorms = require("./files/dorms/dorm.js")
const Messages = new Map();

const {Discord, util, moment, fs} = setupFile.getRequires();
const {prefix, token} = setupFile.getSettings();

const client = new Discord.Client();

client.on('message', msg => {
	if (!base.CheckMsgValid(msg)) return;
	
	var MsgContent = msg.content;
	var args = MsgContent.slice(prefix.length).split(' '); 
	if (MsgContent.startsWith(prefix))
	{
		var cmd = args.shift();
		if (cmd == "help")
			SendHelp(msg)
		else if (cmd == 'sheet')
			Sheets.HandleMessage(msg,args)
		else if (cmd == 'mod')
			Mods.HandleMessage(msg, args)
		else if (cmd == "event")
			Events.HandleMessage(msg, args)
		else if (cmd == "deleted")
        	CheckDeleted(msg)
		else if (cmd == "dorm")
			Dorms.HandleMessage(msg, args)
	}
});

function SendHelp(msg)
{
	var Embed = new Discord.MessageEmbed().setTitle("Bot Help").setDescription("These are the main commands:");
	Embed.addField("sheet help", "Shows help with sheets.")
	.addField("mod help", "Shows moderation commands (WIP).")
	.addField("event help", "Shows event commands (WIP).")
	.addField("dorms help", "Shows dorm commands (WIP).")
	.setTimestamp()
	.setColor("#13f14c")
	.setFooter(msg.author.tag);
	msg.channel.send(Embed);
}

function CheckDeleted(msg)
{
    if (Mods.isMod(msg.member))
    {
        let user = msg.mentions.users.first();
        if (user)
        {
            var ToSend = ">>> __" + user.tag + "__\n";
            var serverDeleted = Messages.get(msg.guild.id);
            serverDeleted.forEach(function(item,index,array){if (user.id == serverDeleted[index].id) ToSend+= serverDeleted[index].time + serverDeleted[index].channel.name + ": " + serverDeleted[index].content + "\n";});				
            msg.author.send(ToSend, {split:true});
        }
        else msg.channel.send('> Please specify a valid user!');	
    }
}

client.on("messageDelete", (msg) => {
	if (msg.channel.type == "dm")
		return;
	if (!msg.author.bot)
	{
		Time = base.ts()
		console.log(Time + msg.author.tag + "[" + msg.author.id +"]: " + msg.channel.name + ": " + msg.content);
		var serverDeleted = Messages.get(msg.guild.id);
		const Deleted = 
		{
			time: Time,
			tag: msg.author.tag,
			id: msg.author.id,
			channel: msg.channel,
			content: msg.content
		};
		if (!serverDeleted)
		{
			const MessagesOfServer = [];
			Messages.set(msg.guild.id, MessagesOfServer);
			serverDeleted = Messages.get(msg.guild.id);
		}
		serverDeleted.push(Deleted);
	}
});


client.on('ready', () => {
	client.user.setPresence({ game: { name: 'ZeUnlucky#5555 is my sugar daddy.', type: 0 } }); 
	console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);

module.exports = {client, Discord}