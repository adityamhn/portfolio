# Portfolio — Products & Engineering

A narrative tech-stack overview of the two products I built and operate, written for a portfolio audience. The goal is to be readable for a non-technical reader while still being precise enough that an engineer can tell exactly how the systems are wired up.

> Use this as a base. Drop the **Role & Responsibilities** sections into your portfolio and fill in your own bullets — the templates are written from the perspective of a CTO/founding engineer.

---

# 1. Pentest Copilot Enterprise

> **Autonomous AI pentesting agent that finds real security vulnerabilities without human intervention.** Pentest Copilot maps attack surfaces, simulates realistic kill-chain behavior, and automates validation and reporting across web, API, and internal environments.

Pentest Copilot Enterprise (internally codenamed **RTCS — Red Team Copilot System**) is not a single application. It is a distributed system of five tightly cooperating services that together replicate the workflow of a human red team: reconnaissance → vulnerability discovery → exploitation → post-exploitation → reporting — autonomously, and at the speed of compute.

## 1.1 The Product, in One Page

A user points the platform at a domain or an internal subnet. From there:

1. The **Engine** spins up an autonomous **AI agent (`secagent`)** inside a sandboxed environment.
2. The agent reasons through reconnaissance and runs real offensive tools (nmap, ffuf, sqlmap, BloodHound, Impacket, custom Python jobs) against the target.
3. Findings, hosts, credentials, sessions and exploitation paths are streamed live into a **Neo4j attack graph** that the user can visualize and navigate in real time.
4. The platform handles its own LLM calls through an in-house **AI proxy** — it can use OpenAI, Anthropic, Groq, Together, Ollama, or any OpenAI-compatible model — and every prompt is traced for observability.
5. When the engagement is done, the system generates a structured **PDF/Markdown report** with reproducible evidence, screenshots, and a kill-chain narrative.

## 1.2 System Architecture (High Level)

The platform is split across **five repositories**, each with a clear responsibility. They were intentionally separated so the security-sensitive pieces (the agent, the AI proxy) can be hardened, sandboxed, deployed, and scaled independently of the user-facing app.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          rtcs/frontend (Next.js)                         │
│         Operator console, attack-graph viz, terminals, reports           │
└──────────────────────────┬───────────────────────────────────────────────┘
                           │ HTTPS + Socket.IO (real-time)
┌──────────────────────────▼───────────────────────────────────────────────┐
│                    rtcs/backend — API Service (Quart)                    │
│      JWT auth · REST · Socket.IO · publishes commands to the engine      │
└──────────────────────────┬───────────────────────────────────────────────┘
                           │ Redis Pub/Sub (decoupled control plane)
┌──────────────────────────▼───────────────────────────────────────────────┐
│                  rtcs/backend — Engine Service (Quart)                   │
│  Module orchestrator · attack-graph writer · AMQP producer · scheduler   │
└──────┬─────────────────────────────────┬─────────────────────────────────┘
       │ RabbitMQ                        │ writes
       │ (job dispatch)                  ▼
       │                       ┌───────────────────┐
       ▼                       │  Neo4j attack     │
┌──────────────┐               │  graph + APOC +   │
│   secagent   │ ──────────────▶  Graph DS         │
│  (Python,    │   results     └───────────────────┘
│   PyInstaller│
│   binary)    │ ◀─────────────── ai_proxy (LLM gateway, Flask)
└──────────────┘
       │
       ▼
   nmap, sqlmap, ffuf, BloodHound, Impacket, Patchright (browser),
   Responder, ntlmrelayx, ZAP, custom AGENT_/CLOUD_/SANDBOX_ jobs…

