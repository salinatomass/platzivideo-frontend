const passport = require('passport')
const { BasicStrategy } = require('passport-http')
const boom = require('@hapi/boom')
const axios = require('axios')

const { API_URL, API_KEY_TOKEN } = require('../../../config')

passport.use(
  new BasicStrategy(async (email, password, cb) => {
    try {
      const { data, status } = await axios({
        url: `${API_URL}/api/auth/sign-in`,
        method: 'post',
        auth: {
          username: email,
          password
        },
        data: {
          apiKeyToken: API_KEY_TOKEN
        }
      })

      if (!data || status !== 200) {
        return cb(boom.unauthorized(), false)
      }

      cb(null, data)
    } catch (err) {
      cb(err)
    }
  })
)
