/**
 * Every visitor-facing string on the MAQO Engineering homepage, in the three
 * locales the site ships (EN / 中文 / BM).
 *
 * Kept here rather than in lib/i18n/dictionaries for the same reason the C&I
 * page keeps its own copy.ts: marketing edits the homepage on its own cycle,
 * and this page's copy is structural enough (split headlines, per-project
 * cards) that folding it into the shared Dictionary would bloat every page's
 * bundle of strings.
 *
 * House style, matching the C&I page: no em dashes anywhere in the copy.
 */

import type { Locale } from "@/lib/i18n";

export type HomeProject = {
  /** Category chip on the photo. */
  chip: string;
  /** Left half of the meta line. */
  location: string;
  /** Right half of the meta line, in the accent colour. */
  metric: string;
  title: string;
  body: string;
  imageAlt: string;
};

export type HomeCopy = {
  meta: { title: string; description: string };

  hero: {
    eyebrow: string;
    /** Split across two lines so each language can break where it needs to. */
    titleLine1: string;
    titleLine2Lead: string;
    titleAccent: string;
    titleTail: string;
    sub: string;
    primaryCta: string;
    tel: string;
    prompt: string;
    /** The annotation pinned to the plant photograph, drawing-style. */
    note: { title: string; meta: string };
  };

  paths: {
    res: { who: string; title: string; desc: string; cta: string };
    ci: { who: string; title: string; desc: string; cta: string };
  };

  md: { quote: string; name: string; role: string; portraitAlt: string };

  numbers: {
    eyebrow: string;
    note: string;
    /** `value` is animated by CountUpFigure, so keep the numeric part first. */
    items: { value: string; label: string }[];
  };

  work: {
    eyebrow: string;
    title: string;
    lede: string;
    resHeading: string;
    resCount: string;
    ciHeading: string;
    ciCount: string;
    viewProject: string;
    seeAllRes: string;
    seeAllCi: string;
    /** Fills a C&I card whose CMS row has no summary, from its module count. */
    ciFallbackBody: string;
    ciFallbackBodyNoPanels: string;
  };

  residentialProjects: HomeProject[];

  process: {
    eyebrow: string;
    title: string;
    lede: string;
    steps: { when: string; title: string; body: string }[];
  };

  routes: {
    eyebrow: string;
    title: string;
    items: { title: string; body: string }[];
  };

  faq: { eyebrow: string; title: string; body: string; cta: string };

  finalCta: { body: string; primary: string; secondary: string; foot: string; emailLabel: string };
};

