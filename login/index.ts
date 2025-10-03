import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { sign } from "hono/jwt";
import { serve } from '@hono/node-server'

const app = new Hono();

const SECRET = process.env.SSO_SECRET || "mysecret";

app.get("/signin", (c) => {
    const callback = c.req.query("callback") || "https://a.azumidev.web.id";
    return c.html(`
    <form method="post" action="/signin?callback=${callback}">
      <input type="text" name="username" placeholder="username" />
      <input type="password" name="password" placeholder="password" />
      <button type="submit">Login</button>
    </form>
  `);
});

app.post("/signin", async (c) => {
    const body = await c.req.parseBody();
    const { username, password } = body;
    const callback = c.req.query("callback") || "https://a.azumidev.web.id";

    if (username === "admin" && password === "123") {
        const token = await sign({ user_id: username }, SECRET);
        c.header(
            "Set-Cookie",
            `token=${token}; Domain=.azumidev.web.id; Path=/; HttpOnly; SameSite=None; Secure`
        );
        return c.redirect(`https://${callback}`);
    }
    return c.text("Login gagal", 401);
});

app.get("/signout", (c) => {
    const callback = c.req.query("callback") || "https://a.azumidev.web.id";
    c.header(
        "Set-Cookie",
        `token=; Domain=.azumidev.web.id; Path=/; HttpOnly; Max-Age=0;`
    );
    return c.redirect(`https://${callback}`);
});

serve({
    fetch: app.fetch,
    port: 3000
})