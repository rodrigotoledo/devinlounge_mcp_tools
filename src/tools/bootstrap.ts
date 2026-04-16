type ToolResponse = { content: Array<{ type: 'text'; text: string }> };

type BootstrapArgs = {
  framework: 'rails' | 'nextjs' | 'nestjs' | 'fastapi' | 'react' | 'expo' | 'phoenix';
  projectName?: string;
  authentication?: 'bcrypt' | 'oauth';
  authorization?: 'cancancan' | 'pundit';
  styling?: 'tailwindcss-rails' | 'simplecss';
  backgroundJobs?: 'solid_queue' | 'sidekiq' | 'none';
  pagination?: 'pagy' | 'kaminari' | 'none';
  appShape?: 'html-first' | 'api-heavy';
  search?: 'ransack' | 'pg_search' | 'none';
  uploads?: 'active-storage' | 'active-storage-image-processing' | 'shrine' | 'none';
  admin?: 'activeadmin' | 'avo' | 'none';
  auditing?: 'paper_trail' | 'audited' | 'none';
  multiTenancy?: 'acts_as_tenant' | 'none';
};

function railsBootstrap(args: BootstrapArgs): string {
  const projectName = args.projectName ?? 'my_app';
  const authentication = args.authentication ?? 'bcrypt';
  const authorization = args.authorization ?? 'cancancan';
  const styling = args.styling ?? 'tailwindcss-rails';
  const backgroundJobs = args.backgroundJobs ?? 'solid_queue';
  const pagination = args.pagination ?? 'pagy';
  const appShape = args.appShape ?? 'html-first';
  const search = args.search ?? 'none';
  const uploads = args.uploads ?? 'active-storage';
  const admin = args.admin ?? 'none';
  const auditing = args.auditing ?? 'none';
  const multiTenancy = args.multiTenancy ?? 'none';

  const stylingStep =
    styling === 'tailwindcss-rails'
      ? 'docker compose exec fullstack bundle add tailwindcss-rails'
      : '# simplecss: include the stylesheet link in the application layout (no gem required)';

  const authorizationStep =
    authorization === 'cancancan'
      ? 'docker compose exec fullstack bundle add cancancan'
      : 'docker compose exec fullstack bundle add pundit';

  const backgroundJobsStep =
    backgroundJobs === 'sidekiq'
      ? 'docker compose exec fullstack bundle add sidekiq'
      : backgroundJobs === 'solid_queue'
        ? '# solid_queue is part of Rails 8 defaults when selected in app setup'
        : '# background jobs: none selected for now';

  const paginationStep =
    pagination === 'pagy'
      ? 'docker compose exec fullstack bundle add pagy'
      : pagination === 'kaminari'
        ? 'docker compose exec fullstack bundle add kaminari'
        : '# pagination: none selected for now';

  const searchStep =
    search === 'ransack'
      ? 'docker compose exec fullstack bundle add ransack'
      : search === 'pg_search'
        ? 'docker compose exec fullstack bundle add pg_search'
        : '# search: none selected for now';

  const uploadsStep =
    uploads === 'active-storage-image-processing'
      ? 'docker compose exec fullstack bundle add image_processing'
      : uploads === 'shrine'
        ? 'docker compose exec fullstack bundle add shrine'
        : uploads === 'active-storage'
          ? '# uploads: Active Storage only (no extra gem required)'
          : '# uploads: none selected for now';

  const adminStep =
    admin === 'activeadmin'
      ? 'docker compose exec fullstack bundle add activeadmin'
      : admin === 'avo'
        ? 'docker compose exec fullstack bundle add avo'
        : '# admin/backoffice: none selected for now';

  const auditingStep =
    auditing === 'paper_trail'
      ? 'docker compose exec fullstack bundle add paper_trail'
      : auditing === 'audited'
        ? 'docker compose exec fullstack bundle add audited'
        : '# auditing/versioning: none selected for now';

  const multiTenancyStep =
    multiTenancy === 'acts_as_tenant'
      ? 'docker compose exec fullstack bundle add acts_as_tenant'
      : '# multi-tenancy: none selected for now';

  return [
    '# Rails bootstrap',
    '',
    'Ask these decisions before creating the project:',
    `- auth: ${authentication} (bcrypt or OAuth strategy)` ,
    `- authorization: ${authorization}`,
    `- styling: ${styling}`,
    `- background jobs: ${backgroundJobs}`,
    `- pagination: ${pagination}`,
    `- app shape: ${appShape}`,
    `- search: ${search}`,
    `- uploads: ${uploads}`,
    `- admin/backoffice: ${admin}`,
    `- auditing/versioning: ${auditing}`,
    `- multi-tenancy: ${multiTenancy}`,
    '',
    '```bash',
    `docker compose exec fullstack bin/rails new ${projectName} --skip-test`,
    `cd ${projectName}`,
    'docker compose exec fullstack bundle install',
    'docker compose exec fullstack bundle add rspec-rails --group "development,test"',
    'docker compose exec fullstack bundle add shoulda-matchers --group "test"',
    'docker compose exec fullstack bundle add simplecov --group "test"',
    'docker compose exec fullstack bundle add guard-rspec --group "development,test"',
    'docker compose exec fullstack bin/rails generate rspec:install',
    'docker compose exec fullstack bundle exec guard init rspec',
    'docker compose exec fullstack rm -rf test/',
    `# auth: ${authentication}`,
    'docker compose exec fullstack bundle add bcrypt',
    authorizationStep,
    `# styling: ${styling}`,
    stylingStep,
    `# background jobs: ${backgroundJobs}`,
    backgroundJobsStep,
    `# pagination: ${pagination}`,
    paginationStep,
    `# app shape: ${appShape}`,
    appShape === 'api-heavy' ? '# API-heavy: add jbuilder or blueprinter as needed' : '# HTML-first: keep serializers optional until needed',
    `# search: ${search}`,
    searchStep,
    `# uploads: ${uploads}`,
    uploadsStep,
    `# admin/backoffice: ${admin}`,
    adminStep,
    `# auditing/versioning: ${auditing}`,
    auditingStep,
    `# multi-tenancy: ${multiTenancy}`,
    multiTenancyStep,
    '# starter output (always create a default response)',
    appShape === 'api-heavy'
      ? "# API mode example: in config/routes.rb add: get '/health', to: proc { [200, { 'Content-Type' => 'application/json' }, ['{\"status\":\"ok\",\"service\":\"rails\"}']] }"
      : "# HTML mode example: rails g controller Home index && set root 'home#index'",
    '# inter-service networking: from containers use service DNS, e.g. http://api:8000, never localhost',
    '```',
    '',
    'Rules: RSpec only, request specs preferred, path helpers in specs, do not use devise in template defaults, ask gem decisions first.',
  ].join('\n');
}

