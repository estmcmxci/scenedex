/**
 * MSW Handlers - Main Export
 *
 * Combines all API handlers for mock backend
 * Used by MSW to intercept and mock API calls
 *
 * DESIGN DECISION (Strategy #7): Handlers control store directly
 * - Each handler validates input with validation.ts
 * - Each handler updates store.ts directly
 * - Components are simpler (handlers encapsulate store logic)
 * - Easier to test (handler + store together)
 */

import { releasesHandlers } from './releases';
import { approvalsHandlers } from './approvals';

/**
 * All API handlers combined
 * Ready for MSW setupServer()
 */
export const handlers = [...releasesHandlers, ...approvalsHandlers];

export { releasesHandlers, approvalsHandlers };



