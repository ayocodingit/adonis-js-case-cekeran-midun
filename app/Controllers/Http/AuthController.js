'use strict'

const User = use('App/Models/User')
const Branch = use('App/Models/Branch')

class AuthController {

  async login({ request, response, auth  }) {
     const { email, password } = request.all()
     const token = await auth
                            .withRefreshToken()
                            .attempt(email, password)
     response.json(token)
  }

  async register({ request, response }) {
     const user = await User.create(request.all())
     response.json(user)
  }

  async logout({ response, auth }) {
      const apiToken = await auth.getAuthHeader()

      await auth
        .authenticator('jwt')
        .revokeTokens([apiToken])
      response.json({ message: 'LOGOUT ...' })
  }

  async profile({ response, auth }) {
    try {
      const user = await auth.getUser()
      user.branch = await Branch.find(user.branch_id)
      return user
    } catch (error) {
      response.json({error: 'Missing or invalid jwt token'})
    }
  }

}

module.exports = AuthController
