/**
 * Every visitor-facing string on the Commercial & Industrial page, in the three
 * locales the site ships (EN / 中文 / BM).
 *
 * The rest of the site keeps its copy in lib/i18n/dictionaries; this page keeps
 * its own because marketing edits it on its own cycle. Structure data (projects,
 * client roster, trust stats) stays in content.ts, because those come from the
 * CMS and are not translated there yet.
 *
 * House style for this page: no em dashes anywhere in the copy.
 */

import type { Locale } from "@/lib/i18n";

export type CiCopy = {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    /** Split so the hero can paint a highlight band behind the figure. */
    title: string;
    titleAccent: string;
    /** Trails the accent in languages that do not end the line on it. */
    titleAfter?: string;
    body: string;
    valueProps: string[];
    primaryCta: string;
    secondaryCta: string;
  };
  clients: { heading: string };
  projects: {
    eyebrow: string;
    title: string;
    body: string;
    videoLink: string;
    viewDetails: string;
    /** "{client}" and "{capacity}" are substituted at render time. */
    viewDetailsFor: string;
    prev: string;
    next: string;
    pause: string;
    resume: string;
    close: string;
    closeDialog: string;
    client: string;
    category: string;
    capacity: string;
    modules: string;
    quoteCta: string;
  };
  bess: {
    eyebrow: string;
    title: string;
    body: string;
    points: { icon: "peak" | "battery" | "utility" | "gear"; title: string; bullets: string[] }[];
    cta: string;
    foot: string;
  };
  why: { eyebrow: string; title: string };
  pillars: { icon: "tax" | "wallet" | "shield" | "gear"; title: string; body: string }[];
  faq: { eyebrow: string; title: string };
  finalCta: { title: string; body: string; cta: string };
  credentialLine: string[];
  form: {
    title: string;
    body: string;
    honeypot: string;
    salutation: string;
    select: string;
    fullName: string;
    fullNamePlaceholder: string;
    company: string;
    companyPlaceholder: string;
    role: string;
    rolePlaceholder: string;
    industry: string;
    industryPlaceholder: string;
    phone: string;
    email: string;
    state: string;
    statePlaceholder: string;
    bill: string;
    billPlaceholder: string;
    submit: string;
    submitting: string;
    consent: string;
  };
  thankYou: {
    metaTitle: string;
    eyebrow: string;
    title: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
  };
  explore: {
    clients: string;
    projects: string;
    bess: string;
    why: string;
    faq: string;
    assessment: string;
  };
};

