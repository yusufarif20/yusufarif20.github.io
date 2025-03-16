function register() {
    console.log(auth);
    console.log("Tombol submit ditekan");

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const city = document.getElementById("city").value;
    const referral = document.getElementById("referral").value;

    if (!email || !password) {
        alert("Email dan password wajib diisi!");
        return;
    }

    // Gunakan auth dari firebase-config.js
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Registrasi berhasil", userCredential);
            const user = userCredential.user;

            database.ref("users/" + user.uid).set({
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email,
                city: city,
                referral: referral,
                createdAt: new Date().toISOString()
            }).then(() => {
                console.log("Data pengguna disimpan ke database.");
                alert("Registrasi berhasil! Silakan login.");
                window.location.href = "login.html";
            }).catch((dbError) => {
                console.error("Gagal menyimpan data:", dbError);
            });

        })
        .catch((error) => {
            console.error("Registrasi gagal:", error);
            alert("Registrasi gagal: " + error.message);
        });
}

// Tambahkan event listener untuk form submit
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("registerForm").addEventListener("submit", function(event) {
        event.preventDefault();
        register();
    });
});
