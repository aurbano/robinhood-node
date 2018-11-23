import * as robinhood from '../../';

const username = 'robinhood-user'
const password = 'robinhood-pass'
const mfaCode  = '12345'

const onLoginSuccess  = () => {
  console.log('Login success, auth token is: ', api.auth_token)

  api.positions((err, res, body) => {
    if (err) {
      console.error('error fetching positions', err)
    } else if (res.statusCode !== 200) {
      console.log(`error fetching positions. received status code ${res.statusCode}`)
    } else {
      console.log('positions are: ', body)
    }
  })

  api.historicals(
	'APPL',
	'5minute',
	'day',
    (err, res, body) => {
      if (err) {
        console.error('error fetching historicals', err)
      } else if (res.statusCode !== 200) {
        console.log(`error fetching historicals. received status code ${res.statusCode}`)
      } else {
        console.log('historicals are: ', body)
      }
    }
  )
}

const api = robinhood({
  username,
  password
}, onLoginSuccess)
