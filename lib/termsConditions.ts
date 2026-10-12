import type { Locale } from "@/lib/i18n";
import type { PrivacyPolicy } from "@/lib/privacyPolicy";

/**
 * Terms & Conditions for the public lead forms. Draft — must be reviewed by
 * legal/compliance before it is relied on. Same shape as the Privacy Policy so
 * both render through LegalPage.
 */

export type TermsConditions = PrivacyPolicy & {
  /** Tick-box text under each lead form, split around the two links:
   *  [before, between, after] → before <Terms> between <Privacy> after. */
  agree: [string, string, string];
};

export const TERMS_LAST_UPDATED = "2026-10-12";

export const TERMS_CONDITIONS: Record<Locale, TermsConditions> = {
  en: {
    title: "Terms & Conditions",
    metaDescription:
      "The terms that apply when you use this website and submit an enquiry form to MAQO Engineering Sdn Bhd.",
    updatedLabel: "Last updated:",
    intro:
      "These Terms & Conditions (\"Terms\") apply when you use this website and submit an enquiry, assessment or quotation form on it. The website is operated by MAQO Engineering Sdn Bhd (\"MAQO\", \"we\", \"us\"). By ticking the agreement box and submitting a form, you confirm that you have read and agree to these Terms and our Privacy Policy.",
    sections: [
      {
        heading: "1. About our services",
        paragraphs: [
          "MAQO designs, supplies and installs solar PV systems, battery energy storage systems (BESS) and EV chargers for homes and for commercial and industrial (C&I) customers in Malaysia. We also offer zero-capex options such as solar power purchase agreements (SPPA). Information on this website is general and does not take into account your property, roof condition, electricity usage or TNB tariff.",
        ],
      },
      {
        heading: "2. Submitting a form",
        bullets: [
          "You must be at least 18 years old, and authorised to give the details you submit. For a company enquiry, you confirm you are authorised to enquire on the company's behalf.",
          "You agree that the information you give is true, accurate and complete. Our assessment depends on it.",
          "Submitting a form is a request for information. It does not create a contract or oblige you to buy anything.",
        ],
      },
      {
        heading: "3. Agreement to be contacted",
        paragraphs: [
          "By submitting a form, you agree that MAQO and its authorised representatives may contact you by phone call, SMS, WhatsApp or email about your enquiry, assessment, quotation and related products and services. You can ask us to stop at any time by replying \"STOP\" or emailing us at the address below.",
        ],
      },
      {
        heading: "4. Quotations, savings and estimates",
        bullets: [
          "Any quotation, system size, price, savings, payback period or return shown on this website, by a calculator, or by our team before a site survey is an estimate only.",
          "Actual results depend on your site survey, roof condition, shading, weather, energy usage, equipment, TNB tariffs and charges, and government programmes such as NEM, SELCO or ATAP, which may change.",
          "A quotation is valid only for the period stated on it. Our obligations start only when both parties sign a written agreement, and that agreement's terms then apply in place of anything on this website.",
        ],
      },
      {
        heading: "5. Promotions",
        paragraphs: [
          "Promotions, rebates or free items mentioned on this website are subject to their own terms, availability and the period stated. We may change or end a promotion at any time, without affecting agreements already signed.",
        ],
      },
      {
        heading: "6. Website content",
        bullets: [
          "We try to keep this website accurate and up to date, but we do not guarantee that all information is complete, current or free of errors, or that the website will always be available.",
          "All text, images, videos, logos and trademarks on this website belong to MAQO or its licensors. You may not copy or use them for commercial purposes without our written permission.",
          "Links to other websites (such as YouTube or social media) are for convenience. We are not responsible for their content or practices.",
        ],
      },
      {
        heading: "7. Acceptable use",
        paragraphs: [
          "You agree not to submit false, misleading or someone else's details, send spam or automated submissions, or try to interfere with the website or its security. We may reject or delete any submission that breaks these Terms.",
        ],
      },
      {
        heading: "8. Limitation of liability",
        paragraphs: [
          "To the extent permitted by law, MAQO is not liable for any loss or damage arising from your use of this website or reliance on estimates or general information on it. Nothing in these Terms limits any rights you have under the Consumer Protection Act 1999 or other laws that cannot be excluded.",
        ],
      },
      {
        heading: "9. Personal data",
        paragraphs: [
          "We handle your personal data in line with our Privacy Policy and the Personal Data Protection Act 2010.",
        ],
      },
      {
        heading: "10. Changes to these Terms",
        paragraphs: [
          "We may update these Terms from time to time. The version on this page, with its updated date, applies to forms submitted after that date.",
        ],
      },
      {
        heading: "11. Governing law",
        paragraphs: ["These Terms are governed by the laws of Malaysia, and the courts of Malaysia have jurisdiction over any dispute."],
      },
    ],
    contactHeading: "12. Contact us",
    contactIntro: "For any question about these Terms, please contact:",
    emailLabel: "Email:",
    phoneLabel: "Phone:",
    addressLabel: "Address:",
    languageNote:
      "These Terms are available in English, Bahasa Melayu and Chinese. If there is any inconsistency, the English version prevails.",
    footerLink: "Terms & Conditions",
    agree: ["I agree to the ", " and ", ", and agree to be contacted by MAQO Engineering Sdn Bhd about my enquiry."],
  },
  ms: {
    title: "Terma & Syarat",
    metaDescription:
      "Terma yang terpakai apabila anda menggunakan laman web ini dan menghantar borang pertanyaan kepada MAQO Engineering Sdn Bhd.",
    updatedLabel: "Kemas kini terakhir:",
    intro:
      "Terma & Syarat ini (\"Terma\") terpakai apabila anda menggunakan laman web ini dan menghantar borang pertanyaan, penilaian atau sebut harga di dalamnya. Laman web ini dikendalikan oleh MAQO Engineering Sdn Bhd (\"MAQO\", \"kami\"). Dengan menanda kotak persetujuan dan menghantar borang, anda mengesahkan bahawa anda telah membaca dan bersetuju dengan Terma ini dan Dasar Privasi kami.",
    sections: [
      {
        heading: "1. Tentang perkhidmatan kami",
        paragraphs: [
          "MAQO mereka bentuk, membekal dan memasang sistem solar PV, sistem storan tenaga bateri (BESS) dan pengecas EV untuk kediaman serta pelanggan komersial dan perindustrian (C&I) di Malaysia. Kami juga menawarkan pilihan tanpa modal seperti perjanjian pembelian tenaga solar (SPPA). Maklumat di laman web ini adalah umum dan tidak mengambil kira hartanah, keadaan bumbung, penggunaan elektrik atau tarif TNB anda.",
        ],
      },
      {
        heading: "2. Menghantar borang",
        bullets: [
          "Anda mesti berumur sekurang-kurangnya 18 tahun dan diberi kuasa untuk memberikan butiran yang anda hantar. Bagi pertanyaan syarikat, anda mengesahkan bahawa anda diberi kuasa untuk bertanya bagi pihak syarikat.",
          "Anda bersetuju bahawa maklumat yang anda berikan adalah benar, tepat dan lengkap. Penilaian kami bergantung padanya.",
          "Menghantar borang adalah permintaan untuk maklumat. Ia tidak mewujudkan kontrak atau mewajibkan anda membeli apa-apa.",
        ],
      },
      {
        heading: "3. Persetujuan untuk dihubungi",
        paragraphs: [
          "Dengan menghantar borang, anda bersetuju bahawa MAQO dan wakilnya yang diberi kuasa boleh menghubungi anda melalui panggilan telefon, SMS, WhatsApp atau e-mel mengenai pertanyaan, penilaian, sebut harga anda serta produk dan perkhidmatan berkaitan. Anda boleh meminta kami berhenti pada bila-bila masa dengan membalas \"STOP\" atau menghantar e-mel ke alamat di bawah.",
        ],
      },
      {
        heading: "4. Sebut harga, penjimatan dan anggaran",
        bullets: [
          "Sebarang sebut harga, saiz sistem, harga, penjimatan, tempoh pulangan modal atau pulangan yang ditunjukkan di laman web ini, oleh kalkulator, atau oleh pasukan kami sebelum tinjauan tapak adalah anggaran sahaja.",
          "Keputusan sebenar bergantung pada tinjauan tapak, keadaan bumbung, teduhan, cuaca, penggunaan tenaga, peralatan, tarif dan caj TNB, serta program kerajaan seperti NEM, SELCO atau ATAP, yang mungkin berubah.",
          "Sebut harga sah hanya bagi tempoh yang dinyatakan padanya. Kewajipan kami bermula hanya apabila kedua-dua pihak menandatangani perjanjian bertulis, dan terma perjanjian itu kemudiannya terpakai menggantikan apa-apa di laman web ini.",
        ],
      },
      {
        heading: "5. Promosi",
        paragraphs: [
          "Promosi, rebat atau barangan percuma yang disebut di laman web ini tertakluk kepada terma, ketersediaan dan tempoh yang dinyatakan. Kami boleh mengubah atau menamatkan promosi pada bila-bila masa, tanpa menjejaskan perjanjian yang telah ditandatangani.",
        ],
      },
      {
        heading: "6. Kandungan laman web",
        bullets: [
          "Kami berusaha memastikan laman web ini tepat dan terkini, tetapi kami tidak menjamin bahawa semua maklumat adalah lengkap, terkini atau bebas daripada kesilapan, atau bahawa laman web ini sentiasa tersedia.",
          "Semua teks, imej, video, logo dan tanda dagangan di laman web ini adalah milik MAQO atau pemberi lesennya. Anda tidak boleh menyalin atau menggunakannya untuk tujuan komersial tanpa kebenaran bertulis kami.",
          "Pautan ke laman web lain (seperti YouTube atau media sosial) disediakan untuk kemudahan. Kami tidak bertanggungjawab atas kandungan atau amalan laman web tersebut.",
        ],
      },
      {
        heading: "7. Penggunaan yang dibenarkan",
        paragraphs: [
          "Anda bersetuju untuk tidak menghantar butiran palsu, mengelirukan atau milik orang lain, menghantar spam atau penghantaran automatik, atau cuba mengganggu laman web atau keselamatannya. Kami boleh menolak atau memadam sebarang penghantaran yang melanggar Terma ini.",
        ],
      },
      {
        heading: "8. Had liabiliti",
        paragraphs: [
          "Setakat yang dibenarkan oleh undang-undang, MAQO tidak bertanggungjawab atas sebarang kerugian atau kerosakan yang timbul daripada penggunaan laman web ini atau pergantungan pada anggaran atau maklumat umum di dalamnya. Tiada apa-apa dalam Terma ini mengehadkan hak anda di bawah Akta Perlindungan Pengguna 1999 atau undang-undang lain yang tidak boleh dikecualikan.",
        ],
      },
      {
        heading: "9. Data peribadi",
        paragraphs: [
          "Kami mengendalikan data peribadi anda selaras dengan Dasar Privasi kami dan Akta Perlindungan Data Peribadi 2010.",
        ],
      },
      {
        heading: "10. Perubahan kepada Terma ini",
        paragraphs: [
          "Kami boleh mengemas kini Terma ini dari semasa ke semasa. Versi di halaman ini, berserta tarikh kemas kininya, terpakai kepada borang yang dihantar selepas tarikh tersebut.",
        ],
      },
      {
        heading: "11. Undang-undang yang mentadbir",
        paragraphs: ["Terma ini ditadbir oleh undang-undang Malaysia, dan mahkamah Malaysia mempunyai bidang kuasa ke atas sebarang pertikaian."],
      },
    ],
    contactHeading: "12. Hubungi kami",
    contactIntro: "Untuk sebarang pertanyaan mengenai Terma ini, sila hubungi:",
    emailLabel: "E-mel:",
    phoneLabel: "Telefon:",
    addressLabel: "Alamat:",
    languageNote:
      "Terma ini tersedia dalam bahasa Inggeris, Bahasa Melayu dan bahasa Cina. Sekiranya terdapat sebarang percanggahan, versi bahasa Inggeris akan diguna pakai.",
    footerLink: "Terma & Syarat",
    agree: ["Saya bersetuju dengan ", " dan ", ", serta bersetuju untuk dihubungi oleh MAQO Engineering Sdn Bhd mengenai pertanyaan saya."],
  },
  cn: {
    title: "条款与条件",
    metaDescription: "您使用本网站并向 MAQO Engineering Sdn Bhd 提交询问表格时适用的条款。",
    updatedLabel: "最后更新：",
    intro:
      "本条款与条件（「本条款」）适用于您使用本网站以及在本网站提交询问、评估或报价表格。本网站由 MAQO Engineering Sdn Bhd（「MAQO」、「我们」）运营。勾选同意框并提交表格，即表示您确认已阅读并同意本条款及我们的隐私政策。",
    sections: [
      {
        heading: "1. 关于我们的服务",
        paragraphs: [
          "MAQO 为马来西亚的住宅及工商业（C&I）客户设计、供应及安装太阳能光伏系统、电池储能系统（BESS）及电动车充电器，并提供零资本方案，例如太阳能购电协议（SPPA）。本网站上的信息属一般性质，并未考虑您的物业、屋顶状况、用电量或 TNB 电费。",
        ],
      },
      {
        heading: "2. 提交表格",
        bullets: [
          "您必须年满 18 岁，并有权提供您所提交的资料。若为公司询问，您确认您有权代表该公司进行询问。",
          "您同意所提供的信息真实、准确及完整。我们的评估以此为依据。",
          "提交表格仅为索取信息，并不构成合约，也不要求您购买任何产品。",
        ],
      },
      {
        heading: "3. 同意接受联系",
        paragraphs: [
          "提交表格即表示您同意 MAQO 及其授权代表可通过电话、短信、WhatsApp 或电子邮件，就您的询问、评估、报价及相关产品与服务与您联系。您可随时回复「STOP」或发送电子邮件至下方地址，要求我们停止联系。",
        ],
      },
      {
        heading: "4. 报价、节省金额及估算",
        bullets: [
          "在实地勘察前，本网站、计算器或我们团队所提供的任何报价、系统容量、价格、节省金额、回本期或回报，均仅为估算。",
          "实际结果取决于实地勘察、屋顶状况、遮荫、天气、用电量、设备、TNB 电费及收费，以及 NEM、SELCO 或 ATAP 等可能变动的政府计划。",
          "报价仅在其注明的期限内有效。我们的义务仅在双方签署书面协议后才开始，届时以该协议条款为准，取代本网站上的任何内容。",
        ],
      },
      {
        heading: "5. 促销",
        paragraphs: [
          "本网站提及的促销、回扣或赠品须受其各自条款、供应情况及注明期限的约束。我们可随时更改或终止促销，但不影响已签署的协议。",
        ],
      },
      {
        heading: "6. 网站内容",
        bullets: [
          "我们尽力确保本网站准确及最新，但不保证所有信息完整、最新或无误，也不保证本网站随时可用。",
          "本网站上的所有文字、图片、视频、标志及商标均属 MAQO 或其授权方所有。未经我们书面许可，您不得复制或将其用于商业用途。",
          "指向其他网站（例如 YouTube 或社交媒体）的链接仅为方便而提供。我们不对其内容或做法负责。",
        ],
      },
      {
        heading: "7. 可接受的使用",
        paragraphs: [
          "您同意不提交虚假、误导性或他人的资料，不发送垃圾信息或自动化提交，也不试图干扰本网站或其安全。我们可拒绝或删除任何违反本条款的提交。",
        ],
      },
      {
        heading: "8. 责任限制",
        paragraphs: [
          "在法律允许的范围内，MAQO 不对您使用本网站或依赖其中的估算或一般信息而引起的任何损失或损害承担责任。本条款中的任何内容均不限制您根据《1999 年消费者保护法》或其他不可排除的法律所享有的权利。",
        ],
      },
      {
        heading: "9. 个人资料",
        paragraphs: ["我们按照我们的隐私政策及《2010 年个人资料保护法》处理您的个人资料。"],
      },
      {
        heading: "10. 本条款的更改",
        paragraphs: ["我们可不时更新本条款。本页面上的版本及其更新日期，适用于该日期之后提交的表格。"],
      },
      {
        heading: "11. 适用法律",
        paragraphs: ["本条款受马来西亚法律管辖，任何争议由马来西亚法院管辖。"],
      },
    ],
    contactHeading: "12. 联系我们",
    contactIntro: "如对本条款有任何疑问，请联系：",
    emailLabel: "电子邮件：",
    phoneLabel: "电话：",
    addressLabel: "地址：",
    languageNote: "本条款备有英文、马来文及中文版本。如有任何歧义，概以英文版本为准。",
    footerLink: "条款与条件",
    agree: ["我同意", "及", "，并同意 MAQO Engineering Sdn Bhd 就我的询问与我联系。"],
  },
};
