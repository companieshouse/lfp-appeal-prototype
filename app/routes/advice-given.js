 
module.exports = function (router) {

  router.post('/advice-given/choose-contact-type', function (req, res) {
    var contactType = req.body.contactType
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []


    if (typeof contactType === 'undefined') {
      Err.type = 'blank'
      Err.text = 'You must select how you contacted us'
      Err.href = '#contactType'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('advice-given/choose-contact-type', {
        errorList: errorList,
        Err: Err })
    } else {
        res.redirect('/advice-given/contact-information')
    }
  })

router.post('/advice-given/contact-information', function (req, res) {
    var contactInformation = req.body.contactInformation
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []


    if (contactInformation === '') {
      Err.type = 'blank'
      Err.text = 'You must provide us with detials of who you contacted'
      Err.href = '#contactInformation'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('advice-given/contact-information', {
        errorList: errorList,
        Err: Err })
    } else {
        res.redirect('/advice-given/date-advice-given')
    }
  })

router.post('/advice-given/contact-information', function (req, res) {
    var contactInformation = req.body.contactInformation
    var editId = req.body.editId
    var errorFlag = false
    var Err = {}
    var errorList = []


    if (contactInformation === '') {
      Err.type = 'blank'
      Err.text = 'You must provide us with detials of who you contacted'
      Err.href = '#contactInformation'
      Err.flag = true
    }
    if (Err.flag) {
      errorList.push(Err)
      errorFlag = true
    }
    if (errorFlag === true) {
      res.render('advice-given/contact-information', {
        errorList: errorList,
        Err: Err })
    } else {
        res.redirect('/advice-given/date-advice-given')
    }
  })



// Currently missing value checks not working.
router.post('/advice-given/date-advice-given', function (req, res) {
    var editId = req.body.editId
    var reasonObject = {}
    var dateAdviceGivenDay = req.body['advice-given-date-day']
    var dateAdviceGivenMonth = req.body['advice-given-date-month']
    var dateAdviceGivenYear = req.body['advice-given-date-year']
    var errorFlag = false
    var dateAdviceGivenDayErr = {}
    var dateAdviceGivenMonthErr = {}
    var dateAdviceGivenYearErr = {}
    var errorList = []
    var dateAdviceGiven = {}
    var inputClasses = {}

    inputClasses.day = 'govuk-input--width-2'
    inputClasses.month = 'govuk-input--width-2'
    inputClasses.year = 'govuk-input--width-4'

    if (dateAdviceGivenDay == '') {
      dateAdviceGivenDayErr.type = 'blank'
      dateAdviceGivenDayErr.text = 'You must enter a day'
      dateAdviceGivenDayErr.href = '#advice-given-date-day'
      dateAdviceGivenDayErr.flag = true
    }
    if (dateAdviceGivenDayErr.flag) {
      inputClasses.day = 'govuk-input--width-2 govuk-input--error'
      errorList.push(dateAdviceGivenDayErr)
      errorFlag = true
    }
    if (dateAdviceGivenMonth == '') {
      dateAdviceGivenMonthErr.type = 'blank'
      dateAdviceGivenMonthErr.text = 'You must enter a month'
      dateAdviceGivenMonthErr.href = '#advice-given-date-month'
      dateAdviceGivenMonthErr.flag = true
    }
    if (dateAdviceGivenMonthErr.flag) {
      inputClasses.month = 'govuk-input--width-2 govuk-input--error'
      errorList.push(dateAdviceGivenMonthErr)
      errorFlag = true
    }
    if (dateAdviceGivenYear == '') {
      dateAdviceGivenYearErr.type = 'blank'
      dateAdviceGivenYearErr.text = 'You must enter a year'
      dateAdviceGivenYearErr.href = '#advice-given-date-year'
      dateAdviceGivenYearErr.flag = true
    }
    if (dateAdviceGivenYearErr.flag) {
      inputClasses.year = 'govuk-input--width-4 govuk-input--error'
      errorList.push(dateAdviceGivenYearErr)
      errorFlag = true
    }
    if (errorFlag == true) {
      res.render('advice-given/date-advice-given', {
        errorList: errorList,
        dateAdviceGivenDayErr: dateAdviceGivenDayErr,
        dateAdviceGivenDay: dateAdviceGivenDay,
        dateAdviceGivenMonth: dateAdviceGivenMonth,
        dateAdviceGivenYear: dateAdviceGivenYear,
        inputClasses: inputClasses,
        reason: reasonObject,
        editId: editId
      })
    } else {
        reasonObject.dateAdviceGiven = dateAdviceGiven
        reasonObject.nextStep = 'advice-given/service-information'
        res.redirect('/advice-given/service-information')
    }
  })


}
