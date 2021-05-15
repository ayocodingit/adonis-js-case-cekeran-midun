'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DocumentSchema extends Schema {
  up () {
    this.create('documents', (table) => {
      table.bigIncrements('id')
      table.string('reference_number').notNullable().unique()
      table.date('date')
      table.string('description')
      table.bigInteger('spending')
      table.bigInteger('sell')
      table.bigInteger('advantage')
      table.bigInteger('percentage')
      table.string('status').notNullable()
      table.bigInteger('branch_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('documents')
  }
}

module.exports = DocumentSchema
