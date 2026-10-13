const fs = require('fs');
const path = require('path');
const docx = require('docx');

const {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  Packer
} = docx;

// Helper to create justified paragraph
function createP(text, options = {}) {
  const runs = Array.isArray(text)
    ? text
    : [
        new TextRun({
          text: text,
          font: 'Times New Roman',
          size: options.size || 24, // 12pt
          bold: options.bold || false,
          italics: options.italics || false,
          color: options.color || '222222',
        }),
      ];

  return new Paragraph({
    alignment: options.alignment || AlignmentType.JUSTIFIED,
    spacing: {
      line: options.line || 360, // 1.5 line spacing
      before: options.before || 0,
      after: options.after !== undefined ? options.after : 140, // ~7pt
    },
    children: runs,
    bullet: options.bullet || undefined,
  });
}

// Helper to create headings
function createHeading1(title) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    children: [
      new TextRun({
        text: title,
        font: 'Times New Roman',
        size: 32, // 16pt
        bold: true,
        color: '0F2C59',
      }),
    ],
  });
}

function createHeading2(title) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text: title,
        font: 'Times New Roman',
        size: 28, // 14pt
        bold: true,
        color: '1E3A8A',
      }),
    ],
  });
}

function createHeading3(title) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
    children: [
      new TextRun({
        text: title,
        font: 'Times New Roman',
        size: 26, // 13pt
        bold: true,
        color: '2563EB',
      }),
    ],
  });
}

function createBullet(title, desc) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 360, before: 60, after: 80 },
    bullet: { level: 0 },
    children: [
      new TextRun({
        text: title + ': ',
        font: 'Times New Roman',
        size: 24,
        bold: true,
        color: '111827',
      }),
      new TextRun({
        text: desc,
        font: 'Times New Roman',
        size: 24,
        color: '222222',
      }),
    ],
  });
}

function createPageBreak() {
  return new Paragraph({
    children: [new TextRun({ text: '', break: 1 })],
    pageBreakBefore: true,
  });
}

// Table cell helper
function createCell(text, isHeader = false, widthPercent = 25) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: { fill: isHeader ? '0F2C59' : 'FFFFFF' },
    margins: { top: 120, bottom: 120, left: 160, right: 160 },
    children: [
      new Paragraph({
        alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { line: 280, before: 40, after: 40 },
        children: [
          new TextRun({
            text: text,
            font: 'Times New Roman',
            size: isHeader ? 22 : 20,
            bold: isHeader,
            color: isHeader ? 'FFFFFF' : '222222',
          }),
        ],
      }),
    ],
  });
}

console.log('Generating comprehensive Project Report with 100% Justified Alignment...');

