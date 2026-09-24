/**
 * Index of articles published on maqosolar.com/blog, newest first within each topic.
 * The full articles live on the main site; this page links out to them.
 */
export type TopicKey = "schemes" | "tariffs" | "industry" | "archive";

export type Post = { title: string; summary: string; href: string };

const BASE = "https://maqosolar.com";

export const POSTS: Record<TopicKey, Post[]> = {
  schemes: [
    { title: "Solar ATAP 2026 Is Coming: Bigger Solar Capacity, No Quota Limits", summary: "What the Solar Accelerated Transition Action Programme changes for rooftop owners.", href: `${BASE}/atap-2026-solar/` },
    { title: "Enhancements to the SelCo Program and National Energy Awards 2024", summary: "Government measures announced for the green energy industry and self-consumption users.", href: `${BASE}/enhancements-to-the-selco-program-and-national-energy-awards-2024-latest-developments-in-malaysias-energy-transition/` },
    { title: "Malaysia Expands Solar Quotas for Schools", summary: "SEDA opens solar quota access to government-aided vernacular schools.", href: `${BASE}/%f0%9f%8c%9e-malaysia-expands-solar-quotas-for-schools-a-bright-future-with-maqo-solar%e2%9a%a1%f0%9f%93%9a/` },
    { title: "LSS6 and BESS: The Next Big Leap in Malaysia's Renewable Energy Revolution", summary: "Large Scale Solar round 6, battery storage projects and the CREAM aggregation mechanism.", href: `${BASE}/lss6-and-bess-the-next-big-leap-in-malaysias-renewable-energy-revolution/` },
    { title: "Malaysia Opens Bids for 2,000MW Large-Scale Solar Projects Under LSS@PETRA+", summary: "The energy ministry's 2,000MWac quota and how bidding works.", href: `${BASE}/malaysia-opens-bids-for-2000mw-large-scale-solar-projects-under-lsspetra-program/` },
    { title: "Malaysia Boosts Renewable Energy with Enhanced CRESS", summary: "Corporate Renewable Energy Supply Scheme changes from 1 March 2025, including fixed system access charges.", href: `${BASE}/malaysia-boosts-renewable-energy-with-enhanced-cress/` },
    { title: "Driving Corporate Sustainability with Green Power", summary: "How the Corporate Green Power Programme lets companies adopt solar PV.", href: `${BASE}/driving-corporate-sustainability-with-green-power/` },
    { title: "NOVA Programme Guidelines for Solar PV Installation", summary: "Self-consumption under NOVA, with rules for exporting surplus power to the grid.", href: `${BASE}/nova-programme-guidelines-for-solar-pv-installation/` },
    { title: "Net Energy Metering (NEM) Programs: Empowering Residential and Government Sectors", summary: "NEM Rakyat for homes from 1 to 10 kW, with surplus credited one-for-one.", href: `${BASE}/2981-2/` },
    { title: "Net Energy Metering (NEM) Malaysia", summary: "Background on the NEM scheme introduced in November 2016.", href: `${BASE}/net-energy-metering-nem-malaysia/` },
    { title: "Solar Power: Your Guide to Installing Solar PV Systems for Self-Consumption", summary: "The installation guidelines for self-consumption systems, step by step.", href: `${BASE}/solar-pv-self-consumption/` },
    { title: "Big News for Solar Energy Users in Malaysia: SelCo Programme Gets a Major Upgrade!", summary: "Updates that make self-consumption more flexible for non-domestic users.", href: `${BASE}/big-news-for-solar-energy-users-in-malaysia-selco-programme-gets-a-major-upgrade/` },
    { title: "FREE Qualification Assessment for up to RM4k Government Home Solar Subsidy (SolaRIS)", summary: "Who qualifies for the SolaRIS rebate on residential NEM installations.", href: `${BASE}/solaris-petra-nem-seda-st-maqo-solar/` },
    { title: "Malaysia Corporate Solar PPA 600MW Quota Application Open from 7 Nov 2022", summary: "The Corporate Green Power Programme launch and its application window.", href: `${BASE}/malaysia-corporate-solar-ppa-600mw-quota-2022/` },
    { title: "LSS4 1000MW, 1GW Solar Farm Quota 2020 offered by Malaysia Government", summary: "The 1GW solar farm quota offered under LSS4.", href: `${BASE}/lss-mentari-program/` },
    { title: "Supply Agreement for Renewable Energy (SARE) Provides Cheaper Electricity to Solar Users", summary: "SARE lets homeowners put panels on the roof under a leasing arrangement.", href: `${BASE}/sare-solar-in-malaysia/` },
    { title: "Solar Leasing and Net Energy Metering (NEM) for Malaysia", summary: "Ministry changes aimed at wider PV adoption through leasing.", href: `${BASE}/solar-leasing-nem-malaysia/` },
    { title: "Utility Scale Solar: Large Scale Solar Round 3 (LSS3)", summary: "The LSS3 request for proposals and what it covered.", href: `${BASE}/lss3/` },
    { title: "Feed-in Tariff (FiT) Quota Revocation and New Quota Press Release Key Facts", summary: "The revoked FiT quota of September 2018 and the new batches that followed.", href: `${BASE}/feed-in-tariff/` },
    { title: "Net Energy Metering (NEM) 2019 Update", summary: "The 2019 NEM rules for rooftop self-consumption and bill credits.", href: `${BASE}/net-energy-metering-nem-2019-update/` },
  ],
  tariffs: [
    { title: "Electricity Tariff Hike in KHTP", summary: "Kulim Hi-Tech Park businesses face a 6.5 sen/kWh surcharge from 1 January 2025.", href: `${BASE}/__trashed/` },
    { title: "What You Need to Know About the Green Electricity Tariff (GET)", summary: "How GET lets homes and businesses buy renewable electricity.", href: `${BASE}/simplified-blog-post-what-you-need-to-know-about-the-green-electricity-tariff-get/` },
    { title: "What is Renewable Energy Certificate (REC)? How it works?", summary: "RECs explained: tracking and buying renewable generation.", href: `${BASE}/what-is-renewable-energy-certificate-rec-how-it-works-definition-benefits-types-examples/` },
    { title: "Only 6600GWh of TNB Green Electricity Tariff (GETS / RECs) available for 2023", summary: "The GET quota raised from 4,500 GWh to 6,600 GWh.", href: `${BASE}/6600gwh-tnb-green-electricity-tariff-gets-recs/` },
    { title: "TNB ICPT Tariff Surcharge is RM0.20 per kWh from 1 Jan 2023", summary: "What the ICPT surcharge increase means for commercial and industrial bills.", href: `${BASE}/alert-1-jan-2023-tnb-electricity-icpt-tariff-surcharge-rm0-20-per-kwh-440-percent-hike-fr-rm0-037/` },
    { title: "Budget 2020: Solar Tax Exemptions Extended to 2023", summary: "The budget extension of tax incentives for solar installations.", href: `${BASE}/budget-2020-solar-tax-exemptions-extended-to-2023/` },
  ],
  industry: [
    { title: "Solar Panel Lifespan: What You Should Know", summary: "How long panels last, and what affects their output over the years.", href: `${BASE}/life-cycle-solar-panel/` },
    { title: "A New Balance in the Global Solar Module Industry: Analysis and Forecast", summary: "Shifts in the global module market and where prices may head.", href: `${BASE}/a-new-balance-in-the-global-solar-module-industry-analysis-and-forecast/` },
    { title: "Ensuring Fire Safety Compliance: Malaysia's Bomba Guidelines for Solar Installations", summary: "The fire and rescue department's requirements for solar systems.", href: `${BASE}/ensuring-fire-safety-compliance-malaysias-bomba-guidelines-for-solar-installations/` },
    { title: "Is there any Radiation from Solar Panel? 光伏发电有辐射吗？", summary: "Comparing panel emissions with everyday household appliances.", href: `${BASE}/blog-radiation-from-solar-panel/` },
  ],
  archive: [
    { title: "Temperature Screening System COVID-19", summary: "The ECO-TSS screening system used during the pandemic.", href: `${BASE}/temperature-screening-system-covid-19/` },
    { title: "Malaysia can generate more electricity if all roofs use solar panels, says Yeo", summary: "A minister's case for rooftop solar at national scale.", href: `${BASE}/malaysia-can-generate-more-electricity-if-all-roofs-use-solar-panels-says-yeo/` },
    { title: "'Yes' to green energy, 'no' to nuke", summary: "Commentary on Malaysia's renewable energy direction.", href: `${BASE}/yes-to-green-energy-no-to-nuke/` },
    { title: "装太阳能系统自行发电 杨美盈：省电费也享津贴", summary: "Chinese-language report on savings and incentives for self-generation.", href: `${BASE}/%e8%a3%85%e5%a4%aa%e9%98%b3%e8%83%bd%e7%b3%bb%e7%bb%9f%e8%87%aa%e8%a1%8c%e5%8f%91%e7%94%b5-%e6%9d%a8%e7%be%8e%e7%9b%88%ef%bc%9a%e7%9c%81%e7%94%b5%e8%b4%b9%e4%b9%9f%e4%ba%ab%e6%b4%a5%e8%b4%b4/` },
    { title: "Minister Yeo Bee Yin Urged SMEs to Participate in NEM Programme", summary: "The call for small businesses to join net energy metering.", href: `${BASE}/sme-nem-yeo-bee-yin/` },
    { title: "United Nations: We Have 12 Years to Limit Climate Change Catastrophe", summary: "The IPCC warning on holding warming to 1.5°C.", href: `${BASE}/climate-change/` },
  ],
};
