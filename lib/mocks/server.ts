/**
 * MSW Server Setup
 * 
 * Initializes Mock Service Worker for Node.js environment
 * This is used during development to intercept API calls
 */

// @ts-ignore - MSW types may not be installed in dev environment
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * Create MSW server with all handlers
 * This will intercept all matching API calls in development
 */
export const server = setupServer(...handlers);

