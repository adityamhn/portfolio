# BugBase — Full Tech Stack

> Covers all 4 sub-projects: **bugbase-api**, **bugbase-employee-backend**, **bugbase-employee-v2**, **bugbase-v3**

---

## Languages & Runtimes

| Technology | Details |
|---|---|
| **TypeScript** | 5.8 / 5.9 — all backends and frontends |
| **Node.js** | v22 (LTS) — runtime for all services |
| **Python** | Not used in this project |

---

## Frontend

### Frameworks & Core
| Package | Version | Used In |
|---|---|---|
| **Next.js** | 15.5 (bugbase-v3), 16.0 (employee-v2) | Both frontends |
| **React** | 19 | Both frontends |
| **react-dom** | 19 | Both frontends |
| **Turbopack** | built-in (`next dev --turbopack`) | Build tooling |

### UI Component Libraries
| Package | Version | Used In |
|---|---|---|
| **Ant Design (antd)** | 5.22 | Both frontends |
| **@ant-design/icons** | 5.5 | Both frontends |
| **@ant-design/nextjs-registry** | 1.0 | Both frontends |
| **Framer Motion** | 11.15 | Both frontends |
| **react-icons** | 5.4 | Both frontends |
| **react-color** | 2.19 | Both frontends |
| **canvas-confetti** | 1.9 | bugbase-v3 |
| **Swiper** | 12.1 | bugbase-v3 |
| **next-themes** | 0.4 | bugbase-v3 |

### State Management
| Package | Version | Used In |
|---|---|---|
| **Redux Toolkit** | 2.5 | Both frontends |
| **react-redux** | 9.2 | Both frontends |
| **redux** | 5.0 | Both frontends |
| **redux-persist** | 6.0 | Both frontends |
| **redux-thunk** | 3.1 | Both frontends |

### Data Fetching
| Package | Version | Used In |
|---|---|---|
| **TanStack Query (react-query)** | 5.62 | Both frontends |
| **axios** | 1.7 / 1.13 | Both frontends |

### Data Visualization & Maps
| Package | Version | Used In |
|---|---|---|
| **Recharts** | 2.15 | Both frontends |
| **Leaflet** | 1.9 | bugbase-v3 |
| **react-leaflet** | 5.0 | bugbase-v3 |
| **Mapbox GL** | 3.9 | bugbase-v3 |
| **react-map-gl** | 7.1 | bugbase-v3 |
| **D3 (d3-geo, d3-scale)** | 3.1 / 4.0 | bugbase-v3 |

### Markdown & Rich Text
| Package | Version | Used In |
|---|---|---|
| **react-markdown** | 9.0 | Both frontends |
| **@uiw/react-md-editor** | 4.0 | Both frontends |
| **remark-gfm** | 4.0 | Both frontends |
| **remark-breaks** | 4.0 | Both frontends |
| **rehype-sanitize** | 6.0 | Both frontends |
| **react-syntax-highlighter** | 15.6 | Both frontends |

### PDF & Documents
| Package | Version | Used In |
|---|---|---|
| **react-pdf** | 9.2 | Both frontends |
| **pdfjs-dist** | 4.10 | bugbase-v3 |

### Forms & Auth UI
| Package | Version | Used In |
|---|---|---|
| **react-google-recaptcha** | 3.1 | Both frontends |
| **@hcaptcha/react-hcaptcha** | 1.11 | bugbase-employee-v2 |

### Drag & Drop / Interaction
| Package | Version | Used In |
|---|---|---|
| **react-dnd** | 16.0 | bugbase-v3 |
| **react-dnd-html5-backend** | 16.0 | bugbase-v3 |

### Diff & Code
| Package | Version | Used In |
|---|---|---|
| **react-diff-view** | 3.3 | bugbase-v3 |
| **unidiff** | 1.0 | bugbase-v3 |

### Payment UI
| Package | Version | Used In |
|---|---|---|
| **@stripe/react-stripe-js** | 3.8 | bugbase-v3 |
| **@stripe/stripe-js** | 5.4 | bugbase-v3 |

