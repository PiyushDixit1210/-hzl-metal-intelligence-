# Operating architecture

## Decision workflow

Executive overview → monthly demand → shipment evidence → landed pricing → account coverage → domestic/export allocation → market scenarios → forecast performance → data health.

## Forecast contract

Required CSV columns: `month,metal,order_tonnes,premium_usd_t,imports_tonnes,lme_usd_t,fx_inr_usd,sector_index,domestic_risk,global_risk,known_at`. At least 36 consecutive closed months per metal; align delayed releases to availability month. Planning reference: 23 October 2026. Models use lags, seasonality and origin-time predictors. Separate standardized ridge regressions with fixed alpha 10 are evaluated on chronological origins against the same month last year. Calibrated intervals are not implemented.

## Operational activation

Use authenticated ingestion services, immutable publication snapshots, data validation, a governed warehouse, scheduled model jobs, a model registry and authenticated prediction APIs. Apply SSO, scoped roles, encryption, audit logs, freshness alerts, drift detection and human approval for model release. Enable a backend-only content-policy connection allowlist when deploying authenticated APIs. Keep secrets outside the static bundle.

Orders, accounts, cargo and country balances are currently illustrative. No live connection or source entitlement is implied. Shipment prediction needs cargo identification, carrier milestones and reconciliation; aggregate order models do not supply it. Domestic/export allocation is a manual capacity plan, not a constrained optimizer. Comparable offers must share grade, delivery, date, location and credit terms. Import parity excludes recoverable taxes and avoids duplicate freight. Auction starting premium remains a decision input.

Production acceptance requires approved data, historical baseline comparison, volume-error tolerances, premium-error tolerances, calibrated interval coverage where required, operational monitoring and a controlled release. Frontend hardening alone does not establish a production forecasting service.

## Financial attributes and market context

Capital projects: capex, revenue, operating cost, maintenance capex, useful life, nominal growth/inflation and discount rate, taxes, working capital and after-tax terminal proceeds. Outputs: NPV, conventional annual IRR, cash/discounted payback, profitability index and annual cash-flow bridge. No debt financing, tax-loss carryforwards or maintenance-capex depreciation is modelled.

Hedging: physical buyer/producer exposure; quantity, entry/settlement prices, hedge percentage, premiums, FX, freight, depot, fees, initial margin, funding and tenor. Matched-price scenarios omit basis mismatch, contract-lot rounding, dynamic variation-margin financing, counterparty exposure and hedge accounting. They are not executable trading instructions.

Portfolio CSV: symbol, asset_class, currency, quantity, cost_price, market_price, fx_to_inr, quote_date, previous_price, previous_quote_date, source; optional EPS, book value, annual dividend, market capitalization, EBITDA, net debt and fundamentals date. All company-wide financial attributes use the quote currency and full currency units. No historical FX return, realized income or corporate-action adjustment is inferred.

Market CSV: series,date,value,unit,source,frequency,published_at. Frequency is Daily or Monthly. Monthly dates are calendar month ends; observation and publication dates must be valid and no later than the fixed planning reference, 23 October 2026. Series source, unit and frequency remain consistent. Uploaded rows are unverified and cannot establish vendor entitlements. Current Bloomberg service access is not configured. Retain entitlement checks and private authenticated storage before any licensed data is shared across users.
