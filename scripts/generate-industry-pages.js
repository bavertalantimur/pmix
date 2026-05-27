const fs = require('fs');
const path = require('path');

const industries = [
  {
    slug: 'energy-and-renewables',
    nav: 'energyRenewables',
    title: 'Energy & Renewables',
    intro: [
      'The energy sector is undergoing a global transition to sustainability, driven by decarbonization, new technologies, and changing regulations. pmgix helps energy and utility companies (power, renewables, oil & gas) navigate these shifts. We advise on financing and structuring clean-energy projects, integrating renewable assets, and optimizing energy portfolios.',
    ],
    services: [
      'Project finance and capital raising for renewable and power projects',
      'Power purchase agreement (PPA) and tariff structuring',
      'Asset valuation and commercial due diligence (solar, wind, hydro)',
      'Regulatory compliance and policy advisory',
      'Energy transition strategy and decarbonization planning',
      'Operational optimization for utilities (grid modernization, storage)',
    ],
    clientValue: [
      'Accelerate project development with bankable finance structures',
      'Reduce costs and risks in energy investments',
      'Integrate sustainability goals with financial returns',
    ],
    seo: 'pmgix advises on energy and renewables projects, from financing clean power to optimizing utility operations, to help clients achieve sustainable energy goals.',
  },
  {
    slug: 'infrastructure',
    nav: 'industryInfrastructure',
    title: 'Infrastructure',
    intro: [
      'pmgix supports governments, sponsors, and developers on large-scale infrastructure projects. We focus on transport, public utilities, facilities, and smart city developments. Our team structures public–private partnerships (PPP), advises on infrastructure finance, and aligns multi-stakeholder requirements.',
    ],
    services: [
      'Infrastructure project feasibility and financing strategy',
      'PPP structuring and concession design',
      'Capital budgeting and value-for-money analysis',
      'Risk allocation and stakeholder engagement',
      'Regulatory and compliance strategy (permits, tariffs)',
      'Infrastructure asset management and optimization',
    ],
    clientValue: [
      'Enable sustainable infrastructure delivery through optimal financing',
      'Improve service quality with public-private collaboration',
      'Enhance long-term asset performance and returns',
    ],
    seo: 'pmgix provides advisory for infrastructure and PPP projects, helping structure financing and partnerships to deliver long-term public and private value.',
  },
  {
    slug: 'financial-institutions',
    nav: 'financialInstitutions',
    title: 'Financial Institutions',
    intro: [
      'pmgix advises banks, insurance companies, asset managers, and fintech firms on strategic financial challenges. From capital adequacy and compliance to digital transformation and M&A, we help financial institutions optimize performance and growth.',
    ],
    services: [
      'Capital structure and regulatory compliance (Basel, Solvency)',
      'Risk management and analytics (credit, market, operational risk)',
      'Digital banking and fintech strategy',
      'M&A, capital raising, and divestiture support',
      'Asset-liability management and treasury optimization',
      'Performance improvement and cost transformation',
    ],
    clientValue: [
      'Strengthen balance sheets and regulatory resilience',
      'Accelerate digital innovation and customer engagement',
      'Unlock new revenue streams and market opportunities',
    ],
    seo: 'pmgix supports financial institutions with strategic advisory on capital, risk, digital transformation, and M&A to enhance stability and growth.',
  },
  {
    slug: 'industrials-and-manufacturing',
    nav: 'industrialsManufacturing',
    title: 'Manufacturing',
    intro: [
      'pmgix serves capital-intensive manufacturing and industrial clients (e.g. automotive, aerospace, machinery). We address challenges in operations, supply chain, technology adoption, and global competition. Our solutions improve efficiency and support modern manufacturing strategies.',
    ],
    services: [
      'Operational efficiency and lean manufacturing',
      'Supply chain optimization and logistics planning',
      'Digital factory and Industry 4.0 adoption',
      'Capital investment and project management',
      'M&A and restructuring in industrials',
      'Product lifecycle and innovation management',
    ],
    clientValue: [
      'Boost productivity and reduce costs with streamlined operations',
      'Scale manufacturing in new markets or technologies',
      'Innovate products and processes while managing risk',
    ],
    seo: 'pmgix advises industrial and manufacturing companies on operations, supply chains, and digital transformation to drive efficiency and competitiveness.',
  },
  {
    slug: 'real-assets-and-property',
    nav: 'realAssetsProperty',
    title: 'Real Assets',
    intro: [
      'pmgix advises on commercial real estate, development, and infrastructure-linked assets. We help investors, developers, and owners maximize value in property, construction projects, and real asset portfolios.',
    ],
    services: [
      'Real estate investment analysis and valuation',
      'Development project finance and feasibility',
      'Asset portfolio optimization and disposition strategy',
      'Property operations and facilities management advisory',
      'Public asset privatization and joint ventures',
      'Real estate M&A and joint development structures',
    ],
    clientValue: [
      'Maximize returns on property investments and developments',
      'Enhance portfolio performance through active management',
      'Mitigate regulatory and market risks in real estate projects',
    ],
    seo: 'pmgix provides advisory for real estate and property investments, from project financing to asset management, to maximize returns and manage risk.',
  },
  {
    slug: 'technology-and-digital-infrastructure',
    nav: 'technologyDigitalInfrastructure',
    title: 'Technology & Digital Infrastructure',
    intro: [
      'pmgix guides technology companies and enterprises undergoing digital transformation. We focus on TMT (tech, media, telecom) and digital infrastructure (data centers, cloud, connectivity). Our work helps clients harness technology trends and modernize their core businesses.',
    ],
    services: [
      'Digital strategy and business model innovation',
      'IT infrastructure and cloud migration advisory',
      'Technology project finance and partnerships',
      'Cybersecurity and data privacy strategy',
      'Product development and commercialization (IoT, AI, platforms)',
      'M&A and growth strategies for tech companies',
    ],
    clientValue: [
      'Accelerate digital and IT transformation with minimal disruption',
      'Capitalize on emerging technologies (5G, AI, IoT) for growth',
      'Secure and scale digital platforms for competitive advantage',
    ],
    seo: 'pmgix advises technology and digital infrastructure companies on strategy, financing, and transformation to leverage emerging tech and scale operations.',
  },
  {
    slug: 'transport-and-logistics',
    nav: 'transportLogistics',
    title: 'Transport & Logistics',
    intro: [
      'pmgix helps clients in transportation (air, rail, shipping) and logistics optimize networks and assets. We design efficient transport models, support infrastructure investments, and address supply chain challenges.',
    ],
    services: [
      'Transportation project finance (ports, airports, rail)',
      'Supply chain network design and optimization',
      'Logistics operations and warehouse efficiency',
      'Fleet and asset lifecycle management',
      'Digital logistics solutions (tracking, automation)',
      'Regulatory and environmental compliance (emissions, safety)',
    ],
    clientValue: [
      'Improve connectivity and throughput in transport networks',
      'Lower operating costs through lean logistics',
      'Adapt to shifting trade patterns and mobility trends',
    ],
    seo: 'pmgix supports transport and logistics companies with project finance and operational advisory to improve network efficiency and resilience.',
  },
  {
    slug: 'utilities',
    nav: 'utilities',
    title: 'Utilities',
    intro: [
      'pmgix assists utilities (electric, water, gas) with their unique challenges in infrastructure, regulation, and sustainability. We work on optimizing utility operations, funding new projects, and meeting growing demand reliably and sustainably.',
    ],
    services: [
      'Utility financing and tariff structuring',
      'Grid modernization and smart infrastructure planning',
      'Renewable integration and energy storage strategies',
      'Demand forecasting and resource optimization',
      'Regulatory compliance and stakeholder management',
      'Operational efficiency and outage management',
    ],
    clientValue: [
      'Ensure reliable service delivery with robust asset plans',
      'Optimize costs through technology and resource planning',
      'Support regulatory compliance and sustainable practices',
    ],
    seo: 'pmgix provides advisory to utilities on financing, grid optimization, and renewable integration to ensure reliable, efficient service.',
  },
  {
    slug: 'public-sector-and-ppp',
    nav: 'publicSectorPpp',
    title: 'Public Sector & PPP',
    intro: [
      'pmgix supports governments and agencies on public investments and PPP initiatives. We bring private-sector rigor to public projects, helping structure contracts, secure funding, and align stakeholder objectives for infrastructure and social programs.',
    ],
    services: [
      'PPP structuring and concession design',
      'Public sector financial management and budgeting',
      'Policy development and regulatory advisory',
      'Government project feasibility and financing',
      'Stakeholder alignment (public, private, community)',
      'Performance monitoring and public reporting',
    ],
    clientValue: [
      'Mobilize private capital to fund public infrastructure and services',
      'Enhance efficiency and accountability in public projects',
      'Achieve social and economic goals through well-structured programs',
    ],
    seo: 'pmgix advises public sector and PPP projects, structuring finance and partnerships to improve infrastructure delivery and public services.',
  },
  {
    slug: 'healthcare-and-life-sciences',
    nav: 'healthcareLifeSciences',
    title: 'Healthcare & Life Sciences',
    intro: [
      'pmgix advises hospitals, health systems, biotech, and pharma companies on strategic and financial issues. We focus on improving patient outcomes and innovation, from service delivery to R&D investments.',
    ],
    services: [
      'Healthcare financing and hospital project advisory',
      'Biotech and pharma investment analysis',
      'Digital health and telemedicine strategy',
      'Regulatory compliance and pricing strategy',
      'Clinical operations and supply chain optimization',
      'M&A and fundraising in life sciences',
    ],
    clientValue: [
      'Improve care delivery efficiency and patient access',
      'Accelerate drug and medical innovation with clear investment cases',
      'Navigate complex healthcare regulations and market shifts',
    ],
    seo: 'pmgix offers advisory to healthcare and life sciences organizations on finance, operations, and innovation to improve outcomes and growth.',
  },
  {
    slug: 'consumer-and-retail',
    nav: 'consumerRetail',
    title: 'Retail',
    intro: [
      'pmgix partners with consumer goods manufacturers and retailers to capture market trends and improve operations. We help clients adapt to changing consumer behavior, supply chain disruptions, and e-commerce growth.',
    ],
    services: [
      'Market entry and growth strategy (consumer trends)',
      'Retail network optimization (store locations, omni-channel)',
      'Brand and product portfolio strategy',
      'Supply chain and inventory management',
      'Cost-to-serve and pricing optimization',
      'Retail finance and capital raise support',
    ],
    clientValue: [
      'Drive revenue growth with customer-centric product and channel strategies',
      'Enhance customer experience and loyalty in digital marketplaces',
      'Reduce costs through efficient supply chains and operations',
    ],
    seo: 'pmgix advises consumer and retail companies on market strategy, digital channels, and supply chain to increase sales and efficiency.',
  },
  {
    slug: 'natural-resources-and-mining',
    nav: 'naturalResourcesMining',
    title: 'Mining',
    intro: [
      'pmgix serves mining, forestry, oil & gas, and minerals sectors on resource development and financing. We advise on extraction projects, commodity risk management, and sustainable operations.',
    ],
    services: [
      'Mineral and commodity project finance (mining, oil, gas)',
      'Resource reserve valuation and feasibility studies',
      'Commodity trading and price risk management',
      'ESG and community impact advisory',
      'Infrastructure support for remote resource projects',
      'Corporate restructuring and JV negotiations',
    ],
    clientValue: [
      'Optimize recovery and profitability of resource assets',
      'Manage commodity and operational risks proactively',
      'Balance resource development with environmental and social stewardship',
    ],
    seo: 'pmgix provides advisory on mining and natural resource projects, from project finance to risk and sustainability management.',
  },
  {
    slug: 'financial-sponsors-and-investors',
    nav: 'financialSponsorsInvestors',
    title: 'Investors',
    intro: [
      'pmgix supports private equity firms, family offices, and investment funds in analyzing, acquiring, and managing portfolio assets. We provide end-to-end transaction and portfolio advisory aligned with investment theses.',
    ],
    services: [
      'Target company due diligence (financial, commercial, operational)',
      'Portfolio strategy and performance improvement',
      'Capital raising and fund structuring',
      'Exit readiness and divestiture planning',
      'Valuation and modeling for investments',
      'Post-merger integration support',
    ],
    clientValue: [
      'Enhance investment returns with rigorous analysis and value creation plans',
      'Increase deal flow and portfolio value through strategic positioning',
      'Mitigate risk with thorough due diligence and exit strategies',
    ],
    seo: 'pmgix supports financial sponsors and investors with due diligence, portfolio strategy, capital structuring, and transaction advisory.',
  },
];

