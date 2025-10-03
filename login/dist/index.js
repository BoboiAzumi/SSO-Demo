"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const jwt_1 = require("hono/jwt");
const node_server_1 = require("@hono/node-server");
const app = new hono_1.Hono();
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
        const token = await (0, jwt_1.sign)({ user_id: username }, SECRET);
        c.header("Set-Cookie", `token=${token}; Domain=.azumidev.web.id; Path=/; HttpOnly; SameSite=None; Secure`);
        return c.redirect(`https://${callback}`);
    }
    return c.text("Login gagal", 401);
});
app.get("/signout", (c) => {
    const callback = c.req.query("callback") || "https://a.azumidev.web.id";
    c.header("Set-Cookie", `token=; Domain=.azumidev.web.id; Path=/; HttpOnly; Max-Age=0;`);
    return c.redirect(`https://${callback}`);
});
(0, node_server_1.serve)({
    fetch: app.fetch,
    port: 3000
});
//# sourceMappingURL=index.js.map