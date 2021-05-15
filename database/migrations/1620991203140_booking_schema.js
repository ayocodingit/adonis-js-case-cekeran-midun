'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BookingSchema extends Schema {
  up () {
    this.create('bookings', (table) => {
      table.bigIncrements('id')
      table.string('name').notNullable()
      table.integer('price').notNullable()
      table.integer('qty').notNullable()
      table.string('unit')
      table.string('category')
      table.bigInteger('document_id').notNullable()
      table.bigInteger('material_id').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('bookings')
  }
}

module.exports = BookingSchema
