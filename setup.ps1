$ErrorActionPreference = "Stop"

$VAULT_IMAGE = "hashicorp/vault:1.21.4"
$VAULT_PORT = 8200

if (-Not (Test-Path ".env")) {
    Write-Host "[ERROR] .env file not found. Create one with VAULT_TOKEN=your-token" -ForegroundColor Red
    exit 1
}

$envContent = Get-Content ".env"
$vaultToken = $null

foreach ($line in $envContent) {
    if ($line -match "^VAULT_TOKEN=(.*)$") {
        $vaultToken = $matches[1]
    }
}

if ([string]::IsNullOrWhiteSpace($vaultToken)) {
    Write-Host "[ERROR] VAULT_TOKEN is not set in .env" -ForegroundColor Red
    exit 1
}

Write-Host "[1/3] Starting Vault..." -ForegroundColor Cyan

$vaultExists = docker ps -a -q -f name=^vault-dev$
if ($vaultExists) {
    Write-Host "      Container 'vault-dev' already exists. Removing it..." -ForegroundColor Yellow
    docker rm -f vault-dev | Out-Null
}

docker run -d `
  --name vault-dev `
  --cap-add=IPC_LOCK `
  --restart unless-stopped `
  -p "${VAULT_PORT}:8200" `
  -e "VAULT_DEV_ROOT_TOKEN_ID=${vaultToken}" `
  -e "VAULT_DEV_LISTEN_ADDRESS=0.0.0.0:8200" `
  $VAULT_IMAGE | Out-Null

Write-Host "      Waiting for Vault..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "[2/3] Creating vault-auth secret..." -ForegroundColor Cyan

kubectl delete secret vault-auth --namespace default 2>$null
kubectl create secret generic vault-auth `
  --from-literal=VAULT_TOKEN="${vaultToken}" `
  --namespace default

Write-Host "[3/3] Applying Helm chart..." -ForegroundColor Cyan
helm upgrade --install quiz-server ./helm --wait --timeout 120s

Write-Host ""
Write-Host "Done! App: http://quiz.localhost" -ForegroundColor Green
Write-Host "      Vault: http://localhost:${VAULT_PORT} (token: ${vaultToken})" -ForegroundColor Green
