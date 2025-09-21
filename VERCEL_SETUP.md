# Vercel Production Setup Guide

## 🚨 ISSUE: Database Connection Error

Aplikasi Anda sudah berhasil di-deploy tetapi API mengalami error karena database belum disetup untuk production.

## 🔧 Langkah-langkah Fix:

### Langkah 1: Setup Environment Variables di Vercel

1. Buka [Vercel Dashboard](https://vercel.com)
2. Pilih proyek `glm-omega`
3. Klik **Settings** → **Environment Variables**
4. Tambahkan variabel berikut:

#### Untuk Development (Quick Fix):
```bash
# Database URL untuk production (gunakan SQLite dulu)
DATABASE_URL = file:./dev.db
```

#### Untuk Production (Recommended):
```bash
# Database PostgreSQL production
DATABASE_URL = postgresql://username:password@host:port/database
```

### Langkah 2: Setup Database Production

#### Opsi A: Gunakan SQLite (Sederhana)
1. Di Vercel, tambahkan environment variable:
   ```
   DATABASE_URL = file:./dev.db
   ```
2. Redeploy aplikasi

#### Opsi B: Gunakan PostgreSQL (Production Ready)
1. **Buat database PostgreSQL** di salah satu platform:
   - [Supabase](https://supabase.com) (Gratis)
   - [PlanetScale](https://planetscale.com) (Gratis)
   - [Railway](https://railway.app) (Gratis)
   - [Neon](https://neon.tech) (Gratis)

2. **Dapatkan connection string** dari provider tersebut

3. **Update environment variable** di Vercel:
   ```
   DATABASE_URL = postgresql://user:password@host:port/database?pgbouncer=true
   ```

### Langkah 3: Run Database Migration

1. Di Vercel dashboard, klik **Deployments**
2. Pilih deployment terbaru
3. Klik **Logs** untuk melihat error detail
4. Jika perlu, tambahkan script build di `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate deploy"
  }
}
```

### Langkah 4: Test API Endpoints

Setelah setup, test API berikut:

```bash
# Health check
curl https://glm-omega.vercel.app/api/health

# Test terms
curl https://glm-omega.vercel.app/api/terms

# Test courses
curl https://glm-omega.vercel.app/api/courses

# Test assignments
curl https://glm-omega.vercel.app/api/assignments

# Test events
curl https://glm-omega.vercel.app/api/events
```

## 🎯 Quick Fix (Untuk Testing Segera)

Jika ingin cepet fix, gunakan SQLite dulu:

1. Di Vercel dashboard → Settings → Environment Variables
2. Tambahkan:
   - Name: `DATABASE_URL`
   - Value: `file:./dev.db`
3. Klik Save
4. Redeploy dengan klik "Redeploy"

## 📋 Checklist Production:

- [ ] Environment variables disetup
- [ ] Database production tersedia
- [ ] Migration dijalankan
- [ ] API endpoints berfungsi
- [ ] Frontend bisa create/read/update/delete data
- [ ] Mobile responsiveness test
- [ ] Performance optimization

## 🔍 Debug Tips:

### Check Vercel Logs:
1. Vercel Dashboard → Proyek → View Logs
2. Cari error database connection
3. Check environment variables loading

### Local Testing:
```bash
# Test dengan production environment
npm run build
npm start
```

### Common Issues:
- `DATABASE_URL` tidak valid
- Database host tidak reachable dari Vercel
- Migration belum dijalankan
- Missing environment variables

## 🚀 Next Steps:

Setelah database fix:
1. Test semua fitur (Create Term, Course, Assignment, Event)
2. Check mobile responsiveness
3. Add custom domain (jika perlu)
4. Setup monitoring dan analytics
5. Add error tracking (Sentry, dll)

## 📞 Support:

Jika masih ada error:
1. Check Vercel logs untuk detail error
2. Pastikan environment variables benar
3. Test database connection secara manual
4. Coba redeploy dengan clear cache

---

**Note:** Untuk production environment, sangat disarankan menggunakan database PostgreSQL daripada SQLite untuk better performance dan reliability.