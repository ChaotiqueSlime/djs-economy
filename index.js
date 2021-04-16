const Sequelize = require('sequelize');
const queuing = require("./queue.js");
const dbQueue = new queuing();
var formatNumber = require('./functions')
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
});
DB.sync()
console.log('\x1b[32m%s\x1b[0m', `Economy Database Loaded | For Support Or Help Join Our Discord https://discord.gg/yv3s3b97Sn`);
module.exports = {
  Set: function (UserID, toSet) {
    return dbQueue.addToQueue({
      "value": this.Func_Set.bind(this),
      "args": [UserID, toSet]
    });
  },
  Get: function (UserID) {
    return dbQueue.addToQueue({
      "value": this.Func_Get.bind(this),
      "args": [UserID]
    });
  },
  Add: function (UserID, toAdd) {
    return dbQueue.addToQueue({
      "value": this.Func_Add.bind(this),
      "args": [UserID, toAdd]
    });
  },
  Sub: function (UserID, toSubtract) {
    return dbQueue.addToQueue({
      "value": this.Func_Sub.bind(this),
      "args": [UserID, toSubtract]
    });
  },
  Leaderboard: function (data = {}) {
    return dbQueue.addToQueue({
      "value": this.Func_LB.bind(this),
      "args": [data]
    });
  },
  Delete: function (UserID) {
    return dbQueue.addToQueue({
      "value": this.Func_Delete.bind(this),
      "args": [UserID]
    });
  },

  Func_Set: async function (UserID, toSet) {
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
  Func_Get: async function (UserID) {
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
  Func_Add: async function (UserID, toAdd) {
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
  Func_LB: async function (data) {
    if (data.limit && !parseInt(data.limit)) throw new Error('\x1b[32m%s\x1b[0m', `Leaderboard function parameter object limit needs to be a number`)
    if (data.limit) data.limit = parseInt(data.limit)
    if (data.filter && !data.filter instanceof Function) throw new Error('\x1b[32m%s\x1b[0m', `Leaderboard function parameter object filter needs to be a function!`)
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
  Func_Sub: async function (UserID, toSubtract) {
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
        return error('\x1b[32m%s\x1b[0m', `Something went wrong in function SubValue`);
      } return resolve('\x1b[32m%s\x1b[0m', `ID has no record in database!`);
    });
  },





















  //Command Functions


  Pay: async function (SenderID, ReceiverID, Amount) {
    const money = Math.abs(Amount)
    if (!SenderID) throw new error(`Missing Parameter Pay Function Needs A SenderID`); if (!parseInt(SenderID)) throw new error(`Pay Function Parameter SenderID needs to be a Integer`);
    if (!ReceiverID) throw new error(`Missing Parameter Pay Function Needs A ReceiverID`); if (!parseInt(ReceiverID)) throw new error(`Pay Function Parameter ReceiverID needs to be a Integer`);
    if (!Amount) throw new error(`Missing Parameter Pay Function Needs A Amount`); if (!parseInt(Amount)) throw new error(`Pay Function Parameter Amount needs to be a Number`);
    const UUID1 = `99${SenderID}`;
    const UUID2 = `99${ReceiverID}`;
    const sender_cash = await this.Get(UUID1);
    const bal = `${sender_cash.cash - money}`;
    const cash = `${formatNumber(money)}`;
    this.Sub(UUID1, money);
    this.Add(UUID2, money);
    return { bal, cash }
  },

  Work: function (Minimum, Maximum, UserID) {
    const rate = Math.random();
    const jobs = ['cashier', 'shopkeeper', 'stripper', 'scrapper', 'cleaner', 'preist', 'theif', 'robber', 'president', 'drug dealer', 'killer', 'buisness man', 'stocks person', 'cook', 'officer', 'developer', 'cop', 'chef', 'maid', 'butler', 'youtuber', 'construction worker', 'singer']
    const failure = ['failure', 'hobo', 'chump', 'disappointment', 'couch potato']
    let job = jobs[Math.floor(Math.random() * jobs.length)]
    if (!Minimum) throw new error(`Missing Parameter Work Function Needs A Minimum Example | const work = djs.Work(1000) |`); if (!parseInt(Minimum)) throw new Error('Work function parameter minimum needs to be a number!');
    if (!Maximum) throw new error(`Missing Parameter Work Function Needs A Maximum Example | const work = djs.Work(1000, 2000) |`); if (!parseInt(Maximum)) throw new Error('Work function parameter maximum needs to be a number!');
    if (!UserID) throw new error(`Missing Parameter Work Function Needs A UserID Example | const work = djs.Work(1000, 2000, message.author.id) |`); if (!parseInt(UserID)) throw new Error('Work function parameter UserID needs to be a integer');
    const money = Math.floor(Math.random() * (Maximum - Minimum + 1)) + Minimum;
    let cash = money;
    const UUID = `99${UserID}`;
    if (rate < 0.5) {
      this.Add(UUID, cash)
      return { cash, job };
    } else if (rate < 0.7) {
      this.Add(UUID, cash)
      return { cash, job }
    } else {
      cash = 0;
      job = failure[Math.floor(Math.random() * failure.length)];
      return { cash, job }
    }
  },

  Deposit: async function (UserID, Amount) {
    if (!UserID) throw new error(`Missing Parameter Deposit Function Needs A UserID`); if (!parseInt(UserID)) throw new error(`Deposit Function Parameter UserID needs to be a Integer`);
    if (!Amount) throw new error(`Missing Parameter Deposit Function Needs An Amount`); if (!parseInt(Amount)) throw new error(`Deposit Function Parameter Amount needs to be a Number`);
    const DepAmount = Math.abs(Amount)
    const UUID = `99${UserID}`;

    const FetchCash = await this.Get(UUID);
    const FetchBank = await this.Get(UserID);

    const cash = `${FetchCash.cash - DepAmount}`;
    const bank = `${FetchBank.cash + DepAmount}`;

    this.Sub(UUID, DepAmount);
    this.Add(UserID, DepAmount);
    return { cash, bank }
  },

  Withdraw: async function (UserID, Amount) {
    if (!UserID) throw new error(`Missing Parameter Deposit Function Needs A UserID`); if (!parseInt(UserID)) throw new error(`Deposit Function Parameter UserID needs to be a Integer`);
    if (!Amount) throw new error(`Missing Parameter Deposit Function Needs An Amount`); if (!parseInt(Amount)) throw new error(`Deposit Function Parameter Amount needs to be a Number`);
    const WithAmount = Math.abs(Amount);
    const UUID = `99${UserID}`;

    const FetchCash = await this.Get(UUID);
    const FetchBank = await this.Get(UserID);

    const cash = `${FetchCash.cash + WithAmount}`;
    const bank = `${FetchBank.cash - WithAmount}`;

    this.Sub(UserID, WithAmount);
    this.Add(UUID, WithAmount);
    return { cash, bank }
  },


  // Bank Functions


  GetBank: async function (UserID) {
    if (!UserID) throw new Error('\x1b[32m%s\x1b[0m', `GetBank function is missing parameters!`);

    const FetchBank = await this.Get(UserID);

    const bank = `${FetchBank.cash}`;
    return { bank }
  },

  SetBank: async function (UserID, Amount) {
    if (!UserID) throw new error(`Missing Parameter SetBank Function Needs A UserID`); if (!parseInt(UserID)) throw new error(`SetBank Function Parameter UserID needs to be a Integer`);
    if (!Amount) throw new error(`Missing Parameter SetBank Function Needs An Amount`); if (!parseInt(Amount)) throw new error(`SetBank Function Parameter Amount needs to be a Number`);
    const SetAmount = Math.abs(Amount);

    this.Set(UserID, SetAmount);

    return { SetAmount }
  },

  AddBank: async function (UserID, Amount) {
    if (!UserID) throw new error(`Missing Parameter AddBank Function Needs A UserID`); if (!parseInt(UserID)) throw new error(`AddBank Function Parameter UserID needs to be a Integer`);
    if (!Amount) throw new error(`Missing Parameter AddBank Function Needs An Amount`); if (!parseInt(Amount)) throw new error(`AddBank Function Parameter Amount needs to be a Number`);
    const AddAmount = Math.abs(Amount);

    this.Add(UserID, AddAmount);

    const FetchBank = await this.Get(UserID);

    const bank = `${FetchBank.cash}`;

    return { bank }
  },

  SubBank: async function (UserID, Amount) {
    if (!UserID) throw new error(`Missing Parameter SubBank Function Needs A UserID`); if (!parseInt(UserID)) throw new error(`SubBank Function Parameter UserID needs to be a Integer`);
    if (!Amount) throw new error(`Missing Parameter SubBank Function Needs An Amount`); if (!parseInt(Amount)) throw new error(`SubBank Function Parameter Amount needs to be a Number`);
    const SubAmount = Math.abs(Amount);

    this.Sub(UserID, SubAmount);

    const FetchBank = await this.Get(UserID);

    const bank = `${FetchBank.cash}`;

    return { bank }
  },

  DeleteBank: async function (UserID) {
    if (!UserID) throw new error(`Missing Parameter DeleteBank Function Needs A UserID`); if (!parseInt(UserID)) throw new error(`DeleteBank Function Parameter UserID needs to be a Integer`);

    this.Delete(UserID);

    return;
  },


  //Cash Functions


  GetCash: async function (UserID) {
    if (!UserID) throw new Error('\x1b[32m%s\x1b[0m', `GetCash function is missing parameters!`);
    const UUID = `99${UserID}`;

    const FetchCash = await this.Get(UUID);

    const cash = `${FetchCash.cash}`;
    return { cash }
  },

  SetCash: async function (UserID, Amount) {
    if (!UserID) throw new error(`Missing Parameter SetCash Function Needs A UserID`); if (!parseInt(UserID)) throw new error(`SetCash Function Parameter UserID needs to be a Integer`);
    if (!Amount) throw new error(`Missing Parameter SetCash Function Needs An Amount`); if (!parseInt(Amount)) throw new error(`SetCash Function Parameter Amount needs to be a Number`);
    const SetAmount = Math.abs(Amount);
    const UUID = `99${UserID}`;

    this.Set(UUID, SetAmount);

    return { SetAmount }
  },

  AddCash: async function (UserID, Amount) {
    if (!UserID) throw new error(`Missing Parameter AddCash Function Needs A UserID`); if (!parseInt(UserID)) throw new error(`AddCash Function Parameter UserID needs to be a Integer`);
    if (!Amount) throw new error(`Missing Parameter AddCash Function Needs An Amount`); if (!parseInt(Amount)) throw new error(`AddCash Function Parameter Amount needs to be a Number`);
    const AddAmount = Math.abs(Amount);
    const UUID = `99${UserID}`;

    this.Add(UUID, AddAmount);

    const FetchCash = await this.Get(UUID);

    const bank = `${FetchCash.cash}`;

    return { bank }
  },

  SubCash: async function (UserID, Amount) {
    if (!UserID) throw new error(`Missing Parameter SubCash Function Needs A UserID`); if (!parseInt(UserID)) throw new error(`SubCash Function Parameter UserID needs to be a Integer`);
    if (!Amount) throw new error(`Missing Parameter SubCash Function Needs An Amount`); if (!parseInt(Amount)) throw new error(`SubCash Function Parameter Amount needs to be a Number`);
    const SubAmount = Math.abs(Amount);
    const UUID = `99${UserID}`;

    this.Sub(UUID, SubAmount);

    const FetchCash = await this.Get(UUID);

    const bank = `${FetchCash.cash}`;

    return { bank }
  },

  DeleteCash: async function (UserID) {
    if (!UserID) throw new error(`Missing Parameter DeleteCash Function Needs A UserID`); if (!parseInt(UserID)) throw new error(`DeleteCash Function Parameter UserID needs to be a Integer`);
    const UUID = `99${UserID}`;

    this.Delete(UUID);

    return;
  },

}
