#!/usr/bin/env bash
# Mescla chaves de cada *.env.example no *.env correspondente (só acrescenta chaves que faltam).
# Uso (na raiz do repo):
#   ./scripts/sync-env-from-example.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

merge_missing() {
  local target="$1"
  local example="$2"
  if [[ ! -f "$example" ]]; then
    echo "skip (no example): $example"
    return 0
  fi
  if [[ ! -f "$target" ]]; then
    cp "$example" "$target"
    echo "created $target from $(basename "$example")"
    return 0
  fi
  local key line
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ -z "${line// }" ]] && continue
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ "$line" =~ ^[A-Za-z_][A-Za-z0-9_]*= ]] || continue
    key="${line%%=*}"
    if ! grep -q "^${key}=" "$target"; then
      printf '\n%s\n' "$line" >> "$target"
      echo "  + $key → $target"
    fi
  done < "$example"
}

echo "Root compose .env"
merge_missing "$ROOT/.env" "$ROOT/.env.example"

echo "hardhat-backend/.env"
merge_missing "$ROOT/hardhat-backend/.env" "$ROOT/hardhat-backend/.env.example"

echo "hardhat-fullstack/.env"
merge_missing "$ROOT/hardhat-fullstack/.env" "$ROOT/hardhat-fullstack/.env.example"

echo "Done."
