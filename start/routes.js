'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
    return { app: 'Cekeran midun' }
})

Route.group(() => {
  Route.post('login', 'AuthController.login')
  Route.post('register', 'AuthController.register')
  Route.post('logout', 'AuthController.logout').middleware('auth')
  Route.get('profile', 'AuthController.profile').middleware('auth')
}).prefix('api/auth')

Route.group(() => {
  Route.get('/', 'BookingController.index')
  Route.post('/', 'BookingController.store')
  Route.put('/:id', 'BookingController.update')
  Route.get('/:id', 'BookingController.show')
}).prefix('api/booking').middleware('auth')
