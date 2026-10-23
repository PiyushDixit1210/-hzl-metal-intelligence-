# Operating architecture

## Decision workflow

Executive overview → monthly demand → shipment evidence → landed pricing → account coverage → domestic/export allocation → market scenarios → forecast performance → data health.

## Forecast contract

Required CSV columns: `month,metal,order_tonnes,premium_usd_t,imports_tonnes,lme_usd_t,fx_inr_usd,sector_index,domestic_risk,global_risk,known_at`. At least 36 consecutive closed months per metal; align delayed releases to availability month. Planning reference: 23 October 2026. Models use lags, seasonality and origin-time predictors. Separate standardized ridge regressions with fixed alpha 10 are evaluated on chronological origins against the same month last year. Calibrated intervals are not implemented.

## Operational activation

Use authenticated ingestion services, immutable publication snapshots, data validation, a governed warehouse, scheduled model jobs, a model registry and authenticated prediction APIs. Apply SSO, scoped roles, encryption, audit logs, freshness alerts, drift detection and human approval for model release. Enable a backend-only content-policy connection allowlist when deploying authenticated APIs. Keep secrets outside the static bundle.

Orders, accounts, cargo and country balances are currently illustrative. No live connection or source entitlement is implied. Shipment prediction needs cargo identification, carrier milestones and reconciliation; aggregate order models do not supply it. Domestic/export allocation is a manual capacity plan, not a constrained optimizer. Comparable offers must share grade, delivery, date, location and credit terms. Import parity excludes recoverable taxes and avoids duplicate freight. Auction starting premium remains a decision input.

Production acceptance requires approved data, historical baseline comparison, volume-error tolerances, premium-error tolerances, calibrated interval coverage where required, operational monitoring and a controlled release. Frontend hardening alone does not establish a production forecasting service.