### Other Frontend Libraries
| Package | Version | Used In |
|---|---|---|
| **react-infinite-scroll-component** | 6.1 | Both frontends |
| **react-player** | 2.16 | Both frontends |
| **react-calendar** | 5.1 | bugbase-employee-v2 |
| **react-csv** | 2.2 | bugbase-employee-v2 |
| **react-json-to-csv** | 1.2 | Both frontends |
| **@uiw/react-json-view** | 2.0-alpha | bugbase-employee-v2 |
| **react-to-print** | 3.0 | bugbase-v3 |
| **file-saver** | 2.0 | bugbase-v3 |
| **next-nprogress-bar** | 2.4 | Both frontends |
| **@next/third-parties** | 15.1 | bugbase-v3 |
| **cookies-next** | 5.0 | bugbase-v3 |
| **js-cookie** | 3.0 | bugbase-v3 |
| **dayjs** | 1.11 | bugbase-employee-v2 |
| **moment / moment-timezone** | 2.30 | Both frontends |
| **lodash** | 4.17 | Both frontends |
| **cvss / @pandatix/js-cvss** | 1.0 / 0.4 | Both frontends |
| **nanoid** | 5.1 | bugbase-employee-v2 |
| **immutability-helper** | 3.1 | bugbase-v3 |
| **sass** | 1.83 | Both frontends (SCSS) |

---

## Backend

### Frameworks & Core
| Package | Version | Used In |
|---|---|---|
| **Express** | 4.21 | Both backends |
| **TypeScript** | 5.8 / 5.9 | Both backends |
| **nodemon** | 3.1 | Dev server |
| **ts-node** | 10.9 | TypeScript execution |

### Database
| Package | Version | Used In |
|---|---|---|
| **Mongoose** | 8.9 (api), 8.18 (employee) | Both backends |
| **MongoDB** | (via Mongoose ODM) | Primary database |
| **Redis** | 4.7 | Both backends — session store + cache |
| **connect-redis** | 8.0 | Session store adapter |

### Authentication & Security
| Package | Version | Used In |
|---|---|---|
| **passport** | 0.7 | Both backends |
| **@node-saml/passport-saml** | 5.0 | SSO/SAML auth |
| **express-session** | 1.18 | Session management |
| **jsonwebtoken** | 9.0 | JWT auth |
| **bcryptjs** | 2.4 | Password hashing |
| **speakeasy** | 2.0 | TOTP/2FA |
| **qrcode** | 1.5 | 2FA QR generation |
| **csrf** | 3.1 | CSRF protection |
| **express-rate-limit** | 7.5 | Rate limiting |
| **express-mongo-sanitize** | 2.2 | NoSQL injection prevention |
| **sanitize-html** | 2.14 | XSS prevention |
| **cookie-parser** | 1.4 | Cookie parsing |
| **cors** | 2.8 | CORS handling |

### Cloud Integrations
| Package | Service | Used In |
|---|---|---|
| **@azure/identity** | Azure AD auth | Both backends |
| **@azure/keyvault-secrets** | Azure Key Vault | Both backends |
| **@azure/storage-blob** | Azure Blob Storage | Both backends |
| **@google-cloud/translate** | Google Translate API | bugbase-api |
| **googleapis** | Google APIs (OAuth, etc.) | Both backends |

### AI
| Package | Version | Used In |
|---|---|---|
| **openai** | 4.77 | bugbase-api (AI features) |

### Payments
| Package | Version | Used In |
|---|---|---|
| **stripe** | 17.5 | Both backends |
| **razorpay** | 2.9 | Both backends |

### Analytics & Tracking
| Package | Service | Used In |
|---|---|---|
| **@jitsu/js** | Jitsu analytics | bugbase-api, bugbase-v3 |
| **@jitsu/sdk-js** | Jitsu analytics | bugbase-employee-backend |

### Third-Party Integrations
| Package | Service | Used In |
|---|---|---|
| **@octokit/rest** | GitHub API | Both backends |
| **@pagerduty/pdjs** | PagerDuty | Both backends |
| **@slack/web-api** | Slack | bugbase-employee-backend |
| **jira2md** | Jira | bugbase-employee-backend |
| **geoip-lite** | GeoIP lookup | Both backends |

### File & Media Processing
| Package | Version | Used In |
|---|---|---|
| **multer** | 2.1 | File uploads |
| **sharp** | 0.33 | Image processing |
| **pdfmake** | 0.2 | PDF generation |
| **pdfkit** | 0.17 | PDF generation |
| **svg-to-pdfkit** | 0.1 | SVG in PDFs |

### Email
| Package | Version | Used In |
|---|---|---|
| **nodemailer** | 6.10 | bugbase-employee-backend |

