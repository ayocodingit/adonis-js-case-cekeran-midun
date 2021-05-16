'use strict'

/*
|--------------------------------------------------------------------------
| BranchSeeder
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
const Branch = use('App/Models/Branch')

class BranchSeeder {
  async run() {
    fs.createReadStream('database/seeds/csv/branch.csv')
      .pipe(csv())
      .on('data', async (row) => {
        row.id = parseInt(row.id)
        await Branch.create(row)
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
      });
  }
}

module.exports = BranchSeeder
