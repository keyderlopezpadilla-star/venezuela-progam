#!/usr/bin/env bash
# ==========================================================
# Venezuela Solidaria · Launcher universal (Windows/Linux/Mac)
# ==========================================================
# Detecta tu entorno, prepara la DB y arranca el dev server.
#
# Uso:
#   bash scripts/launch.sh
#
# Requisitos: Node.js 20+, npm, git, opcional Docker.
# ==========================================================

set -e

CYAN="\033[36m"; GREEN="\033[32m"; YELLOW="\033[33m"; RED="\033[31m"; RESET="\033[0m"
banner() {
  echo -e "${CYAN}"
  echo "  ╔══════════════════════════════════════════════════╗"
  echo "  ║      🇻🇪  VENEZUELA SOLIDARIA · LAUNCHER         ║"
  echo "  ╚══════════════════════════════════════════════════╝"
  echo -e "${RESET}"
}

banner

# 1. Verificar Node
if ! command -v node >/dev/null 2>&1; then
  echo -e "${RED}✗ Node.js no encontrado.${RESET}"
  echo "  Instálalo desde https://nodejs.org (>= 20)"
  exit 1
fi
echo -e "${GREEN}✓${RESET} Node $(node --version)"

# 2. Verificar npm
if ! command -v npm >/dev/null 2>&1; then
  echo -e "${RED}✗ npm no encontrado.${RESET}"
  exit 1
fi
echo -e "${GREEN}✓${RESET} npm $(npm --version)"

# 3. Instalar dependencias si hace falta
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}→ Instalando dependencias...${RESET}"
  npm install
else
  echo -e "${GREEN}✓${RESET} Dependencias instaladas"
fi

# 4. Configurar .env.local si no existe
if [ ! -f ".env.local" ]; then
  echo -e "${YELLOW}→ Creando .env.local desde .env.example...${RESET}"
  cp .env.example .env.local
fi

# 5. Detectar modo de DB
USE_SQLITE=0
if grep -q "^DATABASE_URL=\"postgresql" .env.local 2>/dev/null; then
  echo -e "${GREEN}✓${RESET} Postgres configurado en .env.local"
elif ! grep -q "^DATABASE_URL=" .env.local || grep -q "^DATABASE_URL=\"\"" .env.local; then
  echo -e "${YELLOW}→ No hay DATABASE_URL. Activando modo DEMO con SQLite.${RESET}"
  USE_SQLITE=1
fi

if [ "$USE_SQLITE" -eq 1 ]; then
  # Reconfigurar schema y .env a SQLite
  cp prisma/schema.prisma prisma/schema.prisma.bak
  cat > prisma/schema.prisma <<'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  image         String?
  passwordHash  String?
  role          String    @default("DONOR")
  status        String    @default("PENDING")
  phone         String?
  locale        String    @default("es")
  timezone      String    @default("America/Caracas")
  mfaEnabled    Boolean   @default(false)
  mfaSecret     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  donations     Donation[]
  volunteerProfile VolunteerProfile?
  helpRequests  HelpRequest[]
  favoriteCampaigns CampaignFavorite[]
  auditLogs     AuditLog[]
  taxReceipts   TaxReceipt[]
  certificates  Certificate[]
  savedMethods  PaymentMethod[]
  notifications Notification[]
  addresses     Address[]
}

model Account { id String @id @default(cuid()) userId String type String provider String providerAccountId String refresh_token String? access_token String? expires_at Int? token_type String? scope String? id_token String? session_state String? user User @relation(fields: [userId], references: [id], onDelete: Cascade) @@unique([provider, providerAccountId]) @@map("accounts") }
model Session { id String @id @default(cuid()) sessionToken String @unique userId String expires DateTime user User @relation(fields: [userId], references: [id], onDelete: Cascade) @@map("sessions") }
model VerificationToken { identifier String token String @unique expires DateTime @@unique([identifier, token]) @@map("verification_tokens") }

model Donation {
  id String @id @default(cuid()) trackingCode String @unique @default(cuid()) type String status String @default("PENDING") amount Float currency String @default("USD") message String? isAnonymous Boolean @default(false) donorName String? donorEmail String? donorPhone String? donorUserId String? stripePaymentIntent String? @unique stripeChargeId String? receiptUrl String? campaignId String? allocatedToDelivery String? taxReceiptId String? metadata String? ipAddress String? userAgent String? completedAt DateTime? createdAt DateTime @default(now()) updatedAt DateTime @updatedAt user User? @relation(fields: [donorUserId], references: [id], onDelete: SetNull) campaign Campaign? @relation(fields: [campaignId], references: [id], onDelete: SetNull) @@map("donations")
}
model TaxReceipt { id String @id @default(cuid()) userId String number String @unique year Int totalAmount Float currency String @default("USD") pdfUrl String? issuedAt DateTime @default(now()) user User @relation(fields: [userId], references: [id], onDelete: Cascade) donations Donation[] @@map("tax_receipts") }
model PaymentMethod { id String @id @default(cuid()) userId String brand String last4 String expMonth Int expYear Int isDefault Boolean @default(false) stripeId String @unique createdAt DateTime @default(now()) user User @relation(fields: [userId], references: [id], onDelete: Cascade) @@map("payment_methods") }

