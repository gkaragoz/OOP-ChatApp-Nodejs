const moment = require('moment');

function Log(prefix) {
  this.prefix = prefix;

  this.print = function (log) {
    let date = moment().format('h:mm:ss a');
    console.log('[' + date + '] ' + '[' + this.prefix + '] ' + log);
  }
}

module.exports = Log;