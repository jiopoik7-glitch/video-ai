# Garden iOS — Remotion 30 detik

Project video vertikal bertema berkebun dengan simulasi antarmuka iPhone: Lock Screen, notifikasi, Dynamic Island, Home Screen, tiga aplikasi, dan ending.

## Spesifikasi

- Durasi: 30 detik
- Resolusi: 1080 × 1920 (9:16)
- Frame rate: 60 FPS
- Total frame: 1.800
- Composition ID: `GardenIOS30s`
- Remotion: `4.0.545`
- React: `19.0.0`
- Semua animasi visual dihitung dari frame Remotion.
- Wallpaper, ikon, ilustrasi, dan audio tersedia secara lokal; tidak mengambil aset dari URL eksternal.

## Render melalui GitHub Actions

1. Ekstrak project ini ke root repository GitHub yang akan digunakan.
2. Commit dan push seluruh file ke branch repository.
3. Buka tab **Actions** pada repository GitHub.
4. Pilih workflow **Render Garden iOS Video**.
5. Tekan **Run workflow** dan tunggu job selesai.
6. Unduh artifact bernama `garden-ios-30s` dari hasil workflow. Di dalamnya terdapat `garden-ios-30s.mp4`.

Workflow akan memasang dependency di cloud, menjalankan pemeriksaan TypeScript, mendaftarkan daftar composition, lalu merender MP4 H.264 dengan audio AAC.

## Bagian yang mudah diubah

- Naskah dan konten tiga aplikasi: `src/GardeningVideo.tsx`, pada komponen `whyRows`, `benefitRows`, dan `smallRows`.
- Durasi/resolusi/FPS: `src/videoConfig.ts`.
- Warna dasar: `src/videoConfig.ts`.
- Audio lokal: `public/audio/`.

## Catatan fidelity

Ini adalah rekonstruksi visual bergaya iOS untuk video Remotion, bukan rekaman layar asli iPhone atau implementasi sistem operasi Apple. Ukuran dan susunan UI dirancang untuk komposisi video 9:16.
