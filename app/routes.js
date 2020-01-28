const express = require('express')
const router = express.Router()

/* router.all('*', function (req, res, next) {
  console.log(req.session.signoutFlag)
  console.log(req.session.signoutCounter)
  if (req.session.signoutFlag === true) {
    if (req.session.signoutCounter === 0) {
      req.session.signoutCounter++
      next()
    } else {
      req.session.signoutFlag = false
      req.session.signoutCounter = false
      res.redirect('/sign-out')
    }
  } else {
    next()
  }
})
*/

// Service Core Routes
require('./routes/core-service.js')(router)

// Core Journey Routes
require('./routes/core-journey.js')(router)

// Illness
require('./routes/illness.js')(router)

// Authentication Code
require('./routes/auth-code.js')(router)

// Theft Or Criminal Damage
require('./routes/theft-or-criminal-damage.js')(router)

// Problems Filing Online
require('./routes/problems-filing-online.js')(router)

// Accounting Issues
require('./routes/accounting-issues.js')(router)

// Changes To The Company
require('./routes/changes-to-the-company.js')(router)

// Natural Disaster
require('./routes/natural-disaster.js')(router)

// Other Reason
require('./routes/other-reason.js')(router)

// Rejected Accounts
require('./routes/rejected-accounts.js')(router)

// Personal Circumstances
require('./routes/personal-circumstances.js')(router)

module.exports = router