const en: CiCopy = {
  meta: {
    title: "Commercial & Industrial Solar Malaysia | MAQO Solar",
    description:
      "Cut your company's electricity bill by up to 70% with MAQO Solar. ST Class A & CIDB G7 certified EPCC for factories, warehouses and commercial buildings.",
  },
  hero: {
    eyebrow: "Commercial & Industrial Solar Solutions",
    title: "Cut Your Company's Electric Bill & Save Up to ",
    titleAccent: "70%",
    body:
      "Beat rising tariffs and lock in low energy costs for the next 25 years with customized solar PV solutions.",
    valueProps: ["Zero Upfront Capital Options", "Tier-1 Solar Technology"],
    primaryCta: "Get Your Free Assessment",
    secondaryCta: "See our projects",
  },
  clients: {
    heading: "Trusted by Leading Commercial & Industrial Brands Across Malaysia",
  },
  projects: {
    eyebrow: "Our work",
    title: "Our Latest Commercial Projects",
    body:
      "From a single shoplot roof to a 10 MWp solar farm, delivered end to end by our own engineering and installation teams, on live sites.",
    videoLink: "Watch our commercial & industrial project showcase",
    viewDetails: "View details",
    viewDetailsFor: "View details for {client}, {capacity}",
    prev: "Previous project",
    next: "Next project",
    pause: "Pause automatic sliding",
    resume: "Resume automatic sliding",
    close: "Close",
    closeDialog: "Close project details",
    client: "Client",
    category: "Category",
    capacity: "Capacity",
    modules: "Modules",
    quoteCta: "Get a quote for your site",
  },
  bess: {
    eyebrow: "Battery Energy Storage",
    title: "BESS",
    body:
      "On a TNB maximum demand tariff, one half-hour spike sets the charge for the entire month, and solar alone cannot flatten it. A Battery Energy Storage System discharges into those peaks, so the meter never records them.",
    points: [
      {
        icon: "peak",
        title: "AI dynamic peak shaving",
        bullets: [
          "Reads your load in real time",
          "Discharges the moment demand climbs toward your ceiling",
          "Nothing changes on the production floor, nobody watches a screen",
        ],
      },
      {
        icon: "battery",
        title: "Charges from solar or off-peak grid",
        bullets: [
          "Stores the midday solar generation you're currently exporting",
          "Or charges from the grid while the tariff is at its lowest",
          "Works with an existing rooftop solar system, or on its own",
        ],
      },
      {
        icon: "utility",
        title: "Built around your utility tariff",
        bullets: [
          "Sized against your TNB maximum demand and Time of Use profile",
          "Dispatches to the half-hour intervals your tariff actually bills",
          "Nothing changes on your TNB supply, meter or connection",
        ],
      },
      {
        icon: "gear",
        title: "Metered, so the saving is visible",
        bullets: [
          "Metering ties the battery to your existing rooftop solar system and the grid",
          "See exactly what the battery shaved off your bill",
          "Reported every month",
        ],
      },
    ],
    cta: "Learn more about BESS",
    foot:
      "Supplied and commissioned by the same in-house licensed wiremen and chargemen who build our solar, and designed to sit alongside your existing rooftop solar system.",
  },
  why: { eyebrow: "Why MAQO", title: "Built for commercial and industrial scale" },
  pillars: [
    {
      icon: "tax",
      title: "Tax Incentives on Capital Outlay",
      body:
        "Qualifying solar assets can attract government tax incentives, offsetting a substantial share of your capital outlay against statutory income. We prepare the documentation your tax agent needs.",
    },
    {
      icon: "wallet",
      title: "PPA / Solar Leasing",
      body:
        "RM0 upfront CAPEX. MAQO funds, builds, owns and maintains the system on your roof; you simply buy the electricity it produces at a rate below the tariff, from day one.",
    },
    {
      icon: "shield",
      title: "Premium Equipment & 25-Year Warranty",
      body:
        "Premium panels and inverters only, backed by a 25-year performance warranty on the modules.",
    },
    {
      icon: "gear",
      title: "End-to-End EPCC",
      body:
        "Engineering, Procurement, Construction and Commissioning under one contract, delivered by our own licensed wiremen and chargemen. No subcontracting of the critical works.",
    },
  ],
  faq: { eyebrow: "FAQ", title: "Frequently asked questions" },
  finalCta: {
    title: "Ready to Lock in Your Energy Costs for the Next 25 Years?",
    body:
      "Send us a recent TNB bill and a roof plan. We will come back with an indicative system size, an ROI projection and the funding options open to your business.",
    cta: "Get Free Solar Assessment & ROI Quote",
  },
  credentialLine: ["ST Class A", "CIDB G7", "SEDA Registered", "ISO 9001:2015"],
  form: {
    title: "Request your free C&I solar assessment",
    body:
      "Tell us about your site and we will come back with an indicative system size, savings and payback.",
    honeypot: "Leave this field empty",
    salutation: "Salutation",
    select: "Select",
    fullName: "Full name",
    fullNamePlaceholder: "Your name",
    company: "Company name",
    companyPlaceholder: "Registered company name",
    role: "Role in Organization",
    rolePlaceholder: "Select a role",
    industry: "Industry / sector",
    industryPlaceholder: "Select your industry",
    phone: "Mobile number",
    email: "Work email",
    state: "Site location",
    statePlaceholder: "Select a state",
    bill: "Average monthly TNB bill",
    billPlaceholder: "Select a range",
    submit: "Get Free Solar Assessment & ROI Quote",
    submitting: "Submitting…",
    consent: "By submitting, you agree to be contacted by MAQO Solar about your enquiry.",
  },
  thankYou: {
    metaTitle: "Thank You | MAQO Solar",
    eyebrow: "Enquiry Logged",
    title: "Thank you, our commercial team has your enquiry.",
    body:
      "A dedicated C&I energy consultant will contact you within 1 business day to schedule a site assessment and load review.",
    primaryCta: "Learn more about MAQO",
    secondaryCta: "Back to homepage",
  },
  explore: {
    clients: "Client Roster",
    projects: "Our Projects",
    bess: "Battery Storage",
    why: "Why MAQO",
    faq: "FAQ",
    assessment: "Get an Assessment",
  },
};