const outDir = path.join(__dirname, '..', 'pmix', 'pages');

function esc(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function listItems(items) {
  return items.map((item) => `              <li>${esc(item)}</li>`).join('\n');
}

for (const ind of industries) {
  const introHtml = ind.intro.map((p) => `              <p>${esc(p)}</p>`).join('\n');
  const clientValueHtml = ind.clientValue.map((v) => `              <li>${esc(v)}</li>`).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(ind.seo)}">
  <meta name="robots" content="index, follow">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(ind.title)} | pmgix">
  <meta property="og:description" content="${esc(ind.seo)}">
  <title>${esc(ind.title)} | pmgix</title>
  <link rel="stylesheet" href="../css/variables.css">
  <link rel="stylesheet" href="../css/base.css">
  <link rel="stylesheet" href="../css/layout.css">
  <link rel="stylesheet" href="../css/components.css">
  <link rel="stylesheet" href="../css/responsive.css">
</head>
<body class="page page-industries industry-detail-page" data-page="industries">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <div data-component="header"></div>

  <main id="main-content">
    <section class="section service-document-section" aria-labelledby="industry-title">
      <div class="container">
        <article class="service-document-layout">
          <header class="service-document-header">
            <h1 id="industry-title" class="service-document-header__title">${esc(ind.title)}</h1>
            <div class="service-document-header__intro">
${introHtml}
            </div>
          </header>

          <section class="service-document-capabilities" aria-labelledby="industry-services">
            <h2 id="industry-services" class="service-document-capabilities__title">Services include:</h2>
            <ul class="service-document-capabilities__list">
${listItems(ind.services)}
            </ul>
          </section>

          <div class="service-document-value" aria-labelledby="client-value-label">
            <p class="service-document-value__text">
              <strong id="client-value-label" class="service-document-value__label">Client value:</strong>
            </p>
            <ul class="service-document-value__list">
${clientValueHtml}
            </ul>
          </div>
        </article>
      </div>
    </section>
  </main>

  <div data-component="footer"></div>
  <script type="module" src="../js/main.js"></script>
</body>
</html>
`;

  fs.writeFileSync(path.join(outDir, `${ind.slug}.html`), html, 'utf8');
  console.log(`Wrote ${ind.slug}.html`);
}
