#!/usr/bin/env bash
set -euo pipefail

VAULT_IMAGE="hashicorp/vault:1.21.4"
VAULT_PORT=8200

# ── Load token from .env ──────────────────────────────────────────────────────
if [ ! -f .env ]; then
  echo "[ERROR] .env file not found. Create one with VAULT_TOKEN=your-token"
  exit 1
fi
source .env

if [ -z "${VAULT_TOKEN:-}" ]; then
  echo "[ERROR] VAULT_TOKEN is not set in .env"
  exit 1
fi

# ── Start Vault ───────────────────────────────────────────────────────────────
echo "[1/3] Starting Vault..."
docker run -d \
  --name vault-dev \
  --cap-add=IPC_LOCK \
  --restart unless-stopped \
  -p "${VAULT_PORT}:8200" \
  -e "VAULT_DEV_ROOT_TOKEN_ID=${VAULT_TOKEN}" \
  -e "VAULT_DEV_LISTEN_ADDRESS=0.0.0.0:8200" \
  "$VAULT_IMAGE"

echo "      Waiting for Vault..."
sleep 3

# ── Create vault-auth secret in k3s ──────────────────────────────────────────
echo "[2/3] Creating vault-auth secret..."
kubectl create secret generic vault-auth \
  --from-literal=VAULT_TOKEN="${VAULT_TOKEN}" \
  --namespace default \
  2>/dev/null || kubectl patch secret vault-auth \
  -p "{\"stringData\":{\"VAULT_TOKEN\":\"${VAULT_TOKEN}\"}}"

# ── Apply Helm chart ──────────────────────────────────────────────────────────
echo "[3/3] Applying Helm chart..."
helm upgrade --install quiz-server ./helm --wait --timeout 120s

echo ""
echo "Done! App: http://quiz.localhost"
echo "      Vault: http://localhost:${VAULT_PORT} (token: ${VAULT_TOKEN})"
