module.exports = function (router) {
  router.get('/illness/who-was-ill', function (req, res) {
    var id = 0
    var info = ''
    var checked = {}
    var otherPersonError = false
    var checkedDirector = false
    var checkedAccountant = false
    var checkedFamily = false
    var checkedEmployee = false

    if (req.query.id) {
      id = req.query.id
      info = req.session.appealReasons[id].illPerson
      switch (info) {
        case 'director':
          checkedDirector = true
          break
        case 'accountant':
          checkedAccountant = true
          break
        case 'family':
          checkedFamily = true
          break
        case 'employee':
          checkedEmployee = true
          break
        case 'Someone else':
          otherPersonError = true
          break
      }
      res.render('illness/who-was-ill', {
        checkedDirector: checkedDirector,
        checkedAccountant: checkedAccountant,
        checkedFamily: checkedFamily,
        checkedEmployee: checkedEmployee,
        id: id,
        info: info,
        checked: checked,
        otherPersonError: otherPersonError
      })
    } else {
      res.render('illness/who-was-ill')
    }
  })
  router.post('/illness/who-was-ill', function (req, res) {
    var illPerson = req.body.illPerson
    var otherPerson = req.body.otherPerson
    var editId = req.body.editId
    var errorFlag = false
    var illPersonErr = {}
    var otherPersonErr = {}
    var errorList = []
    var reasonObject = {}

    if (req.body.editId !== '') {
      reasonObject = req.session.appealReasons[editId]
    } else {
      reasonObject = req.session.appealReasons.pop()
    }

    if (typeof illPerson === 'undefined') {
      illPersonErr.type = 'blank'
      illPersonErr.text = 'You must select a person'
      illPersonErr.href = '#ill-person-1'
      illPersonErr.flag = true
    }
    if (illPerson === 'Someone else' && otherPerson === '') {
      otherPersonErr.type = 'invalid'
      otherPersonErr.text = 'You must tell us the person'
      otherPersonErr.href = '#other-person'
      otherPersonErr.flag = true
    }
    if (illPersonErr.flag) {
      errorList.push(illPersonErr)
      errorFlag = true
    }
    if (otherPersonErr.flag) {
      errorList.push(otherPersonErr)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('illness/who-was-ill', {
        errorList: errorList,
        illPersonErr: illPersonErr,
        otherPersonErr: otherPersonErr,
        id: editId
      })
    } else {
      reasonObject.illPerson = req.body.illPerson
      reasonObject.otherPerson = req.body.otherPerson
      reasonObject.complete = false
      switch (req.body.illPerson) {
        case 'director':
          if (req.session.scenario.company.director > 1) {
            if (editId !== '') {
              req.session.appealReasons[editId].illPerson = reasonObject.illPerson
            } else {
              reasonObject.nextStep = 'illness/ill-director'
              req.session.appealReasons.push(reasonObject)
            }
            res.redirect('/illness/ill-director')
          } else {
            if (editId !== '') {
              req.session.appealReasons[editId].illPerson = reasonObject.illPerson
            } else {
              reasonObject.nextStep = 'illness/illness-start-date'
              req.session.appealReasons.push(reasonObject)
            }
            res.redirect('/illness/illness-start-date')
          }
          break
        case 'accountant':
          if (editId !== '') {
            req.session.appealReasons[editId].illPerson = reasonObject.illPerson
          } else {
            reasonObject.nextStep = '/illness/ill-accountant'
            req.session.appealReasons.push(reasonObject)
          }
          res.redirect('/illness/ill-accountant')
          break
        case 'family':
          if (editId !== '') {
            req.session.appealReasons[editId].illPerson = reasonObject.illPerson
          } else {
            reasonObject.nextStep = '/illness/family-member'
            req.session.appealReasons.push(reasonObject)
          }
          res.redirect('/illness/family-member')
          break
        case 'employee':
          if (editId !== '') {
            req.session.appealReasons[editId].illPerson = reasonObject.illPerson
          } else {
            reasonObject.nextStep = '/illness/illness-start-date'
            req.session.appealReasons.push(reasonObject)
          }
          res.redirect('/illness/illness-start-date')
          break
        case 'otherPerson':
          if (editId !== '') {
            req.session.appealReasons[editId].illPerson = reasonObject.illPerson
          } else {
            reasonObject.nextStep = '/illness/illness-start-date'
            req.session.appealReasons.push(reasonObject)
          }
          res.redirect('/illness/illness-start-date')
          break
      }
    }
  })
  router.get('/illness/ill-director', function (req, res) {
    var reasonObject = {}
    var id = 0
    var info = ''

    reasonObject = req.session.appealReasons.pop()
    req.session.appealReasons.push(reasonObject)

    if (req.query.id) {
      id = req.query.id
      info = req.session.appealReasons[id].illDirector
      res.render('illness/ill-director', {
        scenario: req.session.scenario,
        reason: reasonObject,
        id: id,
        info: info
      })
    } else {
      res.render('illness/ill-director', {
        scenario: req.session.scenario,
        reason: reasonObject,
        info: info
      })
    }
  })
  router.post('/illness/ill-director', function (req, res) {
    var illDirector = req.body.illDirector
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []
    var reasonObject = {}
    reasonObject.illDirector = req.body.illDirector

    if (req.body.editId !== '') {
      reasonObject = req.session.appealReasons[editId]
    } else {
      reasonObject = req.session.appealReasons.pop()
    }

    if (typeof illDirector === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must tell us which director was ill'
      Err.href = '#ill-director-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      reasonObject = req.session.appealReasons[req.session.appealReasons.length - 1]
      res.render('illness/ill-director', {
        errorList: errorList,
        Err: Err,
        scenario: req.session.scenario,
        reason: reasonObject
      })
    } else {
      if (req.body.editId !== '') {
        req.session.appealReasons[editId].illDirector = illDirector
        res.redirect('/check-your-answers')
      } else {
        req.session.appealReasons.pop()
        reasonObject.illDirector = req.body.illDirector
        reasonObject.nextStep = 'illness/illness-start-date'
        req.session.appealReasons.push(reasonObject)
        res.redirect('/illness/illness-start-date')
      }
    }
  })
  router.get('/illness/ill-accountant', function (req, res) {
    var id = 0
    var info = ''
    if (req.query.id) {
      id = req.query.id
      info = req.session.appealReasons[id].illAccountant
      res.render('illness/ill-accountant', {
        id: id,
        info: info
      })
    } else {
      res.render('illness/ill-accountant')
    }
  })
  router.post('/illness/ill-accountant', function (req, res) {
    var illAccountant = req.body.illAccountant
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (illAccountant === '') {
      Err.type = 'blank'
      Err.text = 'You must tell us more information'
      Err.href = '#ill-accountant'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('illness/ill-accountant', {
        errorList: errorList,
        Err: Err
      })
    } else {
      if (req.body.editId !== '') {
        req.session.appealReasons[editId].illAccountant = illAccountant
        res.redirect('/check-your-answers')
      } else {
        var reasonObject = req.session.appealReasons.pop()
        reasonObject.illAccountant = req.body.illAccountant
        reasonObject.nextStep = 'illness/illness-start-date'
        req.session.appealReasons.push(reasonObject)
        res.redirect('/illness/illness-start-date')
      }
    }
  })
  router.get('/illness/family-member', function (req, res) {
    var reasonObject = {}
    var id = 0
    var info = ''

    reasonObject = req.session.appealReasons.pop()
    req.session.appealReasons.push(reasonObject)

    if (req.query.id) {
      id = req.query.id
      info = req.session.appealReasons[id].illFamily
      res.render('illness/family-member', {
        scenario: req.session.scenario,
        reason: reasonObject,
        id: id,
        info: info
      })
    } else {
      res.render('illness/family-member', {
        scenario: req.session.scenario,
        reason: reasonObject,
        info: info
      })
    }
  })
  router.post('/illness/family-member', function (req, res) {
    var illFamily = req.body.illFamily
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []
    var reasonObject = {}
    reasonObject.illFamily = req.body.illFamily

    if (req.body.editId !== '') {
      reasonObject = req.session.appealReasons[editId]
    } else {
      reasonObject = req.session.appealReasons.pop()
    }

    if (typeof illFamily === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must tell which director the family member was related to'
      Err.href = '#ill-family-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      reasonObject = req.session.appealReasons[req.session.appealReasons.length - 1]
      res.render('illness/family-member', {
        errorList: errorList,
        Err: Err,
        scenario: req.session.scenario,
        reason: reasonObject
      })
    } else {
      if (req.body.editId !== '') {
        req.session.appealReasons[editId].illFamily = illFamily
        res.redirect('/check-your-answers')
      } else {
        req.session.appealReasons.pop()
        reasonObject.illFamily = req.body.illFamily
        reasonObject.nextStep = 'illness/family-relationship'
        req.session.appealReasons.push(reasonObject)
        res.redirect('/illness/family-relationship')
      }
    }
  })
  router.get('/illness/family-relationship', function (req, res) {
    var id = 0
    var info = ''
    if (req.query.id) {
      id = req.query.id
      info = req.session.appealReasons[id].familyRelationship
      res.render('illness/family-relationship', {
        id: id,
        info: info,
        scenario: req.session.scenario
      })
    } else {
      res.render('illness/family-relationship')
    }
  })
  router.post('/illness/family-relationship', function (req, res) {
    var familyRelationship = req.body.familyRelationship
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (familyRelationship === '') {
      Err.type = 'blank'
      Err.text = 'You must tell us more information'
      Err.href = '#family-relationship'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('illness/family-relationship', {
        errorList: errorList,
        Err: Err
      })
    } else {
      if (req.body.editId !== '') {
        req.session.appealReasons[editId].familyRelationship = familyRelationship
        res.redirect('/check-your-answers')
      } else {
        var reasonObject = req.session.appealReasons.pop()
        reasonObject.familyRelationship = req.body.familyRelationship
        reasonObject.nextStep = 'illness/illness-start-date'
        req.session.appealReasons.push(reasonObject)
        res.redirect('/illness/illness-start-date')
      }
    }
  })
  router.get('/illness/illness-start-date', function (req, res) {
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
      info = req.session.appealReasons[id].illnessStartDate
      res.render('illness/illness-start-date', {
        inputClasses: inputClasses,
        reason: currentReason,
        id: id,
        info: info
      })
    } else {
      res.render('illness/illness-start-date', {
        inputClasses: inputClasses,
        reason: currentReason
      })
    }
  })
  router.post('/illness/illness-start-date', function (req, res) {
    console.log('illness')
    var editId = req.body.editId
    var reasonObject = {}
    var illnessStartDay = req.body['illnessStart-day']
    var illnessStartMonth = req.body['illnessStart-month']
    var illnessStartYear = req.body['illnessStart-year']
    var errorFlag = false
    var illnessStartDayErr = {}
    var illnessStartMonthErr = {}
    var illnessStartYearErr = {}
    var errorList = []
    var illnessStartDate = {}
    var inputClasses = {}

    if (req.body.editId !== '') {
      reasonObject = req.session.appealReasons[editId]
    } else {
      reasonObject = req.session.appealReasons.pop()
    }

    inputClasses.day = 'govuk-input--width-2'
    inputClasses.month = 'govuk-input--width-2'
    inputClasses.year = 'govuk-input--width-4'

    if (illnessStartDay === '') {
      illnessStartDayErr.type = 'blank'
      illnessStartDayErr.text = 'You must enter a day'
      illnessStartDayErr.href = '#illness-start-day'
      illnessStartDayErr.flag = true
    }
    if (illnessStartDayErr.flag) {
      inputClasses.day = 'govuk-input--width-2 govuk-input--error'
      errorList.push(illnessStartDayErr)
      errorFlag = true
    }
    if (illnessStartMonth === '') {
      illnessStartMonthErr.type = 'blank'
      illnessStartMonthErr.text = 'You must enter a month'
      illnessStartMonthErr.href = '#illness-start-month'
      illnessStartMonthErr.flag = true
    }
    if (illnessStartMonthErr.flag) {
      inputClasses.month = 'govuk-input--width-2 govuk-input--error'
      errorList.push(illnessStartMonthErr)
      errorFlag = true
    }
    if (illnessStartYear === '') {
      illnessStartYearErr.type = 'blank'
      illnessStartYearErr.text = 'You must enter a year'
      illnessStartYearErr.href = '#illness-start-year'
      illnessStartYearErr.flag = true
    }
    if (illnessStartYearErr.flag) {
      inputClasses.year = 'govuk-input--width-4 govuk-input--error'
      errorList.push(illnessStartYearErr)
      errorFlag = true
    }
    if (errorFlag === true) {
      if (req.session.signoutFlag === true) {
        req.session.appealReasons.push(reasonObject)
        res.redirect('/sign-out')
      } else {
        req.session.appealReasons.push(reasonObject)
        res.render('illness/illness-start-date', {
          errorList: errorList,
          illnessStartDayErr: illnessStartDayErr,
          illnessStartDay: illnessStartDay,
          illnessStartMonth: illnessStartMonth,
          illnessStartYear: illnessStartYear,
          inputClasses: inputClasses
        })
      }
    } else {
      if (req.body.editId !== '') {
        illnessStartDate.day = illnessStartDay
        illnessStartDate.month = illnessStartMonth
        illnessStartDate.year = illnessStartYear
        req.session.appealReasons[editId].illnessStartDate = illnessStartDate
        res.redirect('/check-your-answers')
      } else {
        illnessStartDate.day = req.body['illnessStart-day']
        illnessStartDate.month = req.body['illnessStart-month']
        illnessStartDate.year = req.body['illnessStart-year']
        reasonObject.illnessStartDate = illnessStartDate
        reasonObject.nextStep = 'illness/continued-illness'
        req.session.appealReasons.push(reasonObject)
        res.redirect('/illness/illness-information')
      }
    }
  })
  router.get('/illness/continued-illness', function (req, res) {
    var id = 0
    var info = ''
    var reasonObject = {}

    reasonObject = req.session.appealReasons.pop()
    req.session.appealReasons.push(reasonObject)

    if (req.query.id) {
      id = req.query.id
      info = req.session.appealReasons[id].continuedIllness
      res.render('illness/continued-illness', {
        scenario: req.session.scenario,
        reason: reasonObject,
        id: id,
        info: info
      })
    } else {
      res.render('illness/continued-illness', {
        scenario: req.session.scenario,
        reason: reasonObject
      })
    }
  })
  router.post('/illness/continued-illness', function (req, res) {
    var reasonObject = req.session.appealReasons.pop()
    reasonObject.continuedIllness = req.body.continuedIllness
    req.session.appealReasons.push(reasonObject)
    var continuedIllness = req.body.continuedIllness
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (typeof continuedIllness === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must tell us if this is a continued illness'
      Err.href = '#continued-illness-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      reasonObject = req.session.appealReasons[req.session.appealReasons.length - 1]
      res.render('illness/continued-illness', {
        errorList: errorList,
        Err: Err,
        scenario: req.session.scenario,
        reason: reasonObject
      })
    } else {
      switch (req.body.continuedIllness) {
        case 'yes':
          if (req.body.editId !== '') {
            req.session.appealReasons[editId].continuedIllness = continuedIllness
            res.redirect('/check-your-answers')
          } else {
            req.session.appealReasons.pop()
            reasonObject.continuedIllness = req.body.continuedIllness
            reasonObject.nextStep = 'illness/illness-information'
            req.session.appealReasons.push(reasonObject)
            res.redirect('/illness/illness-information')
          }
          break
        case 'no':
          if (req.body.editId !== '') {
            req.session.appealReasons[editId].continuedIllness = continuedIllness
            res.redirect('/illness/illness-end-date')
          } else {
            reasonObject = req.session.appealReasons.pop()
            reasonObject.continuedIllness = req.body.continuedIllness
            reasonObject.nextStep = 'illness/illness-end-date'
            req.session.appealReasons.push(reasonObject)
            res.redirect('/illness/illness-end-date')
            break
          }
      }
    }
  })
  router.get('/illness/illness-end-date', function (req, res) {
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
      info = req.session.appealReasons[id].illnessEndDate
      res.render('illness/illness-end-date', {
        inputClasses: inputClasses,
        scenario: req.session.scenario,
        reason: currentReason,
        id: id,
        info: info
      })
    } else {
      res.render('illness/illness-end-date', {
        inputClasses: inputClasses,
        reason: currentReason
      })
    }
  })
  router.post('/illness/illness-end-date', function (req, res) {
    var editId = req.body.editId
    var reasonObject = {}
    var illnessEndDay = req.body['illnessEndDate-day']
    var illnessEndMonth = req.body['illnessEndDate-month']
    var illnessEndYear = req.body['illnessEndDate-year']
    var errorFlag = false
    var illnessEndDayErr = {}
    var illnessEndMonthErr = {}
    var illnessEndYearErr = {}
    var errorList = []
    var illnessEndDate = {}
    var inputClasses = {}

    if (editId !== '') {
      reasonObject = req.session.appealReasons[editId]
    } else {
      reasonObject = req.session.appealReasons.pop()
    }

    inputClasses.day = 'govuk-input--width-2'
    inputClasses.month = 'govuk-input--width-2'
    inputClasses.year = 'govuk-input--width-4'

    if (illnessEndDay === '') {
      illnessEndDayErr.type = 'blank'
      illnessEndDayErr.text = 'You must enter a day'
      illnessEndDayErr.href = '#illness-end-date-day'
      illnessEndDayErr.flag = true
    }
    if (illnessEndDayErr.flag) {
      inputClasses.day = 'govuk-input--width-2 govuk-input--error'
      errorList.push(illnessEndDayErr)
      errorFlag = true
    }
    if (illnessEndMonth === '') {
      illnessEndMonthErr.type = 'blank'
      illnessEndMonthErr.text = 'You must enter a month'
      illnessEndMonthErr.href = '#illness-end-date-month'
      illnessEndMonthErr.flag = true
    }
    if (illnessEndMonthErr.flag) {
      inputClasses.month = 'govuk-input--width-2 govuk-input--error'
      errorList.push(illnessEndMonthErr)
      errorFlag = true
    }
    if (illnessEndYear === '') {
      illnessEndYearErr.type = 'blank'
      illnessEndYearErr.text = 'You must enter a year'
      illnessEndYearErr.href = '#illness-end-date-year'
      illnessEndYearErr.flag = true
    }
    if (illnessEndYearErr.flag) {
      inputClasses.year = 'govuk-input--width-4 govuk-input--error'
      errorList.push(illnessEndYearErr)
      errorFlag = true
    }
    if (errorFlag === true) {
      req.session.appealReasons.push(reasonObject)
      res.render('illness/illness-end-date', {
        errorList: errorList,
        illnessEndDayErr: illnessEndDayErr,
        illnessEndMonthErr: illnessEndMonthErr,
        illnessEndYearErr: illnessEndYearErr,
        illnessEndDay: illnessEndDay,
        illnessEndMonth: illnessEndMonth,
        illnessEndYear: illnessEndYear,
        inputClasses: inputClasses,
        reason: reasonObject,
        editId: editId
      })
    } else {
      if (req.body.editId !== '') {
        illnessEndDate.day = req.body['illnessEndDate-day']
        illnessEndDate.month = req.body['illnessEndDate-month']
        illnessEndDate.year = req.body['illnessEndDate-year']
        req.session.appealReasons[editId].illnessEndDate = illnessEndDate
        res.redirect('/check-your-answers')
      } else {
        req.session.appealReasons.pop()
        illnessEndDate.day = req.body['illnessEndDate-day']
        illnessEndDate.month = req.body['illnessEndDate-month']
        illnessEndDate.year = req.body['illnessEndDate-year']
        reasonObject.illnessEndDate = illnessEndDate
        reasonObject.nextStep = 'illness/illness-information'
        req.session.appealReasons.push(reasonObject)
        res.redirect('/illness/illness-information')
      }
    }
  })
  router.get('/illness-pre-information', function (req, res) {
    res.render('illness-pre-information')
  })
  router.post('/illness/illness-pre-information', function (req, res) {
    var provideDetail = req.body.provideDetail
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (typeof provideDetail === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must tell us if you want to provide more information'
      Err.href = '#provide-detail-1'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('illness/illness-pre-information', {
        errorList: errorList,
        Err: Err
      })
    } else {
      switch (req.body.provideDetail) {
        case 'yes':
          res.redirect('/illness/illness-information')
          break
        case 'no':
          res.redirect('/evidence')
          break
      }
    }
  })
  router.get('/illness/illness-information', function (req, res) {
    var id = 0
    var info = ''
    var reasonObject = {}

    reasonObject = req.session.appealReasons.pop()
    req.session.appealReasons.push(reasonObject)

    if (req.query.id) {
      id = req.query.id
      info = req.session.appealReasons[id].illnessInformation
      res.render('illness/illness-information', {
        id: id,
        info: info,
        scenario: req.session.scenario,
        reason: reasonObject
      })
    } else {
      res.render('illness/illness-information')
    }
  })
  router.post('/illness/illness-information', function (req, res) {
    var illnessInformation = req.body.illnessInformation
    var userName = req.body.userName
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []

    if (illnessInformation === '') {
      Err.type = 'blank'
      Err.text = 'You must tell us how this affected your ability to file on time'
      Err.href = '#illness-information'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('illness/illness-information', {
        errorList: errorList,
        Err: Err
      })
    } else {
      if (req.body.editId !== '') {
        req.session.appealReasons[editId].illnessInformation = illnessInformation
        req.session.appealReasons[editId].userName = userName
        res.redirect('/check-your-answers')
      } else {
        var reasonObject = req.session.appealReasons.pop()
        reasonObject.illnessInformation = req.body.illnessInformation
        reasonObject.userName = req.body.userName
        reasonObject.nextStep = 'evidence'
        req.session.appealReasons.push(reasonObject)
        res.redirect('/evidence')
      }
    }
  })
}
