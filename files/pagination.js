
const Discord = require("../bot.js")
async function SendPaginatedMessage(Page, msgObj)
{
	var CurrentPage = Page;
	const Pages = CalculatePages(CurrentPage);
	var Pos = PagePosition(CurrentPage);
	
	CurrentPage.msg.setFooter("Page " + Pos + " out of " + Pages );
	var message = await msgObj.channel.send(CurrentPage.msg);
	const button = new Discord.ButtonBuilder()
	.setCustomId('primary')
	.setLabel('Click me!')
	.setStyle(ButtonStyle.Primary)
	.setDisabled(true);
		if (FirstReaction.emoji.name == "▶️" || FirstReaction.emoji.name == "◀️")
		{
			if (FirstReaction.emoji.name == "▶️")
			{
				if (CurrentPage.FPage != null)
				{
					CurrentPage.FPage.BPage = CurrentPage;
					CurrentPage = CurrentPage.FPage;
					Pos++;
				}
			}
			else
			{
				if (CurrentPage.BPage != null)
				{
					CurrentPage.BPage.FPage = CurrentPage;
					CurrentPage = CurrentPage.BPage;
					Pos--;
				}
			}
			CurrentPage.msg.setFooter("Page " + Pos + " out of " + Pages);
			message.edit(CurrentPage.msg);
		}
	}	


function CalculatePages(Page)
{
	var BackTotal = 0;
	var FrontTotal = 0;
	var CurrentPage = Page;
	while (CurrentPage.BPage != null)
	{
		BackTotal++;
		CurrentPage = CurrentPage.BPage;
		console.log(CurrentPage)
	}
	CurrentPage = Page;
	while (CurrentPage.FPage != null)
	{
		FrontTotal++;
		CurrentPage = CurrentPage.FPage;
		//console.log(CurrentPage.FPage.msg)
	}
	
	return BackTotal + FrontTotal + 1;
}
function PagePosition(Page)
{
	var BackTotal = 0;
	var CurrentPage = Page;
	while (CurrentPage.BPage != null)
	{
		BackTotal++;
		CurrentPage = CurrentPage.BPage;
	}
	return BackTotal + 1;
}

module.exports = {SendPaginatedMessage, CalculatePages, PagePosition}