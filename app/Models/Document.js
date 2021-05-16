'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Document extends Model {

   branch() {
     return this.belongsTo('App/Models/Branch')
   }

   booking() {
     return this.hasMany('App/Models/Booking')
   }

   sale() {
     return this.hasOne('App/Models/Sale')
   }
}

module.exports = Document
