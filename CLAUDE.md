# PROJECT DEFINITION: Ihouses
 
## 1. Project Description
Ihouses is a real-time, event-driven SaaS (Software as a Service) designed to solve the extreme housing crisis ("woningnood") in the Netherlands for expats, students, and local home-seekers. 
 
The platform continuously scrapes major Dutch housing websites (e.g., Pararius, Funda, Kamernet) in real-time. The moment a new listing matching a user's criteria is published, the platform alerts them instantly via Telegram. To provide a high-value competitive edge, Ihouses leverages LLM APIs (OpenAI/Anthropic) to automatically generate a highly personalized, professional cover letter (motivation letter) in perfect Dutch, combining the user's specific profile (salary, profession, pets, lifestyle) with the scraped property details.
 
## 2. Technical Stack & Architecture
To maintain a low-cost, high-performance, and DevOps-friendly infrastructure, the project is structured as follows:
- Frontend/App Mobile: Next.js (App Router), Tailwind CSS e Lucide React para ícones. Configurado como PWA (com manifest.json e service workers para Android).
- **Backend:** Backend/Serverless: Next.js Route Handlers (API Routes) ou Supabase para persistência de dados e autenticação.
- **Database & Cache:** PostgreSQL (persistent user profiles and subscription criteria) and Redis (fast in-memory caching for real-time deduplication of scraped listings).
- **Automation / Scraping:** Modular, abstract scraper architecture utilizing BeautifulSoup4 and async HTTP clients.
- **AI Engine:** Anthropic (Claude) or OpenAI API client for contextual motivation letter generation.
- **Notifications & UI:** Telegram Bot API (acting as the primary user interface for immediate delivery of alerts with interactive inline buttons).
- **Infrastructure (IaC):** Terraform configuration using the Hetzner Cloud (`hcloud`) provider. Automated host setup using a custom `cloud-init.yaml` (Docker, Docker-Compose-Plugin, and basic security/UFW configuration).
- **CI/CD & GitOps:** GitHub Actions workflow triggering `terraform plan` on Pull Requests and `terraform apply` on merges to the `main` branch, utilizing Terraform Cloud as a remote backend.
## 3. Project Goals (Short & Medium Term)
1. **Infrastructure Automation:** Provision a secure, production-ready VPS on Hetzner Cloud within a $5-$6/month budget, fully managed via GitHub Actions and Terraform.
2. **Robust Real-Time Scraping:** Build highly resilient, non-blocking scrapers that query target websites every 5 minutes, ensuring 0% duplicate alerts using Redis.
3. **Instant Telegram Delivery:** Deliver notifications within less than 60 seconds of a property being listed online, complete with an "Apply Now" link and a "Generate AI Motivation Letter" action button.
4. **AI-Powered Personalization:** Develop an advanced LLM prompt template that outputs grammatically flawless, persuasive Dutch motivation letters tailored to the specific landlord's post.
5. **Monetization Readiness:** Prepare the backend database and API to integrate with payment gateways (Mollie/Stripe) supporting iDEAL (the primary Dutch payment method).
## 4. Custom Instructions for Claude (AI Behavior in this Project)
- **Code Quality:** Always write production-ready, clean, PEP8-compliant, and strictly typed Python code.
- **Asynchronous First:** For backend tasks, always prefer `async/await` patterns over synchronous ones (e.g., `httpx` instead of `requests`, `asyncpg` for SQLAlchemy).
- **DevOps Mindset:** Ensure all code changes are stateless, modular, easy to containerize, and follow standard secure secret-management practices (using Pydantic BaseSettings and `.env` files).
- **Dutch Context:** Keep in mind the specific legal, geographical, and cultural aspects of the Dutch housing market (e.g., municipalities, postal codes, and tenancy laws).