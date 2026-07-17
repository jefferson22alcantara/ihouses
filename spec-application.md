# Specification:
Atue como um Engenheiro de Software Full-Stack Sénior e Arquiteto de Soluções. Quero criar um MVP funcional do projeto "Ihouses", um SaaS event-driven para o mercado de arrendamento neerlandês que resolve a crise habitacional ("woningnood") para expats, estudantes e locais.

A arquitetura será híbrida para máxima eficiência, dividida em dois repositórios/serviços:
1. FRONTEND & USER MANAGEMENT: Next.js (App Router, Tailwind CSS, TypeScript), configurado como Progressive Web App (PWA) para instalação nativa em dispositivos Android.
2. BACKEND DE AUTOMAÇÃO: Python (FastAPI, Playwright/BeautifulSoup), focado em scraping em segundo plano, integração com LLMs (OpenAI/Anthropic) e envio de webhooks/alertas.
3. BASE DE DADOS: PostgreSQL (Supabase) centralizado, ligando ambos os ecossistemas.

Aqui estão as especificações das funcionalidades core:
- Scrapping/Ingestão em Tempo Real: Python monitoriza plataformas como Funda, Pararius e Kamernet.
- Alertas Instantâneos: O script Python dispara notificações imediatas para a Telegram Bot API assim que há um match.
- Automação com LLM: Chamada à API da OpenAI/Anthropic em Python para gerar uma carta de motivação personalizada em neerlandês perfeito, cruzando os dados do perfil do utilizador (salário, profissão, pets, estilo de vida) com os detalhes do imóvel raspado.

Por favor, forneça-me o seguinte escopo de código limpo, modular e tipado:

PARTE 1: FRONTEND (Next.js PWA)
1. A estrutura de ficheiros recomendada para o ecossistema Next.js.
2. A configuração completa da PWA para Android: ficheiro `manifest.json`, metatags necessárias e o registo do Service Worker.
3. O código do Dashboard do Utilizador (Mobile-First): interface limpa para configurar o perfil do inquilino (rendimento, profissão, pets, etc.) e os filtros de habitação (cidade, orçamento máximo, raio de distância).
4. O código da página de Histórico de Alertas: lista de imóveis encontrados com link direto e um botão "Copiar Carta de Motivação por IA".

PARTE 2: BACKEND DE AUTOMAÇÃO (Python)
5. A estrutura do projeto Python e o ficheiro `requirements.txt`.
6. Um script Python estruturado (usando FastAPI para endpoints e asyncio para background tasks) que:
   - Simule ou estruture a lógica de scraping num loop (ex: coletando título, preço, descrição e link de um imóvel no Funda).
   - Faça uma query à base de dados para encontrar utilizadores cujos filtros dão "match" com o imóvel.
   - Contenha a função de integração com o LLM (OpenAI/Anthropic) que recebe o perfil do utilizador + dados do imóvel e devolve a carta de motivação em neerlandês (inclua o system prompt ideal dentro do código).
   - Contenha a função que envia a mensagem formatada com o link do imóvel e a carta gerada diretamente para o ID de Telegram do utilizador.

PARTE 3: BASE DE DADOS
7. O esquema SQL (DDL) para as tabelas essenciais no PostgreSQL: `users`, `user_profiles`, `search_filters` e `alerts_history`.

Gere o código de forma pronta para produção, focando na integração fluida entre o Next.js e o Python através do banco de dados comum.