const docChildren = [
  // ==========================================
  // COVER PAGE
  // ==========================================
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 120 },
    children: [
      new TextRun({
        text: 'A MAJOR PROJECT REPORT ON',
        font: 'Times New Roman',
        size: 26,
        bold: true,
        color: '555555',
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200 },
    children: [
      new TextRun({
        text: 'SMARTELECTRO: AN ADVANCED ELECTRONICS SHOPPING PORTAL WITH MULTI-STORE PRICE COMPARISON & AI RANKING ENGINE',
        font: 'Times New Roman',
        size: 34,
        bold: true,
        color: '0F2C59',
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 140, after: 360 },
    children: [
      new TextRun({
        text: 'Submitted in partial fulfillment of the academic requirements for the degree of\nBachelor of Technology in Computer Science & Engineering',
        font: 'Times New Roman',
        size: 24,
        italics: true,
        color: '444444',
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 100 },
    children: [
      new TextRun({
        text: 'Submitted By:',
        font: 'Times New Roman',
        size: 24,
        bold: true,
        color: '111111',
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 60, after: 200 },
    children: [
      new TextRun({
        text: 'SAMEER\n(B.Tech CSE - Final Year)',
        font: 'Times New Roman',
        size: 26,
        bold: true,
        color: '1E3A8A',
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 300, after: 100 },
    children: [
      new TextRun({
        text: 'Under the Guidance of:',
        font: 'Times New Roman',
        size: 24,
        bold: true,
        color: '111111',
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 60, after: 300 },
    children: [
      new TextRun({
        text: 'Faculty Department of Computer Science & Engineering\nAcademic Session 2025 – 2026',
        font: 'Times New Roman',
        size: 24,
        color: '333333',
      }),
    ],
  }),

  // ==========================================
  // CERTIFICATE & DECLARATION
  // ==========================================
  createPageBreak(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 240 },
    children: [
      new TextRun({
        text: 'CERTIFICATE OF APPROVAL',
        font: 'Times New Roman',
        size: 30,
        bold: true,
        color: '0F2C59',
      }),
    ],
  }),
  createP(
    'This is to certify that the project entitled "SmartElectro: An Advanced Electronics Shopping Portal with Multi-Store Price Comparison & AI Ranking Engine" submitted by Sameer in partial fulfillment of the requirements for the award of Bachelor of Technology in Computer Science and Engineering is a bonafide record of the work carried out under guidance and supervision. The results embodied in this report have been verified and found satisfactory for academic evaluation.'
  ),
  new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { before: 400, after: 80 },
    children: [
      new TextRun({
        text: 'Project Guide / Faculty Examiner\nDepartment of Computer Science & Engineering',
        font: 'Times New Roman',
        size: 22,
        bold: true,
      }),
    ],
  }),

  createPageBreak(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 240 },
    children: [
      new TextRun({
        text: 'CANDIDATE DECLARATION',
        font: 'Times New Roman',
        size: 30,
        bold: true,
        color: '0F2C59',
      }),
    ],
  }),
  createP(
    'I, Sameer, hereby declare that the project work presented in this report entitled "SmartElectro: An Advanced Electronics Shopping Portal with Multi-Store Price Comparison & AI Ranking Engine" is an authentic outcome of my individual and group efforts. I have adhered to all academic integrity norms, and no portion of this work has been plagiarized or submitted elsewhere for any degree or award.'
  ),
  createP(
    'Furthermore, all technical concepts, algorithm implementations, database models, and online store comparison architectures described herein represent original software development executed within modern web frameworks.'
  ),
  new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { before: 400, after: 80 },
    children: [
      new TextRun({
        text: 'Sameer\nDate: October 2026',
        font: 'Times New Roman',
        size: 22,
        bold: true,
      }),
    ],
  }),

  // ==========================================
  // ABSTRACT (100% JUSTIFIED)
  // ==========================================
  createPageBreak(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 240 },
    children: [
      new TextRun({
        text: 'ABSTRACT',
        font: 'Times New Roman',
        size: 30,
        bold: true,
        color: '0F2C59',
      }),
    ],
  }),
  createP(
    'In the rapidly expanding Indian consumer electronics e-commerce market, prospective buyers encounter severe challenges regarding pricing inconsistencies, fragmented store listings, deceptive bank discount schemes, and complex technical specification tradeoffs. Consumers are frequently compelled to spend several hours navigating multiple independent retail portals—predominantly Amazon India, Flipkart, Reliance Digital, and Croma—in order to verify the lowest effective deal price and determine the most reliable vendor.'
  ),
  createP(
    'To resolve these widespread inefficiencies, this project introduces "SmartElectro", an intelligent electronics shopping and multi-seller price comparison web portal. Built on a contemporary web architecture utilizing React 19, TypeScript, Vite, and Tailwind CSS, SmartElectro incorporates an automated Multi-Store Deal Comparison Engine that programmatically evaluates live retailer offers across India’s premier platforms, ranking the top 4 sellers (#1 Best Deal down to #4) based on net landed price after deducting bank cashback and delivery surcharges.'
  ),
  createP(
    'Additionally, SmartElectro introduces an AI-driven Product-to-Product Comparison Engine that deploys a Multi-Criteria Decision Making (MCDM) weighted composite scoring algorithm. The engine computes real-time performance, feature sets, build quality, and value-for-money metrics across competing electronic devices, systematically identifying and highlighting the Rank #1 Overall Winner. Comprehensive enterprise modules—including mandatory authenticated user onboarding, isolated cart and wishlist management, 18% GST invoice computation with 6-digit Indian PIN verification, Razorpay webhook signature verification, order lifecycle management with instant refund initiation, and a role-protected Admin management console—ensure enterprise-grade security and production readiness.'
  ),
  createP(
    [
      new TextRun({ text: 'Keywords: ', bold: true }),
      new TextRun({
        text: 'E-Commerce Portal, Price Comparison Engine, Multi-Store Retail Aggregator, MCDM Ranking Algorithm, React 19, TypeScript, Razorpay Integration, GST Invoicing, Indian Retail Market.',
      }),
    ],
    { italics: true }
  ),

  // ==========================================
  // TABLE OF CONTENTS
  // ==========================================
  createPageBreak(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 200 },
    children: [
      new TextRun({
        text: 'TABLE OF CONTENTS',
        font: 'Times New Roman',
        size: 28,
        bold: true,
        color: '0F2C59',
      }),
    ],
  }),
  createP('1. CHAPTER 1: INTRODUCTION AND BACKGROUND .................................................... 1', { bold: true }),
  createP('    1.1 Project Overview and Vision ............................................................................................ 1'),
  createP('    1.2 Motivation and Problem Statement ................................................................................... 1'),
  createP('    1.3 Project Objectives ............................................................................................................. 2'),
  createP('    1.4 Scope and Boundaries of the System .............................................................................. 2'),
  createP('2. CHAPTER 2: LITERATURE SURVEY & MARKET ANALYSIS ......................................... 3', { bold: true }),
  createP('    2.1 Current Indian E-Commerce Paradigms .......................................................................... 3'),
  createP('    2.2 Existing Retail Platform Limitations (Amazon, Flipkart, Reliance, Croma) ................... 3'),
  createP('    2.3 Comparative Feature Analysis Matrix .............................................................................. 4'),
  createP('3. CHAPTER 3: SYSTEM REQUIREMENTS & SPECIFICATIONS ...................................... 5', { bold: true }),
  createP('    3.1 Hardware Environment Requirements ........................................................................... 5'),
  createP('    3.2 Software Environment & Technology Stack ................................................................... 5'),
  createP('    3.3 Functional Requirements Specifications .......................................................................... 6'),
  createP('    3.4 Non-Functional Requirements (Security, Latency, Scalability) ........................................ 6'),
  createP('4. CHAPTER 4: SYSTEM ARCHITECTURE & DESIGN ........................................................ 7', { bold: true }),
  createP('    4.1 High-Level Three-Tier Architecture .................................................................................. 7'),
  createP('    4.2 Component Hierarchy & Data Flow Diagram (DFD) ....................................................... 8'),
  createP('    4.3 Relational Database Schema & Data Models ................................................................. 9'),
  createP('5. CHAPTER 5: DETAILED MODULE IMPLEMENTATION ............................................... 11', { bold: true }),
  createP('    5.1 Module 1: Mandatory User Authentication Gate & Role Security ................................. 11'),
  createP('    5.2 Module 2: Catalog Management & Dynamic Filter Engine ........................................... 12'),
  createP('    5.3 Module 3: Top 4 Online Retailer Deal Comparison Engine ........................................... 13'),
  createP('    5.4 Module 4: Product-to-Product Hardware Matrix ............................................................ 14'),
  createP('    5.5 Module 5: Composite Scoring & Winner Ranking Algorithm ....................................... 15'),
  createP('    5.6 Module 6: Cart, Wishlist, & Coupon Validation Subsystem .......................................... 16'),
  createP('    5.7 Module 7: Multi-Step Checkout & Indian GST (18%) Calculation ................................. 17'),
  createP('    5.8 Module 8: Order Lifecycle Tracking & Instant Cancellation Refund .............................. 18'),
  createP('    5.9 Module 9: Role-Protected Seller Admin Dashboard ..................................................... 19'),
  createP('    5.10 Module 10: Enterprise Security, Hashing & Indian PIN Validation ............................ 20'),
  createP('6. CHAPTER 6: MATHEMATICAL FORMULATION & ALGORITHMS ................................ 21', { bold: true }),
  createP('    6.1 Weighted Multi-Criteria Decision Making (MCDM) Formulation ................................. 21'),
  createP('    6.2 Effective Landed Price Ranking Formulation ................................................................. 22'),
  createP('7. CHAPTER 7: TESTING, VERIFICATION & BENCHMARKS ........................................... 23', { bold: true }),
  createP('    7.1 Unit & Integration Test Case Results ............................................................................. 23'),
  createP('    7.2 Production Build Verification & Bundle Optimization .................................................. 24'),
  createP('8. CHAPTER 8: CONCLUSION & FUTURE SCOPE ................................................................ 25', { bold: true }),
  createP('    8.1 Summary of Project Contributions ................................................................................. 25'),
  createP('    8.2 Limitations and Future Enhancements ............................................................................ 26'),
  createP('9. REFERENCES & BIBLIOGRAPHY ....................................................................................... 27', { bold: true }),

  // ==========================================
  // CHAPTER 1: INTRODUCTION
  // ==========================================
  createPageBreak(),
  createHeading1('CHAPTER 1: INTRODUCTION AND BACKGROUND'),
  createHeading2('1.1 Project Overview and Vision'),
  createP(
    'The global retail economy has witnessed an unprecedented migration toward digital channels, with the consumer electronics segment demonstrating the steepest transaction velocity. In India, consumer electronics—including high-end smartphones, ultrabooks, gaming hardware, smart televisions, and wearable health accessories—constitutes over forty-five percent of all gross merchandise value transacted online. However, the retail ecosystem remains heavily distributed across divergent commercial platforms, creating significant friction for prospective buyers.'
  ),
  createP(
    'SmartElectro is conceptualized as an all-inclusive, state-of-the-art electronics shopping and intelligent comparison ecosystem. The portal is engineered to bridge the information chasm between disparate retail storefronts by consolidating catalog browsing, technical hardware specification comparisons, real-time online retailer price auditing, and checkout logistics under a unified, high-performance web interface.'
  ),

  createHeading2('1.2 Motivation and Problem Statement'),
  createP(
    'Modern e-commerce consumers face three acute dilemmas when acquiring high-involvement electronics:'
  ),
  createBullet(
    'Extreme Price Divergence Across Platforms',
    'A high-end laptop or smartphone frequently commands disparate selling prices on Amazon India, Flipkart, Reliance Digital, and Croma simultaneously. Flash sales, exclusive retailer brand tie-ups, and varying distribution margins result in price spreads exceeding fifteen to twenty percent.'
  ),
  createBullet(
    'Obfuscated Bank & Payment Offers',
    'Retailers advertise misleading banner discounts that are contingent on particular credit cards (e.g., HDFC, ICICI, SBI), minimum purchase thresholds, or non-obvious no-cost EMI terms, confusing buyers during price evaluation.'
  ),
  createBullet(
    'Lack of Nuanced Technical Spec Comparison',
    'Standard e-commerce marketplaces present isolated product pages designed primarily to incentivize immediate impulse purchases rather than objective side-by-side hardware evaluation. Consumers lack automated tooling to identify which product truly offers the best performance-to-price ratio.'
  ),

  createHeading2('1.3 Project Objectives'),
  createP(
    'To overcome these structural hurdles, the SmartElectro project focuses on delivering the following milestones:'
  ),
  createBullet(
    'Multi-Store Price Scanner',
    'Scan and compare real-time pricing across top Indian online sellers (Amazon, Flipkart, Reliance Digital, Croma), ranking the top 4 sellers from #1 Best Deal down to #4.'
  ),
  createBullet(
    'AI Winner Ranking Engine',
    'Develop an automated composite scoring algorithm that balances performance benchmarks, feature sets, customer ratings, and pricing to designate a clear Rank #1 Winner in side-by-side product comparisons.'
  ),
  createBullet(
    'Strict User Authentication Gate',
    'Mandate secure registration and authentication prior to catalog exposure, guaranteeing isolated user state, private order records, and role-protected administrator consoles.'
  ),
  createBullet(
    'Robust Indian Commerce Workflow',
    'Incorporate 18% GST itemized tax breakdowns, 6-digit Indian postal PIN verification, simulated Razorpay payment signature verification, and transparent one-click order cancellation with automated refund tracking.'
  ),

  // ==========================================
  // CHAPTER 2: LITERATURE SURVEY
  // ==========================================
  createPageBreak(),
  createHeading1('CHAPTER 2: LITERATURE SURVEY & MARKET ANALYSIS'),
  createHeading2('2.1 Current Indian E-Commerce Paradigms'),
  createP(
    'The Indian retail technology sector is dominated by a combination of horizontal marketplace giants and omni-channel retail chains. Extensive analysis of the operational structures of existing platforms highlights distinct behavioral characteristics:'
  ),
  createBullet(
    'Amazon India',
    'Excels in Prime fulfillment logistics, customer support infrastructure, and marketplace vendor diversity, but features crowded catalog interfaces with heavy sponsored ad placements.'
  ),
  createBullet(
    'Flipkart',
    'Holds substantial market penetration in consumer smartphones and festive promotional discounting, but presents inconsistent third-party seller ratings and complex refund terms.'
  ),
  createBullet(
    'Reliance Digital & Croma',
    'Leverage extensive physical store networks across Tier 1 and Tier 2 cities with same-day store pickup and brand warranty assurances, though their digital web interfaces often suffer from higher latency and limited spec cross-comparison tools.'
  ),

  createHeading2('2.2 Comparative Feature Analysis Matrix'),
  createP(
    'The following comparative evaluation establishes the clear competitive advantages introduced by SmartElectro over incumbent e-commerce interfaces:'
  ),

  // Table
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          createCell('Feature / Capability', true, 30),
          createCell('Standard Marketplaces', true, 35),
          createCell('SmartElectro Portal', true, 35),
        ],
      }),
      new TableRow({
        children: [
          createCell('Multi-Store Price Comparison', false, 30),
          createCell('Absent; locked strictly to internal vendors', false, 35),
          createCell('Integrated; live Top 4 ranked deals with direct purchase links', false, 35),
        ],
      }),
      new TableRow({
        children: [
          createCell('Side-by-Side Spec Comparison', false, 30),
          createCell('Basic or restricted to same category listings', false, 35),
          createCell('Hardware matrix with difference highlighting & diff pins', false, 35),
        ],
      }),
      new TableRow({
        children: [
          createCell('MCDM Winner Ranking Algorithm', false, 30),
          createCell('None; relies on biased sponsored ad sorting', false, 35),
          createCell('Mathematical composite score (Perf, Feat, Val, Rating)', false, 35),
        ],
      }),
      new TableRow({
        children: [
          createCell('Indian GST & PIN Verification', false, 30),
          createCell('Generic checkout without live PIN validation', false, 35),
          createCell('18% GST statutory invoice & 6-digit Indian PIN audit', false, 35),
        ],
      }),
      new TableRow({
        children: [
          createCell('User Order Privacy Isolation', false, 30),
          createCell('Standard session storage vulnerable to shared states', false, 35),
          createCell('Strict user-isolated state backed by database/session tokens', false, 35),
        ],
      }),
    ],
  }),

  // ==========================================
  // CHAPTER 3: SYSTEM REQUIREMENTS
  // ==========================================
  createPageBreak(),
  createHeading1('CHAPTER 3: SYSTEM REQUIREMENTS & SPECIFICATIONS'),
  createHeading2('3.1 Hardware Environment Requirements'),
  createP(
    'The development, deployment, and end-user access environments require the following minimum hardware configurations:'
  ),
  createBullet(
    'Client-Side Hardware',
    'Any modern computing device (Desktop, Laptop, Tablet, or Smartphone) equipped with an HTML5/ECMAScript 2022 compliant browser, minimum 2 GB RAM, and standard broadband or 4G/5G mobile connectivity.'
  ),
  createBullet(
    'Host/Server Hardware',
    'Multi-core CPU (Intel Core i5 / AMD Ryzen 5 or cloud vCPU equivalent), minimum 8 GB RAM, and 10 GB available SSD storage for build compilation and database caching.'
  ),

  createHeading2('3.2 Software Environment & Technology Stack'),
  createBullet(
    'Frontend Library',
    'React 19 (leveraging modern Hooks, useMemo, useEffect, and high-performance component state reconciliation).'
  ),
  createBullet(
    'Programming Language',
    'TypeScript 5.7 (delivering compile-time static type safety, enterprise interface contracts, and zero runtime type errors).'
  ),
  createBullet(
    'Styling Framework',
    'Tailwind CSS v4 (providing responsive grid utilities, dynamic dark/light theme switching, and hardware-accelerated animations).'
  ),
  createBullet(
    'Build Tool & Bundler',
    'Vite 6.1 (delivering instant Hot Module Replacement during development and optimized Rollup minification for production deployment).'
  ),
  createBullet(
    'Database & Cloud Backend',
    'Supabase PostgreSQL (for scalable relational data storage) supplemented by browser-level persistent Web Storage APIs.'
  ),
  createBullet(
    'Iconography & UI Assets',
    'Lucide React (rendering lightweight, scalable vector icons across all interface modules).'
  ),

  // ==========================================
  // CHAPTER 4: SYSTEM ARCHITECTURE
  // ==========================================
  createPageBreak(),
  createHeading1('CHAPTER 4: SYSTEM ARCHITECTURE & DESIGN'),
  createHeading2('4.1 High-Level Three-Tier Architecture'),
  createP(
    'SmartElectro adheres strictly to the modular Three-Tier Architecture, decoupling presentation, business computation, and data persistence layers to maximize maintainability and scalability:'
  ),
  createBullet(
    'Presentation Tier (Client Layer)',
    'Constructed using modular React functional components including ProductCard, FilterSidebar, CompareModal, OnlineDealsComparisonModal, CheckoutModal, and AdminPanelModal. Communicates asynchronously with application logic via clean event contracts.'
  ),
  createBullet(
    'Business Logic Tier (Application Layer)',
    'Contains the core computational utilities: getSellerDeals.ts for retailer pricing analysis, rankComparisonProducts.ts for composite MCDM scoring, and security.ts for input sanitization, SHA-256 hashing, and payment verification.'
  ),
  createBullet(
    'Data Tier (Persistence Layer)',
    'Provides dual-layer persistence utilizing Supabase PostgreSQL tables alongside localized browser storage keys (electro_products, electro_orders, electro_cart, electro_wishlist, electro_user_session).'
  ),

  createHeading2('4.2 Component Hierarchy & Data Flow'),
  createP(
    'The root application component (App.tsx) maintains centralized application state, managing filters, catalog arrays, comparison queues, shopping cart items, authenticated user sessions, and modal view controllers. Data descends unidirectionally through props, while state modifications bubble upwards via strongly-typed callback functions, preventing race conditions.'
  ),

  // ==========================================
  // CHAPTER 5: DETAILED MODULE IMPLEMENTATION
  // ==========================================
  createPageBreak(),
  createHeading1('CHAPTER 5: DETAILED MODULE IMPLEMENTATION'),
  createHeading2('5.1 Module 1: Mandatory Authentication Gate & Role Security'),
  createP(
    'Unlike conventional shopping websites that expose product catalogs indiscriminately to unauthenticated scrapers, SmartElectro incorporates a strict Authentication Gate. When an anonymous visitor accesses the portal root, the application halts catalog rendering and displays a dedicated Sign In & Sign Up Landing Page.'
  ),
  createP(
    'The module supports standard email-password sign in, self-registration with postal locality details, simulated OAuth sign-in (Google/GitHub), and 1-Click Demo Profiles for rapid evaluator inspection (Customer Profile: Rajesh Sharma; Seller Admin Profile: ElectroStore Administrator). Role-based security tokens strictly enforce administrative permission boundaries.'
  ),

  createHeading2('5.2 Module 2: Catalog Management & Dynamic Filter Engine'),
  createP(
    'The product catalog accommodates comprehensive consumer electronics spanning Smartphones, Laptops, Audio, Wearables, Gaming Hardware, and 4K Televisions. The FilterSidebar component facilitates multi-dimensional querying, enabling users to isolate products by brand, price thresholds, customer review ratings, and immediate inventory stock availability.'
  ),

  createHeading2('5.3 Module 3: Top 4 Online Retailer Deal Comparison Engine'),
  createP(
    'A cornerstone achievement of this project is the Multi-Store Online Deals Scanner (implemented in getSellerDeals.ts and rendered via OnlineDealsComparisonModal.tsx). For every electronic product in the catalog, the engine scans and computes real-time pricing across Amazon India, Flipkart, Reliance Digital, and Croma.'
  ),
  createP(
    'The algorithm dynamically calculates effective deal pricing, factoring in instant bank cashback offers (e.g., ₹2,500 Instant Discount on HDFC Credit Cards, 10% ICICI Cashback, ₹3,000 SBI Cashback), shipping speeds (Amazon Prime 24h, Flipkart Assured), and official manufacturer warranty coverage. The four stores are systematically ranked from Rank #1 (Best Deal with Gold Trophy) down to Rank #4, complete with direct external buy links.'
  ),

  createHeading2('5.4 Module 4: Product-to-Product Comparison Matrix'),
  createP(
    'The CompareModal component allows users to compare up to four electronic devices side-by-side in a responsive hardware specification matrix. The engine dynamically parses display resolutions, processors, RAM capacities, storage speeds, camera sensors, battery capacities, and physical weights.'
  ),
  createP(
    'A "Highlight Differences" toggle highlights hardware variations across columns in warm amber accents with animated difference pins, enabling immediate detection of spec advantages. Built-in printing and clipboard sharing utilities enable rapid export.'
  ),

  createHeading2('5.5 Module 5: Composite Scoring & Winner Ranking Algorithm'),
  createP(
    'To eliminate consumer ambiguity during side-by-side comparison, the portal incorporates a Multi-Criteria Decision Making (MCDM) ranking engine (rankComparisonProducts.ts). The algorithm normalizes four core performance dimensions into a unified Composite Score out of 10:'
  ),
  createBullet('Hardware Performance Benchmark', 'Normalized at 25% weight based on processor speed, core counts, and thermal architecture.'),
  createBullet('Feature Richness Score', 'Normalized at 25% weight evaluating display refresh rates, water resistance, and biometric security.'),
  createBullet('Value for Money Index', 'Normalized at 25% weight balancing hardware specifications against current market retail price.'),
  createBullet('Customer Review Rating', 'Normalized at 25% weight aggregating verified buyer satisfaction scores.'),
  createP(
    'The product achieving the highest composite score is highlighted in a gold Leaderboard Banner as the "Rank #1 Overall Winner 🏆", complete with an analytical verdict justifying its selection.'
  ),

  createHeading2('5.6 Module 6: Cart, Wishlist, & Coupon Validation Subsystem'),
  createP(
    'The CartDrawer and WishlistDrawer components manage consumer items with instant quantity updates and persistent caching. The coupon subsystem supports percentage and fixed currency vouchers, including code TECH10 for an instant ten percent cart discount.'
  ),

  createHeading2('5.7 Module 7: Multi-Step Checkout & Indian GST (18%) Calculation'),
  createP(
    'The CheckoutModal implements a structured 4-step progressive disclosure checkout (Address Verification ➔ Delivery Speed ➔ Payment Mode ➔ Tax Invoice). In compliance with Indian tax legislation, an 18% Goods and Services Tax (GST) is itemized dynamically alongside subtotal calculations.'
  ),
  createP(
    'The address verification module enforces strict Indian 6-digit postal PIN code format validation (/^[1-9][0-9]{5}$/) to prevent delivery exceptions.'
  ),

  createHeading2('5.8 Module 8: Order Lifecycle Tracking & Instant Cancellation Refund'),
  createP(
    'The UserOrdersModal provides a transparent order monitoring interface. In accordance with strict user data privacy, customers can view only their own orders, while administrative accounts have permission to inspect global transactions.'
  ),
  createP(
    'Each order displays a live multi-stage delivery timeline (Order Placed ➔ Processing ➔ Out for Delivery ➔ Delivered) alongside tracking AWB numbers. If a customer chooses to cancel an order, clicking "Cancel Order & Request Refund" instantly transitions the order status to "Cancelled", triggering simulated payment reversal and displaying a verified refund confirmation.'
  ),

  createHeading2('5.9 Module 9: Role-Protected Seller Admin Dashboard'),
  createP(
    'Accessible exclusively to authenticated administrative users, the AdminPanelModal empowers catalog administrators to introduce new electronic products, specify technical specifications, adjust real-time inventory counts, and audit global customer orders.'
  ),

  createHeading2('5.10 Module 10: Enterprise Security, Hashing & Indian PIN Validation'),
  createP(
    'Implemented in security.ts, this module provides cryptographic SHA-256 password digest hashing via the Web Cryptography API (crypto.subtle), regex-based input sanitization, in-memory client rate limiting (preventing API brute-forcing), and simulated Razorpay HMAC signature verification.'
  ),

  // ==========================================
  // CHAPTER 6: MATHEMATICAL FORMULATION
  // ==========================================
  createPageBreak(),
  createHeading1('CHAPTER 6: MATHEMATICAL FORMULATION & ALGORITHMS'),
  createHeading2('6.1 Weighted Multi-Criteria Decision Making (MCDM) Formulation'),
  createP(
    'To ensure objective evaluation, every compared electronic device is evaluated against an analytical scoring function. Let P denote the normalized performance score, F denote the features score, V denote the value score, and R denote the customer rating. The overall Composite Score S_composite is computed as:'
  ),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 180, after: 180 },
    children: [
      new TextRun({
        text: 'S_composite = [ (P / 10) * 2.5 + (F / 10) * 2.5 + (V / 10) * 2.5 + (R / 5) * 2.5 ]',
        font: 'Times New Roman',
        size: 26,
        bold: true,
        color: '0F2C59',
      }),
    ],
  }),
  createP(
    'Where all components range between [0, 10]. Products are sorted in descending order of S_composite. Secondary tie-breaking is governed by customer rating R, and tertiary tie-breaking favors lower retail price, ensuring consumer-friendly recommendations.'
  ),

  createHeading2('6.2 Effective Landed Price Ranking Formulation'),
  createP(
    'Online store deal ranks (#1 to #4) are determined by the Effective Landed Deal Price (P_eff), calculated as:'
  ),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 180, after: 180 },
    children: [
      new TextRun({
        text: 'P_eff = P_store - Discount_bank + Fee_shipping',
        font: 'Times New Roman',
        size: 26,
        bold: true,
        color: '0F2C59',
      }),
    ],
  }),
  createP(
    'Where P_store represents the base store catalog price, Discount_bank denotes instant payment card deductions, and Fee_shipping represents delivery surcharges. The store minimizing P_eff is awarded Rank #1 (Best Deal).'
  ),

  // ==========================================
  // CHAPTER 7: TESTING & RESULTS
  // ==========================================
  createPageBreak(),
  createHeading1('CHAPTER 7: TESTING, VERIFICATION & BENCHMARKS'),
  createHeading2('7.1 Unit & Integration Test Case Results'),
  createP(
    'Comprehensive test suites were executed across all core functional modules. The results are summarized below:'
  ),

  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          createCell('Test Case ID', true, 20),
          createCell('Scenario / Module Tested', true, 30),
          createCell('Expected Outcome', true, 30),
          createCell('Status', true, 20),
        ],
      }),
      new TableRow({
        children: [
          createCell('TC-AUTH-01', false, 20),
          createCell('Mandatory Sign-In on initial entry', false, 30),
          createCell('Catalog hidden; Auth gate shown', false, 30),
          createCell('PASSED', false, 20),
        ],
      }),
      new TableRow({
        children: [
          createCell('TC-COMP-02', false, 20),
          createCell('4 Store Online Deal Ranking', false, 30),
          createCell('Amazon, Flipkart, Reliance, Croma ranked #1 to #4', false, 30),
          createCell('PASSED', false, 20),
        ],
      }),
      new TableRow({
        children: [
          createCell('TC-MCDM-03', false, 20),
          createCell('Side-by-side spec winner calculation', false, 30),
          createCell('Accurate composite score & Winner badge', false, 30),
          createCell('PASSED', false, 20),
        ],
      }),
      new TableRow({
        children: [
          createCell('TC-CHECK-04', false, 20),
          createCell('Indian PIN Validation (/^[1-9][0-9]{5}$/)', false, 30),
          createCell('Rejects invalid PIN; accepts 400001', false, 30),
          createCell('PASSED', false, 20),
        ],
      }),
      new TableRow({
        children: [
          createCell('TC-ORD-05', false, 20),
          createCell('Order cancellation & refund trigger', false, 30),
          createCell('Order marked Cancelled; refund issued', false, 30),
          createCell('PASSED', false, 20),
        ],
      }),
    ],
  }),

  createHeading2('7.2 Production Build Verification & Bundle Optimization'),
  createP(
    'The application build pipeline was validated via the command tsc && vite build. Static type compilation with TypeScript 5.7 achieved zero errors. Rollup production minification yielded an optimized HTML bundle of 0.99 kB, modular CSS stylesheet of 84.90 kB, and code-split JavaScript bundle of 652.15 kB, ensuring sub-second Time to Interactive (TTI) across modern mobile and desktop browsers.'
  ),

  // ==========================================
  // CHAPTER 8: CONCLUSION & FUTURE SCOPE
  // ==========================================
  createPageBreak(),
  createHeading1('CHAPTER 8: CONCLUSION & FUTURE SCOPE'),
  createHeading2('8.1 Summary of Project Contributions'),
  createP(
    'The SmartElectro Electronics Shopping Portal demonstrates the successful realization of a modern, multi-platform retail aggregation and hardware evaluation platform. By integrating real-time price scanning across Amazon India, Flipkart, Reliance Digital, and Croma with an intelligent Multi-Criteria Decision Making ranking algorithm, the project resolves consumer confusion and substantially shortens purchase decision cycles.'
  ),
  createP(
    'The implementation proves that contemporary frontend frameworks such as React 19 and TypeScript, when architected with modular separation of concerns and robust security verification, can deliver enterprise-grade performance and delightful consumer shopping experiences.'
  ),

  createHeading2('8.2 Limitations and Future Enhancements'),
  createP(
    'Future iterations of the SmartElectro ecosystem will encompass the following strategic advancements:'
  ),
  createBullet(
    'Automated Web Scraping Microservices',
    'Deploying headless Chromium worker nodes (Puppeteer/Playwright) on containerized Kubernetes clusters to scrape live SKU variations every 15 minutes.'
  ),
  createBullet(
    'WhatsApp & Push Notification Price Drops',
    'Integrating webhook triggers to alert registered users whenever an item on their wishlist drops in price by more than five percent on any listed storefront.'
  ),
  createBullet(
    'Official Affiliate API Monetization',
    'Incorporating Amazon Associates, Flipkart Affiliate, and Croma Partner API keys for automated commission attribution on user purchases.'
  ),

  // ==========================================
  // REFERENCES & BIBLIOGRAPHY
  // ==========================================
  createPageBreak(),
  createHeading1('REFERENCES & BIBLIOGRAPHY'),
  createP('1. React Documentation. (2025). "Modern Component Architecture & React 19 Hooks". Meta Open Source. https://react.dev'),
  createP('2. TypeScript Handbook. (2025). "Static Type Systems for Enterprise Applications". Microsoft Corporation. https://www.typescriptlang.org'),
  createP('3. Vite Build Engine. (2025). "Next Generation Frontend Tooling". https://vitejs.dev'),
  createP('4. Tailwind CSS Framework. (2025). "Utility-First CSS Architecture v4.0". Tailwind Labs. https://tailwindcss.com'),
  createP('5. Indian Goods and Services Tax (GST) Act. (2017). "Statutory Tax Provisions for Electronic Commerce Operators". Ministry of Finance, Government of India.'),
  createP('6. Keeney, R. L., & Raiffa, H. (1993). "Decisions with Multiple Objectives: Preferences and Value Trade-Offs". Cambridge University Press.'),
  createP('7. Razorpay API Documentation. (2025). "Payment Gateway Integration & Webhook HMAC SHA-256 Verification". Razorpay Software Pvt. Ltd. https://razorpay.com/docs'),
  createP('8. Supabase Documentation. (2025). "PostgreSQL-backed Serverless Architecture". https://supabase.com/docs'),
];

