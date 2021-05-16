'use strict'

class HomeController {

  index({ response }) {
    response.json({app: 'Cekeran Midun Rest Api'})
  }


}

module.exports = HomeController
