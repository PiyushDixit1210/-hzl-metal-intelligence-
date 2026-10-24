'use strict';
const HZL_EVENT_DATA = {
  "asOf": "2026-10-24",
  "windowStart": "2024-10-24",
  "classification": "Reviewed public historical cases",
  "cases": [
    {
      "id": "zinc-smelters",
      "title": "Asian zinc smelter constraints",
      "metals": [
        "Zinc"
      ],
      "period": "H1 2025",
      "eventEnd": "2025-06-30",
      "published": "2025-08-25",
      "source": "ILZSG, August 2025 preliminary release",
      "url": "https://www.ilzsg.org/wp-content/uploads/3.PRESS%20RELEASES/20250825_ILZSG%20Press%20Release%20August%202025.pdf",
      "page": "1",
      "fact": "ILZSG reported refined zinc output down 2.1% in H1 2025, with Japan closures and Korea’s Seokpo suspension among the factors.",
      "channel": "Refined supply and origin availability",
      "inputs": "Origin-specific refined-metal output, available export offers, shipment ETAs and inventories",
      "decision": "Verify Japan/Korea import offers before revising domestic coverage or the auction starting premium.",
      "limit": "A global production change is not an estimate of Indian imports or HZL orders. Provisional figures can be revised.",
      "preset": {
        "demandShock": 0,
        "priceShock": 0,
        "premiumShift": 15,
        "freightShift": 0,
        "fxShock": 0,
        "duty": 0,
        "deferral": 20,
        "delay": 7
      }
    },
    {
      "id": "australia-zinc",
      "title": "Australia zinc production recovery",
      "metals": [
        "Zinc"
      ],
      "period": "H1 2025",
      "eventEnd": "2025-06-30",
      "published": "2025-07-30",
      "source": "Glencore H1 2025 Production Report",
      "url": "https://www.glencore.com/.rest/api/v1/documents/static/80aa3906-26b0-40d5-8fb1-881442e89c39/GLEN_2025-H1%2BProductionReport.pdf",
      "page": "7 and 12",
      "fact": "McArthur River zinc in concentrates rose from 119.9 kt to 130.5 kt in H1 2025, about 9% year on year.",
      "channel": "Upstream mine supply recovery",
      "inputs": "Mine output, concentrate flows, smelter conversion, grade and destination-specific cargoes",
      "decision": "Test whether higher upstream supply becomes comparable refined imports before changing commercial assumptions.",
      "limit": "Concentrate output is not refined metal shipped to India. The source does not establish a change in HZL sales.",
      "preset": {
        "demandShock": 0,
        "priceShock": -3,
        "premiumShift": -5,
        "freightShift": 0,
        "fxShock": 0,
        "duty": 0,
        "deferral": 0,
        "delay": 0
      }
    },
    {
      "id": "lead-regional",
      "title": "Lead demand diverged by geography",
      "metals": [
        "Lead"
      ],
      "period": "H1 2025",
      "eventEnd": "2025-06-30",
      "published": "2025-08-25",
      "source": "ILZSG, August 2025 preliminary release",
      "url": "https://www.ilzsg.org/wp-content/uploads/3.PRESS%20RELEASES/20250825_ILZSG%20Press%20Release%20August%202025.pdf",
      "page": "1",
      "fact": "Global refined lead usage rose 2.3% in H1 2025, while India and Japan recorded lower usage than a year earlier.",
      "channel": "Regional demand divergence",
      "inputs": "Local battery orders, customer requirements, inventories and country usage releases",
      "decision": "Reconcile Indian customer demand instead of applying the global growth rate to HZL’s order book.",
      "limit": "Country usage is not an account forecast. Replacement and original-equipment battery demand need separate evidence.",
      "preset": {
        "demandShock": -5,
        "priceShock": 0,
        "premiumShift": 0,
        "freightShift": 0,
        "fxShock": 0,
        "duty": 0,
        "deferral": 0,
        "delay": 0
      }
    },
    {
      "id": "lead-inventory",
      "title": "Lead inventories and price pressure",
      "metals": [
        "Lead"
      ],
      "period": "Q1 2026",
      "eventEnd": "2026-03-31",
      "published": "2026-04-28",
      "source": "World Bank Commodity Markets Outlook, April 2026",
      "url": "https://documents1.worldbank.org/curated/en/099842304282633100/pdf/IDU-29bd7eb3-10b9-441a-89be-9732d149e669.pdf",
      "page": "37",
      "fact": "The World Bank reported lead prices down 2% quarter on quarter in Q1 2026, reflecting rising global inventories.",
      "channel": "Inventory and price context",
      "inputs": "Reported stocks, price dates, battery dispatches and customer stock cover",
      "decision": "Test inventory-led pricing pressure separately from the volume of confirmed battery orders.",
      "limit": "The reported price move does not determine physical premiums or imply an equal change in domestic demand.",
      "preset": {
        "demandShock": 0,
        "priceShock": -2,
        "premiumShift": -5,
        "freightShift": 0,
        "fxShock": 0,
        "duty": 0,
        "deferral": 0,
        "delay": 0
      }
    },
    {
      "id": "silver-tariffs",
      "title": "Tariff uncertainty and silver relocation",
      "metals": [
        "Silver"
      ],
      "period": "Late 2024–January 2025",
      "eventEnd": "2025-01-29",
      "published": "2025-01-29",
      "source": "Silver Institute, 29 January 2025",
      "url": "https://silverinstitute.org/global-silver-market-forecast-to-remain-in-a-sizeable-deficit-in-2025/",
      "page": "",
      "fact": "The Silver Institute linked anticipated US tariff policy to short covering and silver deliveries into CME warehouses from late 2024.",
      "channel": "Policy uncertainty and regional stocks",
      "inputs": "Warehouse location, forward basis, lease rates, effective trade measures and delivery terms",
      "decision": "Check regional availability and delivery basis before interpreting exchange inventories as global demand.",
      "limit": "Anticipated policy is not an enacted duty. No India-specific tariff or price effect is established here.",
      "preset": {
        "demandShock": 0,
        "priceShock": 5,
        "premiumShift": 2,
        "freightShift": 0,
        "fxShock": 0,
        "duty": 0,
        "deferral": 10,
        "delay": 7
      }
    },
    {
      "id": "silver-squeeze",
      "title": "October 2025 silver liquidity squeeze",
      "metals": [
        "Silver"
      ],
      "period": "October 2025",
      "eventEnd": "2025-10-31",
      "published": "2026-04-15",
      "source": "Silver Institute / Metals Focus, World Silver Survey 2026",
      "url": "https://silverinstitute.org/elevated-lease-rates-regional-liquidity-tightness-and-robust-investor-interest-resulted-in-record-silver-prices-in-2025/",
      "page": "",
      "fact": "The 2026 survey described an October 2025 silver liquidity squeeze involving inventories, CME stock shifts and investment flows.",
      "channel": "Liquidity and deliverable availability",
      "inputs": "Deliverable stocks, warehouse location, lease rates and physical demand by segment",
      "decision": "Compare immediate delivery availability with industrial offtake before revising price and premium assumptions.",
      "limit": "This is a retrospective report. It cannot be used as information already known in an October 2025 replay.",
      "preset": {
        "demandShock": 0,
        "priceShock": 10,
        "premiumShift": 5,
        "freightShift": 0,
        "fxShock": 0,
        "duty": 0,
        "deferral": 20,
        "delay": 7
      }
    },
    {
      "id": "silver-pv",
      "title": "Silver intensity changed in solar manufacturing",
      "metals": [
        "Silver"
      ],
      "period": "2025",
      "eventEnd": "2025-12-31",
      "published": "2026-04-15",
      "source": "Silver Institute / Metals Focus, World Silver Survey 2026",
      "url": "https://silverinstitute.org/elevated-lease-rates-regional-liquidity-tightness-and-robust-investor-interest-resulted-in-record-silver-prices-in-2025/",
      "page": "",
      "fact": "Industrial silver demand fell 3% to 657.4 Moz in 2025; PV thrifting and substitution offset growth in other end uses.",
      "channel": "Technology and material intensity",
      "inputs": "Solar production, silver per unit, technology mix and actual industrial customer orders",
      "decision": "Separate installation growth from silver intensity when estimating addressable industrial demand.",
      "limit": "The annual global change is not a monthly HZL forecast or a validated customer-level coefficient.",
      "preset": {
        "demandShock": -5,
        "priceShock": 0,
        "premiumShift": 0,
        "freightShift": 0,
        "fxShock": 0,
        "duty": 0,
        "deferral": 0,
        "delay": 0
      }
    },
    {
      "id": "zinc-war",
      "title": "2026 conflict and zinc concentrate disruption",
      "metals": [
        "Zinc"
      ],
      "period": "Q1–April 2026",
      "eventEnd": "2026-04-20",
      "published": "2026-04-28",
      "source": "World Bank Commodity Markets Outlook, April 2026",
      "url": "https://documents1.worldbank.org/curated/en/099842304282633100/pdf/IDU-29bd7eb3-10b9-441a-89be-9732d149e669.pdf",
      "page": "38–39",
      "fact": "The World Bank reported zinc prices up 2% in Q1 2026 and further April gains as conflict-linked concentrate disruptions constrained Chinese smelting.",
      "channel": "War, supply chains and smelting",
      "inputs": "Affected-origin concentrates, route exposure, energy costs, freight, smelter output and customer demand",
      "decision": "Compare supply tightening with downstream demand stress, keeping each causal channel separate.",
      "limit": "These are dated observations, not current conditions. Do not apply a zinc response mechanically to lead or silver.",
      "preset": {
        "demandShock": -5,
        "priceShock": 5,
        "premiumShift": 15,
        "freightShift": 30,
        "fxShock": 2,
        "duty": 0,
        "deferral": 20,
        "delay": 14
      }
    }
  ],
  "methods": [
    "Source summaries are paraphrased and scoped to their original reporting period.",
    "Published date is the earliest allowed review date for the selected report, not the event date.",
    "Review-date filtering is day-level and illustrative. Production point-in-time ingestion needs timestamped source snapshots.",
    "All presets and scenario calculations are hypothetical and independent of the historical observations.",
    "Case selection resets scenario changes to zero. No forecast model is trained by this module."
  ],
  "sources": [
    {
      "name": "World Bank publication metadata",
      "url": "https://thedocs.worldbank.org/en/doc/f3138644a1e8e2bb631399ae11d6c408-0050012026/commodity-markets-outlook-april-2026"
    },
    {
      "name": "World Bank April 2026 report licence",
      "url": "https://creativecommons.org/licenses/by/3.0/igo/"
    }
  ]
};
if(typeof module!=='undefined'&&module.exports)module.exports=HZL_EVENT_DATA;
if(typeof window!=='undefined')window.HZLEventData=HZL_EVENT_DATA;
