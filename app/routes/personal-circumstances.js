module.exports = function (router) {
  router.get('/personal/personal-reason', function (req, res) {
    var id = 0
    var info = ''
    var reasonObject = {}
    var checkedFinancial = false
    var checkedBereavement = false
    var checkedMentalHealth = false
    var checkedHousing = false
    var checkedOther = false

    if (req.query.id) {
      id = req.query.id
      info = req.session.appealReasons[id].personalReason
      reasonObject = req.session.appealReasons[id]
      switch (reasonObject.reason) {
        case 'financial':
          checkedFinancial = true
          break
        case 'bereavement':
          checkedBereavement = true
          break
        case 'mentalHealth':
          checkedMentalHealth = true
          break
        case 'housing':
          checkedHousing = true
          break
        case 'other':
          checkedOther = true
          break
      }
      res.render('personal/personal-reason', {
        id: id,
        checkedFinancial: checkedFinancial,
        checkedBereavement: checkedBereavement,
        checkedMentalHealth: checkedMentalHealth,
        checkedHousing: checkedHousing,
        checkedOther: checkedOther,
        info: info
      })
    } else {
      res.render('personal/personal-reason')
    }
  })
  router.post('/personal/personal-reason', function (req, res) {
    var reasonObject = {}
    var personalReason = req.body.personalReason
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (personalReason === '') {
      Err.type = 'blank'
      Err.text = 'You must tell the type of personal reason'
      Err.href = '#personal-reason'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('personal/personal-reason', {
        errorList: errorList,
        Err: Err
      })
    } else {
      reasonObject = req.session.appealReasons.pop()
      switch (req.body.personalReason) {
        case 'financial':
          reasonObject.personalReason = 'Financial problems'
          break
        case 'bereavement':
          reasonObject.personalReason = 'Bereavement'
          break
        case 'mentalHealth':
          reasonObject.personalReason = 'Mental health'
          break
        case 'housing':
          reasonObject.personalReason = 'Housing and accommodation'
          break
        case 'other':
          reasonObject.personalReason = 'Other reason'
          break
      }
      if (req.body.personalReason === 'bereavement') {
        reasonObject.nextStep = '/personal/bereavement/date-of-death'
        req.session.appealReasons.push(reasonObject)
        res.redirect('/personal/bereavement/date-of-death')
      } else {
        reasonObject.nextStep = '/personal/personal-start-date'
        req.session.appealReasons.push(reasonObject)
        res.redirect('/personal/personal-start-date')
      }
    }
  })
  router.get('/personal/personal-start-date', function (req, res) {
    var currentReason = {}
    var id = 0
    var info = ''
    var inputClasses = {}
    currentReason = req.session.appealReasons.pop()
    req.session.appealReasons.push(currentReason)
    inputClasses.day = 'govuk-input--width-2'
    inputClasses.month = 'govuk-input--width-2'
    inputClasses.year = 'govuk-input--width-4'
    if (req.query.id) {
      id = req.query.id
      info = req.session.appealReasons[id].personalStartDate
      res.render('personal/personal-start-date', {
        inputClasses: inputClasses,
        reason: currentReason,
        id: id,
        info: info
      })
    } else {
      res.render('personal/personal-start-date', {
        inputClasses: inputClasses,
        reason: currentReason
      })
    }
  })
  router.post('/personal/personal-start-date', function (req, res) {
    var editId = req.body.editId
    var reasonObject = {}
    var personalStartDay = req.body['personalStart-day']
    var personalStartMonth = req.body['personalStart-month']
    var personalStartYear = req.body['personalStart-year']
    var errorFlag = false
    var personalStartDayErr = {}
    var personalStartMonthErr = {}
    var personalStartYearErr = {}
    var errorList = []
    var personalStartDate = {}
    var inputClasses = {}

    if (req.body.editId !== '') {
      reasonObject = req.session.appealReasons[editId]
    } else {
      reasonObject = req.session.appealReasons.pop()
    }

    inputClasses.day = 'govuk-input--width-2'
    inputClasses.month = 'govuk-input--width-2'
    inputClasses.year = 'govuk-input--width-4'

    if (personalStartDay === '') {
      personalStartDayErr.type = 'blank'
      personalStartDayErr.text = 'You must enter a day'
      personalStartDayErr.href = '#personal-start-day'
      personalStartDayErr.flag = true
    }
    if (personalStartDayErr.flag) {
      inputClasses.day = 'govuk-input--width-2 govuk-input--error'
      errorList.push(personalStartDayErr)
      errorFlag = true
    }
    if (personalStartMonth === '') {
      personalStartMonthErr.type = 'blank'
      personalStartMonthErr.text = 'You must enter a month'
      personalStartMonthErr.href = '#personal-start-month'
      personalStartMonthErr.flag = true
    }
    if (personalStartMonthErr.flag) {
      inputClasses.month = 'govuk-input--width-2 govuk-input--error'
      errorList.push(personalStartMonthErr)
      errorFlag = true
    }
    if (personalStartYear === '') {
      personalStartYearErr.type = 'blank'
      personalStartYearErr.text = 'You must enter a year'
      personalStartYearErr.href = '#personal-start-year'
      personalStartYearErr.flag = true
    }
    if (personalStartYearErr.flag) {
      inputClasses.year = 'govuk-input--width-4 govuk-input--error'
      errorList.push(personalStartYearErr)
      errorFlag = true
    }
    if (errorFlag === true) {
      if (req.session.signoutFlag === true) {
        req.session.appealReasons.push(reasonObject)
        res.redirect('/sign-out')
      } else {
        req.session.appealReasons.push(reasonObject)
        res.render('personal/personal-start-date', {
          errorList: errorList,
          personalStartDayErr: personalStartDayErr,
          personalStartDay: personalStartDay,
          personalStartMonth: personalStartMonth,
          personalStartYear: personalStartYear,
          inputClasses: inputClasses
        })
      }
    } else {
      if (req.body.editId !== '') {
        personalStartDate.day = personalStartDay
        personalStartDate.month = personalStartMonth
        personalStartDate.year = personalStartYear
        req.session.appealReasons[editId].personalStartDate = personalStartDate
        res.redirect('/check-your-answers')
      } else {
        personalStartDate.day = req.body['personalStart-day']
        personalStartDate.month = req.body['personalStart-month']
        personalStartDate.year = req.body['personalStart-year']
        reasonObject.personalStartDate = personalStartDate
        reasonObject.nextStep = 'personal/continued-personal'
        req.session.appealReasons.push(reasonObject)
        res.redirect('/personal/continued-personal')
      }
    }
  })
  router.get('/personal/continued-personal', function (req, res) {
    var id = 0
    var info = ''
    var reasonObject = {}

    reasonObject = req.session.appealReasons.pop()
    req.session.appealReasons.push(reasonObject)

    if (req.query.id) {
      id = req.query.id
      info = req.session.appealReasons[id].continuedPersonal
      res.render('personal/continued-personal', {
        scenario: req.session.scenario,
        reason: reasonObject,
        id: id,
        info: info
      })
    } else {
      res.render('personal/continued-personal', {
        scenario: req.session.scenario,
        reason: reasonObject
      })
    }
  })
  router.post('/personal/continued-personal', function (req, res) {
    var reasonObject = req.session.appealReasons.pop()
    reasonObject.continuedPersonal = req.body.continuedPersonal
    req.session.appealReasons.push(reasonObject)
    var continuedPersonal = req.body.continuedPersonal
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (typeof continuedPersonal === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must tell us if this is a continued personal'
      Err.href = '#continued-personal-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      reasonObject = req.session.appealReasons[req.session.appealReasons.length - 1]
      res.render('personal/continued-personal', {
        errorList: errorList,
        Err: Err,
        scenario: req.session.scenario,
        reason: reasonObject
      })
    } else {
      switch (req.body.continuedPersonal) {
        case 'yes':
          if (req.body.editId !== '') {
            req.session.appealReasons[editId].continuedPersonal = continuedPersonal
            res.redirect('/check-your-answers')
          } else {
            req.session.appealReasons.pop()
            reasonObject.continuedPersonal = req.body.continuedPersonal
            if (req.session.scenario.company.directors.length > 1) {
              reasonObject.nextStep = 'personal/directors-affected'
              req.session.appealReasons.push(reasonObject)
              res.redirect('/personal/directors-affected')
            } else {
              reasonObject.nextStep = 'personal/personal-information'
              req.session.appealReasons.push(reasonObject)
              res.redirect('/personal/personal-information')
            }
          }
          break
        case 'no':
          if (req.body.editId !== '') {
            req.session.appealReasons[editId].continuedPersonal = continuedPersonal
            res.redirect('/personal/personal-end-date')
          } else {
            reasonObject = req.session.appealReasons.pop()
            reasonObject.continuedPersonal = req.body.continuedPersonal
            reasonObject.nextStep = 'personal/personal-end-date'
            req.session.appealReasons.push(reasonObject)
            res.redirect('/personal/personal-end-date')
            break
          }
      }
    }
  })
  router.get('/personal/personal-end-date', function (req, res) {
    var currentReason = {}
    var inputClasses = {}
    var id = 0
    var info = ''
    currentReason = req.session.appealReasons.pop()
    req.session.appealReasons.push(currentReason)
    inputClasses.day = 'govuk-input--width-2'
    inputClasses.month = 'govuk-input--width-2'
    inputClasses.year = 'govuk-input--width-4'
    if (req.query.id) {
      id = req.query.id
      info = req.session.appealReasons[id].personalEndDate
      res.render('personal/personal-end-date', {
        inputClasses: inputClasses,
        scenario: req.session.scenario,
        reason: currentReason,
        id: id,
        info: info
      })
    } else {
      res.render('personal/personal-end-date', {
        inputClasses: inputClasses,
        reason: currentReason
      })
    }
  })
  router.post('/personal/personal-end-date', function (req, res) {
    var editId = req.body.editId
    var reasonObject = {}
    var personalEndDay = req.body['personalEndDate-day']
    var personalEndMonth = req.body['personalEndDate-month']
    var personalEndYear = req.body['personalEndDate-year']
    var errorFlag = false
    var personalEndDayErr = {}
    var personalEndMonthErr = {}
    var personalEndYearErr = {}
    var errorList = []
    var personalEndDate = {}
    var inputClasses = {}

    if (editId !== '') {
      reasonObject = req.session.appealReasons[editId]
    } else {
      reasonObject = req.session.appealReasons.pop()
    }

    inputClasses.day = 'govuk-input--width-2'
    inputClasses.month = 'govuk-input--width-2'
    inputClasses.year = 'govuk-input--width-4'

    if (personalEndDay === '') {
      personalEndDayErr.type = 'blank'
      personalEndDayErr.text = 'You must enter a day'
      personalEndDayErr.href = '#personal-end-date-day'
      personalEndDayErr.flag = true
    }
    if (personalEndDayErr.flag) {
      inputClasses.day = 'govuk-input--width-2 govuk-input--error'
      errorList.push(personalEndDayErr)
      errorFlag = true
    }
    if (personalEndMonth === '') {
      personalEndMonthErr.type = 'blank'
      personalEndMonthErr.text = 'You must enter a month'
      personalEndMonthErr.href = '#personal-end-date-month'
      personalEndMonthErr.flag = true
    }
    if (personalEndMonthErr.flag) {
      inputClasses.month = 'govuk-input--width-2 govuk-input--error'
      errorList.push(personalEndMonthErr)
      errorFlag = true
    }
    if (personalEndYear === '') {
      personalEndYearErr.type = 'blank'
      personalEndYearErr.text = 'You must enter a year'
      personalEndYearErr.href = '#personal-end-date-year'
      personalEndYearErr.flag = true
    }
    if (personalEndYearErr.flag) {
      inputClasses.year = 'govuk-input--width-4 govuk-input--error'
      errorList.push(personalEndYearErr)
      errorFlag = true
    }
    if (errorFlag === true) {
      req.session.appealReasons.push(reasonObject)
      res.render('personal/personal-end-date', {
        errorList: errorList,
        personalEndDayErr: personalEndDayErr,
        personalEndMonthErr: personalEndMonthErr,
        personalEndYearErr: personalEndYearErr,
        personalEndDay: personalEndDay,
        personalEndMonth: personalEndMonth,
        personalEndYear: personalEndYear,
        inputClasses: inputClasses,
        reason: reasonObject,
        editId: editId
      })
    } else {
      if (req.body.editId !== '') {
        personalEndDate.day = req.body['personalEndDate-day']
        personalEndDate.month = req.body['personalEndDate-month']
        personalEndDate.year = req.body['personalEndDate-year']
        req.session.appealReasons[editId].personalEndDate = personalEndDate
        res.redirect('/check-your-answers')
      } else {
        req.session.appealReasons.pop()
        personalEndDate.day = req.body['personalEndDate-day']
        personalEndDate.month = req.body['personalEndDate-month']
        personalEndDate.year = req.body['personalEndDate-year']
        reasonObject.personalEndDate = personalEndDate
        if (req.session.scenario.company.directors.length > 1) {
          reasonObject.nextStep = 'personal/directors-affected'
          req.session.appealReasons.push(reasonObject)
          res.redirect('/personal/directors-affected')
        } else {
          reasonObject.nextStep = 'personal/personal-information'
          req.session.appealReasons.push(reasonObject)
          res.redirect('/personal/personal-information')
        }
      }
    }
  })
  router.get('/personal/directors-affected', function (req, res) {
    var reasonObject = {}
    var id = 0
    var info = ''

    reasonObject = req.session.appealReasons.pop()
    req.session.appealReasons.push(reasonObject)

    if (req.query.id) {
      id = req.query.id
      info = req.session.appealReasons[id].directorsAffected
      res.render('personal/directors-affected', {
        scenario: req.session.scenario,
        reason: reasonObject,
        id: id,
        info: info
      })
    } else {
      res.render('personal/directors-affected', {
        scenario: req.session.scenario,
        reason: reasonObject,
        info: info
      })
    }
  })
  router.post('/personal/directors-affected', function (req, res) {
    var directorsAffected = req.body.directorsAffected
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []
    var reasonObject = {}
    reasonObject.directorsAffected = req.body.directorsAffected

    if (req.body.editId !== '') {
      reasonObject = req.session.appealReasons[editId]
    } else {
      reasonObject = req.session.appealReasons.pop()
    }

    if (typeof directorsAffected === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must tell which director the person was related to'
      Err.href = '#ill-family-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      reasonObject = req.session.appealReasons[req.session.appealReasons.length - 1]
      res.render('personal/directors-affected', {
        errorList: errorList,
        Err: Err,
        scenario: req.session.scenario,
        reason: reasonObject
      })
    } else {
      if (req.body.editId !== '') {
        req.session.appealReasons[editId].directorsAffected = directorsAffected
        res.redirect('/check-your-answers')
      } else {
        req.session.appealReasons.pop()
        reasonObject.directorsAffected = req.body.directorsAffected
        reasonObject.nextStep = 'personal/personal-information'
        req.session.appealReasons.push(reasonObject)
        res.redirect('/personal/personal-information')
      }
    }
  })
  router.get('/personal/bereavement/date-of-death', function (req, res) {
    var currentReason = {}
    var id = 0
    var info = ''
    var inputClasses = {}
    currentReason = req.session.appealReasons.pop()
    req.session.appealReasons.push(currentReason)
    inputClasses.day = 'govuk-input--width-2'
    inputClasses.month = 'govuk-input--width-2'
    inputClasses.year = 'govuk-input--width-4'
    if (req.query.id) {
      id = req.query.id
      info = req.session.appealReasons[id].dateOfDeath
      res.render('personal/bereavement/date-of-death', {
        inputClasses: inputClasses,
        reason: currentReason,
        id: id,
        info: info
      })
    } else {
      res.render('personal/bereavement/date-of-death', {
        inputClasses: inputClasses,
        reason: currentReason
      })
    }
  })
  router.post('/personal/bereavement/date-of-death', function (req, res) {
    var editId = req.body.editId
    var reasonObject = {}
    var dateOfDeathDay = req.body['dateOfDeath-day']
    var dateOfDeathMonth = req.body['dateOfDeath-month']
    var dateOfDeathYear = req.body['dateOfDeath-year']
    var errorFlag = false
    var dateOfDeathDayErr = {}
    var dateOfDeathMonthErr = {}
    var dateOfDeathYearErr = {}
    var errorList = []
    var dateOfDeathDate = {}
    var inputClasses = {}

    if (req.body.editId !== '') {
      reasonObject = req.session.appealReasons[editId]
    } else {
      reasonObject = req.session.appealReasons.pop()
    }

    inputClasses.day = 'govuk-input--width-2'
    inputClasses.month = 'govuk-input--width-2'
    inputClasses.year = 'govuk-input--width-4'

    if (dateOfDeathDay === '') {
      dateOfDeathDayErr.type = 'blank'
      dateOfDeathDayErr.text = 'You must enter a day'
      dateOfDeathDayErr.href = '#date-of-death-day'
      dateOfDeathDayErr.flag = true
    }
    if (dateOfDeathDayErr.flag) {
      inputClasses.day = 'govuk-input--width-2 govuk-input--error'
      errorList.push(dateOfDeathDayErr)
      errorFlag = true
    }
    if (dateOfDeathMonth === '') {
      dateOfDeathMonthErr.type = 'blank'
      dateOfDeathMonthErr.text = 'You must enter a month'
      dateOfDeathMonthErr.href = '#date-of-death-month'
      dateOfDeathMonthErr.flag = true
    }
    if (dateOfDeathMonthErr.flag) {
      inputClasses.month = 'govuk-input--width-2 govuk-input--error'
      errorList.push(dateOfDeathMonthErr)
      errorFlag = true
    }
    if (dateOfDeathYear === '') {
      dateOfDeathYearErr.type = 'blank'
      dateOfDeathYearErr.text = 'You must enter a year'
      dateOfDeathYearErr.href = '#date-of-death-year'
      dateOfDeathYearErr.flag = true
    }
    if (dateOfDeathYearErr.flag) {
      inputClasses.year = 'govuk-input--width-4 govuk-input--error'
      errorList.push(dateOfDeathYearErr)
      errorFlag = true
    }
    if (errorFlag === true) {
      if (req.session.signoutFlag === true) {
        req.session.appealReasons.push(reasonObject)
        res.redirect('/sign-out')
      } else {
        req.session.appealReasons.push(reasonObject)
        res.render('personal/bereavement/date-of-death', {
          errorList: errorList,
          dateOfDeathDayErr: dateOfDeathDayErr,
          dateOfDeathDay: dateOfDeathDay,
          dateOfDeathMonth: dateOfDeathMonth,
          dateOfDeathYear: dateOfDeathYear,
          inputClasses: inputClasses
        })
      }
    } else {
      if (req.body.editId !== '') {
        dateOfDeathDate.day = dateOfDeathDay
        dateOfDeathDate.month = dateOfDeathMonth
        dateOfDeathDate.year = dateOfDeathYear
        req.session.appealReasons[editId].dateOfDeathDate = dateOfDeathDate
        res.redirect('/check-your-answers')
      } else {
        dateOfDeathDate.day = req.body['dateOfDeath-day']
        dateOfDeathDate.month = req.body['dateOfDeath-month']
        dateOfDeathDate.year = req.body['dateOfDeath-year']
        reasonObject.dateOfDeathDate = dateOfDeathDate
        reasonObject.nextStep = 'personal/bereavement/relationship-to-company'
        req.session.appealReasons.push(reasonObject)
        res.redirect('/personal/bereavement/relationship-to-company')
      }
    }
  })
  router.get('/personal/bereavement/relationship-to-company', function (req, res) {
    var id = 0
    var relationshipToCompany = ''
    if (req.query.id) {
      id = req.query.id
      relationshipToCompany = req.session.appealReasons[id].relationshipToCompany
      res.render('personal/bereavement/relationship-to-company', {
        id: id,
        relationshipToCompany: relationshipToCompany
      })
    } else {
      res.render('personal/bereavement/relationship-to-company')
    }
  })
  router.post('/personal/bereavement/relationship-to-company', function (req, res) {
    var relationshipToCompany = req.body.relationshipToCompany
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (relationshipToCompany === '') {
      Err.type = 'blank'
      Err.text = 'You must tell us how the person was related to the company'
      Err.href = '#relationship-to-company'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('personal/bereavement/relationship-to-company', {
        errorList: errorList,
        Err: Err
      })
    } else {
      if (req.body.editId !== '') {
        req.session.appealReasons[editId].relationshipToCompany = relationshipToCompany
        res.redirect('/check-your-answers')
      } else {
        var reasonObject = req.session.appealReasons.pop()
        reasonObject.relationshipToCompany = req.body.relationshipToCompany
        reasonObject.nextStep = 'personal/personal-information'
        req.session.appealReasons.push(reasonObject)
        res.redirect('/personal/personal-information')
      }
    }
  })
  router.get('/personal/personal-information', function (req, res) {
    var id = 0
    var info = ''
    if (req.query.id) {
      id = req.query.id
      info = req.session.appealReasons[id].personalInformation
      res.render('personal/personal-information', {
        id: id,
        info: info
      })
    } else {
      res.render('personal/personal-information')
    }
  })
  router.post('/personal/personal-information', function (req, res) {
    var personalInformation = req.body.personalInformation
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (personalInformation === '') {
      Err.type = 'blank'
      Err.text = 'You must tell us more information'
      Err.href = '#personal-information'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('personal/personal-information', {
        errorList: errorList,
        Err: Err
      })
    } else {
      if (req.body.editId !== '') {
        req.session.appealReasons[editId].personalInformation = personalInformation
        res.redirect('/check-your-answers')
      } else {
        var reasonObject = req.session.appealReasons.pop()
        reasonObject.personalInformation = req.body.personalInformation
        reasonObject.nextStep = 'evidence'
        req.session.appealReasons.push(reasonObject)
        res.redirect('/evidence')
      }
    }
  })
}
