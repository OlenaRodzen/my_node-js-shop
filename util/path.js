const path = require('path');

module.exports = (...paths) => path.join(path.dirname(process.mainModule.filename), ...paths) ;