const cn: CiCopy = {
  meta: {
    title: "马来西亚工商业太阳能 | MAQO Solar",
    description:
      "MAQO Solar 助您削减公司电费高达 70%。ST A 级、CIDB G7 认证的工商业太阳能 EPCC 承包商，专注工厂、仓库与商业楼宇。",
  },
  hero: {
    eyebrow: "工商业太阳能解决方案",
    title: "削减公司电费，最高节省 ",
    titleAccent: "70%",
    body: "以量身定制的太阳能系统应对电价上涨，锁定未来 25 年的低能源成本。",
    valueProps: ["零前期资本方案", "一线品牌太阳能技术"],
    primaryCta: "获取免费评估",
    secondaryCta: "查看我们的项目",
  },
  clients: { heading: "马来西亚各领先工商业品牌的共同选择" },
  projects: {
    eyebrow: "我们的实绩",
    title: "最新工商业项目",
    body:
      "从单间店屋屋顶到 10 MWp 太阳能电站，全程由我们自己的工程与安装团队在实际运作中的场地上完成。",
    videoLink: "观看我们的工商业项目实录",
    viewDetails: "查看详情",
    viewDetailsFor: "查看 {client} 的项目详情，{capacity}",
    prev: "上一个项目",
    next: "下一个项目",
    pause: "暂停自动播放",
    resume: "继续自动播放",
    close: "关闭",
    closeDialog: "关闭项目详情",
    client: "客户",
    category: "类别",
    capacity: "装机容量",
    modules: "组件数量",
    quoteCta: "为您的场地获取报价",
  },
  bess: {
    eyebrow: "电池储能系统",
    title: "BESS",
    body:
      "在 TNB 最高需求电价下，短短半小时的尖峰就决定了整个月的需求费，而单靠太阳能无法削平它。电池储能系统会在尖峰时段放电，让电表记录不到这些峰值。",
    points: [
      {
        icon: "peak",
        title: "AI 动态削峰",
        bullets: [
          "实时读取您的用电负载",
          "需求一接近上限便立即放电",
          "生产线照常运作，无需专人盯着屏幕",
        ],
      },
      {
        icon: "battery",
        title: "以太阳能或离峰电网充电",
        bullets: [
          "储存您目前外销出去的中午太阳能发电量",
          "或在电价最低的时段从电网充电",
          "可搭配现有屋顶太阳能系统，亦可独立运行",
        ],
      },
      {
        icon: "utility",
        title: "依您的电力公司电价量身设计",
        bullets: [
          "按您的 TNB 最高需求与分时电价用电曲线选型",
          "针对电费实际计算的每半小时区间进行放电",
          "您的 TNB 供电、电表与接线均无需改动",
        ],
      },
      {
        icon: "gear",
        title: "全程计量，省了多少一目了然",
        bullets: [
          "计量系统将电池与您现有的屋顶太阳能系统及电网连成一体",
          "清楚看到电池为您削掉的电费",
          "每月提供报告",
        ],
      },
    ],
    cta: "了解更多 BESS 资讯",
    foot:
      "由建设我们太阳能系统的同一组自有持牌电气技师与电气负责人供应及调试，并可与您现有的屋顶太阳能系统并存运行。",
  },
  why: { eyebrow: "为何选择 MAQO", title: "为工商业规模而生" },
  pillars: [
    {
      icon: "tax",
      title: "资本支出享税务优惠",
      body:
        "符合条件的太阳能资产可享政府税务优惠，将大部分资本支出从法定收入中抵扣。我们会备妥您的税务代理所需的文件。",
    },
    {
      icon: "wallet",
      title: "PPA／太阳能租赁",
      body:
        "前期资本支出 RM0。MAQO 出资、建设、拥有并维护您屋顶上的系统；您只需以低于电价的费率购买它所发的电，从第一天起即可受惠。",
    },
    {
      icon: "shield",
      title: "优质设备与 25 年质保",
      body: "只采用优质组件与逆变器，组件享有 25 年发电性能质保。",
    },
    {
      icon: "gear",
      title: "一站式 EPCC",
      body:
        "设计、采购、施工与调试统一合约，由我们自有的持牌电气技师与电气负责人执行，关键工程绝不外包。",
    },
  ],
  faq: { eyebrow: "常见问题", title: "常见问题解答" },
  finalCta: {
    title: "准备好锁定未来 25 年的能源成本了吗？",
    body:
      "把最近一期的 TNB 电费单和屋顶平面图发给我们，我们将回复建议的系统容量、投资回报预测，以及贵公司可选的融资方案。",
    cta: "获取免费太阳能评估与投资回报报价",
  },
  credentialLine: ["ST A 级", "CIDB G7", "SEDA 注册", "ISO 9001:2015"],
  form: {
    title: "申请免费工商业太阳能评估",
    body: "告诉我们您的场地情况，我们将回复建议系统容量、节省金额与回本期。",
    honeypot: "请勿填写此栏",
    salutation: "称谓",
    select: "请选择",
    fullName: "姓名",
    fullNamePlaceholder: "您的姓名",
    company: "公司名称",
    companyPlaceholder: "注册公司名称",
    role: "在机构中的职位",
    rolePlaceholder: "请选择职位",
    industry: "行业／领域",
    industryPlaceholder: "请选择您的行业",
    phone: "手机号码",
    email: "公司电邮",
    state: "场地地点",
    statePlaceholder: "请选择州属",
    bill: "每月平均 TNB 电费",
    billPlaceholder: "请选择范围",
    submit: "获取免费太阳能评估与投资回报报价",
    submitting: "提交中…",
    consent: "提交即表示您同意 MAQO Solar 就您的询问与您联系。",
  },
  thankYou: {
    metaTitle: "感谢您的查询 | MAQO Solar",
    eyebrow: "查询已记录",
    title: "谢谢您，我们的工商业团队已收到您的查询。",
    body: "专属工商业能源顾问将在 1 个工作日内与您联系，安排现场评估与用电分析。",
    primaryCta: "了解更多关于 MAQO",
    secondaryCta: "返回首页",
  },
  explore: {
    clients: "客户名单",
    projects: "我们的项目",
    bess: "电池储能",
    why: "为何选择 MAQO",
    faq: "常见问题",
    assessment: "申请评估",
  },
};

