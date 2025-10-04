const express = require('express')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const app = express()
const SECRET = process.env.SSO_SECRET || 'mysecret'

app.use(cookieParser())

function renderPage(content) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>SSO Express Service</title>
    <style>
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #1a1a1a;
        color: #f5f5f5;
      }
      .card {
        background: #2a2a2a;
        padding: 2rem 3rem;
        border-radius: 14px;
        box-shadow: 0 6px 15px rgba(0,0,0,0.4);
        text-align: center;
        max-width: 350px;
      }
      .btn {
        display: inline-block;
        margin-top: 1.2rem;
        padding: 0.6rem 1.2rem;
        background: #28a745;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        transition: background 0.3s ease;
      }
      .btn:hover {
        background: #218838;
      }
      h2 {
        margin-top: 0;
      }
    </style>
  </head>
  <body>
    <div class="card">
      ${content}
    </div>
  </body>
  </html>
  `
}

app.get('/', (req, res) => {
  const token = req.cookies.token
  if (!token) {
    return res.send(renderPage(`
      <h2>Anda belum login</h2>
      <a href="https://login.azumidev.web.id/signin?callback=a.azumidev.web.id" class="btn">Login</a>
    `))
  }

  try {
    const decoded = jwt.verify(token, SECRET)
    res.send(renderPage(`
      <h2>Halo, ${decoded.user_id}</h2>
      <p>Selamat datang di Service A</p>
      <a href="https://login.azumidev.web.id/signout?callback=a.azumidev.web.id" class="btn">Logout</a>
    `))
  } catch (err) {
    res.send(renderPage(`
      <h2>Token tidak valid</h2>
      <a href="https://login.azumidev.web.id/signin?callback=a.azumidev.web.id" class="btn">Login ulang</a>
    `))
  }
})

app.listen(3000, () => console.log('A service running on port 3000'))
