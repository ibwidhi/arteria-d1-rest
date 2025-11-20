import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Env = {
	DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>();
app.use('/api/*', cors());

app.get('/api/webhooks', async (c) => {
	const { results } = await c.env.DB.prepare('SELECT * FROM webhooks ORDER BY created_at DESC').all();
	return c.json(results);
});

app.post('/api/webhooks', async (c) => {
	const body = await c.req.json();
	const stringPayload = JSON.stringify(body);
	console.log('body ::: ', stringPayload);
	await c.env.DB.prepare('INSERT INTO webhooks (payload) VALUES (?)').bind(stringPayload).run();
	return c.json({ success: true });
});

export default app;
