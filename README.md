# HZL Metal Intelligence

Interactive application and browser ML pilot built from the supplied requirements and reviewed transcript excerpt. Open `dist/index.html` or serve `dist` with any static web server. No build or dependencies required. Live integrations, production validation and customer-data transfer are not included.

## Included

Nine integrated views: overview; monthly order-book scenarios and learned forecasts; import/shipment radar; import-parity and auction premium workbench; editable customer demand and share of wallet; country screening and allocation; market-event scenarios and normalized sample peer offers; ML training and validation; sources, requirement coverage and phased implementation.

Select zinc/lead and rolling three-month/next-quarter horizons. Change scenario inputs, edit or add sample customers, adjust pricing and allocation, export the selected view, or download the implementation brief. Browser changes persist in local storage. Reset from Data & implementation.

## Evidence and limitations

Evidence includes the user's earlier summary and a supplied transcript excerpt that omits the middle of the meeting. Existing operating records remain synthetic. The ML lab fits actual ridge coefficients to a synthetic example or an authorized uploaded aggregate CSV; synthetic results are not HZL performance and uploaded results remain unverified. Above-90% confidence needs an agreed definition and independent validation. Scenario sensitivity bands are not confidence intervals; the ML pilot has no calibrated intervals. Source timing and licenses need verification. Private transcript details and unverified claims about a named legacy vendor are not published in this repository.

## ML pilot

Open **ML lab & validation**, train the explicitly synthetic demonstration or download the CSV contract/example, then upload approved aggregate monthly history. At least 36 consecutive closed months per metal are required. History is held in browser memory only. Separate ridge models predict demand and premium at horizons 1–6; up to twelve rolling-origin tests per horizon are compared with the same month last year. Alpha is fixed at 10 and normalization is fitted within each training fold. Select **Use in selected dashboard horizon** to display matching learned forecasts. Refresh clears the model. No interval calibration, production acceptance or shipment-arrival model is claimed.

Forecast inputs, algorithm, validation, limitations and fitted coefficients are inspectable through the model-card download. `ml-engine.js` is independent of the UI; `intelligence.js` integrates the pilot and event/peer workspaces. Customer wallet, shipments and capacity remain separate sample inputs.

## Production requirements

Connect licensed trade, shipment, market and customer sources; implement authenticated APIs, server-side persistence, customer access controls and auditing. Establish historical snapshots, reproducible forecasting/backtests and calibrated intervals before presenting predictive performance. Validate HZL pricing formulas, duties, Incoterms and freight treatment. Confirm commercial onboarding and relevant PO arrangements before third-party customer-data access.

See the in-app implementation brief for candidate schemas, model inputs and phased delivery.