const ms: CiCopy = {
  meta: {
    title: "Solar Komersial & Industri Malaysia | MAQO Solar",
    description:
      "Kurangkan bil elektrik syarikat anda sehingga 70% bersama MAQO Solar. EPCC bertauliah ST Kelas A & CIDB G7 untuk kilang, gudang dan bangunan komersial.",
  },
  hero: {
    eyebrow: "Penyelesaian Solar Komersial & Industri",
    title: "Kurangkan Bil Elektrik Syarikat Anda & Jimat Sehingga ",
    titleAccent: "70%",
    body:
      "Atasi kenaikan tarif dan kunci kos tenaga yang rendah untuk 25 tahun akan datang dengan sistem solar PV yang direka khas.",
    valueProps: ["Pilihan Tanpa Modal Awal", "Teknologi Solar Tier-1"],
    primaryCta: "Dapatkan Penilaian Percuma",
    secondaryCta: "Lihat projek kami",
  },
  clients: {
    heading: "Dipercayai Jenama Komersial & Industri Terkemuka Di Seluruh Malaysia",
  },
  projects: {
    eyebrow: "Kerja kami",
    title: "Projek Komersial Terkini Kami",
    body:
      "Daripada satu bumbung kedai sehingga ladang solar 10 MWp, disiapkan sepenuhnya oleh pasukan kejuruteraan dan pemasangan kami sendiri, di tapak yang sedang beroperasi.",
    videoLink: "Tonton pameran projek komersial & industri kami",
    viewDetails: "Lihat butiran",
    viewDetailsFor: "Lihat butiran untuk {client}, {capacity}",
    prev: "Projek sebelumnya",
    next: "Projek seterusnya",
    pause: "Jeda peralihan automatik",
    resume: "Sambung peralihan automatik",
    close: "Tutup",
    closeDialog: "Tutup butiran projek",
    client: "Pelanggan",
    category: "Kategori",
    capacity: "Kapasiti",
    modules: "Modul",
    quoteCta: "Dapatkan sebut harga untuk tapak anda",
  },
  bess: {
    eyebrow: "Sistem Simpanan Tenaga Bateri",
    title: "BESS",
    body:
      "Di bawah tarif permintaan maksimum TNB, satu lonjakan setengah jam sudah menetapkan caj untuk sebulan penuh, dan solar sahaja tidak mampu meratakannya. Sistem Simpanan Tenaga Bateri melepaskan kuasa pada waktu puncak itu, jadi meter tidak pernah merekodkannya.",
    points: [
      {
        icon: "peak",
        title: "Pemotongan puncak dinamik AI",
        bullets: [
          "Membaca beban anda secara masa nyata",
          "Melepaskan kuasa sebaik permintaan menghampiri had anda",
          "Tiada apa berubah di lantai pengeluaran, tiada sesiapa perlu memantau skrin",
        ],
      },
      {
        icon: "battery",
        title: "Dicas daripada solar atau grid luar puncak",
        bullets: [
          "Menyimpan janaan solar tengah hari yang kini anda eksport",
          "Atau mengecas daripada grid ketika tarif berada di paras terendah",
          "Berfungsi dengan sistem solar bumbung sedia ada, atau secara berdiri sendiri",
        ],
      },
      {
        icon: "utility",
        title: "Direka mengikut tarif utiliti anda",
        bullets: [
          "Disaiz mengikut permintaan maksimum TNB dan profil Time of Use anda",
          "Melepaskan kuasa mengikut selang setengah jam yang benar-benar dicaj",
          "Tiada perubahan pada bekalan, meter atau sambungan TNB anda",
        ],
      },
      {
        icon: "gear",
        title: "Bermeter, jadi penjimatan jelas kelihatan",
        bullets: [
          "Pemeteran menghubungkan bateri dengan sistem solar bumbung sedia ada anda dan grid",
          "Lihat dengan tepat berapa yang dipotong bateri daripada bil anda",
          "Dilaporkan setiap bulan",
        ],
      },
    ],
    cta: "Ketahui lebih lanjut tentang BESS",
    foot:
      "Dibekal dan ditauliahkan oleh pendawai dan penjaga jentera berlesen dalaman yang sama membina sistem solar kami, dan direka untuk beroperasi bersama sistem solar bumbung sedia ada anda.",
  },
  why: { eyebrow: "Kenapa MAQO", title: "Dibina untuk skala komersial dan industri" },
  pillars: [
    {
      icon: "tax",
      title: "Insentif Cukai Atas Perbelanjaan Modal",
      body:
        "Aset solar yang layak boleh menikmati insentif cukai kerajaan, mengimbangi sebahagian besar perbelanjaan modal anda terhadap pendapatan berkanun. Kami sediakan dokumen yang diperlukan ejen cukai anda.",
    },
    {
      icon: "wallet",
      title: "PPA / Pajakan Solar",
      body:
        "CAPEX awal RM0. MAQO membiaya, membina, memiliki dan menyelenggara sistem di bumbung anda; anda hanya membeli elektrik yang dijana pada kadar di bawah tarif, bermula hari pertama.",
    },
    {
      icon: "shield",
      title: "Peralatan Premium & Waranti 25 Tahun",
      body:
        "Panel dan inverter premium sahaja, disokong waranti prestasi 25 tahun ke atas modul.",
    },
    {
      icon: "gear",
      title: "EPCC Hujung ke Hujung",
      body:
        "Kejuruteraan, Perolehan, Pembinaan dan Pentauliahan di bawah satu kontrak, dilaksanakan oleh pendawai dan penjaga jentera berlesen kami sendiri. Kerja kritikal tidak disubkontrakkan.",
    },
  ],
  faq: { eyebrow: "FAQ", title: "Soalan lazim" },
  finalCta: {
    title: "Sedia Mengunci Kos Tenaga Anda Untuk 25 Tahun Akan Datang?",
    body:
      "Hantarkan bil TNB terkini dan pelan bumbung anda. Kami akan kembali dengan saiz sistem indikatif, unjuran ROI dan pilihan pembiayaan yang terbuka untuk perniagaan anda.",
    cta: "Dapatkan Penilaian Solar & Sebut Harga ROI Percuma",
  },
  credentialLine: ["ST Kelas A", "CIDB G7", "Berdaftar SEDA", "ISO 9001:2015"],
  form: {
    title: "Mohon penilaian solar C&I percuma anda",
    body:
      "Beritahu kami tentang tapak anda dan kami akan kembali dengan saiz sistem indikatif, penjimatan dan tempoh bayar balik.",
    honeypot: "Biarkan ruangan ini kosong",
    salutation: "Gelaran",
    select: "Pilih",
    fullName: "Nama penuh",
    fullNamePlaceholder: "Nama anda",
    company: "Nama syarikat",
    companyPlaceholder: "Nama syarikat berdaftar",
    role: "Peranan dalam Organisasi",
    rolePlaceholder: "Pilih peranan",
    industry: "Industri / sektor",
    industryPlaceholder: "Pilih industri anda",
    phone: "Nombor telefon bimbit",
    email: "E-mel kerja",
    state: "Lokasi tapak",
    statePlaceholder: "Pilih negeri",
    bill: "Purata bil TNB bulanan",
    billPlaceholder: "Pilih julat",
    submit: "Dapatkan Penilaian Solar & Sebut Harga ROI Percuma",
    submitting: "Menghantar…",
    consent:
      "Dengan menghantar, anda bersetuju untuk dihubungi oleh MAQO Solar berkenaan pertanyaan anda.",
  },
  thankYou: {
    metaTitle: "Terima Kasih | MAQO Solar",
    eyebrow: "Pertanyaan Direkodkan",
    title: "Terima kasih, pasukan komersial kami telah menerima pertanyaan anda.",
    body:
      "Perunding tenaga C&I khusus akan menghubungi anda dalam masa 1 hari bekerja untuk menetapkan penilaian tapak dan semakan beban.",
    primaryCta: "Ketahui lebih lanjut tentang MAQO",
    secondaryCta: "Kembali ke laman utama",
  },
  explore: {
    clients: "Senarai Pelanggan",
    projects: "Projek Kami",
    bess: "Simpanan Bateri",
    why: "Kenapa MAQO",
    faq: "FAQ",
    assessment: "Dapatkan Penilaian",
  },
};

export const CI_COPY: Record<Locale, CiCopy> = { en, cn, ms };

export function getCiCopy(locale: Locale): CiCopy {
  return CI_COPY[locale] ?? en;
}