function nextjsBootstrap(args: BootstrapArgs): string {
  const projectName = args.projectName ?? 'web-nextjs';
  return [
    '# Next.js bootstrap',
    '',
    '```bash',
    `npx create-next-app@latest ${projectName} --ts --app --eslint --tailwind`,
    `cd ${projectName}`,
    'npm install @tanstack/react-query react-hook-form zod',
    '# starter output (always create a default response)',
    "mkdir -p app/api/health && printf 'export async function GET() {\n  return Response.json({ status: \"ok\", service: \"nextjs\" });\n}\n' > app/api/health/route.ts",
    '# optional HTML starter page',
    "printf 'export default function Home() {\n  return <main>Next.js ready</main>;\n}\n' > app/page.tsx",
    '# inter-service networking: server-side calls from this container must use compose DNS (e.g. http://nestjs:3001), not localhost',
    '```',
    '',
    'Rules: App Router, TypeScript strict, TanStack Query for client-side server-state, React Hook Form + Zod for forms, no Redux unless explicitly requested.',
  ].join('\n');
}

function nestjsBootstrap(args: BootstrapArgs): string {
  const projectName = args.projectName ?? 'backend-nestjs';
  return [
    '# NestJS bootstrap',
    '',
    '```bash',
    `docker compose exec nestjs npx @nestjs/cli new ${projectName} --package-manager npm`,
    `cd ${projectName}`,
    'docker compose exec nestjs npm install class-validator class-transformer @nestjs/swagger swagger-ui-express',
    '# starter output (always create a default response)',
    "# in src/app.controller.ts return: { status: 'ok', service: 'nestjs' } from GET /",
    '# inter-service networking: use compose DNS for upstream URLs (e.g. http://api:8000), not localhost',
    '```',
    '',
    'Rules: modular architecture, DTO validation, Swagger enabled, Jest unit tests plus e2e for critical endpoints.',
  ].join('\n');
}

