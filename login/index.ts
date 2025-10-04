import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { serve } from '@hono/node-server'

const app = new Hono()
const SECRET = process.env.SSO_SECRET || 'mysecret'

// Helper untuk tampilan
function renderPage(content: string) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>SSO Login</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-family: 'Poppins', sans-serif;
        background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
      }
      .card {
        background: white;
        padding: 2rem 3rem;
        border-radius: 16px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        text-align: center;
        width: 320px;
        animation: fadeIn 0.6s ease;
      }
      h2 {
        margin-bottom: 1rem;
        color: #ff6f00;
      }
      input {
        width: 100%;
        padding: 0.6rem;
        margin: 0.4rem 0;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 14px;
      }
      button {
        margin-top: 1rem;
        width: 100%;
        padding: 0.7rem;
        background: #ff6f00;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 15px;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.3s ease;
      }
      button:hover {
        background: #e65100;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
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

// GET login form
app.get('/signin', (c) => {
  const callback = c.req.query('callback') || 'a.azumidev.web.id'
  return c.html(renderPage(`
    <h2>Login</h2>
    <form method="post" action="/signin?callback=${callback}">
      <input type="text" name="username" placeholder="Username" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
    </form>
  `))
})

// POST login
app.post('/signin', async (c) => {
  const body = await c.req.parseBody()
  const { username, password } = body as Record<string, string>
  const callback = c.req.query('callback') || 'a.azumidev.web.id'

  if (username === 'admin' && password === '123') {
    const token = await sign({ user_id: username }, SECRET)
    c.header(
      'Set-Cookie',
      `token=${token}; Domain=.azumidev.web.id; Path=/; HttpOnly; SameSite=None; Secure`
    )
    return c.redirect(`https://${callback}`)
  }

  return c.html(renderPage(`<h2>Login gagal</h2><p>Username atau password salah</p>`))
})

// Signout
app.get('/signout', (c) => {
  const callback = c.req.query('callback') || 'a.azumidev.web.id'
  c.header('Set-Cookie', `token=; Domain=.azumidev.web.id; Path=/; HttpOnly; Max-Age=0;`)
  return c.redirect(`https://${callback}`)
})

export default app

serve({
    fetch: app.fetch,
    port: 3000
})