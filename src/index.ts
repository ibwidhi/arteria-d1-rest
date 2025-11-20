/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// export default {
// 	async fetch(request, env, ctx): Promise<Response> {
// 		return new Response('Hello World!');
// 	},
// } satisfies ExportedHandler<Env>;

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
