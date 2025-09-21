# Neon.tech Setup Checklist

## ✅ Sebelum Setup (Sudah Done)
- [x] Aplikasi sudah di-deploy ke Vercel
- [x] GitHub repository sudah ada
- [x] Prisma schema sudah diupdate ke PostgreSQL
- [x] Package.json sudah memiliki script yang benar

## 🚀 Langkah Setup Neon.tech

### Step 1: Buat Account Neon.tech
- [ ] Buka https://neon.tech
- [ ] Sign up dengan GitHub/Google/email
- [ ] Verifikasi email (jika perlu)

### Step 2: Buat Project Baru
- [ ] Click "New Project"
- [ ] Project name: `academic-planner`
- [ ] Database name: `academicdb` (default)
- [ ] Region: Pilih terdekat (Singapore/US East)
- [ ] Plan: Free
- [ ] Click "Create Project"

### Step 3: Dapatkan Connection String
- [ ] Tunggu project ready (1-2 menit)
- [ ] Copy connection string dari dashboard
- [ ] Format: `postgresql://user:pass@host-neon.tech/dbname?sslmode=require`
- [ ] Pastikan ada `?sslmode=require` di akhir

### Step 4: Setup Vercel Environment
- [ ] Buka https://vercel.com
- [ ] Pilih project `glm-omega`
- [ ] Click Settings → Environment Variables
- [ ] Add variable:
  - Name: `DATABASE_URL`
  - Value: `[paste connection string]`
  - Environment: Production, Preview, Development
- [ ] Click Save

### Step 5: Redeploy Aplikasi
- [ ] Click Deployments
- [ ] Pilih deployment terbaru
- [ ] Click Redeploy
- [ ] Tunggu deploy selesai

## 🧪 Testing Setelah Setup

### Test API Health
- [ ] `curl https://glm-omega.vercel.app/api/health` → `{"message":"Good!"}`

### Test API Endpoints
- [ ] `curl https://glm-omega.vercel.app/api/terms` → `[]` (no error)
- [ ] `curl https://glm-omega.vercel.app/api/courses` → `[]` (no error)
- [ ] `curl https://glm-omega.vercel.app/api/assignments` → `[]` (no error)
- [ ] `curl https://glm-omega.vercel.app/api/events` → `[]` (no error)

### Test Browser Functionality
- [ ] Buka https://glm-omega.vercel.app
- [ ] Click tab "Terms"
- [ ] Click "Create Term" → Form muncul
- [ ] Isi form dan submit → Success
- [ ] Check term created di list
- [ ] Test create course
- [ ] Test create assignment
- [ ] Test create event
- [ ] Check calendar view
- [ ] Test dashboard statistics

## 🎯 Success Criteria
- [ ] Semua API endpoints return 200 (bukan error)
- [ ] Bisa create/read/update/delete data
- [ ] Data tersimpan di database Neon
- [ ] Aplikasi berjalan normal di browser
- [ ] Mobile responsiveness OK

## 🔧 Troubleshooting

### Jika API masih error:
- [ ] Check Vercel environment variables
- [ ] Pastikan `DATABASE_URL` benar
- [ ] Redeploy lagi
- [ ] Check Vercel logs

### Jika form tidak bisa submit:
- [ ] Check browser console untuk errors
- [ ] Test API dengan curl commands
- [ ] Check Neon dashboard untuk connections

### Jika performance lambat:
- [ ] Check Neon dashboard untuk usage
- [ ] Optimize queries jika perlu

## 📈 Monitoring

### Neon Dashboard
- [ ] Buka Neon.tech dashboard
- [ ] Monitor active connections
- [ ] Check storage usage
- [ ] Monitor query performance

### Vercel Analytics
- [ ] Check Vercel analytics
- [ ] Monitor performance metrics
- [ ] Check error rates

---

## 🎉 Selesai!

Jika semua checklist di atas ✅, maka:
- Aplikasi Anda siap production!
- Database PostgreSQL yang scalable
- Auto-backup oleh Neon
- Monitoring dan analytics ready

**Estimasi waktu total:** 15-20 menit