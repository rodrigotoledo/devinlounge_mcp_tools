# Foreman + Procfile para Rails Fullstack

Sempre inicie projetos Rails fullstack usando o Foreman:

```
bundle exec foreman start
```

Ou, se preferir, use o binstub:

```
bin/dev
```


> **Regra:** Nunca suba Rails fullstack só com `rails server`. Sempre use Foreman para garantir que web e worker rodem juntos.

# Foreman e Procfile no Rails Fullstack

Este projeto Rails fullstack utiliza Foreman para orquestrar múltiplos processos em desenvolvimento e produção.

## Procfile.dev (desenvolvimento)

```
web: bin/rails server -b 0.0.0.0
css: bin/rails tailwindcss:watch
worker: bundle exec sidekiq
```

- `web`: inicia o servidor Rails acessível em todas as interfaces
- `css`: recompila CSS com Tailwind em hot reload
- `worker`: inicia o Sidekiq para jobs em background

Inicie tudo com:

```
bundle exec foreman start -f Procfile.dev
# ou
bin/dev
```

## Procfile (produção)

```
web: bundle exec puma -C config/puma.rb
css: bin/rails tailwindcss:build
worker: bundle exec sidekiq
```

- `web`: inicia o servidor Puma
- `css`: build final do Tailwind CSS
- `worker`: Sidekiq

## Recomendações
- Sempre use Foreman/bin/dev para desenvolvimento local.
- O docker-compose já está configurado para rodar `./bin/dev`.
- Não defina a porta no Procfile.dev, deixe o Rails usar a porta do ambiente.
- O serviço CSS (Tailwind) é obrigatório para hot reload em apps modernos.

---

Consulte a documentação do monorepo para mais detalhes sobre padrões de orquestração.
