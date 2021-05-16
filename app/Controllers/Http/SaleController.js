'use strict'

const { validate } = use('Validator')
const Document = use('App/Models/Document')
const Sale = use('App/Models/Sale')
const Database = use('Database')


class SaleController {

  async update({ request, response, params }) {
      request = request.all()
      const validation = await validate(request, {
        'gross_income': 'required|integer',
        'tax': 'required',
        'net_income': 'required|integer',
      })
      if (validation.fails()) {
        return response.json(validation.messages())
      }
      await this.updateSale(request, params.id)
      response.json({ message: 'UPDATED' })
  }

  async updateSale(request, id) {
    const trx = await Database.beginTransaction()
    try {
       const document = await Document
                                    .query()
                                    .with('booking')
                                    .with('sale')
                                    .where('id', id)
                                    .first()
       let sale
       request.tax = parseInt(request.tax.replace('%', ''))
       request.document_id = document.id
       if (document.toJSON().sale != null) {
          sale = await document.sale().first()
          sale.fill(request)
          await sale.save(trx)
       } else {
          sale = await Sale.create(request, trx)
       }
       const sell = sale.net_income
       console.log(document);
       await document.findOrFail(id).update({
          sell: sell,
          status: 'closed',
          advantage: sell - document.spending,
          percentage: (sell - document.spending) * 100
       }, trx)
       await trx.commit()
    } catch (error) {
      await trx.rollback()
      console.log(error);
      throw error
    }
  }
}

module.exports = SaleController
