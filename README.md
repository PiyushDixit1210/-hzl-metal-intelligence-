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

## Investment and finance

Four views cover capital projects, procurement and hedging, portfolios and company attributes, and global market trends. Annual project cash flows include initial capex and working capital, straight-line depreciation, cash taxes, maintenance capex, working-capital changes and final recovery. NPV, conventional IRR, simple/discounted payback and scenarios are shown in INR crore. Hedge calculations separately model physical buyer/producer cash flow, long/short financial P&L, fees, initial margin and its financing. Portfolio imports calculate price-only unrealized returns and supported valuation ratios. Cost is translated at current supplied FX, so this is not an historical FX-inclusive total return.

The global reference snapshot is derived from the World Bank Commodity Price Data (The Pink Sheet), October 2026 workbook: six series, September 2024–September 2026. Prices are monthly averages, not live quotes. Source, provider metadata, file hash, timing and transformations are retained in `market-data.js`; attribution and links are in the dashboard. Source: https://www.worldbank.org/en/research/commodity-markets . Data terms: https://data.worldbank.org/summary-terms-of-use . No World Bank endorsement is implied.

No direct Bloomberg connection or entitlement is included. Bloomberg Data License supports enterprise delivery, but a production connection requires service credentials and authorized use/display rights. Approved exports from Bloomberg or other vendors can be normalized to the market CSV schema. No proprietary market values or real holdings are committed to this public repository. Portfolio and market imports are local to browser session memory; imported data is labelled unverified. Refresh clears it. No trades are executed and no investment recommendations are generated.
