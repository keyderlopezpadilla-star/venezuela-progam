# Convierte prisma/schema.prisma a SQLite para modo demo local.
# Llamado desde launch.bat en Windows.

$ErrorActionPreference = "Stop"

$schemaPath = "prisma/schema.prisma"
$schema = Get-Content $schemaPath -Raw

# Reemplaza datasource a SQLite
$schema = $schema -replace '(?s)datasource db \{[^}]*\}', @'
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
'@

# Reemplaza tipos incompatibles con SQLite
$schema = $schema -replace 'Decimal\s*\(\s*\d+\s*,\s*\d+\s*\)\s*', ''
$schema = $schema -replace 'Json\?', 'String?'
$schema = $schema -replace 'String\[\]', 'String'
$schema = $schema -replace 'enum\s+\w+\s+\{[^}]+\}', ''  # Quita enums (SQLite no los soporta)
$schema = $schema -replace '@db\.\w+', ''

# Quita referencias a enums en defaults y types
$schema = $schema -replace 'UserRole\.\w+', '"DONOR"'
$schema = $schema -replace 'UserStatus\.\w+', '"PENDING"'
$schema = $schema -replace 'DonationType\.\w+', '"ONE_TIME"'
$schema = $schema -replace 'DonationStatus\.\w+', '"PENDING"'
$schema = $schema -replace 'CampaignStatus\.\w+', '"ACTIVE"'
$schema = $schema -replace 'CampaignPriority\.\w+', '"MEDIUM"'
$schema = $schema -replace 'VolunteerStatus\.\w+', '"REGISTERED"'
$schema = $schema -replace 'DeliveryStatus\.\w+', '"PLANNED"'
$schema = $schema -replace 'HelpRequestStatus\.\w+', '"SUBMITTED"'
$schema = $schema -replace 'HelpUrgency\.\w+', '"MEDIUM"'

# Quita enums restantes que Prisma no entiende como tipos
$schema = $schema -replace '\s+(UserRole|UserStatus|DonationType|DonationStatus|CampaignStatus|CampaignPriority|VolunteerStatus|DeliveryStatus|HelpRequestStatus|HelpUrgency)\s+', ' String '

# Agregar provider sqlite al generador si no está
if ($schema -notmatch 'provider\s*=\s*"prisma-client-js"') {
  $schema = $schema -replace '(generator client \{)', "`$1`n  provider = `"prisma-client-js`""
}

Set-Content -Path $schemaPath -Value $schema -Encoding UTF8

# Sobrescribe DATABASE_URL en .env.local
$envPath = ".env.local"
$envContent = Get-Content $envPath -Raw
$envContent = $envContent -replace '(?m)^DATABASE_URL=.*', 'DATABASE_URL="file:./dev.db"'
Set-Content -Path $envPath -Value $envContent -Encoding UTF8

Write-Host "[OK] Schema convertido a SQLite y .env.local actualizado."