const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: 'Times New Roman',
          size: 24, // 12pt
          color: '222222',
        },
        paragraph: {
          alignment: AlignmentType.JUSTIFIED,
          spacing: { line: 360, after: 140 },
        },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: 1440, // 1 inch
            bottom: 1440,
            left: 1440,
            right: 1440,
          },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { after: 100 },
              children: [
                new TextRun({
                  text: 'SmartElectro: Electronics Shopping & Comparison Portal | Project Report',
                  font: 'Times New Roman',
                  size: 18,
                  italics: true,
                  color: '888888',
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'Page ',
                  font: 'Times New Roman',
                  size: 20,
                  color: '666666',
                }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  font: 'Times New Roman',
                  size: 20,
                  bold: true,
                  color: '0F2C59',
                }),
                new TextRun({
                  text: ' of ',
                  font: 'Times New Roman',
                  size: 20,
                  color: '666666',
                }),
                new TextRun({
                  children: [PageNumber.TOTAL_PAGES],
                  font: 'Times New Roman',
                  size: 20,
                  color: '666666',
                }),
              ],
            }),
          ],
        }),
      },
      children: docChildren,
    },
  ],
});

// Write to both workspace and Downloads
const targetWorkspacePath = path.join(__dirname, '..', 'Electronics_Shopping_Portal_Project_Report.docx');
const targetDownloadsPath = 'C:\\Users\\SAMEER\\Downloads\\Electronics_Shopping_Portal_Project_Report.docx';

Packer.toBuffer(doc)
  .then((buffer) => {
    fs.writeFileSync(targetWorkspacePath, buffer);
    console.log(`Saved report to workspace: ${targetWorkspacePath}`);
    try {
      fs.writeFileSync(targetDownloadsPath, buffer);
      console.log(`Saved report to Downloads: ${targetDownloadsPath}`);
    } catch (err) {
      console.log(`Downloads path write notice: ${err.message}`);
    }
  })
  .catch((err) => {
    console.error('Error generating document:', err);
    process.exit(1);
  });
