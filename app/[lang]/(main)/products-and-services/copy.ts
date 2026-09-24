import type { Locale } from "@/lib/i18n";
import type { Category } from "./products";

// Page and UI wording for /products-and-services. Product content itself lives
// in products.ts (English), products.cn.ts and products.ms.ts.

export type CatalogUi = {
  categories: Record<Category, string>;
  allProducts: string;
  filterLabel: string;
  showing: (n: number) => string;
  viewProduct: string;
  viewProductLabel: (name: string) => string;
  close: string;
  quoteWith: (brand: string) => string;
  keyFeatures: string;
  benefits: string;
  specs: string;
  applications: string;
  faq: string;
  images: string;
};

export type PageCopy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  intro: string;
  servicesEyebrow: string;
  servicesLead: string;
  servicesAccent: string;
  services: { title: string; body: string }[];
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
  ui: CatalogUi;
};

const en: PageCopy = {
  metaTitle: "Our Solar Products | MAQO Solar",
  metaDescription: "AIKO solar panels, Sigenergy and FoxESS inverters and batteries installed by MAQO Solar.",
  eyebrow: "Products",
  titleLead: "Our Solar",
  titleAccent: "Products",
  intro: "The panels, inverters and batteries we install on Malaysian roofs. Pick a category, open any product for the full specs.",
  servicesEyebrow: "Powering with quality",
  servicesLead: "Our",
  servicesAccent: "Services",
  services: [
    { title: "System Design", body: "We design your solar system around your actual energy usage and electricity bill." },
    { title: "Financial Planning", body: "Flexible financing plans so you can go solar, generate your own power and save money." },
    { title: "Energy Consultation", body: "Talk to our team to understand your return on investment before any panel goes up." },
    { title: "Operation & Maintenance", body: "O&M service when you need it, to keep your system running at its best." },
    { title: "ATAP Solutions", body: "Solar ATAP setups tailored to Malaysian homes and businesses to maximise your savings." },
    { title: "Site Survey", body: "A detailed on-site survey of your roof and wiring, so the system we propose fits your property." },
  ],
  ctaTitle: "Not sure which combination fits your roof?",
  ctaBody: "Send us your bill and we will size the panels, inverter and battery for you.",
  ctaButton: "Get my free system sizing",
  ui: {
    categories: { panels: "Solar Panels", inverters: "Inverters", batteries: "Batteries" },
    allProducts: "All products",
    filterLabel: "Filter by category",
    showing: (n) => `Showing ${n} products`,
    viewProduct: "View product",
    viewProductLabel: (name) => `View product: ${name}`,
    close: "Close product details",
    quoteWith: (brand) => `Get a quote with ${brand}`,
    keyFeatures: "Key features",
    benefits: "What it means for you",
    specs: "Technical specifications",
    applications: "Where it fits",
    faq: "Common questions",
    images: "Product images",
  },
};

const cn: PageCopy = {
  metaTitle: "我们的太阳能产品 | MAQO Solar",
  metaDescription: "MAQO Solar 安装的 AIKO 太阳能板，以及 Sigenergy 与 FoxESS 逆变器和电池。",
  eyebrow: "产品",
  titleLead: "我们的太阳能",
  titleAccent: "产品",
  intro: "我们在马来西亚屋顶上安装的太阳能板、逆变器和电池。选择类别，点开任何产品即可查看完整规格。",
  servicesEyebrow: "以品质供电",
  servicesLead: "我们的",
  servicesAccent: "服务",
  services: [
    { title: "系统设计", body: "根据您实际的用电量和电费单，为您设计太阳能系统。" },
    { title: "财务规划", body: "灵活的分期付款方案，让您轻松装太阳能、自己发电、节省开支。" },
    { title: "能源咨询", body: "在安装任何太阳能板之前，与我们的团队一起了解您的投资回报。" },
    { title: "运营与维护", body: "按需提供运维服务，让您的系统保持最佳运行状态。" },
    { title: "ATAP 方案", body: "为马来西亚住宅和企业量身定制的 Solar ATAP 方案，帮您节省更多。" },
    { title: "现场勘察", body: "详细勘察您的屋顶和线路，确保我们建议的系统适合您的房产。" },
  ],
  ctaTitle: "不确定哪种组合适合您的屋顶？",
  ctaBody: "把电费单发给我们，我们为您配置合适的太阳能板、逆变器和电池。",
  ctaButton: "免费为我配置系统",
  ui: {
    categories: { panels: "太阳能板", inverters: "逆变器", batteries: "电池" },
    allProducts: "全部产品",
    filterLabel: "按类别筛选",
    showing: (n) => `显示 ${n} 个产品`,
    viewProduct: "查看产品",
    viewProductLabel: (name) => `查看产品：${name}`,
    close: "关闭产品详情",
    quoteWith: (brand) => `获取 ${brand} 报价`,
    keyFeatures: "主要特点",
    benefits: "对您的好处",
    specs: "技术规格",
    applications: "适用场景",
    faq: "常见问题",
    images: "产品图片",
  },
};

