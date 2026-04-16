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

Write-Host "[1/3] Creating vault-auth Kubernetes secret..." -ForegroundColor Cyan

kubectl delete secret vault-auth --namespace default 2>$null
kubectl create secret generic vault-auth `
  --from-literal=VAULT_TOKEN="${vaultToken}" `
  --namespace default

Write-Host "[2/3] Applying Helm chart (with PostgreSQL and Vault)..." -ForegroundColor Cyan
if (Test-Path ".\helm\charts\postgresql-16.3.3.tgz") {
    Remove-Item -Force ".\helm\charts\postgresql-16.3.3.tgz"
}
helm dependency update ./helm
helm upgrade --install quiz-server ./helm --timeout 300s

Write-Host "[3/3] Populating Vault..." -ForegroundColor Cyan

$envPairs = @{}
foreach ($line in $envContent) {
    if ($line -match "^([^=]+)=(.*)$") {
        $envPairs[$matches[1]] = $matches[2]
    }
}

$dbUrl = "jdbc:postgresql://quiz-server-postgresql:5432/" + $envPairs["POSTGRES_DB"] + "?currentSchema=public"

Write-Host "      Waiting for Vault pod to be ready..."
kubectl wait --for=condition=ready pod -l app=quiz-server-vault --timeout=120s | Out-Null

$vaultPod = kubectl get pod -l app=quiz-server-vault -o jsonpath="{.items[0].metadata.name}"
Write-Host "      Injecting secrets into $vaultPod"

kubectl exec $vaultPod -- env VAULT_TOKEN=$vaultToken VAULT_ADDR=http://127.0.0.1:8200 vault kv put secret/dev `
    SPRING_APPLICATION_NAME=quiz-server `
    SPRING_DATASOURCE_URL=$dbUrl `
    SPRING_DATASOURCE_USERNAME=$($envPairs["POSTGRES_USER"]) `
    SPRING_DATASOURCE_PASSWORD=$($envPairs["POSTGRES_PASSWORD"]) `
    JWT_SECRET=$($envPairs["JWT_SECRET"]) `
    EXPIRATIONMS=$($envPairs["EXPIRATIONMS"]) `
    CLOUDINARY_CLOUD_NAME=$($envPairs["CLOUDINARY_CLOUD_NAME"]) `
    CLOUDINARY_API_KEY=$($envPairs["CLOUDINARY_API_KEY"]) `
    CLOUDINARY_API_SECRET=$($envPairs["CLOUDINARY_API_SECRET"]) `
    ALLOWED_ORIGINS="http://localhost:3000,http://quiz.localhost" | Out-Null

Write-Host ""
Write-Host "Done! App: http://quiz.localhost" -ForegroundColor Green
Write-Host "      Vault runs internally in k3s. (token: ${vaultToken})" -ForegroundColor Green
