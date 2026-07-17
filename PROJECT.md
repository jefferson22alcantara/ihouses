Hi Claude, let's officially start building VinderHop! 

Since you already have our project instructions, goals, and technical stack in your context, let's begin with a comprehensive **Phase 1: Project Scaffolding, Core Backend Setup, and Infrastructure as Code (IaC) with CI/CD**.

Please generate the complete boilerplate for our repository so I can set up both the local development environment and the GitOps deployment pipeline immediately.

### What I need in this response:

1. **Folder Structure Map:** A visual directory tree of the entire project, including the `.github/workflows/`, `app/`, `terraform/`, and `docs/` directories.
2. **Dependency Management:** A production-ready `pyproject.toml` (using Poetry) or `requirements.txt` containing our core async dependencies (`fastapi`, `uvicorn`, `httpx`, `sqlalchemy[asyncio]`, `asyncpg`, `redis`, `pydantic-settings`, `beautifulsoup4`).
3. **Core Backend Files:**
   - **`app/config.py`:** Pydantic `BaseSettings` reading from `.env` to validate env variables (Database, Redis, Telegram, and LLM APIs).
   - **`app/main.py`:** FastAPI entry point with async lifespan events for DB connection pool and Redis client initialization, plus a `/health` endpoint.
   - **`Dockerfile`:** Secure, multi-stage Dockerfile running as a non-root user.
   - **`docker-compose.yml`:** Setup for running `web` (FastAPI), `db` (Postgres), and `redis` containers locally.
4. **Infrastructure Files (`terraform/`):**
   - **`providers.tf` & `backend.tf`:** Hetzner Cloud provider setup and Terraform Cloud remote backend configuration.
   - **`variables.tf` & `main.tf`:** Provisioning a single `cx22` Ubuntu VPS in Germany, associated with an SSH key, and a firewall rule opening only ports 22, 80, and 443.
   - **`cloud-init.yaml`:** Script to update the OS, install Docker/Docker-compose, configure a basic UFW firewall, and create the `/opt/vinderhop` directory on boot.
5. **GitOps Pipeline (`.github/workflows/terraform.yml`):**
   - A GitHub Actions workflow that runs `terraform plan` on Pull Requests to `main`, and `terraform apply` on pushes/merges to `main`, securely using `HCLOUD_TOKEN` and `TF_API_TOKEN` from GitHub Secrets.

Please output the code files cleanly, following our async-first and strictly-typed directives. Let's get this infrastructure and environment ready for deployment!