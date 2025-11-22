/**
 * MSW Browser Setup
 * 
 * Initializes Mock Service Worker for browser environment
 * This is used during development to intercept API calls
 */

// @ts-ignore - MSW types may not be installed
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * Create MSW worker with all handlers
 * This will intercept all matching API calls in the browser
 */
export const worker = setupWorker(...handlers);