const en: HomeCopy = {
  meta: {
    title: "MAQO Solar Malaysia | Residential & Commercial Solar Engineering",
    description:
      "MAQO Engineering Sdn Bhd designs, builds and maintains rooftop solar for Malaysian homes and businesses. ST Class A, CIDB G7, SEDA registered and ISO 9001:2015 certified, with 1,000+ systems installed since 2013.",
  },

  hero: {
    eyebrow: "Est. 2013 · ST Class A · CIDB G7",
    titleLine1: "Your roof, engineered",
    titleLine2Lead: "to ",
    titleAccent: "pay for itself",
    titleTail: ".",
    sub: "Licensed solar engineering for Malaysian homes and businesses, designed, built and maintained in house since 2013.",
    primaryCta: "Get a free solar consultation",
    tel: "or call 03-8069 1706",
    prompt: "Which one are you?",
    note: { title: "Spritzer bottling plant", meta: "1,071 kWp · 2,380 modules" },
  },

  paths: {
    res: {
      who: "I'm a homeowner",
      title: "Residential Solar",
      desc: "Free home assessment, a fixed written quote, and up to 90% off your TNB bill.",
      cta: "Explore residential solar",
    },
    ci: {
      who: "I'm a business owner",
      title: "Commercial & Industrial Solar",
      desc: "Lock your energy cost for 25 years, with EPCC, PPA or zero upfront capital.",
      cta: "Explore C&I solar",
    },
  },

  md: {
    quote:
      "We're in it for you, and for a better planet. Our mission is to reshape the energy landscape by making solar power accessible and affordable for everyone.",
    name: "Kong Kok King",
    role: "Managing Director · M.Eng, University of Tokyo",
    portraitAlt: "Kong Kok King, Managing Director of MAQO Engineering Sdn Bhd",
  },

  numbers: {
    eyebrow: "MAQO by the numbers",
    note: "Every system under the same licence, by the same in-house crew.",
    items: [
      { value: "1,000+", label: "Residential systems commissioned" },
      { value: "500+", label: "Commercial & industrial clients" },
      { value: "13+", label: "Years of Malaysian solar experience" },
    ],
  },

  work: {
    eyebrow: "Selected work",
    title: "From a single terrace roof in Subang Jaya to 2,380 panels over a bottling plant.",
    lede: "Same licence, same crew, same commissioning standard. Only the scale changes.",
    resHeading: "Residential",
    resCount: "03 of 1,000+ homes",
    ciHeading: "Commercial & Industrial",
    ciCount: "03 of 500+ clients",
    viewProject: "View project",
    seeAllRes: "See all residential work",
    seeAllCi: "See all C&I work",
    ciFallbackBody: "{panels}, designed, installed and commissioned by MAQO under a single ST Class A licence.",
    ciFallbackBodyNoPanels: "Designed, installed and commissioned by MAQO under a single ST Class A licence.",
  },

  residentialProjects: [
    {
      chip: "Terrace home",
      location: "Subang Jaya, Selangor",
      metric: "RM680 to RM90 / month",
      title: "Bill cut to under RM90 a month",
      body: "A hybrid system with battery storage on a double-storey terrace. MAQO handled the TNB application, the inspection and the meter changeover.",
      imageAlt: "MAQO crew installing solar panels on the pitched roof of a Malaysian home",
    },
    {
      chip: "Bungalow",
      location: "Shah Alam, Selangor",
      metric: "RM350 / month saved",
      title: "Crane-lifted install, zero tile damage",
      body: "Panels hoisted by crane to protect the clay tiles, from SEDA approval through to the TNB meter.",
      imageAlt: "Rooftop solar array on a Malaysian home at sunset",
    },
    {
      chip: "Community",
      location: "Shah Alam, Selangor",
      metric: "6.96 kWp",
      title: "Surau At-Taqwa",
      body: "Twelve panels, commissioned in a day and a half from first fix to the main distribution board.",
      imageAlt: "Solar panels on the pitched roof of Surau At-Taqwa",
    },
  ],

  process: {
    eyebrow: "How it works",
    title: "Five steps, and we own every one of them.",
    lede: "The same sequence whether it is one rooftop or a factory. Only the site assessment and the build window change.",
    steps: [
      {
        when: "Day 1",
        title: "Consultation",
        body: "Send us your latest bill. We call back within one business day.",
      },
      {
        when: "Week 1",
        title: "Site & energy assessment",
        body: "Roof structure, shading, switchboard and load profile, surveyed on site.",
      },
      {
        when: "Week 1 to 2",
        title: "System design",
        body: "Sizing, single-line drawing, yield and payback, at a fixed price in writing.",
      },
      {
        when: "1 to 3 days",
        title: "Installation",
        body: "Our own CIDB G7 crew. Commercial builds are staged around operations.",
      },
      {
        when: "Year 1 to 25",
        title: "Monitoring & support",
        body: "Live app monitoring and scheduled maintenance. The warranty stays with us.",
      },
    ],
  },

  routes: {
    eyebrow: "Where to next",
    title: "Not ready to talk yet? Start here instead.",
    items: [
      { title: "Residential Solar", body: "Packages, pricing and what ATAP actually pays back." },
      { title: "Commercial & Industrial", body: "EPCC, PPA and zero-CAPEX models for factories and warehouses." },
      { title: "Solar Calculator", body: "Enter your monthly bill, see system size, savings and payback." },
      { title: "Battery Storage", body: "BESS for maximum demand management and backup power." },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    title: "The questions worth asking before you sign.",
    body: "Still unsure? A consultation costs nothing and commits you to nothing.",
    cta: "Ask us directly",
  },

  finalCta: {
    body: "A free, no-obligation consultation and site assessment. You get the system design, the yield model and the payback figure in writing before anything is signed.",
    primary: "Book my free consultation",
    secondary: "Call 03-8069 1706",
    foot: "Residential and C&I · Peninsular Malaysia",
    emailLabel: "Email",
  },
};

const cn: HomeCopy = {
  meta: {
    title: "MAQO 太阳能马来西亚 | 住宅与工商业太阳能工程",
    description:
      "MAQO Engineering Sdn Bhd 为马来西亚住宅与企业设计、安装并维护屋顶太阳能系统。持有 ST A 级、CIDB G7、SEDA 注册及 ISO 9001:2015 认证，自 2013 年起已完成超过 1,000 套系统。",
  },

  hero: {
    eyebrow: "创立于 2013 · ST A 级 · CIDB G7",
    titleLine1: "让您的屋顶",
    titleLine2Lead: "自己",
    titleAccent: "赚回成本",
    titleTail: "。",
    sub: "为马来西亚住宅与企业提供持牌太阳能工程服务，自 2013 年起全程由自家团队设计、施工与维护。",
    primaryCta: "免费太阳能咨询",
    tel: "或致电 03-8069 1706",
    prompt: "您属于哪一类？",
    note: { title: "Spritzer 瓶装厂", meta: "1,071 kWp · 2,380 片组件" },
  },

  paths: {
    res: {
      who: "我是屋主",
      title: "住宅太阳能",
      desc: "免费上门评估、书面固定报价，电费最高可省 90%。",
      cta: "了解住宅太阳能",
    },
    ci: {
      who: "我是企业主",
      title: "工商业太阳能",
      desc: "锁定未来 25 年能源成本，可选 EPCC、PPA 或零资本投入方案。",
      cta: "了解工商业太阳能",
    },
  },

  md: {
    quote:
      "我们为您，也为这个星球。我们的使命，是让太阳能变得人人负担得起、人人用得上，从而重塑能源格局。",
    name: "江国庆",
    role: "董事总经理 · 东京大学工程硕士",
    portraitAlt: "MAQO Engineering Sdn Bhd 董事总经理江国庆",
  },

  numbers: {
    eyebrow: "数字中的 MAQO",
    note: "每一套系统，同一张执照，同一支自家施工团队。",
    items: [
      { value: "1,000+", label: "住宅系统已完工启用" },
      { value: "500+", label: "工商业客户" },
      { value: "13+", label: "年马来西亚太阳能经验" },
    ],
  },

  work: {
    eyebrow: "精选项目",
    title: "从梳邦再也的一间排屋，到瓶装厂屋顶上的 2,380 片组件。",
    lede: "同一张执照、同一支团队、同一套验收标准，改变的只是规模。",
    resHeading: "住宅",
    resCount: "1,000+ 户中的 3 例",
    ciHeading: "工商业",
    ciCount: "500+ 客户中的 3 例",
    viewProject: "查看项目",
    seeAllRes: "查看全部住宅项目",
    seeAllCi: "查看全部工商业项目",
    ciFallbackBody: "{panels}，由 MAQO 以单一 ST A 级执照完成设计、安装与调试。",
    ciFallbackBodyNoPanels: "由 MAQO 以单一 ST A 级执照完成设计、安装与调试。",
  },

  residentialProjects: [
    {
      chip: "排屋",
      location: "梳邦再也，雪兰莪",
      metric: "每月 RM680 降至 RM90",
      title: "每月电费降到 RM90 以下",
      body: "双层排屋的混合式系统加储能电池。TNB 申请、验收与电表更换全程由 MAQO 处理。",
      imageAlt: "MAQO 团队在马来西亚住宅斜屋顶上安装太阳能板",
    },
    {
      chip: "独立式洋房",
      location: "莎阿南，雪兰莪",
      metric: "每月省下 RM350",
      title: "吊车吊装，瓦片零损伤",
      body: "以吊车吊运组件保护瓦片，从 SEDA 批准到 TNB 换表全程跟进。",
      imageAlt: "黄昏时分马来西亚住宅屋顶上的太阳能阵列",
    },
    {
      chip: "社区",
      location: "莎阿南，雪兰莪",
      metric: "6.96 kWp",
      title: "At-Taqwa 祈祷室",
      body: "12 片组件，从首次施工到接入总配电箱仅用一天半即完成调试。",
      imageAlt: "At-Taqwa 祈祷室斜屋顶上的太阳能板",
    },
  ],

  process: {
    eyebrow: "服务流程",
    title: "五个步骤，每一步都由我们亲自负责。",
    lede: "无论是一片屋顶还是一座工厂，流程相同，只有现场评估与施工周期不同。",
    steps: [
      { when: "第 1 天", title: "咨询", body: "把最近一期电费单发给我们，一个工作日内回电。" },
      { when: "第 1 周", title: "现场与用电评估", body: "屋顶结构、遮阴、配电箱与用电曲线，全部现场勘查。" },
      { when: "第 1 至 2 周", title: "系统设计", body: "容量配置、单线图、发电量与回本年期，连同固定报价书面呈交。" },
      { when: "1 至 3 天", title: "安装施工", body: "自家 CIDB G7 团队施工，工商业项目分阶段进行，不影响运作。" },
      { when: "第 1 至 25 年", title: "监控与售后", body: "手机应用实时监控与定期保养，保修由我们承担。" },
    ],
  },

  routes: {
    eyebrow: "接下来",
    title: "还没准备好联系？可以先从这里开始。",
    items: [
      { title: "住宅太阳能", body: "配套、价格，以及 ATAP 实际能回本多少。" },
      { title: "工商业太阳能", body: "为工厂与仓库而设的 EPCC、PPA 与零资本投入方案。" },
      { title: "太阳能计算器", body: "输入月电费，即时估算系统规模、节省与回本年期。" },
      { title: "储能电池", body: "用于最高需求管理与备用电力的 BESS 系统。" },
    ],
  },

  faq: {
    eyebrow: "常见问题",
    title: "签约前值得先问清楚的问题。",
    body: "还不确定？咨询完全免费，也没有任何承诺。",
    cta: "直接问我们",
  },

  finalCta: {
    body: "免费、无附带条件的咨询与现场评估。系统设计、发电量预估与回本年期，全部白纸黑字呈交，之后才谈签约。",
    primary: "预约免费咨询",
    secondary: "致电 03-8069 1706",
    foot: "住宅与工商业 · 服务马来西亚半岛",
    emailLabel: "电邮",
  },
};

const ms: HomeCopy = {
  meta: {
    title: "MAQO Solar Malaysia | Kejuruteraan Solar Kediaman & Komersial",
    description:
      "MAQO Engineering Sdn Bhd mereka bentuk, memasang dan menyelenggara solar bumbung untuk rumah dan perniagaan di Malaysia. ST Kelas A, CIDB G7, berdaftar SEDA dan diperakui ISO 9001:2015, dengan lebih 1,000 sistem sejak 2013.",
  },

  hero: {
    eyebrow: "Sejak 2013 · ST Kelas A · CIDB G7",
    titleLine1: "Bumbung anda, direka",
    titleLine2Lead: "untuk ",
    titleAccent: "membayar dirinya",
    titleTail: ".",
    sub: "Kejuruteraan solar berlesen untuk rumah dan perniagaan di Malaysia, direka, dipasang dan diselenggara oleh pasukan kami sendiri sejak 2013.",
    primaryCta: "Dapatkan konsultasi solar percuma",
    tel: "atau hubungi 03-8069 1706",
    prompt: "Anda yang mana satu?",
    note: { title: "Kilang pembotolan Spritzer", meta: "1,071 kWp · 2,380 modul" },
  },

  paths: {
    res: {
      who: "Saya pemilik rumah",
      title: "Solar Kediaman",
      desc: "Penilaian rumah percuma, sebut harga bertulis yang tetap, dan jimat sehingga 90% bil TNB.",
      cta: "Terokai solar kediaman",
    },
    ci: {
      who: "Saya pemilik perniagaan",
      title: "Solar Komersial & Industri",
      desc: "Kunci kos tenaga anda selama 25 tahun, dengan EPCC, PPA atau tanpa modal permulaan.",
      cta: "Terokai solar C&I",
    },
  },

  md: {
    quote:
      "Kami di sini untuk anda, dan untuk planet yang lebih baik. Misi kami adalah membentuk semula landskap tenaga dengan menjadikan kuasa solar mampu milik untuk semua.",
    name: "Kong Kok King",
    role: "Pengarah Urusan · M.Eng, Universiti Tokyo",
    portraitAlt: "Kong Kok King, Pengarah Urusan MAQO Engineering Sdn Bhd",
  },

  numbers: {
    eyebrow: "MAQO dalam angka",
    note: "Setiap sistem di bawah lesen yang sama, oleh pasukan dalaman yang sama.",
    items: [
      { value: "1,000+", label: "Sistem kediaman siap ditauliahkan" },
      { value: "500+", label: "Pelanggan komersial & industri" },
      { value: "13+", label: "Tahun pengalaman solar di Malaysia" },
    ],
  },

  work: {
    eyebrow: "Projek terpilih",
    title: "Dari satu bumbung teres di Subang Jaya ke 2,380 panel di atas kilang pembotolan.",
    lede: "Lesen yang sama, pasukan yang sama, piawai pentauliahan yang sama. Hanya skalanya berubah.",
    resHeading: "Kediaman",
    resCount: "03 daripada 1,000+ rumah",
    ciHeading: "Komersial & Industri",
    ciCount: "03 daripada 500+ pelanggan",
    viewProject: "Lihat projek",
    seeAllRes: "Lihat semua projek kediaman",
    seeAllCi: "Lihat semua projek C&I",
    ciFallbackBody: "{panels}, direka, dipasang dan ditauliahkan oleh MAQO di bawah satu lesen ST Kelas A.",
    ciFallbackBodyNoPanels: "Direka, dipasang dan ditauliahkan oleh MAQO di bawah satu lesen ST Kelas A.",
  },

  residentialProjects: [
    {
      chip: "Rumah teres",
      location: "Subang Jaya, Selangor",
      metric: "RM680 ke RM90 / bulan",
      title: "Bil turun ke bawah RM90 sebulan",
      body: "Sistem hibrid dengan storan bateri di rumah teres dua tingkat. MAQO menguruskan permohonan TNB, pemeriksaan dan pertukaran meter.",
      imageAlt: "Pasukan MAQO memasang panel solar di bumbung sebuah rumah di Malaysia",
    },
    {
      chip: "Banglo",
      location: "Shah Alam, Selangor",
      metric: "RM350 / bulan dijimatkan",
      title: "Pemasangan guna kren, genting tanpa kerosakan",
      body: "Panel diangkat dengan kren bagi melindungi genting tanah liat, dari kelulusan SEDA hingga meter TNB.",
      imageAlt: "Susunan panel solar di bumbung rumah di Malaysia ketika senja",
    },
    {
      chip: "Komuniti",
      location: "Shah Alam, Selangor",
      metric: "6.96 kWp",
      title: "Surau At-Taqwa",
      body: "Dua belas panel, ditauliahkan dalam sehari setengah dari kerja pertama hingga papan agihan utama.",
      imageAlt: "Panel solar di bumbung Surau At-Taqwa",
    },
  ],

  process: {
    eyebrow: "Cara ia berfungsi",
    title: "Lima langkah, dan setiap satunya milik kami.",
    lede: "Urutan yang sama sama ada satu bumbung atau sebuah kilang. Hanya penilaian tapak dan tempoh pemasangan yang berubah.",
    steps: [
      { when: "Hari 1", title: "Konsultasi", body: "Hantar bil terkini anda. Kami hubungi semula dalam satu hari bekerja." },
      { when: "Minggu 1", title: "Penilaian tapak & tenaga", body: "Struktur bumbung, bayang, papan suis dan profil beban, ditinjau di tapak." },
      { when: "Minggu 1 hingga 2", title: "Reka bentuk sistem", body: "Saiz, lukisan satu garis, hasil dan tempoh bayar balik, pada harga tetap secara bertulis." },
      { when: "1 hingga 3 hari", title: "Pemasangan", body: "Pasukan CIDB G7 kami sendiri. Projek komersial dijadualkan mengikut operasi anda." },
      { when: "Tahun 1 hingga 25", title: "Pemantauan & sokongan", body: "Pemantauan langsung melalui aplikasi dan penyelenggaraan berjadual. Waranti kekal dengan kami." },
    ],
  },

  routes: {
    eyebrow: "Seterusnya",
    title: "Belum bersedia untuk berbincang? Mulakan di sini.",
    items: [
      { title: "Solar Kediaman", body: "Pakej, harga, dan berapa sebenarnya ATAP membayar balik." },
      { title: "Komersial & Industri", body: "Model EPCC, PPA dan tanpa modal untuk kilang dan gudang." },
      { title: "Kalkulator Solar", body: "Masukkan bil bulanan anda, lihat saiz sistem, penjimatan dan bayar balik." },
      { title: "Storan Bateri", body: "BESS untuk pengurusan permintaan maksimum dan kuasa sandaran." },
    ],
  },

  faq: {
    eyebrow: "Soalan lazim",
    title: "Soalan yang patut ditanya sebelum anda menandatangani.",
    body: "Masih tidak pasti? Konsultasi adalah percuma dan tanpa sebarang ikatan.",
    cta: "Tanya kami terus",
  },

  finalCta: {
    body: "Konsultasi dan penilaian tapak percuma, tanpa sebarang ikatan. Anda menerima reka bentuk sistem, model hasil dan angka bayar balik secara bertulis sebelum apa-apa ditandatangani.",
    primary: "Tempah konsultasi percuma saya",
    secondary: "Hubungi 03-8069 1706",
    foot: "Kediaman dan C&I · Semenanjung Malaysia",
    emailLabel: "E-mel",
  },
};

const HOME_COPY: Record<Locale, HomeCopy> = { en, cn, ms };

export function getHomeCopy(locale: Locale): HomeCopy {
  return HOME_COPY[locale];
}
