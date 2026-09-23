import type { Locale } from "@/lib/i18n";

/**
 * Personal Data Protection notice (PDPA 2010, as amended 2024) for the public
 * lead forms. Draft — must be reviewed by legal/compliance before it is relied
 * on. Kept here rather than in the dictionaries because it is one long legal
 * document, not UI copy.
 */

type Section = { heading: string; paragraphs?: string[]; bullets?: string[] };

export type PrivacyPolicy = {
  title: string;
  metaDescription: string;
  updatedLabel: string;
  intro: string;
  sections: Section[];
  contactHeading: string;
  contactIntro: string;
  emailLabel: string;
  phoneLabel: string;
  addressLabel: string;
  languageNote: string;
  /** Short link text appended to the consent line under each lead form. */
  formLink: string;
  /** Footer link label. */
  footerLink: string;
};

export const PRIVACY_LAST_UPDATED = "2026-09-23";

export const PRIVACY_POLICY: Record<Locale, PrivacyPolicy> = {
  en: {
    title: "Privacy Policy",
    metaDescription:
      "How MAQO Engineering Sdn Bhd collects, uses and protects the personal data you share with us, under Malaysia's Personal Data Protection Act 2010.",
    updatedLabel: "Last updated:",
    intro:
      "This Privacy Policy explains how MAQO Engineering Sdn Bhd (\"MAQO\", \"we\", \"us\") collects, uses, discloses and protects your personal data when you use this website or submit an enquiry to us, in accordance with the Personal Data Protection Act 2010 of Malaysia (\"PDPA\").",
    sections: [
      {
        heading: "1. Personal data we collect",
        paragraphs: ["When you submit an enquiry or assessment form on this website, we collect:"],
        bullets: [
          "Your salutation, full name, mobile number and email address.",
          "Your state, monthly electricity bill range, property type, electricity supply type and preferred communication language.",
          "For commercial enquiries: your company name, industry and role in the organisation.",
          "Technical information such as the page you came from, campaign or advertising identifiers (for example UTM, Google or Facebook click IDs) and basic, non-identifying usage statistics of this website.",
        ],
      },
      {
        heading: "2. Why we use your personal data",
        bullets: [
          "To contact you about your enquiry and provide a solar, battery or EV charging assessment and quotation.",
          "To follow up on your enquiry, arrange site visits and provide our products and services.",
          "To understand which of our marketing campaigns and pages are effective, and to improve this website.",
          "To prevent spam, fraud and misuse of our website.",
          "To comply with legal and regulatory obligations.",
        ],
      },
      {
        heading: "3. Source of your personal data",
        paragraphs: [
          "We collect personal data directly from you when you fill in a form on this website, and from the technical information your browser sends when you visit it.",
        ],
      },
      {
        heading: "4. Is providing your personal data compulsory?",
        paragraphs: [
          "All fields on our enquiry forms are required. If you do not provide them, we will not be able to process your enquiry or contact you with an assessment.",
        ],
      },
      {
        heading: "5. Who we disclose your personal data to",
        paragraphs: ["We do not sell your personal data. We may share it with:"],
        bullets: [
          "Our sales and customer service staff who handle your enquiry.",
          "Service providers that host and operate our website, database, customer relationship management (CRM) system and communication tools on our behalf, under confidentiality obligations.",
          "Regulators, authorities or other parties where required or permitted by law.",
        ],
      },
      {
        heading: "6. Transfer outside Malaysia",
        paragraphs: [
          "Some of our service providers store data on servers located outside Malaysia. Where this happens, we take reasonable steps to ensure your personal data receives a level of protection comparable to that required under the PDPA.",
        ],
      },
      {
        heading: "7. How we protect and retain your personal data",
        paragraphs: [
          "We use reasonable technical and organisational measures to protect your personal data, including encrypted connections, restricted staff access and access controls on our systems.",
          "We keep your personal data only for as long as it is needed for the purposes above, or as required by law, after which it is deleted or anonymised.",
        ],
      },
      {
        heading: "8. Your rights",
        paragraphs: ["Under the PDPA, you may:"],
        bullets: [
          "Request access to, and a copy of, the personal data we hold about you.",
          "Request correction of personal data that is inaccurate, incomplete or out of date.",
          "Withdraw your consent, or ask us to stop using your personal data for marketing, at any time.",
          "Make enquiries or complaints about how we handle your personal data.",
        ],
      },
      {
        heading: "9. Cookies and analytics",
        paragraphs: [
          "This website uses cookies and similar technologies to remember your language preference, measure how the website is used and understand the performance of our advertising (for example through Google and Meta tools). You can block or delete cookies through your browser settings; some parts of the website may not work as intended if you do.",
        ],
      },
      {
        heading: "10. Changes to this policy",
        paragraphs: [
          "We may update this Privacy Policy from time to time. The latest version will always be published on this page with its updated date.",
        ],
      },
    ],
    contactHeading: "11. Contact us",
    contactIntro:
      "To exercise your rights, or for any question or complaint about this Privacy Policy, please contact:",
    emailLabel: "Email:",
    phoneLabel: "Phone:",
    addressLabel: "Address:",
    languageNote:
      "This Privacy Policy is available in English, Bahasa Melayu and Chinese. In the event of any inconsistency, the English version shall prevail.",
    formLink: "Read our Privacy Policy.",
    footerLink: "Privacy Policy",
  },

  ms: {
    title: "Dasar Privasi",
    metaDescription:
      "Cara MAQO Engineering Sdn Bhd mengumpul, menggunakan dan melindungi data peribadi anda di bawah Akta Perlindungan Data Peribadi 2010.",
    updatedLabel: "Kemas kini terakhir:",
    intro:
      "Dasar Privasi ini menerangkan cara MAQO Engineering Sdn Bhd (\"MAQO\", \"kami\") mengumpul, menggunakan, mendedahkan dan melindungi data peribadi anda apabila anda menggunakan laman web ini atau menghantar pertanyaan kepada kami, selaras dengan Akta Perlindungan Data Peribadi 2010 (\"PDPA\").",
    sections: [
      {
        heading: "1. Data peribadi yang kami kumpul",
        paragraphs: ["Apabila anda menghantar borang pertanyaan atau penilaian di laman web ini, kami mengumpul:"],
        bullets: [
          "Gelaran, nama penuh, nombor telefon bimbit dan alamat e-mel anda.",
          "Negeri, julat bil elektrik bulanan, jenis hartanah, jenis bekalan elektrik dan bahasa komunikasi pilihan anda.",
          "Bagi pertanyaan komersial: nama syarikat, industri dan jawatan anda dalam organisasi.",
          "Maklumat teknikal seperti halaman rujukan, pengecam kempen atau iklan (contohnya UTM, ID klik Google atau Facebook) dan statistik penggunaan asas laman web ini yang tidak mengenal pasti anda.",
        ],
      },
      {
        heading: "2. Tujuan kami menggunakan data peribadi anda",
        bullets: [
          "Untuk menghubungi anda mengenai pertanyaan anda dan memberikan penilaian serta sebut harga solar, bateri atau pengecasan EV.",
          "Untuk membuat susulan, mengatur lawatan tapak dan menyediakan produk serta perkhidmatan kami.",
          "Untuk memahami keberkesanan kempen pemasaran dan halaman kami, serta menambah baik laman web ini.",
          "Untuk mencegah spam, penipuan dan penyalahgunaan laman web kami.",
          "Untuk mematuhi kewajipan undang-undang dan peraturan.",
        ],
      },
      {
        heading: "3. Sumber data peribadi anda",
        paragraphs: [
          "Kami mengumpul data peribadi terus daripada anda apabila anda mengisi borang di laman web ini, dan daripada maklumat teknikal yang dihantar oleh pelayar anda semasa lawatan.",
        ],
      },
      {
        heading: "4. Adakah pemberian data peribadi wajib?",
        paragraphs: [
          "Semua ruangan dalam borang pertanyaan kami adalah wajib. Jika anda tidak memberikannya, kami tidak dapat memproses pertanyaan anda atau menghubungi anda untuk penilaian.",
        ],
      },
      {
        heading: "5. Pihak yang kami dedahkan data peribadi anda",
        paragraphs: ["Kami tidak menjual data peribadi anda. Kami mungkin berkongsinya dengan:"],
        bullets: [
          "Kakitangan jualan dan khidmat pelanggan kami yang mengendalikan pertanyaan anda.",
          "Penyedia perkhidmatan yang mengehos dan mengendalikan laman web, pangkalan data, sistem pengurusan perhubungan pelanggan (CRM) dan alat komunikasi bagi pihak kami, tertakluk kepada kewajipan kerahsiaan.",
          "Pengawal selia, pihak berkuasa atau pihak lain apabila dikehendaki atau dibenarkan oleh undang-undang.",
        ],
      },
      {
        heading: "6. Pemindahan ke luar Malaysia",
        paragraphs: [
          "Sesetengah penyedia perkhidmatan kami menyimpan data di pelayan di luar Malaysia. Dalam keadaan ini, kami mengambil langkah munasabah untuk memastikan data peribadi anda menerima tahap perlindungan yang setanding dengan yang dikehendaki di bawah PDPA.",
        ],
      },
      {
        heading: "7. Cara kami melindungi dan menyimpan data peribadi anda",
        paragraphs: [
          "Kami menggunakan langkah teknikal dan organisasi yang munasabah untuk melindungi data peribadi anda, termasuk sambungan yang disulitkan, akses kakitangan yang terhad dan kawalan akses pada sistem kami.",
          "Kami menyimpan data peribadi anda hanya selama yang diperlukan bagi tujuan di atas, atau seperti yang dikehendaki oleh undang-undang, selepas itu ia akan dipadam atau dijadikan tanpa nama.",
        ],
      },
      {
        heading: "8. Hak anda",
        paragraphs: ["Di bawah PDPA, anda boleh:"],
        bullets: [
          "Meminta akses kepada, dan salinan, data peribadi anda yang kami simpan.",
          "Meminta pembetulan data peribadi yang tidak tepat, tidak lengkap atau lapuk.",
          "Menarik balik persetujuan anda, atau meminta kami berhenti menggunakan data peribadi anda untuk pemasaran, pada bila-bila masa.",
          "Membuat pertanyaan atau aduan mengenai cara kami mengendalikan data peribadi anda.",
        ],
      },
      {
        heading: "9. Kuki dan analitik",
        paragraphs: [
          "Laman web ini menggunakan kuki dan teknologi serupa untuk mengingati pilihan bahasa anda, mengukur penggunaan laman web dan memahami prestasi iklan kami (contohnya melalui alat Google dan Meta). Anda boleh menyekat atau memadam kuki melalui tetapan pelayar anda; sesetengah bahagian laman web mungkin tidak berfungsi seperti yang dimaksudkan jika anda berbuat demikian.",
        ],
      },
      {
        heading: "10. Perubahan kepada dasar ini",
        paragraphs: [
          "Kami mungkin mengemas kini Dasar Privasi ini dari semasa ke semasa. Versi terkini akan sentiasa diterbitkan di halaman ini bersama tarikh kemas kininya.",
        ],
      },
    ],
    contactHeading: "11. Hubungi kami",
    contactIntro:
      "Untuk melaksanakan hak anda, atau untuk sebarang pertanyaan atau aduan mengenai Dasar Privasi ini, sila hubungi:",
    emailLabel: "E-mel:",
    phoneLabel: "Telefon:",
    addressLabel: "Alamat:",
    languageNote:
      "Dasar Privasi ini disediakan dalam Bahasa Inggeris, Bahasa Melayu dan Bahasa Cina. Sekiranya terdapat sebarang percanggahan, versi Bahasa Inggeris akan diguna pakai.",
    formLink: "Baca Dasar Privasi kami.",
    footerLink: "Dasar Privasi",
  },

  cn: {
    title: "隐私政策",
    metaDescription: "MAQO Engineering Sdn Bhd 如何根据马来西亚《2010年个人资料保护法令》收集、使用及保护您的个人资料。",
    updatedLabel: "最后更新：",
    intro:
      "本隐私政策说明 MAQO Engineering Sdn Bhd（“MAQO”或“我们”）在您使用本网站或向我们提交询问时，如何依据马来西亚《2010年个人资料保护法令》（“PDPA”）收集、使用、披露及保护您的个人资料。",
    sections: [
      {
        heading: "1. 我们收集的个人资料",
        paragraphs: ["当您在本网站提交询问或评估表格时，我们会收集："],
        bullets: [
          "您的称谓、全名、手机号码及电子邮件地址。",
          "您所在的州属、每月电费范围、房产类型、电力供应类型及偏好的沟通语言。",
          "商业询问：公司名称、行业及您在机构中的职位。",
          "技术资料，例如来源页面、营销活动或广告识别码（如 UTM、Google 或 Facebook 点击 ID），以及不会识别您身份的基本网站使用统计。",
        ],
      },
      {
        heading: "2. 我们使用您个人资料的目的",
        bullets: [
          "就您的询问与您联系，并提供太阳能、电池或电动车充电的评估及报价。",
          "跟进您的询问、安排现场勘察，并提供我们的产品与服务。",
          "了解我们营销活动及网页的成效，并改善本网站。",
          "防止垃圾信息、欺诈及滥用本网站。",
          "遵守法律及监管义务。",
        ],
      },
      {
        heading: "3. 个人资料的来源",
        paragraphs: ["我们在您填写本网站表格时直接向您收集个人资料，以及在您浏览时由浏览器发送的技术资料。"],
      },
      {
        heading: "4. 提供个人资料是否必须？",
        paragraphs: ["询问表格中的所有栏位均为必填。若您不提供，我们将无法处理您的询问或联系您进行评估。"],
      },
      {
        heading: "5. 我们向谁披露您的个人资料",
        paragraphs: ["我们不会出售您的个人资料。我们可能会与以下各方分享："],
        bullets: [
          "负责处理您询问的销售及客户服务人员。",
          "代表我们托管及运营网站、数据库、客户关系管理（CRM）系统及通讯工具的服务供应商，并受保密义务约束。",
          "在法律要求或允许的情况下，监管机构、执法当局或其他相关方。",
        ],
      },
      {
        heading: "6. 转移至马来西亚境外",
        paragraphs: ["部分服务供应商将资料储存在马来西亚境外的服务器。在此情况下，我们会采取合理措施，确保您的个人资料获得与 PDPA 要求相当的保护。"],
      },
      {
        heading: "7. 我们如何保护及保留您的个人资料",
        paragraphs: [
          "我们采取合理的技术及管理措施保护您的个人资料，包括加密连接、限制员工访问及系统访问控制。",
          "我们只会在上述目的所需或法律要求的期限内保留您的个人资料，之后将予以删除或匿名化处理。",
        ],
      },
      {
        heading: "8. 您的权利",
        paragraphs: ["根据 PDPA，您可以："],
        bullets: [
          "要求查阅并获取我们所持有的您的个人资料副本。",
          "要求更正不准确、不完整或过时的个人资料。",
          "随时撤回同意，或要求我们停止将您的个人资料用于营销用途。",
          "就我们处理您个人资料的方式提出询问或投诉。",
        ],
      },
      {
        heading: "9. Cookie 与分析工具",
        paragraphs: [
          "本网站使用 Cookie 及类似技术来记住您的语言偏好、衡量网站使用情况，并了解我们广告的成效（例如通过 Google 及 Meta 工具）。您可通过浏览器设置阻止或删除 Cookie；但这样做可能导致网站部分功能无法正常运作。",
        ],
      },
      {
        heading: "10. 本政策的变更",
        paragraphs: ["我们可能不时更新本隐私政策。最新版本及其更新日期将始终公布于本页面。"],
      },
    ],
    contactHeading: "11. 联系我们",
    contactIntro: "如需行使您的权利，或对本隐私政策有任何疑问或投诉，请联系：",
    emailLabel: "电邮：",
    phoneLabel: "电话：",
    addressLabel: "地址：",
    languageNote: "本隐私政策备有英文、马来文及中文版本。如有任何歧义，概以英文版本为准。",
    formLink: "阅读我们的隐私政策。",
    footerLink: "隐私政策",
  },
};