const ms: PageCopy = {
  metaTitle: "Produk Solar Kami | MAQO Solar",
  metaDescription: "Panel solar AIKO, serta inverter dan bateri Sigenergy dan FoxESS yang dipasang oleh MAQO Solar.",
  eyebrow: "Produk",
  titleLead: "Produk",
  titleAccent: "Solar Kami",
  intro: "Panel, inverter dan bateri yang kami pasang di bumbung Malaysia. Pilih kategori, buka mana-mana produk untuk spesifikasi penuh.",
  servicesEyebrow: "Tenaga berkualiti",
  servicesLead: "Perkhidmatan",
  servicesAccent: "Kami",
  services: [
    { title: "Reka Bentuk Sistem", body: "Kami mereka sistem solar anda berdasarkan penggunaan tenaga dan bil elektrik sebenar anda." },
    { title: "Perancangan Kewangan", body: "Pelan pembiayaan fleksibel supaya anda boleh beralih ke solar, menjana tenaga sendiri dan berjimat." },
    { title: "Perundingan Tenaga", body: "Berbincang dengan pasukan kami untuk memahami pulangan pelaburan anda sebelum sebarang panel dipasang." },
    { title: "Operasi & Penyelenggaraan", body: "Perkhidmatan O&M apabila anda memerlukannya, supaya sistem anda sentiasa berfungsi dengan terbaik." },
    { title: "Penyelesaian ATAP", body: "Pemasangan Solar ATAP yang disesuaikan untuk rumah dan perniagaan di Malaysia bagi memaksimumkan penjimatan anda." },
    { title: "Tinjauan Tapak", body: "Tinjauan terperinci di bumbung dan pendawaian anda, supaya sistem yang kami cadangkan sesuai dengan hartanah anda." },
  ],
  ctaTitle: "Tidak pasti gabungan mana yang sesuai untuk bumbung anda?",
  ctaBody: "Hantar bil anda dan kami akan saiz panel, inverter dan bateri untuk anda.",
  ctaButton: "Dapatkan saiz sistem percuma",
  ui: {
    categories: { panels: "Panel Solar", inverters: "Inverter", batteries: "Bateri" },
    allProducts: "Semua produk",
    filterLabel: "Tapis mengikut kategori",
    showing: (n) => `Memaparkan ${n} produk`,
    viewProduct: "Lihat produk",
    viewProductLabel: (name) => `Lihat produk: ${name}`,
    close: "Tutup butiran produk",
    quoteWith: (brand) => `Dapatkan sebut harga ${brand}`,
    keyFeatures: "Ciri utama",
    benefits: "Manfaat untuk anda",
    specs: "Spesifikasi teknikal",
    applications: "Sesuai untuk",
    faq: "Soalan lazim",
    images: "Gambar produk",
  },
};

export const PAGE_COPY: Record<Locale, PageCopy> = { en, cn, ms };
