## Cash Leaderboard Command
* Note Needs To Be Adapted To Your Command Handler

```js
// Note! must be in an async function

const djs = require('djs-economy')

// define member

var output = await djs.LeaderboardCash({
    filter: x => x.cash > 50,
    search: member.id
    })
    
if (message.mentions.users.first()) {
        message.channel.send(`**${member.user.tag}** Is **#${output}** On The Leaderboard!`);
    } else {
    
djs.LeaderboardCash({
  limit: 4, //You can change the limit to 10 if you want
  filter: x => x.cash > 50
}).then(async users => {
if(users[0]) var firstplace = await client.users.fetch(users[0].userid) 
if(users[1]) var secondplace = await client.users.fetch(users[1].userid)
if(users[2]) var thirdplace = await client.users.fetch(users[2].userid)
if(users[3]) var fourthplace = await client.users.fetch(users[3].userid)

message.channel.send(`
🥇 ${firstplace && firstplace.tag || 'Nobody Yet'} ⟶  💵 ${users[0] && users[0].cash || 'None'}\n
🥈 ${secondplace && secondplace.tag || 'Nobody Yet'} ⟶  💵 ${users[1] && users[1].cash || 'None'}\n
🥉 ${thirdplace && thirdplace.tag || 'Nobody Yet'} ⟶  💵 ${users[2] && users[2].cash || 'None'}\n
🏅 ${fourthplace && fourthplace.tag || 'Nobody Yet'} ⟶  💵 ${users[3] && users[3].cash || 'None'}\n
**<@${member.user.id}> Your Ranking #${output}**`)
  })
}
```
