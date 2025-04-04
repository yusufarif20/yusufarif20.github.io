document.addEventListener("DOMContentLoaded", function() {
    // Firebase authentication state listener
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const userId = user.uid;
            const cartContainer = document.getElementById("cart-container");
            const cartCount = document.getElementById("cart-count");
            
            // Load existing cart items from Firebase
            loadCartFromFirebase(userId, cartContainer, cartCount);
        } else {
            console.log("User tidak login. Tidak bisa menampilkan keranjang.");
            document.getElementById("cart-container").innerHTML = `
                <div class="alert alert-warning">
                    Silakan login untuk melihat keranjang belanja Anda.
                </div>
            `;
        }
    });
});

function loadCartFromFirebase(userId, cartContainer, cartCount) {
    const cartRef = firebase.database().ref(`cart/${userId}`);

    cartRef.on("value", (snapshot) => {
        cartContainer.innerHTML = "";
        let count = 0;

        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            const itemKey = childSnapshot.key;
            count++;

            // Buat elemen item kursus
            const courseItem = document.createElement("div");
            courseItem.classList.add("cart-item");

            courseItem.innerHTML = `
                <img src="${item.thumbnail || 'course-image.jpg'}" alt="${item.title}" style="width: 100px; height: auto;">
                <div class="cart-info">
                    <h3>${item.title}</h3>
                    <p>${item.description || 'Deskripsi kursus tidak tersedia'}</p>
                    <p>${item.paymentMethod || 'Metode pembayaran tidak tersedia'}</p>
                </div>
                <span class="cart-price" style="margin-right: 15px;">${item.price}</span>
                <div class="button-group" style="display: flex; gap: 8px;">
                    <button class="edit-btn" data-item-id="${itemKey}" style="background-color: #3498db; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 5px;">Edit</button>
                    <button class="remove-btn" data-item-id="${itemKey}" style="background-color: red; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 5px;">Hapus</button>
                    <button class="checkout-btn" data-item-id="${itemKey}" style="background-color: green; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 5px;">Checkout</button>
                </div>
            `;

            // Tambahkan item kursus ke container
            cartContainer.appendChild(courseItem);

            // Buat elemen metode pembayaran (TAPI JANGAN TAMBAHKAN KE DOM DULU)
            const paymentMethods = document.createElement("div");
            paymentMethods.classList.add("payment-methods");
            paymentMethods.style.display = "none"; // Sembunyikan dulu

            paymentMethods.innerHTML = `
                <div style="margin-left: 15px;">
                    <h4>Pilih Metode Pembayaran:</h4>
                    <select class="payment-select" data-item-id="${itemKey}" style="padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                        <option value="Transfer Bank">Transfer Bank</option>
                        <option value="Kartu Kredit">Kartu Kredit</option>
                        <option value="E-wallet">E-Wallet</option>
                    </select>
                    <button class="confirm-payment-btn" data-item-id="${itemKey}" style="background-color: purple; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 5px; margin-left: 10px;">
                        Konfirmasi
                    </button>
                </div>
            `;

            // Event listener untuk tombol Edit agar metode pembayaran muncul
            courseItem.querySelector(".edit-btn").addEventListener("click", function () {
                if (paymentMethods.style.display === "none") {
                    paymentMethods.style.display = "block"; // Tampilkan metode pembayaran
                    courseItem.appendChild(paymentMethods); // Tambahkan ke DOM jika belum ada
                } else {
                    paymentMethods.style.display = "none"; // Sembunyikan lagi jika ditekan lagi
                }
            });

            // Event listener untuk tombol Konfirmasi
            paymentMethods.querySelector(".confirm-payment-btn").addEventListener("click", function () {
                const selectedPayment = paymentMethods.querySelector(".payment-select").value;
                confirmPaymentMethod(itemKey, selectedPayment);
            });

            // Event listener untuk tombol Hapus
            courseItem.querySelector(".remove-btn").addEventListener("click", function () {
                removeFromCart(userId, itemKey, cartCount);
            });

            // Event listener untuk tombol Checkout
            courseItem.querySelector(".checkout-btn").addEventListener("click", function () {
                checkoutItem(item);
            });
        });

        updateCartCount(count, cartCount);
    });
}


// Function to remove a course from Firebase
function removeFromCart(userId, itemKey, cartCount) {
    firebase.database().ref(`cart/${userId}/${itemKey}`).remove()
        .then(() => {
            console.log("Item berhasil dihapus dari keranjang!");
        })
        .catch((error) => {
            console.error("Error menghapus item:", error);
        });
}

// Function to update cart count display
function updateCartCount(count, cartCountElement) {
    cartCountElement.textContent = `${count} kursus dalam keranjang`;
}

function checkoutItem(item) {
    const checkoutData = {
        title: item.title,
        description: item.description || 'Deskripsi tidak tersedia',
        price: item.price,
        image: item.thumbnail || 'course-image.jpg',
        paymentMethod : item.paymentMethod
    };

    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    
    // Redirect to checkout page
    window.location.href = "checkout.html";
}

function confirmPaymentMethod(itemKey, selectedPayment) {
    alert(`Metode pembayaran untuk item ${itemKey}: ${selectedPayment}`);
    
    // Simpan metode pembayaran ke Firebase
    const user = firebase.auth().currentUser;
    if (user) {
        firebase.database().ref(`cart/${user.uid}/${itemKey}/paymentMethod`).set(selectedPayment)
            .then(() => {
                console.log("Metode pembayaran berhasil disimpan!");
            })
            .catch((error) => {
                console.error("Gagal menyimpan metode pembayaran:", error);
            });
    }
}