# Neon.tech Setup Guide untuk Academic Planner

## 🎯 Target: Setup PostgreSQL Production Database

### 📋 Overview
- **Database**: Neon.tech (PostgreSQL serverless)
- **Hosting**: Vercel
- **Framework**: Next.js 15 + Prisma
- **Status**: Ready for production

---

## 🚀 Langkah 1: Buat Project di Neon.tech

### 1.1 Sign Up & Create Project
1. Buka https://neon.tech
2. Click "Sign Up" (gunakan GitHub/Google/email)
3. Setelah login, click "New Project"
4. Isi detail:
   - **Project name**: `academic-planner`
   - **Database name**: `academicdb` (default)
   - **Region**: Pilih terdekat (Singapore/US East)
   - **Plan**: Free (sudah cukup)

### 1.2 Tunggu Proses
- Neon akan membuat database (~1-2 menit)
- Setelah ready, Anda akan melihat dashboard

---

## 🔑 Langkah 2: Dapatkan Connection String

### 2.1 Find Connection Details
1. Di Neon dashboard, click project Anda
2. Di sidebar, click **Dashboard**
3. Scroll ke bawah ke **Connection Details**
4. Copy **Connection string**

### 2.2 Format Connection String
Format yang akan Anda dapatkan:
```
postgresql://username:password@ep-xyz-123456.us-east-2.aws.neon.tech/academicdb?sslmode=require
```

**Important**: Pastikan ada `?sslmode=require` di akhir URL!

---

## ⚙️ Langkah 3: Setup di Vercel

### 3.1 Add Environment Variable
1. Buka https://vercel.com
2. Pilih project `glm-omega`
3. Click **Settings** → **Environment Variables**
4. Add variable:
   - **Name**: `DATABASE_URL`
   - **Value**: `[Paste connection string dari Neon]`
   - **Environment**: Production, Preview, Development
5. Click **Save**

### 3.2 Redeploy Application
1. Click **Deployments**
2. Pilih deployment terbaru
3. Click **Redeploy** (atau tunggu auto-redeploy)

---

## 📊 Langkah 4: Generate Prisma Client

### 4.1 Update Package.json (Opsional)
Pastikan ada script untuk generate Prisma client:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev"
  }
}
```

### 4.2 Generate Client
Vercel akan otomatis generate Prisma client saat build karena kita sudah update `build` script.

---

## 🧪 Langkah 5: Test Database Connection

### 5.1 Test Health Check
```bash
curl https://glm-omega.vercel.app/api/health
```
Expected: `{"message":"Good!"}`

### 5.2 Test API Endpoints
```bash
# Test Terms API
curl https://glm-omega.vercel.app/api/terms

# Test Courses API  
curl https://glm-omega.vercel.app/api/courses

# Test Assignments API
curl https://glm-omega.vercel.app/api/assignments

# Test Events API
curl https://glm-omega.vercel.app/api/events
```

### 5.3 Test di Browser
1. Buka https://glm-omega.vercel.app
2. Coba:
   - Create new term
   - Add course
   - Create assignment
   - Add event

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Issue 1: "Database connection failed"
**Solution**: 
- Check `DATABASE_URL` di Vercel environment variables
- Pastikan connection string benar
- Restart deployment di Vercel

#### Issue 2: "SSL required"
**Solution**:
- Pastikan connection string memiliki `?sslmode=require`
- Update environment variable di Vercel

#### Issue 3: "Prisma schema error"
**Solution**:
- Pastikan schema sudah diupdate ke `postgresql`
- Redeploy application

#### Issue 4: "Migration failed"
**Solution**:
- Neon otomatis handle schema dengan `prisma db push`
- Tidak perlu manual migration

---

## 📈 Monitor Neon Database

### 1. Neon Dashboard
- Buka project di Neon.tech
- Monitor usage di **Dashboard**
- Check active connections
- Monitor storage usage

### 2. Limits Free Tier
- **Storage**: 3 GB (cukup untuk aplikasi Anda)
- **Compute Hours**: Tidak terbatas
- **Active Connections**: 10 connections
- **Data Transfer**: 5 GB/month

### 3. Scaling
Jika melebihi limits:
- Upgrade ke Pro plan ($25/month)
- Atau optimize query dan connections

---

## 🎉 Success Criteria

Aplikasi Anda siap production jika:
- ✅ Health check returns `{"message":"Good!"}`
- ✅ API endpoints return data (bukan error)
- ✅ Bisa create term di browser
- ✅ Bisa add course di browser
- ✅ Bisa create assignment di browser
- ✅ Bisa add event di browser
- ✅ Data tersimpan di database Neon
- ✅ Bisa view data di dashboard

---

## 🚀 Next Steps (Optional)

### 1. Backup Strategy
- Neon sudah otomatis backup
- Check backup settings di Neon dashboard

### 2. Performance Optimization
- Add indexing di Prisma schema jika perlu
- Monitor query performance di Neon

### 3. Security
- Jangan share connection string
- Use Vercel environment variables
- Monitor access logs

### 4. Custom Domain
- Setup custom domain di Vercel
- Update DNS settings

---

## 📞 Support

### Jika ada issues:
1. Check Vercel logs
2. Check Neon dashboard
3. Test connection locally
4. Restart deployment

### Useful Links:
- [Neon Docs](https://neon.tech/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)

---

**🎯 Goal**: Aplikasi academic planner Anda dengan database production yang scalable dan reliable!

**⏰ Estimated Time**: 10-15 minutes total