'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
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
const User = use('App/Models/User')

class UserSeeder {
  async run () {
    fs.createReadStream('database/seeds/csv/user.csv')
      .pipe(csv())
      .on('data', async (row) => {
        if (row.branch_id !== '') {
          row.branch_id = parseInt(row.branch_id)
        } else {
          row.branch_id = null
        }
        await User.create(row)
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
      });
  }
}

module.exports = UserSeeder
