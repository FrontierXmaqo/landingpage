import type { Locale } from "@/lib/i18n";

/**
 * About page copy that has no entry in lib/i18n/dictionaries: the story road,
 * the solutions tiles and the track-record block, in all three languages.
 * The Chinese and Malay versions are draft translations; have a fluent reader
 * check them.
 */

/**
 * Stops on the Our Story road. `scene` draws an illustration on the inner side
 * of that stop's bend; `badges` render as pills under the body.
 */
export type StoryMilestone = {
  year: string;
  title: string;
  body: string;
  badges?: string[];
  scene?: "house" | "factory";
};

export type AboutContent = {
  storyTag: string;
  storyTitleLead: string;
  storyTitleAccent: string;
  milestones: StoryMilestone[];
  solutionsTag: string;
  solutionsTitleLead: string;
  solutionsTitleAccent: string;
  solutionsBody: string;
  solutions: { title: string; body: string }[];
  trackTag: string;
  trackTitle: string;
  /** 70% / 78.2% figures are MAQO's own published marketing metrics
   *  (maqosolar.com/about-us); the rest are already used elsewhere on this site. */
  stats: { value: string; label: string }[];
  viewMore: string;
  finalCtaSecondary: string;
};

/** Real installs, same photos already used on the live C&I project carousel.
 *  Client names stay as they are in every language. */
export const PROOF_PROJECTS = [
  { title: "Amcorp Gemas Solar Farm", image: "/projects/amcorp-gemas.webp", big: true },
  { title: "Spritzer", image: "/projects/spritzer.webp" },
  { title: "Bermaz", image: "/projects/bermaz.webp" },
  { title: "1DOC Medical", image: "/projects/1doc-medical.webp" },
  { title: "Surau At-Taqwa", image: "/projects/surau-at-taqwa.webp" },
];

const en: AboutContent = {
  storyTag: "Our Story",
  storyTitleLead: "The road",
  storyTitleAccent: "since 2013.",
  milestones: [
    {
      year: "2013",
      title: "Company Foundation",
      body: "Founded as MAQO Solar in Puchong, Selangor by Managing Director Kong Kok King (M.Eng, University of Tokyo), providing residential solar installations across Malaysia.",
    },
    {
      year: "2014",
      title: "2MW Supply Agreement & Incorporation",
      body: "Secured a 2MW solar module procurement contract with Yingli Green Energy in January, then incorporated as MAQO Engineering Sdn. Bhd. on 26 August.",
    },
    {
      year: "2015",
      title: "Residential Focus & SEDA Accreditation",
      body: "Built an in-house engineering team registered with SEDA as certified Grid-Connected PV (GCPV) designers and installers.",
      scene: "house",
    },
    {
      year: "2016–2019",
      title: "C&I Expansion & Smart Monitoring",
      body: "Expanded into turnkey Commercial & Industrial solar under NEM and GITA incentives, adding IoT sensors and app-based monitoring for 24/7 real-time system tracking.",
      scene: "factory",
    },
    {
      year: "2020",
      title: "Major Licences & Industry Awards",
      body: "Achieved CIDB Grade 7 and Suruhanjaya Tenaga Class A status, and won the SME100 Fast Moving Companies award and a Global Business Leadership Award for Excellence in Renewable Energy.",
      badges: ["CIDB G7", "ST Class A", "SME100 Fast Moving Companies", "Global Business Leadership Award"],
    },
    {
      year: "2021–2024",
      title: "ISO 9001 & 300+ Projects",
      body: "Earned ISO 9001 certification and surpassed 300 installations across residential, commercial rooftop, off-grid battery and Large-Scale Solar projects.",
    },
    {
      year: "Present",
      title: "Complete Energy Management",
      body: "A leading turnkey solar PV contractor partnering with Tier-1 module manufacturers, offering up to 25-year performance warranties and long-term O&M packages.",
    },
  ],
  solutionsTag: "What We Do",
  solutionsTitleLead: "One rooftop. Or a",
  solutionsTitleAccent: "gigawatt pipeline.",
  solutionsBody: "One platform across the whole chain, serving homeowners, factories and developers alike.",
  solutions: [
    { title: "Residential Solar", body: "Turnkey EPC rooftop solar for homes, sized around your TNB bill and your roof." },
    { title: "EV Charging", body: "Solar-powered home EV charging, so the electrons your car uses come off your own roof." },
    { title: "Commercial & Industrial", body: "EPC, PPA and Zero Capex solar for factories, warehouses and offices, 50kWp to 5,000kWp+." },
    { title: "Battery Storage (BESS)", body: "Battery energy storage for maximum demand management and peak shaving." },
  ],
  trackTag: "Track Record",
  trackTitle: "Achievements & Certifications",
  stats: [
    { value: "1,000+", label: "Homeowners & businesses served" },
    { value: "70%", label: "Avg. operational cost reduction" },
    { value: "78.2%", label: "Cleaner energy generated" },
    { value: "25-Yr", label: "Panel performance warranty" },
  ],
  viewMore: "View More",
  finalCtaSecondary: "Talk to Our Team",
};

