'use strict'

const Material = use('App/Models/Material')
const Branch = use('App/Models/Branch')
const Document = use('App/Models/Document')
const moment = require('moment')

class ListController {

  async material({ response }) {
    response.json(await Material.all())
  }

  async branch({ response }) {
    response.json(await Branch.all())
  }

  async document({ response, auth }) {
    const user = await auth.getUser()
    const document = Document.query().with(['branch'])
    let data
    if (user.role === 'branch') {
      data = await document.where('branch_id', user.branch_id)
                      .with(['booking', 'sale'])
                      .where('date', moment().format('Y-M-D'))
                      .first()
    } else if (user.role === 'ceo') {
      data = await document.where('status', 'closed')
                      .fetch()
    } else {
      data = await document.where('date', moment().format('Y-M-D'))
                      .fetch()
    }
    response.json(data)
  }

}

module.exports = ListController
