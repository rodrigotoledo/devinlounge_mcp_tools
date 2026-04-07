# Hardhat

A comprehensive platform for connecting clients with workers through job postings and services.

## Overview

Hardhat consists of:
- **Backend API**: FastAPI-based REST API for user management, authentication, and job postings
- **Mobile App**: React Native/Expo app for mobile access to the platform

## Backend API

Backend em FastAPI para autenticacao, gestao de usuarios, publicacao de vagas e upload de fotos de perfil.

### Visao geral

Esta API fornece:

- cadastro de usuarios com papeis `client`, `worker` e `admin`
- autenticacao via JWT
- leitura e atualizacao do perfil autenticado
- upload de foto de perfil em `JPG`, `PNG` ou `WEBP`
- criacao e listagem de vagas
- atualizacao de vagas
- documentacao automatica em `/docs` e `/redoc`

### Stack usada

- Python 3.12
- FastAPI
- Uvicorn
- SQLAlchemy 2
- Pydantic 2
- python-jose para JWT
- passlib + bcrypt para hash de senha
- PostgreSQL (obrigatorio); `DATABASE_URL` no `.env`

### Estrutura principal

```text
./
|-- docker-compose.yml   # Postgres + Redis + API + Rails fullstack (na raiz)
|-- hardhat-backend/
|   |-- app/
|   |-- Dockerfile
|   |-- requirements.txt
|   `-- .env
`-- hardhat-expo/
```

### Pre-requisitos

**Opcao A — sem Docker**

- Python 3.12 ou superior
- `pip`
- ambiente virtual Python
- **PostgreSQL** acessivel (local ou remoto) e `DATABASE_URL` no `.env`

**Opcao B — com Docker**

- Docker Engine 24 ou superior
- Docker Compose v2 (`docker compose`)

### Docker e Docker Compose

O **`docker-compose.yml` fica na raiz do repositório** e sobe **PostgreSQL** (`db`), **Redis** (`redis`) e a **API** (`api`, build a partir de `hardhat-backend/`). Variáveis da API vêm de **`hardhat-backend/.env`**. O modo **development** vs **production** vem de **`ENV`** nesse arquivo.

### Arquivos

| Arquivo | Uso |
|--------|-----|
| `docker-compose.yml` (raiz) | Orquestra `db`, `redis`, `api` e **`fullstack`** (Rails dev). |
| `hardhat-backend/Dockerfile` | Imagem da API (Python 3.12-slim, `requirements.txt`). |
| `hardhat-fullstack/Dockerfile` | Rails: estágio `development` no Compose; imagem final = produção (Thruster). |
| `hardhat-backend/.env` | `DATABASE_URL`, `REDIS_URL`, `SECRET_KEY`, `ENV`, etc. |

### Preparar `.env`

Na **raiz do repositório** e em cada projeto:

```bash
cp .env.example .env
cd hardhat-backend && cp .env.example .env
cd ../hardhat-fullstack && cp .env.example .env
cd ..
```

Ou, na raiz, uma vez: **`./scripts/sync-env-from-example.sh`** — cria ou completa `.env`, `hardhat-backend/.env` e `hardhat-fullstack/.env` a partir dos `*.env.example`.

### Inicio rapido (Postgres + API)

1. Copie o `.env` e confira `DATABASE_URL` (padrao aponta para o servico `db` do Compose):

```bash
cd hardhat-backend
cp .env.example .env
# Ajuste SECRET_KEY e demais variaveis
```

2. Suba os servicos (**na raiz do repo**):

```bash
docker compose up --build
```

3. O schema Postgres e aplicado pelo **Rails** (`fullstack` roda `db:prepare` na subida; se precisar manualmente):

```bash
docker compose exec fullstack bin/rails db:migrate
```

4. Acesse a API:
   - API: http://localhost:8000
   - Docs: http://localhost:8000/docs
   - Redoc: http://localhost:8000/redoc

5. **Rails (fullstack)** sobe junto em http://localhost:3000 (`FULLSTACK_PORT` para mudar a porta). Primeiro `up` pode demorar (`bundle install` / `db:prepare`). Com Compose, credenciais Postgres do Rails vêm de **`FULLSTACK_DATABASE_*`** (mesmo cluster que a API; ver `.env.example`).

## Mobile App

App mobile Expo com NativeWind inspirado no layout de autenticacao do projeto web Hardhat.

### Rotas expo-router
- `app/(public)/offers.tsx` - tab Trabalhos
- `app/(public)/signup.tsx` - tab Criar Conta
- `app/(public)/signin.tsx` - tab Minha Conta; mostra login anonimo e conta do usuario autenticado
- `app/(public)/info.tsx` - tab Informacoes
- `app/(public)/forgot-password.tsx` - rota de recuperacao de senha (fora da tab)

### Auth hook
- `hooks/useAuth.tsx` - provider simples usando `expo-secure-store`

### Layouts
- `app/(public)/_layout.tsx` - layout público para telas de auth
- `app/_layout.tsx` - root layout com `AuthProvider`

### Rodar localmente

```bash
cd hardhat-expo
npm install
```

### Comandos disponíveis

#### Sincronização de ambiente

```bash
npm run env:sync
```
Sincroniza a URL da API local lendo o IP da máquina e atualizando o `.env`. Rode isso antes de iniciar se a API local mudou de endereço.

#### Iniciar o app

```bash
npm start                  # inicia o Expo normalmente
npm run start:sync         # sincroniza env e inicia
npm run start:clean        # inicia limpando o cache do Metro
npm run start:clean:sync   # sincroniza env, limpa cache e inicia
npm run start:tunnel       # inicia via túnel (útil em redes restritas)
npm run start:sync:tunnel  # sincroniza env e inicia via túnel (teste no celular físico)
```

> Use `start:sync` ou `start:clean:sync` sempre que trocar de rede ou mudar o IP da máquina de desenvolvimento.

#### Rodar em plataforma específica

```bash
npm run android   # build e run no emulador/device Android
npm run ios       # build e run no simulador/device iOS
npm run web       # inicia no navegador via Expo Web
```

#### Tipagem

```bash
npm run typecheck   # roda o TypeScript sem emitir arquivos (tsc --noEmit)
```

### Stack

- Expo
- React Native
- TypeScript
- NativeWind
- Tailwind CSS

### Direcao visual

- fundo `stone-50`
- cards brancos com sombra suave
- acento principal em `orange-600` e `orange-700`
- logomarca com icone de predio inspirado no layout Rails
