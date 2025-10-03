const express = require('express')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const app = express()
const SECRET = process.env.SSO_SECRET || 'mysecret'

app.use(cookieParser())

app.get('/', (req, res) => {
  const token = req.cookies.token
  if (!token) {
    return res.send(`
      <p>anda belum login</p>
      <a href="https://login.azumidev.web.id/signin?callback=a.azumidev.web.id">Login</a>
    `)
  }

  try {
    const decoded = jwt.verify(token, SECRET)
    res.send(`
      <p>Sudah login sebagai ${decoded.user_id}</p>
      <a href="https://login.azumidev.web.id/signout?callback=a.azumidev.web.id">Logout</a>
    `)
  } catch (err) {
    res.send(`
      <p>Token tidak valid</p>
      <a href="https://login.azumidev.web.id/signin?callback=a.azumidev.web.id">Login ulang</a>
    `)
  }
})

app.listen(3000, () => console.log('A service running on port 3000'))
