## Pay Command
* Note Needs To Be Adapted To Your Command Handler

```js
const DB = require('djs-economy')

var user = message.mentions.users.first()
var amount = args[2] //Args might be diffrent because of your handler
      
if (!user) {
    return message.reply('@ the person you wanna pay first');
  }
if (!amount) {
    return message.reply('Specify the amount you want to pay!'); 
  }

const transfer = await DB.Pay(message.author.id, user.id, amount)
//message.author.id = Person Paying
//user.id = Person Receiving Money

if ((transfer.bal) <= (transfer.cash)) {
    return message.channel.send(`You Dont Have Enough Cash`);
    }
    
message.channel.send(`You Paid <@${user.id}> $${transfer.cash} You Now Have $${transfer.bal}`);

.cash promise is the amount you paid the Receiver
.bal promise is the amount the person paying has left
```