Storage:  MariaDB · Neo4j · Redis · MinIO · Elasticsearch
Observability:  Filebeat · Metricbeat · Langfuse (LLM traces)
Edge:     Nginx · OpenVPN · Cloudflare
Ship:     Azure ACR · Azure VMs · GitHub Actions · uv · PyArmor · PyInstaller
```

## 1.3 The Five Repositories

### 1.3.1 `rtcs` — The Control Plane (Backend + Frontend)

The brain of the platform. The backend is split deliberately into **two Quart services** that share a `shared/` package but never import each other directly:

- **API Service** (`rtcs/backend/api_service/`) — speaks to the user. REST + Socket.IO + JWT. Receives operator intent (“start an external assessment for `acme.com`”) and publishes commands.
- **Engine Service** (`rtcs/backend/engine_service/`) — speaks to the agents. Owns the orchestration state machine, dispatches jobs to RabbitMQ, consumes results, writes nodes/edges into Neo4j.

The two communicate over **Redis Pub/Sub** instead of in-process function calls. That isolation lets us scale the engine horizontally, restart it without dropping the user’s session, and run engine experiments against a stable API layer.

The **frontend** (`rtcs/frontend`) is a Next.js + React application. The interesting parts are:

- A live **attack-graph visualization** built on `@neo4j-nvl`, Sigma.js, graphology, and ForceAtlas2 — operators can pan/zoom through a real-time graph of hosts, sessions, creds, and exploits as the agent finds them.
- An in-browser **terminal** (xterm.js) and **code editor** (Ace) so an operator can take manual control of any agent without leaving the console.
- A **WYSIWYG report editor** (TinyMCE) and inline diff viewer for evidence review.

### 1.3.2 `secagent` — The Autonomous Pentester

This is where the actual hacking happens. `secagent` is a Python program that ships in three flavors — **`linux_agent`** (deployed inside the target environment), **`sandbox`** (managed cloud sandbox for browser/web jobs), and **`cloud`** (long-running enrichment jobs like wordlist generation, GitHub dorking, hash cracking). All three are compiled to single-file binaries with **PyInstaller**, hardened with **PyArmor**, and the Windows variant is XOR-encrypted at build time.

It exposes a job dispatcher with three families of jobs (each visible in `secagent/jobs/`):

| Family | Examples | Where it runs |
|---|---|---|
| `AGENT_JOB_*` | `SECRETSDUMP`, `CERTIPY`, `ZEROLOGON`, `NTLMRELAYX_COERCE`, `PRIV_ESCALATION`, `LDAP_INFO_USERS_EXTRACT`, `BROWSERCREDS_EXTRACT`, `MSSQL/MYSQL` | inside the target network (Linux/Windows) |
| `SANDBOX_JOB_*` | `ACTIVE_ZAP_SCAN`, `DIRBUSTING`, `SPIDER_CRAWL`, `HTTP_DESYNC_TESTER`, `GRAPHQL_INTROSPECT`, `ANDROID_TESTER`, `TRAJECTORY_GENERATOR` | in our managed cloud sandbox |
| `CLOUD_JOB_*` | `CRACK_HASH`, `EXTRACT_SECRETS`, `GITLEAKS_SECRET`, `GENERATE_WORDLIST`, `SEARCH_GITHUB`, `GOOGLE_DORKS` | on long-lived cloud workers |

The agent talks back to the engine over **RabbitMQ** with `pika` (a sync, pre-fork-safe AMQP client — chosen because the agent is heavily multithreaded with native libraries). RabbitMQ’s **per-channel prefetch and delivery-tag semantics** are core to how we throttle in-flight work without ack storms — the comment in `agent.py` explains exactly why we don’t NACK-with-requeue on backpressure.

### 1.3.3 `ai_proxy` — The Multi-Provider LLM Gateway

Every LLM call in the platform — both from the backend and from `secagent` — is funnelled through `ai_proxy`. It is a small but critical Flask + Gunicorn service that:

- **Speaks one unified API** to consumers and dispatches to **OpenAI, Anthropic, Groq, Together, Ollama**, or **any OpenAI-compatible endpoint** (so we can swap models without touching product code).
- **Wraps every call in `langfuse`** for end-to-end LLM tracing, cost tracking, and evaluation.
- **Uses `instructor` + Pydantic** to force structured outputs (typed JSON) where the agent needs reliable parsing.
- **Handles streaming, retries, fallback chains and per-tenant rate limits** in one place, so neither the engine nor the agent has to know which model is currently behind the API.

Centralizing the LLM layer here is what makes BYOK (bring-your-own-key) and zero-downtime model migrations possible.

### 1.3.4 `pentest-copilot` — The Open-Source Single-User Edition

Open-sourced on GitHub. A user can run `./run.sh start`, point a browser at `localhost:3000`, and get an AI agent that drives a Kali container directly. It uses a simpler stack — **Express + TypeScript + MongoDB + Redis** — because it’s designed to run on a laptop, not a fleet.

Highlights of the architecture:

- **Agentic execution loop** with up to 25 reasoning iterations per turn, 16 tools (bash, Python, Burp Suite RPC, browser automation via [Magnitude](https://github.com/magnitude-dev/magnitude), subagent spawning, etc.).
- A bundled **Kali Linux container** with XFCE4 + TightVNC + noVNC so the operator can watch the agent work in a real GUI desktop, all over a websocket.
- Real **Burp Suite integration** via `burp-rpc` — the agent can read proxy history, send to Repeater/Intruder, and use Collaborator for OOB testing.
- **Patchright** (a custom hardened Chromium fork) and **dockerode** for sandboxing browser sessions in containers per job.

### 1.3.5 `pentest-copilot-shared` — The Internal Python SDK

A small but heavily-used Python package (`hatchling`-built, `pytest`-tested) that owns shared primitives — Pydantic models for cross-service messages, HTTP/scraping helpers, token counting (`tiktoken`), and structured-logging schemas. Versioned and consumed by both `rtcs` and `secagent` so contract changes are explicit.

## 1.4 The Tech Stack — and Why

I made stack decisions on three principles: **(a)** match the runtime model to the workload (async I/O for orchestration, sync for tool execution), **(b)** keep the security surface small and inspectable, and **(c)** stay close to the metal where it matters (binary agents, hand-rolled AMQP semantics) and as high-level as possible everywhere else.

### Languages & Runtimes
- **Python 3.11/3.13** for the engine, agent, and AI proxy. Almost the entire offensive-security ecosystem (Impacket, BloodHound CE, Certipy, Responder, ntlmrelayx, lsassy, masky) is Python — meeting the ecosystem where it lives saved years of reimplementation work.
- **TypeScript 5.9 on Node 22** for the open-source `pentest-copilot` (Express backend + Next.js frontend). Chosen because that codebase ships to end users on laptops and has to interact with system processes, Docker, SSH, and a browser UI from the same runtime.
- **Go** preinstalled inside the Kali container so the agent can compile offensive tooling on demand.
- **JDK 8** in CI for building the Windows agent toolchain.

### Web Framework Layer
- **Quart** (async Flask) for `rtcs/backend`. We needed first-class `asyncio` for thousands of concurrent agent connections, AMQP consumers, Neo4j sessions and Socket.IO clients living in the same process — and we wanted Flask’s decorator/routing ergonomics. Quart is the only mature option that gives both.
- **Flask + Gunicorn** for `ai_proxy`. The proxy is mostly fan-in/fan-out and benefits from a simple, sync, pre-forked WSGI model.
- **Express 4** for the open-source `pentest-copilot` backend. Boring, battle-tested, easy for contributors.
- **Next.js 16 + React 19 + Turbopack** for both frontends. App Router gives us streaming SSR for the dashboards, and Turbopack keeps incremental dev builds under a second even on the 200+ page operator console.

### Real-Time & Messaging — the Heart of the System
This is the part of the stack I’m most opinionated about. Pentest Copilot has three different real-time channels for three very different reasons:

| Channel | Purpose | Why this and not the others |
|---|---|---|
| **Socket.IO** (frontend ↔ API) | Push live agent updates and graph deltas to operator UIs | Browser-friendly, transparent fallback, and built-in rooms map naturally to per-engagement scopes. |
| **Redis Pub/Sub** (API ↔ Engine) | Internal control plane: `start_module`, `enqueue_submodule`, `cancel`, lifecycle events | Sub-millisecond latency, stateless consumers, fits a fan-out command bus. We don’t need durability here — if the engine missed a command, the user just reissues it. |
| **RabbitMQ / AMQP** (Engine ↔ Agents) | Reliable, durable job dispatch and result return between the engine and `secagent` instances out in the field | Agents may live behind NAT, in customer networks, or run for hours. We need durable queues, per-channel prefetch for backpressure, and channel-scoped delivery tags to ack the right message on the right channel. RabbitMQ gives us all three out of the box; the engine uses **`aio_pika`** (async) and the agent uses **`pika`** (sync, thread-safe with the agent’s native-extension-heavy worker pool). |

### Data Layer
- **Neo4j** (with **APOC** and the **Graph Data Science** plugin) is the **attack graph** — hosts, users, services, credentials, sessions, exploit paths, and the edges between them. A graph DB is the right shape for kill-chain reasoning: Cypher queries like “show me every path from any compromised user to a domain admin” are one-line, and we use GDS for shortest-path and centrality scoring on the graph itself.
- **MariaDB 11** stores the relational, transactional state — engagements, organizations, users, modules, submodules, jobs, tasks, schedules, billing — driven through `aiomysql`. Plain SQL is the right tool for these high-cardinality joins.
- **MongoDB** is the document store for the open-source edition (chat history, session metadata, agent state) via **Mongoose**.
- **Redis 7** plays three roles: session/auth cache (`connect-redis`), the API↔Engine pub/sub bus, and an LRU response cache for expensive reconnaissance lookups.
- **MinIO** (self-hosted, S3-compatible) stores artifacts: payloads, screenshots, packet captures, generated reports.
- **Elasticsearch 9** ingests structured logs and agent telemetry for full-text search and post-engagement forensics.

### AI / LLM Stack
- **Anthropic SDK + OpenAI SDK + LangChain + Groq + Together + Ollama** — all reachable through the `ai_proxy`.
- **Instructor + Pydantic 2** to coerce model output into typed structured data. We never let raw model JSON enter business logic.
- **Langfuse** for LLM observability — every prompt, response, tool call, latency, and token cost is traced. Indispensable for debugging non-deterministic agent loops.
- **tiktoken** in three different services for accurate token accounting before we hit provider limits.
- **Magnitude** (in the OSS edition) for AI-driven browser automation against JavaScript-heavy targets.

### Offensive Security Toolkit (in `secagent`)
A curated 60+ library set that turns Python into a credible red-team platform: **Impacket**, **BloodHound CE**, **Certipy-AD**, **lsassy**, **masky**, **dploot**, **pypykatz**, **ldap3 / msldap / aiosmb / aardwolf**, **minikerberos**, **pyspnego**, **gssapi**, **Responder**, **ntlmrelayx**, **python-libnmap**, **pywerview**, **dsinternals**, plus our own custom **Patchright** (hardened Chromium for stealth browsing). Wherever a primitive existed in the offensive-Python ecosystem we adopted it; wherever it didn’t, we built it.

### Reporting & Document Generation
- **ReportLab + svglib + matplotlib + Pillow + markdown2** generate the final PDF reports, complete with attack-graph snapshots, evidence images, and CVSS-scored findings.
- **TinyMCE** in the frontend lets analysts edit reports inline with full WYSIWYG, syntax-highlighted code blocks, and diff views.

### Infrastructure & Deploy
- **Azure** is the production substrate — **Azure Container Registry** for images, **Azure VMs** (Ubuntu + Windows) for the engine, sandboxes, and Windows-specific build agents, with **Azure Service Principals** for CI auth.
- **Cloudflare** for DNS and edge security.
- **Docker + Docker Buildx + Compose** for everything. We have separate `docker-compose.dev.yml`, `.local.yml`, `.production` files so a developer can run the entire infra (Neo4j + MariaDB + RabbitMQ + Redis + MinIO + ES) on a laptop with one command.
- **Nginx** for reverse proxy + SSL termination.
- **OpenVPN** so GitHub Actions runners can SSH into private production VMs without exposing them.
- **Samba/SMB** as the payload share between Linux and Windows agent builds.
- **`jemalloc`** is `LD_PRELOAD`-injected into the Quart processes — the engine holds long-lived AMQP connections and Neo4j sessions, and `jemalloc` cut steady-state RSS by ~30 % vs glibc’s allocator on our workload.
- **Filebeat + Metricbeat (8.17)** ship Docker, Nginx and system metrics into Elasticsearch for ops dashboards.

### CI/CD
- **GitHub Actions** for all five repos.
- The `secagent` pipeline is the most complex: it builds Linux binaries inside a **`manylinux_2_28`** container (so they run on every supported customer distro), builds the Windows binary on a `windows-2025` runner with **JDK 8**, **PyInstaller**, **PyArmor**, then **XOR-encrypts** the Windows agent before uploading artifacts to the SMB share. After build, **`kota65535/github-openvpn-connect-action`** brings the runner onto the production VPN, **`appleboy/ssh-action`** SSHes in to redeploy, and a **Slack webhook** posts the result with preflight test status.
- **`uv`** (Rust-based, drop-in pip replacement) is used everywhere Python dependencies are resolved. Build times for the agent dropped from ~3 min to under 20 s.
- **Biome + ruff + pre-commit + Husky + ESLint + Prettier** for automated formatting/linting on every commit.

### Developer Tooling
- **`pnpm`** for all Node projects (workspace-aware, content-addressed, fast).
- **`uv`** for all Python projects.
- **`ngrok`** for exposing a local engine to a remote agent during development.
- **`pytest`** for shared-lib tests; **`mocha`** for the bundled mock-TTP server tests.

## 1.5 My Role & Responsibilities — *Pentest Copilot Enterprise*

> *Template — adapt to your own contributions and metrics.*

As **CTO and co-founder**, I own the technical direction and engineering execution of Pentest Copilot Enterprise end to end:

- **Architecture & Systems Design** — Designed the five-service split (API / Engine / Agent / AI Proxy / Shared), the Redis-vs-RabbitMQ-vs-Socket.IO division of responsibilities, and the Neo4j-as-attack-graph + MariaDB-as-system-of-record pattern that the platform is built on.
- **Autonomous Agent (`secagent`)** — Designed the job-dispatch model (`AGENT_JOB_*` / `SANDBOX_JOB_*` / `CLOUD_JOB_*`), the AMQP backpressure semantics, and the multi-platform single-binary build pipeline (Linux + Windows, PyInstaller + PyArmor + XOR encryption).
- **AI / LLM Platform** — Built the in-house multi-provider AI proxy with Langfuse-traced calls, structured-output enforcement (`instructor`/Pydantic), and provider failover so we can swap models without product changes.
- **Frontend & UX** — Drove the operator console in Next.js + React, including the live Neo4j attack-graph visualization, the in-browser terminal/IDE, and the WYSIWYG report editor.
- **Infrastructure & DevOps** — Built the Azure-based production environment, the GitHub Actions CI/CD pipelines (including OpenVPN-into-private-VPC deploys), and the local-dev Docker Compose stack used by the team.
- **Observability & Reliability** — Stood up the Elasticsearch + Filebeat/Metricbeat + Langfuse stack and the structured logging schema that lets us trace any finding back to the exact prompt, tool invocation and host that produced it.
- **Security of the Platform Itself** — Owned the threat model for a product that, by definition, runs offensive code. Designed the sandbox isolation, agent code-protection (PyArmor + XOR), and the BYO-LLM-key flow so customer prompts never leave their tenancy.
- **Team & Hiring** — *(fill in your own — number of engineers managed, hiring decisions, internal review processes, etc.)*

---

# 2. BugBase

> **Continuous Vulnerability Assessment Platform that continuously identifies, manages and mitigates real security vulnerabilities by plugging into Bug Bounty and Pentesting programs.**

BugBase is the company’s flagship platform — the marketplace and management layer that connects researchers, internal pentesters, and enterprise customers around continuous vulnerability discovery and remediation.

## 2.1 The Product, in One Page

BugBase is two parallel experiences sharing a common substrate:

- **The public/customer-facing platform (`bugbase-v3`)** — researchers submit findings, customers triage and pay them out, and program owners monitor real-time security posture across their estate.
- **The internal employee/triage console (`bugbase-employee-v2`)** — BugBase staff use this to validate reports, manage programs, run integrations into customer ticketing systems (Jira, GitHub, PagerDuty, Slack), and generate compliance-ready exports.

Both are powered by two Node/Express APIs (`bugbase-api` and `bugbase-employee-backend`) that share a MongoDB cluster but expose different surfaces.

## 2.2 System Architecture (High Level)

```
┌────────────────────────────────┐    ┌───────────────────────────────────┐
│  bugbase-v3 (Next.js 15)        │    │ bugbase-employee-v2 (Next.js 16)  │
│  Public + customer dashboard    │    │ Internal triage console           │
└──────────────┬─────────────────┘    └───────────────┬───────────────────┘
               │ REST + cookies                       │ REST + SSO/SAML
               ▼                                      ▼
