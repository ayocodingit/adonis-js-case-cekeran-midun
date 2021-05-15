'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Booking extends Model {

  material() {
    return this.belongsTo('App/Models/Material')
  }
}

module.exports = Booking
