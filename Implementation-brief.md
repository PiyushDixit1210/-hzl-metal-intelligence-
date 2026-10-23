# HZL Metal Intelligence — implementation brief

Scope: supplied meeting transcript excerpt and earlier requirements summary. The excerpt skips 2:21–15:14. No production dataset supplied. Existing operating records are synthetic; uploaded aggregate ML history is unverified.

## Decisions
- Monthly order-book forecast: next 3 months and next calendar quarter, by metal/customer.
- Predictive imports and shipments bridging approximately one-month Korea/Japan trade reporting lag.
- Customer demand and weighted HZL share of wallet.
- Quarterly auction starting premium informed by import parity and comparable market intelligence.
- Domestic/export allocation and country market screening.

## Sources
ERP/CRM/orders, customer demand, auction bids/clears, LME, FX, depot/freight, licensed cargo/AIS/carrier feeds, Korea/Japan trade, ILZSG, Fastmarkets and Wood Mackenzie. Confirm rights, cadence and limits. The private transcript review records meeting-reported legacy-vendor details; the public app records the replacement-source action without publishing an unverified named-vendor claim.

## Data model
customer_demand(customer_id, metal, grade, month, total_tonnes, hzl_tonnes, known_at)
orders(order_id, customer_id, metal, grade, delivery_month, booked_tonnes, status, known_at)
shipments(shipment_id, metal, hs_code, origin, destination, tonnes, eta, event_at, known_at, provider)
prices(metal, grade, location, incoterm, date, lme_usd_t, premium_usd_t, fx, freight, depot, known_at)
auctions(auction_id, date, grade, depot, volume_t, starting_premium, clearing_premium, currency, terms)
country_balance(country, metal, product_form, period, production, consumption, imports, exports, stock_change, published_at)
forecasts(model_version, cutoff_at, target_month, customer_id, metal, point_tonnes, lower, upper, interval_level)

## Modeling
Start with customer run-rate and seasonal-naive baselines. Use lagged orders, imports, ETAs, sector indicators, metal prices, premiums, forex, route costs and geopolitical events available at prediction time. Rolling-origin backtests at 1, 2 and 3 months; WAPE, bias and calibrated interval coverage. The requested above-90% target must be defined with the client; no guarantee is made.

## Pricing
Validate import-parity formula and duty/tax base with HZL. Normalize global-player prices by grade, date, location, volume, delivery terms and credit. Avoid double-counting freight. Human-reviewed auction starting premium, not automatic clearing-price replacement.

## Architecture
Licensed batch/stream connectors -> immutable source landing -> validation and entity resolution -> governed warehouse -> feature pipeline -> forecast services -> authenticated API -> integrated dashboard. Add SSO, scoped roles, encryption, audit logs, data freshness monitoring, model drift alerts, persistent storage and scheduled ingestion. Browser-only prototype storage is not production infrastructure.

## Delivery
1. Confirm requirements, vendor history, commercial formula, source access and data contracts.
2. Ingest history and reconcile orders, customers, auctions and metal movement.
3. Pilot forecast and premium workbench; validate vs baselines on held-out months.
4. Add predictive shipments, country screening and constrained allocation.
5. Controlled production rollout with monitoring.

## Partner pathway
Select in-house or third-party delivery. Share customer data only after the relevant commercial onboarding and PO arrangements and approved secure access scope. The prototype transfers no data.

## Working ML pilot

The ML lab accepts at least 36 consecutive closed monthly aggregate snapshots for each included metal. Required CSV columns are `month,metal,order_tonnes,premium_usd_t,imports_tonnes,lme_usd_t,fx_inr_usd,sector_index,domestic_risk,global_risk,known_at`. Each feature row must reflect information available within that forecast-origin month. Delayed source data needs alignment to its publication month, not simply its reported period. Only closed months known by 23 October 2026 are accepted.

Separate standardized ridge models with fixed alpha 10 predict order tonnes and USD/t premium at horizons 1–6 for zinc and lead. Up to twelve chronological test origins per target/horizon are compared with the same month last year. Metrics include WAPE, bias, absolute premium error, direction and the proposed ±10% point-error tolerance. This tolerance is not an agreed interpretation of above-90% confidence. No calibrated intervals or production approval are claimed.

Training history and models stay in browser memory. Refresh clears the model. The synthetic demonstration is not HZL performance; uploaded data is unverified. Matching forecast months can feed the overview and demand view. Customer wallet, capacity and shipments remain separate sample inputs. Model cards expose weights, features and evaluation records.

Market signals & peers provides explicit manual domestic/global crisis assumptions, volume/premium/timing sensitivity and normalized synthetic zinc offers. These are neither causal event predictions nor actual competitor quotes. Production needs real licensed evidence, backend prediction services, role-based access, original publication/revision snapshots, model monitoring, calibrated intervals, shipment models and constrained allocation optimization.
