'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BranchSchema extends Schema {
  up () {
    this.create('branches', (table) => {
      table.bigIncrements('id')
      table.string('name').notNullable()
      table.string('code').notNullable()
      table.string('address').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('branches')
  }
}

module.exports = BranchSchema
