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
      console.log(req.session.appealReasons)
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
      reasonObject.personalReason = req.body.personalReason
      if (req.body.personalReason === 'bereavement') {
        reasonObject.nextStep = '/personal/bereavement/relationship-to-company'
        req.session.appealReasons.push(reasonObject)
        res.redirect('/personal/bereavement/relationship-to-company')
      } else {
        reasonObject.nextStep = '/personal/issue-start-date'
        req.session.appealReasons.push(reasonObject)
        res.redirect('/personal/issue-start-date')
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
