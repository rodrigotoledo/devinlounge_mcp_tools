# syntax=docker/dockerfile:1
FROM ruby:3.3

# Instala dependências do sistema e bash
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs bash

# Instala bundler
RUN gem install bundler

WORKDIR /app

# Copia Gemfile e Gemfile.lock se existirem
COPY Gemfile Gemfile.lock ./

# Instala gems
RUN bundle install || true

# Copia o restante do app
COPY . .

# Comando padrão
CMD ["bash"]
