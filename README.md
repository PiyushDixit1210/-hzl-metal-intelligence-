# HZL Metal Intelligence

Commercial planning workspace for demand, import arrivals, customer coverage, import-parity pricing and domestic/export allocation.

## Run

Serve `dist/` with a static HTTP server. No build, installation or external services are needed. The application uses system fonts and has no third-party browser dependencies. `executive.js` is the application entry point; `ml-engine.js` contains the forecasting engine.

## Operating modes

Default operating records are illustrative and visibly labelled. No live market feed, ERP or CRM connection is included. Monthly order scenarios compound an editable growth assumption. The forecast workspace can train separate ridge models for aggregate orders and premium, at horizons one through six, from synthetic examples or an approved monthly CSV. Model output can replace planning estimates only when the selected calendar months are covered.

History, fitted models and assumptions remain in browser-session memory. Refresh clears them. No account identifiers are needed for model training. The application does not transmit imported files or save them in local storage. Exported snapshots contain the selected settings and records.

## Verification and deployment

Train demonstration and imported models; reject malformed CSV, duplicate months and unavailable-at-origin predictors; compare chronological errors against seasonal baselines. Numeric synthetic results demonstrate model mechanics, not operating accuracy. No calibrated uncertainty intervals or accuracy guarantee is offered.

Vercel serves `dist/` and applies security headers, frame restrictions and a self-only content policy. Production publication follows the linked GitHub main branch. The static interface is ready for executive demonstrations; operational activation still requires authenticated APIs, licensed data feeds, persistent storage, source freshness controls and approved validation thresholds. Never place private datasets, credentials or market subscription keys in this public repository.
