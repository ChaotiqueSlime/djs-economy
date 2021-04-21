## Work Command
* Note Needs To Be Adapted To Your Command Handler

```js
const djs = require('djs-economy')

// Minimum & Maximum param is the money you can get example 1000-2000
// [UserID] param must be a discord user id

const work = djs.Work(Minimum, Maximum, UserID)

//Define Minimum, Maximum, & UserID

message.channel.send(`you worked as a ${work.job} and earned ${work.cash}`)

// work.job gives a random job the user worked as
// work.cash is the amount of money they gained from min-max params 
```
