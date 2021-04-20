const Sequelize = require('sequelize');
const queuing = require("./queue.js");
const dbQueue = new queuing();
const sequelize = new Sequelize('database', 'Awesome', '132435465768798', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: `Economy.sqlite`,
});
const DB = sequelize.define('Value', {
  userID: {
    type: Sequelize.STRING,
    unique: true,
  },
  cash: Sequelize.INTEGER,
  bank: Sequelize.INTEGER,
});
DB.sync()
console.log('\x1b[32m%s\x1b[0m', `Economy Database Loaded | For Support Or Help Join Our Discord https://discord.gg/yv3s3b97Sn`);
module.exports = {


//Cash Functions

  SetCash: function (UserID, toSet) {
    return dbQueue.addToQueue({
      "value": this.Func_SetCash.bind(this),
      "args": [UserID, toSet]
    });
  },
  GetCash: function (UserID) {
    return dbQueue.addToQueue({
      "value": this.Func_GetCash.bind(this),
      "args": [UserID]
    });
  },
  AddCash: function (UserID, toAdd) {
    return dbQueue.addToQueue({
      "value": this.Func_AddCash.bind(this),
      "args": [UserID, toAdd]
    });
  },
  SubCash: function (UserID, toSubtract) {
    return dbQueue.addToQueue({
      "value": this.Func_SubCash.bind(this),
      "args": [UserID, toSubtract]
    });
  },
  LeaderboardCash: function (data = {}) {
    return dbQueue.addToQueue({
      "value": this.Func_LBCash.bind(this),
      "args": [data]
    });
  },

  Func_SetCash: async function (UserID, toSet) {
    if (!UserID) throw new Error('\x1b[32m%s\x1b[0m', `SetCash function is missing parameters!`); if (!toSet && toSet != 0) throw new Error('\x1b[32m%s\x1b[0m', `SetCash function is missing parameters!`); if (!parseInt(toSet)) throw new Error('\x1b[32m%s\x1b[0m', `SetCash function parameter <amount> needs to be a number!`); toSet = parseInt(toSet);
    return new Promise(async (resolve, error) => {
      const Info = await DB.update({
        cash: toSet
      }, {
        where: {
          userID: UserID
        }
      });
      if (Info > 0) {
        return resolve({
          userid: UserID,
          cash: toSet
        })
      } else {
        try {
          const Info2 = await DB.create({
            userID: UserID,
            cash: 1
          });
          return resolve({
            userid: UserID,
            cash: toSet
          })
        } catch (e) { if (e.name === 'SequelizeUniqueConstraintError') { return resolve('\x1b[32m%s\x1b[0m', `Duplicate Found, shouldn\'t happen in this function, check typo\'s`); } return error(e); }
      }
    });
  },
  Func_GetCash: async function (UserID) {
    if (!UserID) throw new Error('\x1b[32m%s\x1b[0m', `GetCash function is missing parameters!`);
    return new Promise(async (resolve, error) => {
      const Info = await DB.findOne({
        where: {
          userID: UserID
        }
      });
      if (Info) {
        return resolve({
          userid: Info.userID,
          cash: Info.cash
        })
      }
      try {
        const Info2 = await DB.create({
          userID: UserID,
          cash: 1
        });
        return resolve({
          userid: UserID,
          cash: 1
        })
      } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') { return resolve('\x1b[32m%s\x1b[0m', `Duplicate Found, shouldn\'t happen in this function, check typo\'s`); } return error(e);
      }
    });
  },
  Func_AddCash: async function (UserID, toAdd) {
    if (!UserID) throw new Error('\x1b[32m%s\x1b[0m', `AddCash function is missing parameters!`); if (!toAdd && toAdd != 0) throw new Error('\x1b[32m%s\x1b[0m', `AddCash function is missing parameters!`); if (!parseInt(toAdd)) throw new Error('\x1b[32m%s\x1b[0m', `AddCash function parameter <amount> needs to be a number!`); toAdd = parseInt(toAdd);
    return new Promise(async (resolve, error) => {
      const Info = await DB.findOne({
        where: {
          userID: UserID
        }
      });
      if (Info) {
        const Info2 = await DB.update({
          cash: Info.cash + toAdd
        }, {
          where: {
            userID: UserID
          }
        });
        if (Info2 > 0) {
          return resolve({
            userid: UserID,
            oldcash: Info.cash,
            newcash: Info.cash + toAdd,
          })
        }
        return error('\x1b[32m%s\x1b[0m', `Something went wrong in function AddCash`);
      } return resolve('\x1b[32m%s\x1b[0m', `ID has no record in database!`);
    });
  },
  Func_LBCash: async function (data) {
    if (data.limit && !parseInt(data.limit)) throw new Error('\x1b[32m%s\x1b[0m', `Cash Leaderboard function parameter object limit needs to be a number`)
    if (data.limit) data.limit = parseInt(data.limit)
    if (data.filter && !data.filter instanceof Function) throw new Error('\x1b[32m%s\x1b[0m', `Cash Leaderboard function parameter object filter needs to be a function!`)
    if (!data.filter) data.filter = x => x;
    return new Promise(async (resolve, error) => {
      if (data.search) {
        const Info = await DB.findAll({
          where: {
            cash: {
              [Sequelize.Op.gt]: 0
            }
          }
        })
        let output = Info.map(l => l.userID + ' ' + l.cash).sort((a, b) => b.split(' ')[1] - a.split(' ')[1]).map(l => new Object({
          userid: l.split(' ')[0],
          cash: l.split(' ')[1]
        })).filter(data.filter).slice(0, data.limit).findIndex(l => l.userid == data.search)
        if (output == -1) return resolve('Not found')
        return resolve(output + 1)
      } else {
        const Info = await DB.findAll({
          where: {
            cash: {
              [Sequelize.Op.gt]: 0
            }
          }
        })
        let output = Info.map(l => l.userID + ' ' + l.cash).sort((a, b) => b.split(' ')[1] - a.split(' ')[1]).map(l => new Object({
          userid: l.split(' ')[0],
          cash: l.split(' ')[1]
        })).filter(data.filter).slice(0, data.limit)
        return resolve(output)
      }
    });
  },
  Func_SubCash: async function (UserID, toSubtract) {
    if (!UserID) throw new Error('\x1b[32m%s\x1b[0m', `SubCash function is missing parameters!`); if (!toSubtract && toSubtract != 0) throw new Error('\x1b[32m%s\x1b[0m', `SubCash function is missing parameters!`); if (!parseInt(toSubtract)) throw new Error('\x1b[32m%s\x1b[0m', `SubCash function parameter toSubtract needs to be a number!`); toSubtract = parseInt(toSubtract);
    return new Promise(async (resolve, error) => {
      const Info = await DB.findOne({
        where: {
          userID: UserID
        }
      });
      if (Info) {
        const Info2 = await DB.update({
          cash: Info.cash - toSubtract
        }, {
          where: {
            userID: UserID
          }
        });
        if (Info2 > 0) {
          return resolve({
            userid: UserID,
            oldcash: Info.cash,
            newcash: Info.cash - toSubtract
          })
        }
        return error('\x1b[32m%s\x1b[0m', `Something went wrong in function SubCash`);
      } return resolve('\x1b[32m%s\x1b[0m', `ID has no record in database!`);
    });
  },





//Bank Functions

  SetBank: function (UserID, toSet) {
    return dbQueue.addToQueue({
      "value": this.Func_SetBank.bind(this),
      "args": [UserID, toSet]
    });
  },
  GetBank: function (UserID) {
    return dbQueue.addToQueue({
      "value": this.Func_GetBank.bind(this),
      "args": [UserID]
    });
  },
  AddBank: function (UserID, toAdd) {
    return dbQueue.addToQueue({
      "value": this.Func_AddBank.bind(this),
      "args": [UserID, toAdd]
    });
  },
  SubBank: function (UserID, toSubtract) {
    return dbQueue.addToQueue({
      "value": this.Func_SubBank.bind(this),
      "args": [UserID, toSubtract]
    });
  },
  LeaderboardBank: function (data = {}) {
    return dbQueue.addToQueue({
      "value": this.Func_LBBank.bind(this),
      "args": [data]
    });
  },

  Func_SetBank: async function (UserID, toSet) {
    if (!UserID) throw new Error('\x1b[32m%s\x1b[0m', `SetBank function is missing parameters!`); if (!toSet && toSet != 0) throw new Error('\x1b[32m%s\x1b[0m', `SetBank function is missing parameters!`); if (!parseInt(toSet)) throw new Error('\x1b[32m%s\x1b[0m', `SetBank function parameter <amount> needs to be a number!`); toSet = parseInt(toSet);
    return new Promise(async (resolve, error) => {
      const Info = await DB.update({
        bank: toSet
      }, {
        where: {
          userID: UserID
        }
      });
      if (Info > 0) {
        return resolve({
          userid: UserID,
          bank: toSet
        })
      } else {
        try {
          const Info2 = await DB.create({
            userID: UserID,
            bank: 1
          });
          return resolve({
            userid: UserID,
            bank: toSet
          })
        } catch (e) { if (e.name === 'SequelizeUniqueConstraintError') { return resolve('\x1b[32m%s\x1b[0m', `Duplicate Found, shouldn\'t happen in this function, check typo\'s`); } return error(e); }
      }
    });
  },
  Func_GetBank: async function (UserID) {
    if (!UserID) throw new Error('\x1b[32m%s\x1b[0m', `GetBank function is missing parameters!`);
    return new Promise(async (resolve, error) => {
      const Info = await DB.findOne({
        where: {
          userID: UserID
        }
      });
      if (Info) {
        return resolve({
          userid: Info.userID,
          bank: Info.bank
        })
      }
      try {
        const Info2 = await DB.create({
          userID: UserID,
          bank: 1
        });
        return resolve({
          userid: UserID,
          bank: 1
        })
      } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') { return resolve('\x1b[32m%s\x1b[0m', `Duplicate Found, shouldn\'t happen in this function, check typo\'s`); } return error(e);
      }
    });
  },
  Func_AddBank: async function (UserID, toAdd) {
    if (!UserID) throw new Error('\x1b[32m%s\x1b[0m', `AddBank function is missing parameters!`); if (!toAdd && toAdd != 0) throw new Error('\x1b[32m%s\x1b[0m', `AddBank function is missing parameters!`); if (!parseInt(toAdd)) throw new Error('\x1b[32m%s\x1b[0m', `AddBank function parameter <amount> needs to be a number!`); toAdd = parseInt(toAdd);
    return new Promise(async (resolve, error) => {
      const Info = await DB.findOne({
        where: {
          userID: UserID
        }
      });
      if (Info) {
        const Info2 = await DB.update({
          bank: Info.bank + toAdd
        }, {
          where: {
            userID: UserID
          }
        });
        if (Info2 > 0) {
          return resolve({
            userid: UserID,
            oldbank: Info.bank,
            newbank: Info.bank + toAdd,
          })
        }
        return error('\x1b[32m%s\x1b[0m', `Something went wrong in function AddBank`);
      } return resolve('\x1b[32m%s\x1b[0m', `ID has no record in database!`);
    });
  },
  Func_LBBank: async function (data) {
    if (data.limit && !parseInt(data.limit)) throw new Error('\x1b[32m%s\x1b[0m', `Banl Leaderboard function parameter object limit needs to be a number`)
    if (data.limit) data.limit = parseInt(data.limit)
    if (data.filter && !data.filter instanceof Function) throw new Error('\x1b[32m%s\x1b[0m', `Bank Leaderboard function parameter object filter needs to be a function!`)
    if (!data.filter) data.filter = x => x;
    return new Promise(async (resolve, error) => {
      if (data.search) {
        const Info = await DB.findAll({
          where: {
            bank: {
              [Sequelize.Op.gt]: 0
            }
          }
        })
        let output = Info.map(l => l.userID + ' ' + l.bank).sort((a, b) => b.split(' ')[1] - a.split(' ')[1]).map(l => new Object({
          userid: l.split(' ')[0],
          bank: l.split(' ')[1]
        })).filter(data.filter).slice(0, data.limit).findIndex(l => l.userid == data.search)
        if (output == -1) return resolve('Not found')
        return resolve(output + 1)
      } else {
        const Info = await DB.findAll({
          where: {
            bank: {
              [Sequelize.Op.gt]: 0
            }
          }
        })
        let output = Info.map(l => l.userID + ' ' + l.bank).sort((a, b) => b.split(' ')[1] - a.split(' ')[1]).map(l => new Object({
          userid: l.split(' ')[0],
          bank: l.split(' ')[1]
        })).filter(data.filter).slice(0, data.limit)
        return resolve(output)
      }
    });
  },
  Func_SubBank: async function (UserID, toSubtract) {
    if (!UserID) throw new Error('\x1b[32m%s\x1b[0m', `SubBank function is missing parameters!`); if (!toSubtract && toSubtract != 0) throw new Error('\x1b[32m%s\x1b[0m', `SubBank function is missing parameters!`); if (!parseInt(toSubtract)) throw new Error('\x1b[32m%s\x1b[0m', `SubBank function parameter toSubtract needs to be a number!`); toSubtract = parseInt(toSubtract);
    return new Promise(async (resolve, error) => {
      const Info = await DB.findOne({
        where: {
          userID: UserID
        }
      });
      if (Info) {
        const Info2 = await DB.update({
          bank: Info.bank - toSubtract
        }, {
          where: {
            userID: UserID
          }
        });
        if (Info2 > 0) {
          return resolve({
            userid: UserID,
            oldbank: Info.bank,
            newbank: Info.bank - toSubtract
          })
        }
        return error('\x1b[32m%s\x1b[0m', `Something went wrong in function SubBank`);
      } return resolve('\x1b[32m%s\x1b[0m', `ID has no record in database!`);
    });
  },



  // Other Functions
  Delete: function (UserID) {
    return dbQueue.addToQueue({
      "value": this.Func_Delete.bind(this),
      "args": [UserID]
    });
  },

  Func_Delete: async function (UserID) {
    if (!UserID) throw new Error('\x1b[32m%s\x1b[0m', `Delete function is missing parameters!`)
    const DeleteProm = new Promise(async (resolve, error) => {
      const Info = await DB.destroy({
        where: {
          userID: UserID
        }
      });
      if (Info) {
        return resolve({
          deleted: true
        })
      }
      return resolve({
        deleted: false
      })
    });
    return DeleteProm;
  },




  //Command Functions

  Pay: async function (SenderID, ReceiverID, Amount) {
    const money = Math.abs(Amount)
    if (!SenderID) throw new Error(`Missing Parameter Pay Function Needs A SenderID`); if (!parseInt(SenderID)) throw new Error(`Pay Function Parameter SenderID needs to be a Integer`);
    if (!ReceiverID) throw new Error(`Missing Parameter Pay Function Needs A ReceiverID`); if (!parseInt(ReceiverID)) throw new Error(`Pay Function Parameter ReceiverID needs to be a Integer`);
    if (!Amount) throw new Error(`Missing Parameter Pay Function Needs A Amount`); if (!parseInt(Amount)) throw new Error(`Pay Function Parameter Amount needs to be a Number`);

    const sender_cash = await this.GetCash(SenderID);
    const bal = parseInt(sender_cash.cash - money)
    const cash = parseInt(money)
    this.SubCash(SenderID, money);
    this.AddCash(ReceiverID, money);
    return { bal, cash }
  },

  Work: function (Minimum, Maximum, UserID) {
    const rate = Math.random();
    const jobs = ['cashier', 'shopkeeper', 'stripper', 'scrapper', 'cleaner', 'preist', 'theif', 'robber', 'president', 'drug dealer', 'killer', 'buisness man', 'stocks person', 'cook', 'officer', 'developer', 'cop', 'chef', 'maid', 'butler', 'youtuber', 'construction worker', 'singer']
    const failure = ['failure', 'hobo', 'chump', 'disappointment', 'couch potato']
    let job = jobs[Math.floor(Math.random() * jobs.length)]
    if (!Minimum) throw new Error(`Missing Parameter Work Function Needs A Minimum Example | const work = djs.Work(1000) |`); if (!parseInt(Minimum)) throw new Error('Work function parameter minimum needs to be a number!');
    if (!Maximum) throw new Error(`Missing Parameter Work Function Needs A Maximum Example | const work = djs.Work(1000, 2000) |`); if (!parseInt(Maximum)) throw new Error('Work function parameter maximum needs to be a number!');
    if (!UserID) throw new Error(`Missing Parameter Work Function Needs A UserID Example | const work = djs.Work(1000, 2000, message.author.id) |`); if (!parseInt(UserID)) throw new Error('Work function parameter UserID needs to be a integer');
    const money = Math.floor(Math.random() * (Maximum - Minimum + 1)) + Minimum;
    let cash = money;
    if (rate < 0.5) {
      this.AddCash(UserID, cash)
      return { cash, job };
    } else if (rate < 0.7) {
      this.AddCash(UserID, cash)
      return { cash, job }
    } else {
      cash = 0;
      job = failure[Math.floor(Math.random() * failure.length)];
      return { cash, job }
    }
  },



  //Banking Functions
  Deposit: async function (UserID, Amount) {
    if (!UserID) throw new Error(`Missing Parameter Deposit Function Needs A UserID`); if (!parseInt(UserID)) throw new Error(`Deposit Function Parameter UserID needs to be a Integer`);
    if (!Amount) throw new Error(`Missing Parameter Deposit Function Needs An Amount`); if (!parseInt(Amount)) throw new Error(`Deposit Function Parameter Amount needs to be a Number`);
    const DepAmount = Math.abs(Amount)

    const FetchCash = await this.GetCash(UserID);
    const FetchBank = await this.GetBank(UserID);

    const cash = parseInt(FetchCash.cash - DepAmount)
    const bank = parseInt(FetchBank.bank + DepAmount)

    this.SubCash(UserID, DepAmount);
    this.AddBank(UserID, DepAmount);
    return { cash, bank }
  },

  Withdraw: async function (UserID, Amount) {
    if (!UserID) throw new Error(`Missing Parameter Deposit Function Needs A UserID`); if (!parseInt(UserID)) throw new Error(`Deposit Function Parameter UserID needs to be a Integer`);
    if (!Amount) throw new Error(`Missing Parameter Deposit Function Needs An Amount`); if (!parseInt(Amount)) throw new Error(`Deposit Function Parameter Amount needs to be a Number`);
    const WithAmount = Math.abs(Amount);

    const FetchCash = await this.GetCash(UserID);
    const FetchBank = await this.GetBank(UserID);

    const cash = parseInt(FetchCash.cash + WithAmount)
    const bank = parseInt(FetchBank.bank - WithAmount)

    this.SubBank(UserID, WithAmount);
    this.AddCash(UserID, WithAmount);
    return { cash, bank }
  },


}
