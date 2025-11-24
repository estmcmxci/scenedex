# Full Vision Architecture

## Automated Curator Onboarding & Safe Deployment

### Current MVP (Phase 1)
- Manual setup: Curator registers `scenius.basetest.eth`, manually sets Safe as operator
- One-time script: `setup-operator.ts` authorizes Safe for curator's names
- Approval flow: Curator approves → Safe executes (Safe already authorized)

### Full Vision (Phase 2)
**Custom TLD Registration Flow:**
1. User registers curator name from custom TLD (e.g., `alice.curator`)
2. Registration transaction atomically:
   - Deploys Safe contract for that curator
   - Sets deployed Safe as operator of the registered name
   - Links curator name → Safe address
3. Result: Curator name fully configured with Safe in single transaction

**Approval Flow:**
- Curator approves release → Safe executes registration
- No manual operator setup needed (handled during registration)
- All operations (Split, Zora, Basename, Reverse Record) in one atomic Safe transaction

**Benefits:**
- Zero manual setup for curators
- Atomic onboarding (name + Safe + authorization in one tx)
- Seamless approval experience
- Scalable to unlimited curators

**Technical Requirements:**
- Custom TLD registrar contract
- Safe factory integration
- Operator authorization in registration logic
- Reverse record: Safe → curator name

