import { defineHandler } from 'nitro';

/**
 * Single-page fallback.
 *
 * The application is one document with in-page navigation, so there is only
 * ever one HTML file. Anything that is not a static asset is sent to the
 * root rather than 404ing, so a stale deep link still lands on the app.
 */
export default defineHandler((event) => {
  const url = new URL(event.req.url);
  const target = url.pathname === '/' ? '/' : `/${url.search}`;

  return new Response(null, {
    status: 302,
    headers: { location: target },
  });
});
