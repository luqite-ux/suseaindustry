# Route inventory

| Route | Template status | Planned authority after integration |
|---|---|---|
| `/` | PASS | tenant settings + product/article queries |
| `/products` | PASS | Supabase products/categories |
| `/products/[slug]` | PASS | Supabase product detail |
| `/products/pla-basic` | PASS compatibility route | redirects/normalizes to dynamic data route |
| `/capabilities` | PASS | verified tenant content |
| `/applications` | PASS | verified tenant content |
| `/about` | PASS | tenant site settings + verified factory facts |
| `/news` | PASS | Supabase published articles, honest empty state |
| `/news/[slug]` | PASS | Supabase published article detail |
| `/contact` | PASS template | server CAPTCHA + inquiries integration pending |
| `/_not-found` | PASS | branded 404 |

Desktop and 390px entrypoints are all listed for the template visual review after the local server starts.