const cn: AboutContent = {
  storyTag: "我们的故事",
  storyTitleLead: "一路走来，",
  storyTitleAccent: "始于 2013 年。",
  milestones: [
    {
      year: "2013",
      title: "公司成立",
      body: "由董事经理 Kong Kok King（东京大学工学硕士）在雪兰莪蒲种创立 MAQO Solar，为全马提供住宅太阳能安装服务。",
    },
    {
      year: "2014",
      title: "2MW 供应协议与正式注册",
      body: "1 月与英利绿色能源签订 2MW 太阳能组件采购合同，并于 8 月 26 日注册为 MAQO Engineering Sdn. Bhd.。",
    },
    {
      year: "2015",
      title: "专注住宅与 SEDA 认证",
      body: "组建自家工程团队，在 SEDA 注册为认证的并网光伏（GCPV）设计与安装商。",
      scene: "house",
    },
    {
      year: "2016–2019",
      title: "拓展工商业与智能监控",
      body: "在 NEM 与 GITA 优惠下拓展一站式工商业太阳能业务，加入物联网传感器与应用程序监控，全天候实时追踪系统。",
      scene: "factory",
    },
    {
      year: "2020",
      title: "重要执照与行业奖项",
      body: "获得 CIDB 第 7 级与能源委员会 Class A 资格，并荣获 SME100 快速成长企业奖及全球商业领袖奖（可再生能源卓越奖）。",
      badges: ["CIDB G7", "ST Class A", "SME100 Fast Moving Companies", "Global Business Leadership Award"],
    },
    {
      year: "2021–2024",
      title: "ISO 9001 与 300+ 项目",
      body: "获得 ISO 9001 认证，安装项目超过 300 个，涵盖住宅、商业屋顶、离网电池及大型太阳能电站。",
    },
    {
      year: "现在",
      title: "全方位能源管理",
      body: "领先的一站式太阳能光伏承包商，与一线组件制造商合作，提供最长 25 年功率质保及长期运维配套。",
    },
  ],
  solutionsTag: "我们的业务",
  solutionsTitleLead: "一个屋顶，",
  solutionsTitleAccent: "或一整条吉瓦级项目线。",
  solutionsBody: "一个平台贯穿整个链条，服务屋主、工厂与开发商。",
  solutions: [
    { title: "住宅太阳能", body: "一站式 EPC 住宅屋顶太阳能，根据您的 TNB 电费单和屋顶配置。" },
    { title: "电动车充电", body: "用太阳能为家中电动车充电，车子用的电来自您自家屋顶。" },
    { title: "工商业", body: "为工厂、仓库和办公室提供 EPC、PPA 及零资本支出太阳能，50kWp 至 5,000kWp 以上。" },
    { title: "电池储能（BESS）", body: "电池储能系统，用于最高需求管理与削峰。" },
  ],
  trackTag: "业绩记录",
  trackTitle: "成就与认证",
  stats: [
    { value: "1,000+", label: "服务过的屋主与企业" },
    { value: "70%", label: "平均营运成本降幅" },
    { value: "78.2%", label: "清洁能源发电占比" },
    { value: "25 年", label: "太阳能板功率质保" },
  ],
  viewMore: "查看更多",
  finalCtaSecondary: "联系我们的团队",
};

