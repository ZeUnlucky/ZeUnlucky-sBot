async function SendPaginatedMessage(Page, msgObj)
{
	var CurrentPage = Page;
	const Pages = CalculatePages(CurrentPage);
	var Pos = PagePosition(CurrentPage);
	
	CurrentPage.msg.setFooter("Page " + Pos + " out of " + Pages );
	var message = await msgObj.channel.send(CurrentPage.msg);
	await message.react("◀️");
	await message.react("❎");
	await message.react("▶️");

	const collector = message.createReactionCollector((reaction, user) => !user.bot, {});
	collector.on('collect',  r=> {
		if (!r.users.last().bot)
			r.remove(r.users.last().id);
		if (r.users.last() == msgObj.author)
		{
			if (r.emoji.name == "❎")
			{
				collector.stop();
				message.delete();
			}
			else if (r.emoji.name == "▶️" || r.emoji.name == "◀️")
			{
				if (r.emoji.name == "▶️")
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
	});
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
		console.log("back")
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