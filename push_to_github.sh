#!/bin/bash

# Script untuk memudahkan push ke GitHub
# Ganti YOUR_USERNAME dengan username GitHub Anda

echo "=== GitHub Push Script ==="
echo "Pastikan Anda sudah membuat repository di GitHub"
echo "Repository name: academic-planner"
echo ""

# Minta input username GitHub
read -p "Masukkan username GitHub Anda: " username

if [ -z "$username" ]; then
    echo "Error: Username tidak boleh kosong!"
    exit 1
fi

# Set repository URL
repo_url="https://github.com/$username/academic-planner.git"

echo "Repository URL: $repo_url"
echo ""

# Tambahkan remote
echo "Menambahkan remote repository..."
git remote add origin $repo_url

# Rename branch ke main (jika belum)
echo "Mengatur branch default..."
git branch -M main

# Push ke GitHub
echo "Mendorong kode ke GitHub..."
git push -u origin main

echo ""
echo "=== Selesai! ==="
echo "Kode Anda sudah di GitHub: https://github.com/$username/academic-planner"
echo ""
echo "Langkah selanjutnya:"
echo "1. Deploy ke Vercel: https://vercel.com"
echo "2. Import repository dari GitHub"
echo "3. Setup environment variables"
echo "4. Deploy aplikasi"