'use strict'

/*
|--------------------------------------------------------------------------
| MaterialSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const csv = require('csv-parser')
const fs = require('fs')
const Material = use('App/Models/Material')

class MaterialSeeder {
  async run () {
    fs.createReadStream('database/seeds/csv/material.csv')
      .pipe(csv())
      .on('data', async (row) => {
        if (row.category === '') {
          row.category = null
        }
        row.price = parseInt(row.price)
        await Material.create(row)
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
      });
  }
}

module.exports = MaterialSeeder
