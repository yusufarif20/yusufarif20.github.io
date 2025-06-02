✅ Tujuan Program
Tujuan utama dari program ini adalah membangun sistem pembelajaran online (e-learning) yang memungkinkan pengguna untuk:

- Membuat akun dan login ke sistem

- Melihat daftar kursus yang tersedia

- Menambahkan kursus ke keranjang belanja

Melakukan checkout dan pembayaran
Program ini dirancang agar mudah digunakan, aman, dan mendukung berbagai skenario umum dalam transaksi kursus online.

🧩 Daftar Fungsi (Endpoints & Fitur)
1. Login
Tujuan: Mengautentikasi pengguna untuk mengakses sistem.

Fitur Utama:

Form login (email/username & password)

- Validasi kredensial

- "Ingat Saya" (penyimpanan token)

Endpoint (simulasi):
POST /api/login

2. Register (Pendaftaran Pengguna)
Tujuan: Memungkinkan pengguna baru untuk membuat akun.

Fitur Utama:

- Form pendaftaran (nama, email, password)

- Validasi email unik dan password

Endpoint:
POST /api/register

3. View Course
Tujuan: Menampilkan daftar kursus dan detailnya.

Fitur Utama:

- Daftar kursus (judul, deskripsi, harga)

- Pencarian dan filter kursus

- Melihat detail kursus

Endpoints:
GET /api/courses – daftar semua kursus
GET /api/courses/{id} – detail kursus

4. Add to Cart
Tujuan: Menambahkan kursus ke keranjang untuk pembelian nanti.

Fitur Utama:

- Tombol "Tambah ke Keranjang"

- Update jumlah item di keranjang

- Feedback ke pengguna

Endpoint:
POST /api/cart/add

5. Checkout
Tujuan: Menyelesaikan proses pembelian kursus.

Fitur Utama:

- Review isi keranjang

- Input alamat penagihan

- Proses transaksi dan konfirmasi

Endpoint:
POST /api/checkout


Anggota Kelompok 3 :
- Yusuf Arif Rahman 23050974083
- Ainur Rofiq 23050974114
- Rafi Putra Bagus Riadi 23050974110
- Julio Anggara Putra 23050974101
Website Prodi :https://pendidikan-ti.ft.unesa.ac.id/
