# GitHub Setup Guide

## Langkah 1: Buat Repository di GitHub
1. Kunjungi https://github.com
2. Login atau buat akun baru
3. Klik "New repository"
4. Repository name: `academic-planner`
5. Description: `A comprehensive academic planner application`
6. Pilih Public atau Private
7. Jangan centang "Add README", "gitignore", atau "license"
8. Klik "Create repository"

## Langkah 2: Hubungkan Kode Lokal ke GitHub
Ganti `YOUR_USERNAME` dengan username GitHub Anda:

```bash
# Tambahkan remote repository
git remote add origin https://github.com/YOUR_USERNAME/academic-planner.git

# Rename branch default ke main (jika perlu)
git branch -M main

# Push kode ke GitHub
git push -u origin main
```

## Langkah 3: Setup Hosting dengan Vercel (Rekomendasi)

### Opsi A: Deploy melalui Vercel Dashboard
1. Kunjungi https://vercel.com
2. Login dengan akun GitHub Anda
3. Klik "New Project"
4. Pilih repository `academic-planner` dari GitHub
5. Konfigurasi:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
6. Klik "Deploy"

### Opsi B: Deploy dengan Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy proyek
vercel
```

## Langkah 4: Setup Environment Variables di Vercel
Di dashboard Vercel:
1. Pilih proyek Anda
2. Klik "Settings" → "Environment Variables"
3. Tambahkan variabel (jika diperlukan):
   - `DATABASE_URL` (untuk production database)
4. Klik "Save"
5. Redeploy proyek

## Langkah 5: Testing Production
Setelah deploy selesai:
1. Vercel akan memberikan URL (misal: https://academic-planner.vercel.app)
2. Test semua fitur:
   - Create term
   - Add courses
   - Manage assignments
   - View calendar

## Catatan Penting

### Database Production
Untuk production environment, Anda perlu:
1. Database production (PostgreSQL/MySQL) bukan SQLite
2. Update `DATABASE_URL` di environment variables
3. Jalankan `prisma migrate deploy` untuk setup database production

### Custom Domain
Jika ingin menggunakan domain sendiri:
1. Di Vercel dashboard, klik "Settings" → "Domains"
2. Tambahkan domain Anda
3. Ikuti instruksi DNS setup

## Troubleshooting

### Jika Deploy Gagal
1. Check build logs di Vercel dashboard
2. Pastikan semua dependencies terinstall
3. Check error messages dan fix kode

### Jika Database Error
1. Pastikan `DATABASE_URL` production sudah benar
2. Jalankan migration di production
3. Check koneksi database

## Link Bermanfaat
- GitHub: https://github.com
- Vercel: https://vercel.com
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs