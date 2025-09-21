#!/bin/bash

echo "=== Quick Fix untuk Vercel Database ==="
echo ""

echo "🔧 ISSUE: Database connection error di Vercel"
echo "💡 SOLUSI: Setup environment variable DATABASE_URL"
echo ""

echo "📋 Langkah-langkah manual:"
echo ""
echo "1. Buka Vercel Dashboard: https://vercel.com"
echo "2. Pilih proyek 'glm-omega'"
echo "3. Klik Settings → Environment Variables"
echo "4. Tambahkan variabel:"
echo "   - Name: DATABASE_URL"
echo "   - Value: file:./dev.db"
echo "5. Klik Save"
echo "6. Klik Deployments → Redeploy"
echo ""

echo "🚀 Alternative: Gunakan PostgreSQL (Production Ready)"
echo ""
echo "Provider gratis:"
echo "- Supabase: https://supabase.com"
echo "- Neon: https://neon.tech"
echo "- PlanetScale: https://planetscale.com"
echo ""

echo "📝 Setelah dapat PostgreSQL connection string:"
echo "Update DATABASE_URL di Vercel dengan:"
echo "postgresql://user:password@host:port/database"
echo ""

echo "🧪 Test setelah fix:"
echo "curl https://glm-omega.vercel.app/api/health"
echo "curl https://glm-omega.vercel.app/api/terms"
echo ""

echo "✅ Jika berhasil, Anda bisa create term dan gunakan semua fitur!"
echo ""