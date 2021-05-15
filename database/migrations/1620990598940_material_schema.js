'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MaterialSchema extends Schema {
  up () {
    this.create('materials', (table) => {
      table.bigIncrements('id')
      table.string('name').notNullable()
      table.integer('price').notNullable()
      table.string('unit')
      table.string('category')
      table.timestamps()
    })
  }

  down () {
    this.drop('materials')
  }
}

module.exports = MaterialSchema