┌────────────────────────────────┐    ┌───────────────────────────────────┐
│  bugbase-api (Express + TS)     │    │ bugbase-employee-backend (Express)│
│  Submissions · Programs · Pay   │    │ Triage · Workflow · Integrations  │
└──────────────┬─────────────────┘    └───────────────┬───────────────────┘
               │                                      │
               └──────────────┬──────────────┬────────┘
                              ▼              ▼
                          MongoDB         Redis (sessions, cache)
                              │
            ┌─────────────────┼──────────────────┬──────────────┐
            ▼                 ▼                  ▼              ▼
      Stripe + Razorpay   GitHub · Jira     Azure Blob     Cloudflare
       (dual-rail pay)    Slack · PagerDuty Azure Key Vault    DNS/CDN
                                            Google Translate
```

Two APIs, two frontends, one shared MongoDB. The split keeps the **internal triage console behind SSO/SAML** with its own SLAs and data-access rules, while the public app stays optimized for researcher submissions and customer dashboards.

## 2.3 The Four Repositories

### 2.3.1 `bugbase-api` — The Customer/Researcher API
Express + TypeScript on Node 22. Owns all public-facing flows: account creation, program enrollment, submission intake, deduplication, payouts (Stripe + Razorpay), customer dashboards, AI-assisted triage (`openai`), Google Translate for cross-language reports, and analytics ingest into Jitsu.

### 2.3.2 `bugbase-employee-backend` — The Internal Operations API
Same Express stack, different surface. Owns triage workflows, program lifecycle management, Slack/Jira/PagerDuty/GitHub bidirectional integrations, employee SSO via SAML, headless-browser report scraping (Puppeteer), email pipelines (Nodemailer), and PDF/CSV exports. Sessions are isolated from `bugbase-api` so a researcher token can never escalate into employee scope.

### 2.3.3 `bugbase-v3` — The Public Dashboard
Next.js 15 App Router + React 19. The richest UI surface in the platform — geographic threat maps (Mapbox + Leaflet + D3-geo), CVSS scoring (`cvss` + `@pandatix/js-cvss`), markdown report rendering with sanitization, PDF report viewing (`react-pdf` + `pdfjs-dist`), Stripe-elements payment flows, and confetti when a researcher gets paid.

### 2.3.4 `bugbase-employee-v2` — The Internal Triage Console
Next.js 16 + React 19, optimized for high-information-density workflows. JSON tree views, advanced calendar/scheduling, CSV imports/exports, hCaptcha-protected admin actions, and a 2FA flow (`speakeasy` + `qrcode`) for privileged actions.

## 2.4 The Tech Stack — and Why

BugBase was built for a different set of constraints than Pentest Copilot — **multi-region deploy, payments, SSO, PII handling, and 99.9% uptime.** The stack reflects that.

### Languages & Runtimes
- **TypeScript 5.8/5.9 on Node 22 (LTS)** end-to-end. Single language across both backends and both frontends means we share validators, types, model definitions, and helpers as `.d.ts` packages. No Python in this product — the workload is CRUD-, integration-, and UI-heavy, not compute-heavy.

### Frontend
- **Next.js 15 / 16 with the App Router** powers both UIs. Streaming SSR keeps the time-to-first-byte tight on dashboard pages with hundreds of database-backed widgets, and **Turbopack** gives the team < 1 s incremental dev builds on a 200+ route surface.
- **Ant Design 5** is the component foundation. We standardized on AntD because BugBase is form- and table-heavy (program editors, finding tables, payout invoices) and AntD’s `Form`, `Table`, and `DatePicker` primitives are best-in-class for that pattern. Custom theming layers our brand on top.
- **Redux Toolkit + redux-persist** handle long-lived UI state (filters, drafts, multi-step forms) that must survive page refresh. **TanStack Query 5** owns *server* state — caching, request dedup, optimistic updates.
- **Mapbox GL + react-map-gl + Leaflet + D3-geo** render the **global threat map** on `bugbase-v3`, plotting submissions, IPs, and active programs geographically.
- **Recharts** for everything tabular-to-chart.
- **Stripe Elements (`@stripe/react-stripe-js`)** for PCI-conformant payment UI; **Razorpay** is wired in parallel for the Indian market.
- **react-pdf + pdfjs-dist** for in-browser PDF rendering of submitted findings; **react-to-print** + **react-csv** + **json2csv** for export flows.
- **react-google-recaptcha + @hcaptcha/react-hcaptcha** to keep automated submission noise out.
- **next-themes** drives the dark/light theme toggle on `bugbase-v3`.

### Backend
- **Express 4** with **TypeScript** on both APIs. Express was the right call because BugBase is a classic REST + integration API — every route does CRUD, calls a third party, or transforms data. We don’t need Nest’s DI overhead or Fastify’s perf ceiling; we need predictability.
- **Mongoose 8 + MongoDB** as the system of record. Document storage maps cleanly to the natural shape of our data (a finding has nested PoCs, comments, attachments, history, and references), and we use Mongoose’s schema validation as the last line of defence after `zod` and `sanitize-html`.
- **Redis 4 + connect-redis 8** for sessions, rate-limit counters (`express-rate-limit`), and short-TTL cache for expensive program/finding aggregates.
- **Passport 0.7 + @node-saml/passport-saml** for SSO/SAML on the employee side; **JWT** + `express-session` for the public side; **bcryptjs** for password hashing; **speakeasy + qrcode** for TOTP 2FA on privileged actions.
- **csrf + express-mongo-sanitize + sanitize-html + cookie-parser + cors + express-rate-limit** form the defense-in-depth middleware stack. As a security company, we eat our own dogfood: every controller is rate-limited, sanitized, mongo-injection-protected, and CSRF-checked by default.

### Cloud & Integrations
- **Azure** is the primary cloud. We use **Azure Container Registry**, **Azure Blob Storage** (for findings attachments, evidence, exported reports), **Azure Key Vault** (for runtime secrets — never `.env` in production), and **Azure Container Instances**.
- **AWS ECR + EC2** runs the legacy/secondary deployment in the `ap-south-1` (Mumbai) region for low-latency Indian customers. `aws-actions/configure-aws-credentials` + `aws-actions/amazon-ecr-login` handle CI auth.
- **Google Cloud** for Translate API (so our triagers can read findings in any language) and Google OAuth.
- **Cloudflare** for DNS, CDN, and zone management across multiple branded domains.
- **Stripe + Razorpay** dual-rail for global + Indian payments.
- **Octokit** (GitHub), **PagerDuty PDJS**, **Slack Web API**, **`jira2md`** (Jira ↔ Markdown), and **Nodemailer** form the integration substrate — every BugBase finding can sync bidirectionally with the customer’s ticketing/incident stack.
- **Puppeteer** runs in `bugbase-employee-backend` for headless screenshot capture and report scraping.
- **Sharp** + **pdfmake** + **pdfkit** + **svg-to-pdfkit** form the PDF/image generation pipeline for compliance reports.
- **Jitsu** (`@jitsu/js`, `@jitsu/sdk-js`) is our self-hosted analytics — we won’t ship a security platform that pipes user telemetry to Google Analytics.
- **geoip-lite** drives request-level geo enrichment.

### Infrastructure & Deploy
- **Docker** with multi-stage `node:22-alpine` images; separate `Dockerfile.nginx` and `Dockerfile.testing.nginx` for env-specific reverse proxies.
- **Nginx** terminates SSL and serves static frontend builds.
- **Terraform** (lives in a separate `bugbase-devops` repo) provisions the cloud infrastructure on every promotion. We deliberately keep IaC outside the app repos so the same Terraform plan can be applied across `production`, `azure-production`, `azure-testing`, `testing`, and `development` workflows.

### CI/CD
- **GitHub Actions** is the source of truth, with an explicit pipeline per environment:
  - `production.workflow.yml` → AWS ECR + Terraform (Mumbai/ap-south-1).
  - `azure-production.workflow.yml` → Azure ACR + Terraform.
  - `azure-testing.workflow.yml` → Azure ACR + Terraform (testing).
  - `development.workflow.yml`, `testing.workflow.yml`, `deploy.workflow.yml`, `demo-employee.workflow.yml` for the lower environments.
- **GitLab CI** still runs as a legacy pipeline on `bugbase-api` and is being decommissioned.
- **Dependabot** is wired across all four repos.
- **`pnpm`** (corepack-managed) is the package manager everywhere.

### Developer Tooling
- **ESLint** (`eslint-config-love`, `eslint-config-next`, `eslint-plugin-react`) + **Prettier** + **Husky** for pre-commit hygiene.
- **`tsc`** for TypeScript builds, **`nodemon` + `ts-node`** for the dev loop.

## 2.5 My Role & Responsibilities — *BugBase*

> *Template — adapt to your own contributions and metrics.*

As **CTO and co-founder**, I’ve owned BugBase from prototype to production:

- **Product & Platform Architecture** — Designed the dual-API split (`bugbase-api` for public/customer, `bugbase-employee-backend` for internal/triage) and the shared-Mongo, isolated-session model that keeps researcher and employee surfaces hard-segregated.
- **Multi-Region, Multi-Cloud Deploy** — Architected the parallel **AWS (Mumbai) + Azure** deploys with environment-specific Terraform pipelines so we can serve Indian customers from `ap-south-1` while running the global plane on Azure.
- **Frontend Engineering** — Led the migration of both frontends to **Next.js App Router + React 19** and the shared design system on Ant Design.
- **Payments & Billing** — Built the dual-rail Stripe + Razorpay payout system with idempotent ledger entries and reconciliation jobs.
- **Integrations Platform** — Designed and shipped the GitHub / Jira / Slack / PagerDuty bidirectional sync model so BugBase can be a first-class citizen in any customer’s incident workflow.
- **Security Posture** — Owned the internal threat model, authored the defense-in-depth middleware stack (`csrf` + `mongo-sanitize` + `sanitize-html` + `rate-limit` + `helmet`-equivalents), implemented SSO/SAML for the employee app and TOTP 2FA for privileged actions, and ran the secret-management migration onto Azure Key Vault.
- **Reliability & Observability** — Built the deploy promotion pipeline (`development → testing → production`), the Jitsu-based analytics pipeline, and the on-call/PagerDuty wiring.
- **Team & Hiring** — *(fill in your own — number of engineers managed, hiring decisions, internal review processes, etc.)*

---

# Appendix — At-a-glance comparison of the two stacks

| Concern | Pentest Copilot Enterprise | BugBase |
|---|---|---|
| **Primary languages** | Python 3.11/3.13, TypeScript | TypeScript |
| **Frontend** | Next.js 16 / React 19 + Sigma.js + Neo4j-NVL + xterm.js + TinyMCE | Next.js 15-16 / React 19 + Ant Design + Mapbox/Leaflet |
| **Backend framework** | Quart (async) + Flask (gateway) + Express (OSS) | Express |
| **Primary DB** | MariaDB + Neo4j + MongoDB (OSS) | MongoDB |
| **Cache / sessions** | Redis | Redis |
| **Object storage** | MinIO (self-hosted S3) | Azure Blob |
| **Search / logs** | Elasticsearch + Filebeat + Metricbeat | — |
| **Real-time** | Socket.IO + Redis Pub/Sub + RabbitMQ (AMQP) | REST + cookies |
| **Job/queue** | RabbitMQ (`pika` + `aio_pika`) | — |
| **AI** | OpenAI · Anthropic · Groq · Together · Ollama · LangChain · Instructor · Langfuse | OpenAI (`bugbase-api`) |
| **Payments** | Stripe (OSS edition) | Stripe + Razorpay |
| **Cloud** | Azure (ACR + VMs) + Cloudflare | Azure + AWS (`ap-south-1`) + Cloudflare + GCP (Translate, OAuth) |
| **CI/CD** | GitHub Actions + OpenVPN + SSH + uv + PyInstaller + PyArmor | GitHub Actions + Terraform + AWS/Azure auth |
| **Package mgmt** | `uv` (Py) · `pnpm` (Node) | `pnpm` |
| **Observability** | Filebeat + Metricbeat + Elasticsearch + Langfuse + structlog | Jitsu + custom logging |