model Campaign {
  id String @id @default(cuid()) slug String @unique title String subtitle String? description String coverImage String? goal Float raised Float @default(0) donors Int @default(0) status String @default("ACTIVE") priority String @default("MEDIUM") region String startDate DateTime @default(now()) endDate DateTime? emergencyType String? beneficiaries Int @default(0) metadata String? createdAt DateTime @default(now()) updatedAt DateTime @updatedAt donations Donation[] favorites CampaignFavorite[] deliveries Delivery[] updates CampaignUpdate[] @@map("campaigns")
}
model CampaignFavorite { id String @id @default(cuid()) userId String campaignId String createdAt DateTime @default(now()) user User @relation(fields: [userId], references: [id], onDelete: Cascade) campaign Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade) @@unique([userId, campaignId]) @@map("campaign_favorites") }
model CampaignUpdate { id String @id @default(cuid()) campaignId String title String body String imageUrl String? createdAt DateTime @default(now()) campaign Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade) @@map("campaign_updates") }

model VolunteerProfile {
  id String @id @default(cuid()) userId String @unique bio String? skills String @default("") availability String? hasVehicle Boolean @default(false) languages String @default("") city String? state String? country String @default("Venezuela") emergencyContact String? emergencyPhone String? idDocumentUrl String? backgroundCheckAt DateTime? status String @default("REGISTERED") totalHours Int @default(0) joinedAt DateTime @default(now()) user User @relation(fields: [userId], references: [id], onDelete: Cascade) shifts VolunteerShift[] @@map("volunteer_profiles")
}
model VolunteerShift { id String @id @default(cuid()) volunteerId String warehouseId String? startTime DateTime endTime DateTime hoursLogged Int? task String status String @default("SCHEDULED") notes String? volunteer VolunteerProfile @relation(fields: [volunteerId], references: [id], onDelete: Cascade) warehouse Warehouse? @relation(fields: [warehouseId], references: [id]) @@map("volunteer_shifts") }
model Certificate { id String @id @default(cuid()) userId String title String hours Int issuedAt DateTime @default(now()) pdfUrl String? user User @relation(fields: [userId], references: [id], onDelete: Cascade) @@map("certificates") }

model Warehouse { id String @id @default(cuid()) name String address String city String state String latitude Float? longitude Float? capacity Int? managerId String? phone String? isActive Boolean @default(true) createdAt DateTime @default(now()) updatedAt DateTime @updatedAt inventory InventoryItem[] shifts VolunteerShift[] deliveries Delivery[] @@map("warehouses") }
model InventoryItem { id String @id @default(cuid()) warehouseId String name String category String unit String quantity Int @default(0) minQuantity Int @default(0) expiresAt DateTime? receivedAt DateTime @default(now()) warehouse Warehouse @relation(fields: [warehouseId], references: [id], onDelete: Cascade) @@map("inventory_items") }

model Delivery {
  id String @id @default(cuid()) code String @unique @default(cuid()) campaignId String? warehouseId String driverName String? driverPhone String? vehicleInfo String? origin String destination String lat Float? lng Float? status String @default("PLANNED") scheduledFor DateTime completedAt DateTime? recipientName String recipientPhone String? recipientIdNum String? proofPhotoUrls String @default("[]") signatureUrl String? qrCode String? weightKg Float? itemCount Int? notes String? blockchainHash String? createdAt DateTime @default(now()) updatedAt DateTime @updatedAt campaign Campaign? @relation(fields: [campaignId], references: [id]) warehouse Warehouse @relation(fields: [warehouseId], references: [id]) @@map("deliveries")
}

model HelpRequest {
  id String @id @default(cuid()) trackingCode String @unique @default(cuid()) requesterId String? fullName String phone String email String? region String city String address String? latitude Float? longitude Float? familySize Int hasChildren Boolean @default(false) hasElderly Boolean @default(false) hasDisabled Boolean @default(false) urgency String @default("MEDIUM") category String description String evidenceUrls String @default("[]") status String @default("SUBMITTED") assignedToId String? resolutionNotes String? createdAt DateTime @default(now()) updatedAt DateTime @updatedAt resolvedAt DateTime? requester User? @relation(fields: [requesterId], references: [id], onDelete: SetNull) @@map("help_requests")
}

model Address { id String @id @default(cuid()) userId String line1 String line2 String? city String state String postalCode String? country String @default("Venezuela") isDefault Boolean @default(false) user User @relation(fields: [userId], references: [id], onDelete: Cascade) @@map("addresses") }
model Notification { id String @id @default(cuid()) userId String title String body String type String data String? readAt DateTime? createdAt DateTime @default(now()) user User @relation(fields: [userId], references: [id], onDelete: Cascade) @@map("notifications") }
model AuditLog { id String @id @default(cuid()) userId String? action String resource String resourceId String? ipAddress String? userAgent String? metadata String? severity String @default("info") createdAt DateTime @default(now()) user User? @relation(fields: [userId], references: [id], onDelete: SetNull) @@map("audit_logs") }
model PageView { id String @id @default(cuid()) path String referrer String? country String? device String? createdAt DateTime @default(now()) @@map("page_views") }
EOF

  # Sobrescribir DATABASE_URL en .env.local
  sed -i.bak 's|^DATABASE_URL=.*|DATABASE_URL="file:./dev.db"|' .env.local
fi

# 6. Prisma generate + migrate
echo -e "${YELLOW}→ Generando cliente Prisma...${RESET}"
npx prisma generate

if [ ! -f "prisma/dev.db" ] && [ "$USE_SQLITE" -eq 1 ]; then
  echo -e "${YELLOW}→ Creando DB y corriendo migraciones...${RESET}"
  npx prisma db push --skip-generate
fi

# 7. Seed
echo -e "${YELLOW}→ Sembrando datos demo...${RESET}"
DATABASE_URL="file:./dev.db" npx tsx prisma/seed-sqlite.ts 2>/dev/null || echo -e "${YELLOW}  (seed omitido, continuando)${RESET}"

# 8. Lanzar
echo ""
echo -e "${GREEN}✓ Todo listo. Arrancando servidor...${RESET}"
echo -e "${CYAN}  → http://localhost:3000${RESET}"
echo ""
npm run dev