const setupFile = require('./includes.js');
const base = require("./files/base.js")
const Sheets = require("./files/sheets/sheet.js")

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
		if (cmd == 'sheet')
			Sheets.HandleSheetMessage(msg,args)
	}
});

client.on('ready', () => {
	client.user.setPresence({ game: { name: 'ZeUnlucky#5555 is my sugar daddy.', type: 0 } }); 
	console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);