function fastapiBootstrap(args: BootstrapArgs): string {
  const projectName = args.projectName ?? 'backend-fastapi';
  return [
    '# FastAPI bootstrap',
    '',
    '```bash',
    `mkdir -p ${projectName}`,
    `cd ${projectName}`,
    '# add fastapi, uvicorn, pydantic-settings, sqlalchemy, alembic, pytest, ruff, mypy to requirements',
    '# starter output (always create a default response)',
    "# in app/main.py add: @app.get('/health') -> {'status': 'ok', 'service': 'fastapi'}",
    '# inter-service networking: use compose DNS (e.g. http://db:5432, http://redis:6379 from containers), not localhost',
    '```',
    '',
    'Rules: Pydantic v2 at boundaries, pydantic-settings for config, SQLAlchemy 2 async, lifespan hooks, pytest for request/integration tests.',
  ].join('\n');
}

function reactBootstrap(args: BootstrapArgs): string {
  const projectName = args.projectName ?? 'web-react';
  return [
    '# React SPA bootstrap',
    '',
    '```bash',
    `docker compose exec react npm create vite@latest ${projectName} -- --template react-ts`,
    `cd ${projectName}`,
    'docker compose exec react npm install @tanstack/react-query react-hook-form zod',
    '# starter output (always create a default response)',
    "printf 'export default function App() {\n  return <main>React ready</main>;\n}\n' > src/App.tsx",
    "# add health endpoint in dev proxy target service, e.g. GET /health from backend",
    '# inter-service networking: browser uses localhost:publishedPort, but container-to-container URLs use compose DNS service names',
    '```',
    '',
    'Rules: Vite + TypeScript strict, TanStack Query for server-state, React Hook Form + Zod for forms, no Redux unless explicitly requested.',
  ].join('\n');
}

function expoBootstrap(args: BootstrapArgs): string {
  const projectName = args.projectName ?? 'expo-mobile';
  return [
    '# Expo bootstrap',
    '',
    '```bash',
    `npx create-expo-app@latest ${projectName}`,
    `cd ${projectName}`,
    'npm install expo-router nativewind @tanstack/react-query expo-secure-store',
    '# starter output (always create a default response)',
    "# in app/index.tsx render a basic screen: 'Expo ready'",
    "# for API base URL, use host-reachable address (simulator/emulator specific), not Docker service DNS directly",
    '```',
    '',
    'Rules: Expo Router + TypeScript strict, NativeWind via className, TanStack Query for server-state, expo-secure-store for secrets, no Redux unless explicitly requested.',
  ].join('\n');
}

function phoenixBootstrap(args: BootstrapArgs): string {
  const projectName = args.projectName ?? 'backend-phoenix';
  return [
    '# Phoenix bootstrap',
    '',
    '```bash',
    `docker compose exec phoenix mix phx.new ${projectName}`,
    `cd ${projectName}`,
    'docker compose exec phoenix mix deps.get',
    '# starter output (always create a default response)',
    "# in router add: get \"/health\", HealthController, :index",
    "# in HealthController index/2 return json(conn, %{status: \"ok\", service: \"phoenix\"})",
    '# inter-service networking: use compose DNS for upstream services from containerized runtime',
    '```',
    '',
    'Rules: context modules for business logic, Ecto for persistence, Credo for linting, ExUnit for tests.',
  ].join('\n');
}

export async function getProjectBootstrap(args: BootstrapArgs): Promise<ToolResponse> {
  const contentByFramework: Record<BootstrapArgs['framework'], string> = {
    rails: railsBootstrap(args),
    nextjs: nextjsBootstrap(args),
    nestjs: nestjsBootstrap(args),
    fastapi: fastapiBootstrap(args),
    react: reactBootstrap(args),
    expo: expoBootstrap(args),
    phoenix: phoenixBootstrap(args),
  };

  return {
    content: [
      {
        type: 'text',
        text: contentByFramework[args.framework],
      },
    ],
  };
}