const ms: AboutContent = {
  storyTag: "Kisah Kami",
  storyTitleLead: "Perjalanan",
  storyTitleAccent: "sejak 2013.",
  milestones: [
    {
      year: "2013",
      title: "Penubuhan Syarikat",
      body: "Ditubuhkan sebagai MAQO Solar di Puchong, Selangor oleh Pengarah Urusan Kong Kok King (M.Eng, Universiti Tokyo), menyediakan pemasangan solar kediaman di seluruh Malaysia.",
    },
    {
      year: "2014",
      title: "Perjanjian Bekalan 2MW & Pemerbadanan",
      body: "Memperoleh kontrak perolehan modul solar 2MW dengan Yingli Green Energy pada Januari, kemudian diperbadankan sebagai MAQO Engineering Sdn. Bhd. pada 26 Ogos.",
    },
    {
      year: "2015",
      title: "Fokus Kediaman & Akreditasi SEDA",
      body: "Membina pasukan kejuruteraan sendiri yang berdaftar dengan SEDA sebagai pereka dan pemasang PV Bersambung Grid (GCPV) bertauliah.",
      scene: "house",
    },
    {
      year: "2016–2019",
      title: "Pengembangan C&I & Pemantauan Pintar",
      body: "Berkembang ke solar Komersial & Industri turnkey di bawah insentif NEM dan GITA, dengan sensor IoT dan pemantauan melalui aplikasi untuk penjejakan sistem masa nyata 24/7.",
      scene: "factory",
    },
    {
      year: "2020",
      title: "Lesen Utama & Anugerah Industri",
      body: "Mencapai status CIDB Gred 7 dan Suruhanjaya Tenaga Kelas A, serta memenangi anugerah SME100 Fast Moving Companies dan Global Business Leadership Award untuk Kecemerlangan dalam Tenaga Boleh Baharu.",
      badges: ["CIDB G7", "ST Class A", "SME100 Fast Moving Companies", "Global Business Leadership Award"],
    },
    {
      year: "2021–2024",
      title: "ISO 9001 & 300+ Projek",
      body: "Memperoleh pensijilan ISO 9001 dan melepasi 300 pemasangan merangkumi projek kediaman, bumbung komersial, bateri luar grid dan Solar Berskala Besar.",
    },
    {
      year: "Kini",
      title: "Pengurusan Tenaga Lengkap",
      body: "Kontraktor solar PV turnkey terkemuka yang bekerjasama dengan pengeluar modul Tier-1, menawarkan waranti prestasi sehingga 25 tahun dan pakej O&M jangka panjang.",
    },
  ],
  solutionsTag: "Apa Yang Kami Lakukan",
  solutionsTitleLead: "Satu bumbung. Atau",
  solutionsTitleAccent: "saluran projek gigawatt.",
  solutionsBody: "Satu platform merentasi seluruh rantaian, untuk pemilik rumah, kilang dan pemaju.",
  solutions: [
    { title: "Solar Kediaman", body: "Solar bumbung EPC turnkey untuk rumah, disaiz mengikut bil TNB dan bumbung anda." },
    { title: "Pengecasan EV", body: "Pengecasan EV di rumah dengan tenaga solar, jadi elektrik kereta anda datang dari bumbung sendiri." },
    { title: "Komersial & Industri", body: "Solar EPC, PPA dan Zero Capex untuk kilang, gudang dan pejabat, 50kWp hingga 5,000kWp+." },
    { title: "Storan Bateri (BESS)", body: "Storan tenaga bateri untuk pengurusan kehendak maksimum dan pengurangan puncak." },
  ],
  trackTag: "Rekod Prestasi",
  trackTitle: "Pencapaian & Pensijilan",
  stats: [
    { value: "1,000+", label: "Pemilik rumah & perniagaan dilayani" },
    { value: "70%", label: "Purata pengurangan kos operasi" },
    { value: "78.2%", label: "Tenaga bersih dijana" },
    { value: "25 Thn", label: "Waranti prestasi panel" },
  ],
  viewMore: "Lihat Lagi",
  finalCtaSecondary: "Bercakap dengan Pasukan Kami",
};

export const ABOUT_CONTENT: Record<Locale, AboutContent> = { en, cn, ms };
