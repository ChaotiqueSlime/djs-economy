<div align="center">
  <br />
  <br />
  <p>
    <a href="https://nodei.co/npm/djs-economy/"><img src="https://nodei.co/npm/djs-economy.png?downloads=true&stars=true" alt="NPM info" /></a>
  </p>
  <p>
    <a href="https://discord.gg/yv3s3b97Sn"><img src="https://discord.com/api/guilds/464316540490088448/widget.json" alt="Discord server" /></a>
    <a href="https://www.npmjs.com/package/djs-economy"><img src="https://img.shields.io/npm/v/djs-economy.svg" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/djs-economy"><img src="https://img.shields.io/npm/dt/djs-economy.svg" alt="NPM downloads" /></a>
    <a href="https://www.patreon.com/jsdevelopment"><img src="https://img.shields.io/badge/donate-patreon-F96854.svg" alt="Patreon" /></a>
  </p>
</div>

## Latest News!!
↪ New Cash & Bank System! (4/15/21)<br/>

## Installation
**Node.js 12.0.0 or newer is required.**  
```js
$ npm install --save djs-economy
```
if your getting python required error please download sequelize & sqlite3 manually then download djs-economy

## Table of Contents
> * [Adding Cash & Bank](https://github.com/ChaotiqueSlime/djs-economy/blob/main/contents/ADDING.md)
> * [Subtracting Cash & Bank](https://github.com/ChaotiqueSlime/djs-economy/blob/main/contents/SUBTRACTING.md)
> * [Setting Cash & Bank](https://github.com/ChaotiqueSlime/djs-economy/blob/main/contents/SETTING.md)
> * [Getting Cash & Bank](https://github.com/ChaotiqueSlime/djs-economy/blob/main/contents/GETTING.md)
> * [Deleting Users](https://github.com/ChaotiqueSlime/djs-economy/blob/main/contents/DELETING.md)
> * [Pre-Made Commands](https://github.com/ChaotiqueSlime/djs-economy/blob/main/contents/PREMADE-COMMANDS.md)

### Adding Cash/Bank
```js
// [UserID] param1 must be a discord user id
// <amount> param2 must be a number
const djs = require('djs-economy')

djs.AddCash(UserID, Amount) //Add Money To Cash Balance
djs.AddBank(UserID, Amount) //Add Money To Bank Balance
```

### Subtracting Cash/Bank
```js
// [UserID] param1 must be a discord user id
// <amount> param2 must be a number
const djs = require('djs-economy')

djs.SubCash(UserID, Amount) //Subtracts Money From Cash Balance
djs.SubBank(UserID, Amount) //Subtracts Money From Bank Balance
```

### Setting Cash/Bank
```js
// [UserID] param1 must be a discord user id
// <amount> param2 must be a number
const djs = require('djs-economy')

djs.SetCash(UserID, Amount) // Set Money For Cash Balance
djs.SetBank(UserID, Amount) // Set Money For Bank Balance
```

### Getting Cash/Bank
```js
// [UserID] param1 must be a discord user id
const djs = require('djs-economy')

const FetchCash = await djs.GetCash(UserID) //Gets Cash Balance
console.log(FetchCash.cash) //Displays Cash Balance

const FetchBank = await djs.GetBank(UserID) //Gets Bank Balance
console.log(FetchBank.bank) //Displays Bank Balance
```

### Deleting Cash/Bank Users
```js
// [UserID] param1 must be a discord user id
const djs = require('djs-economy')

djs.Delete(UserID) //Deletes Users Cash & Bank Balance
```

# Pre-Made Commands
> * [Pay Command](https://github.com/ChaotiqueSlime/djs-economy/blob/main/commands/PAY.md)
> * [Work Command](https://github.com/ChaotiqueSlime/djs-economy/blob/main/commands/WORK.md)
> * [Cash Leaderboard Command](https://github.com/ChaotiqueSlime/djs-economy/blob/main/commands/CASH_LEADERBOARD.md)
> * [Bank Leaderboard Command](https://github.com/ChaotiqueSlime/djs-economy/blob/main/commands/BANK_LEADERBOARD.md)



## Links
[Discord](https://discord.gg/yv3s3b97Sn), [Github](https://github.com/ChaotiqueSlime/djs-economy), [Patreon](https://www.patreon.com/jsdevelopment)
