module.exports = function (router) {
  router.get('/other/other-reason-entry', function (req, res) {
    res.render('other/other-reason-entry', {
      scenario: req.session.scenario
    })
  })
  router.get('/other/reason-other', function (req, res) {
    var id = 0
    var userName = ''
    var userRelationship = ''
    var otherReason = ''
    var otherInformation = ''
    if (req.query.id) {
      id = req.query.id
      userName = req.session.appealReasons[id].userName
      userRelationship = req.session.appealReasons[id].userRelationship
      otherReason = req.session.appealReasons[id].otherReason
      otherInformation = req.session.appealReasons[id].otherInformation
      res.render('other/reason-other', {
        id: id,
        userName: userName,
        userRelationship: userRelationship,
        otherReason: otherReason,
        otherInformation: otherInformation
      })
    } else {
      res.render('other/reason-other')
    }
  })
  router.post('/other/reason-other', function (req, res) {
    var otherInformation = req.body.otherInformation
    var userName  = req.body.userName
    var userRelationship = req.body.userRelationship
    var otherReason = req.body.otherReason
    var editId = req.body.editId
    var errTitle = {}
    var errDescription = {}
    var errorList = []

    if (userName === '') {
      errName.type = 'blank'
      errName.text = 'You must tell us your name'
      errName.href = '#user-name'
      errName.flag = true
      errorList.push(errName)
    }
    if (userRelationship === '') {
      errRelationship.type = 'blank'
      errRelationship.text = 'You must tell us your relationship to the company'
      errRelationship.href = '#user-relationship'
      errRelationship.flag = true
      errorList.push(errRelationship)
    }
    if (otherInformation === '') {
      errDescription.type = 'blank'
      errDescription.text = 'You must give us more information'
      errDescription.href = '#other-information'
      errDescription.flag = true
      errorList.push(errDescription)
    }

    if (otherReason === '') {
      errTitle.type = 'blank'
      errTitle.text = 'You must give your reason a title'
      errTitle.href = '#other-reason'
      errTitle.flag = true
      errorList.push(errTitle)
    }

    if (errorList.length > 0) {
      res.render('other/reason-other', {
        errorList: errorList,
        errTitle: errTitle,
        errDescription: errDescription,
        id: editId,
        otherReason: otherReason,
        otherInformation: otherInformation,
        userName: userName,
        userRelationship: userRelationship
      })
    } else {
      if (editId !== '') {
        req.session.appealReasons[editId].otherReason = req.body.otherReason
        req.session.appealReasons[editId].otherInformation = req.body.otherInformation
        req.session.appealReasons[editId].userName = req.body.userName
        req.session.appealReasons[editId].userRelationship = req.body.userRelationship
        res.redirect('/check-your-answers')
      } else {
        var reasonObject = req.session.appealReasons.pop()
        reasonObject.otherReason = req.body.otherReason
        reasonObject.otherInformation = req.body.otherInformation
        reasonObject.userName = req.body.userName
        reasonObject.userRelationship = req.body.userRelationship
        req.session.appealReasons.push(reasonObject)
        res.redirect('/evidence')
      }
    }
  })
}