### HTTP & Scraping
| Package | Version | Used In |
|---|---|---|
| **axios** | 1.13 | Both backends |
| **node-fetch** | 3.3 | Both backends |
| **form-data** | 4.0 | bugbase-api |
| **http-proxy-middleware** | 2.0 | bugbase-employee-backend |
| **puppeteer** | 23.11 | bugbase-employee-backend (headless browser) |
| **cheerio** | — | Parsing |

### Data Utilities
| Package | Version | Used In |
|---|---|---|
| **csv-parse** | 5.6 | Both backends |
| **csv-writer** | 1.6 | Both backends |
| **json2csv** | 6.0-alpha | Both backends |
| **xml2js** | 0.6 | XML parsing (SAML, etc.) |
| **lodash** | 4.18 | Both backends |
| **moment / moment-timezone** | 2.30 | Both backends |
| **deep-diff** | 1.0 | Object diffing |
| **nanoid / uuid** | 5.0 / 11.0 | ID generation |
| **dotenv** | 16.4 | Env vars |
| **easy-currencies** | 1.8 | Currency conversion |
| **amazon-s3-uri** | 0.1 | S3 URL parsing |

---

## Infrastructure & Cloud

### Cloud Providers
| Provider | Services Used |
|---|---|
| **AWS** | ECR (Elastic Container Registry), EC2 (SSH deploy), region: ap-south-1 (Mumbai) |
| **Azure** | ACR (`bugbase.azurecr.io`), Azure Key Vault, Azure Blob Storage, Azure Container Instances, Azure Service Principal auth |
| **Google Cloud** | Google Translate API, Google OAuth (googleapis) |
| **Cloudflare** | DNS management, CDN, zone management (multiple zones) |

### Databases & Storage (Self-Hosted / Managed)
| Service | Purpose |
|---|---|
| **MongoDB** | Primary application database |
| **Redis** | Session store + caching |

### Containerization
| Technology | Details |
|---|---|
| **Docker** | Multi-stage builds (node:22-alpine base) |
| **Docker Buildx** | Multi-platform builds |
| **Nginx** | Reverse proxy + SSL termination (separate Dockerfile.nginx) |
| **pnpm** | Package manager (corepack-managed) |

---

## CI/CD

### Platforms
| Platform | Usage |
|---|---|
| **GitHub Actions** | Primary CI/CD for all 4 sub-projects |
| **GitLab CI** | Legacy pipeline (bugbase-api) |

### Workflow Overview
| Workflow | Trigger | What it does |
|---|---|---|
| `production.workflow.yml` | Push to `production` branch | Build → Push to AWS ECR → Terraform deploy |
| `azure-production.workflow.yml` | Push to `azure-production` branch | Build → Push to Azure ACR → Terraform deploy |
| `azure-testing.workflow.yml` | Push to `azure-testing` branch | Build → Push to Azure ACR → Terraform deploy (testing env) |
| `development.workflow.yml` | Push to `development` branch | Build + deploy to dev environment |
| `testing.workflow.yml` | Push to `testing` branch | Build + deploy to testing environment |
| `deploy.workflow.yml` | Push to deploy branch | Frontend deployment |
| `demo-employee.workflow.yml` | Push to branch | Employee demo environment |
| `dependabot.yml` | Scheduled | Automated dependency updates |

### Tools in Pipelines
| Tool | Purpose |
|---|---|
| **Terraform** | Infrastructure provisioning (deploys from separate `bugbase-devops` repo) |
| **hashicorp/setup-terraform** | GitHub Action for Terraform |
| **aws-actions/configure-aws-credentials** | AWS auth in CI |
| **aws-actions/amazon-ecr-login** | ECR login |
| **azure/docker-login** | ACR login |
| **azure/login** | Azure SP auth |
| **actions/checkout** | Source checkout |
| **Dependabot** | Automated dependency PRs |

---

## Developer Tooling

| Tool | Purpose |
|---|---|
| **pnpm** | Package manager (all projects) |
| **TypeScript** | Static typing |
| **ESLint** | Linting (eslint-config-love, eslint-config-next, eslint-plugin-react) |
| **Prettier** | Code formatting |
| **Husky** | Git hooks (pre-commit linting/formatting) |
| **Turbopack** | Next.js fast bundler (dev) |
| **tsc** | TypeScript compiler |
| **nodemon** | Dev server with auto-restart |
