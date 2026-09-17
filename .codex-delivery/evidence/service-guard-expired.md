# Service guard isolated expired-state verification

The exact guard source deployed at the Production SHA was evaluated against an isolated status response containing protocol version 1, registered guard version 1, enforcement enabled, a past expiry date, `available: false`, and `status: expired`. The availability function returned false and the outer proxy contract rewrites public routes to `/service-expired`; it does not redirect the whole site.

No expiry state was enabled for the real customer tenant.

Result: **PASS**
