# Aturan Project Remotion Ini

1. Project ini dirender lewat GitHub Actions, BUKAN di lokal Termux.
2. JANGAN pernah menjalankan `npm install`, `npx remotion render`, atau `npx remotion studio` di terminal lokal.
3. Selalu pastikan Composition utama di `src/Root.tsx` tetap memakai ID `HelloWorld` agar cocok dengan file `.github/workflows/render.yml`.
4. Jika butuh ukuran vertikal (Reels/TikTok), ubah `width={1080}` dan `height={1920}` pada Composition `HelloWorld`.
5. Jika butuh library tambahan, cukup tambahkan ke `package.json`, biar GitHub Actions yang menginstall.
6. Pastikan tidak ada error TypeScript atau syntax karena tidak dicek lokal.
