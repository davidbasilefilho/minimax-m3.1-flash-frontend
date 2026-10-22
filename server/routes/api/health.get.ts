import { defineHandler } from 'nitro';

/**
 * A health endpoint.
 *
 * The product makes no server calls — every number on the page is static,
 * sourced data computed in the browser. This route exists only so the
 * deployment platform has something to ping.
 */
export default defineHandler(() => ({
  status: 'ok',
  app: 'signal',
  subject: 'MiniMax-M3.1-Flash',
}));
