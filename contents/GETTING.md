### Getting Cash/Bank
```js
// [UserID] param1 must be a discord user id
// Note! must be in an async function

const djs = require('djs-economy')

const FetchCash = await djs.GetCash(UserID) //Gets Cash Balance
console.log(FetchCash.cash) //Displays Cash Balance

const FetchBank = await djs.GetBank(UserID) //Gets Bank Balance
console.log(FetchBank.bank) //Displays Bank Balance
```
