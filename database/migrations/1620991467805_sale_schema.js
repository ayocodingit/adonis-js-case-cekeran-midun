'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SaleSchema extends Schema {
  up () {
    this.create('sales', (table) => {
      table.bigIncrements('id')
      table.bigInteger('gross_income').notNullable()
      table.integer('tax').notNullable()
      table.bigInteger('net_income').notNullable()
      table.bigInteger('document_id').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('sales')
  }
}

module.exports = SaleSchema
