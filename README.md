# موازين (Mawazin)

نظام إدارة المكاتب القانونية المتكامل مع مساعد قانوني ذكي متخصص في القانون السعودي.

## التشغيل محليًا

### المتطلبات

- Node.js (مفضل +18)
- pnpm
- قاعدة بيانات MySQL

### إعداد المتغيرات

أنشئ ملف `.env` (لا يتم رفعه إلى GitHub) واضف القيم المناسبة، مثال:

```bash
# Database
DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DB_NAME

# Auth (حسب إعدادك الحالي)
FRONTEND_URL=http://localhost:5173

# OpenAI
OPENAI_API_KEY=YOUR_KEY

# Legal Crawler (اختياري)
LEGAL_CRAWLER_ENABLED=false
LEGAL_CRAWLER_INTERVAL_MINUTES=180
LEGAL_CRAWLER_MAX_PAGES_PER_RUN=20
LEGAL_CRAWLER_USER_AGENT=mawazin-legal-assistant/1.0
LEGAL_CRAWLER_SEED_SITEMAPS=https://laws.moj.gov.sa/sitemap.xml,https://laws.moj.gov.sa/sitemap-regulations.xml,https://laws.moj.gov.sa/sitemap-judicial-decisions.xml,https://laws.boe.gov.sa/BoeLaws/Laws/Folders,https://laws.boe.gov.sa/BoeLaws/Laws/LawUpdated/1,https://laws.boe.gov.sa/BoeLaws/Laws/Search
```

### التثبيت والتشغيل

```bash
pnpm install
pnpm dev
```

- الواجهة الأمامية: `http://localhost:5173`
- السيرفر: يعمل عبر `server/_core/index.ts`

## رفع المشروع على GitHub

تأكد أن:

- ملفات `.env*` غير مرفوعة (موجودة داخل `.gitignore`).
- لا ترفع مفاتيح API أو بيانات قواعد البيانات.

## ملاحظات

هذا المشروع يقدم مساعدة قانونية عامة ولا يعتبر استشارة قانونية رسمية.
