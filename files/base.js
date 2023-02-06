const setupFile = require('../includes.js');
const {Discord, util, moment, fs} = setupFile.getRequires();
function ts()
{
	return "["+ moment().format("h:mm:ss A") +"] "
}
function FormatMoment(dur) 
{
	let hours = dur.hours();
	let minutes = dur.minutes();
	let seconds = dur.seconds();
	var ToSend = (hours < 10 ? "0" : "") + hours + ":";
	ToSend += (minutes < 10 ? "0" : "") + minutes + ":";
	return ToSend += (seconds < 10 ? "0" : "") + seconds;
}
function CreateFile(content, name)
{
	fs.writeFile('./files/' + name + '.json', JSON.stringify( content, null, 4 ), function( err ) {
		if ( err ) console.log( err );
		 });
}
function IsJsonString(str) 
{
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function MakeJSONString(str)
{
	var arr = str.split('');
	console.log(str);
	if (str.startsWith(" "))
	{
		arr.shift();
		str = arr.join('');
	}
	if (str.startsWith('"') && str.endsWith('"'))
	{
		arr.shift();
		arr.pop();
		str = arr.join('');
	}
	arr = str.replace(/"/g, "'").split("");
	arr.unshift('"');
	arr.push('"');
	str = arr.join('');
	return str;
}
function ReturnSendableJSON(ret)
{
	var keys = Object.keys(ret);
	console.log(ret);
	var ToSend = "";
	while (!!keys[0])
	{
		if (typeof(ret[keys[0]]) == 'object')
		{
			ToSend += "__**" + keys[0] +"**__\n";
			if (Array.isArray(ret[keys[0]]))
				ToSend += ret[keys[0]].join(', ') +"\n";
			else
				ToSend += ReturnSendableJSON(ret[keys[0]]) +"\n";
		}
		else
		{
			ToSend += "__" + keys[0] +"__\n";
			ToSend += ret[keys[0]] + "\n";
		}
		keys.shift();
	}
	return ToSend;
}
function Capitalise(str)
{
	return str.replace(str.charAt(0), str.charAt(0).toUpperCase());
}
function CheckMsgValid(msg)
{
	if (msg.author.bot) return false;
	if (msg.member == null || msg.channel.type == "dm") return false;
	return true;
}
function getRandomIntEx(max) 
{
  return Math.floor(Math.random() * Math.floor(max));
}
module.exports = {ts, FormatMoment, CreateFile, IsJsonString, MakeJSONString, ReturnSendableJSON, Capitalise,
CheckMsgValid, getRandomIntEx }