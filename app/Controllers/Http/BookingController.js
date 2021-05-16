'use strict'

const Booking = use('App/Models/Booking')
const Database = use('Database')
const Document = use('App/Models/Document')
const Material = use('App/Models/Material')
const { validate } = use('Validator')
const moment = require('moment')

/**
 * Resourceful controller for interacting with bookings
 */
class BookingController {
  /**
   * Show a list of all bookings.
   * GET bookings
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async index ({ response }) {
      const material = await Material.query()
                              .whereIn('name', ['Ceker', 'Mie', 'Bihun', 'Sosis Ori'])
                              .fetch()
      response.json(material);
  }

  /**
   * Create/save a new booking.
   * POST bookings
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
      let error = 0
      let data = []
      let materials = []
      request = request.all()
      for (const item of request.data) {
        const validation = await validate(item, {
          material: 'required',
          qty: 'required|integer|min:1'
        })
        if (validation.fails()) {
          error = error + 1
          item['error'] = validation.messages()[0].message
        } else if (materials.includes(item['material'].id)) {
          item['error'] = 'material already exists'
          error = error + 1
        }
        data.push(item)
        materials.push(item['material'].id)
      }

      if (!error) {
          await this.storeBooking(request, auth)
          return response.json({message: 'CREATED'})
      }
      response.status(422).json(data)
  }

  async storeBooking(request, auth) {
    const trx = await Database.beginTransaction()
    try {
      const document = new Document
      document.reference_number = request.reference_number
      document.date = moment()
      document.branch_id = (await auth.getUser()).branch_id
      document.description = request.description
      document.status = 'booking'
      await document.save(trx)

      for (const item of request.data) {
        const material = await Material.findOrFail(item['material'].id)
        const booking = new Booking
        booking.material_id = material.id
        booking.name = material.name
        booking.price = material.price
        booking.category = material.category
        booking.qty = item['qty']
        booking.document_id = document.id
        await booking.save(trx)
      }
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Display a single booking.
   * GET bookings/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show ({ params, response}) {
      const document = await Document
                                    .query()
                                    .with('branch')
                                    .with('booking.material')
                                    .where('id', params.id)
                                    .first()
      response.json(document)
  }

  /**
   * Update booking details.
   * PUT or PATCH bookings/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    let error = 0
    let data = []
    request = request.all()
    for (const item of request.data) {
      const max = (await Booking.findOrFail(item['id'])).qty
      const validation = await validate(item, {
        qty: 'required|integer|min:1|max:' + max
      })
      if (validation.fails()) {
        error = error + 1
        item['error'] = validation.messages()[0].message
      }
      data.push(item)
    }

    if (!error) {
      this.updateBooking(request, params.id)
      return response.json({message: 'UPDATED'})
    }
    response.status(422).json(data)

  }

  async updateBooking(request, id) {
    const trx = await Database.beginTransaction()
    try {
      let spending = 0
      for (const item of request.data) {
        const booking = await Booking.findOrFail(item['id'])
        booking.qty = item['qty']
        await booking.save(trx)
        spending = spending + booking.qty * booking.price
      }
      const document = await Document.findOrFail(id)
      document.status = 'received'
      document.spending = spending
      await document.save(trx)
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Delete a booking with id.
   * DELETE bookings/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    await Booking
                .findOrFail(params.id)
                .destroy()
    response.json({message: 'DELETED'})
  }
}

module.exports = BookingController
