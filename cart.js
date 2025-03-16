document.addEventListener("DOMContentLoaded", function() {
    const cartContainer = document.getElementById("cart-container");
    const cartCount = document.getElementById("cart-count");
    const addCourseButton = document.getElementById("add-course");

    let cartItems = 0;

    function updateCartCount() {
        cartCount.textContent = `${cartItems} kursus dalam keranjang`;
    }

    function addCourse() {
        cartItems++;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <img src="course-image.jpg" alt="Kursus">
            <div class="cart-info">
                <h3>Kursus Pemrograman Web</h3>
                <p>Full-Stack Development dengan Next.js & TypeScript</p>
            </div>
            <span class="cart-price">Rp.100.000,00 </span>
            <button class="remove-btn" style="background-color: red; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 5px;">Hapus</button>
            <button class="checkout-btn" style="background-color: red; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 5px; margin-left: 5px;">Checkout</button>
        `;

        cartContainer.appendChild(cartItem);
        updateCartCount();

        // Event untuk menghapus item dari keranjang
        cartItem.querySelector(".remove-btn").addEventListener("click", function () {
            cartContainer.removeChild(cartItem);
            cartItems--;
            updateCartCount();
        });

        // Event untuk checkout item tertentu
        cartItem.querySelector(".checkout-btn").addEventListener("click", function () {
            const courseTitle = cartItem.querySelector("h3").innerText;
            const courseDescription = cartItem.querySelector("p").innerText;
            const coursePrice = cartItem.querySelector(".cart-price").innerText;
            const courseImage = cartItem.querySelector("img").src;

            // Simpan data ke localStorage untuk checkout
            const checkoutData = {
                title: courseTitle,
                description: courseDescription,
                price: coursePrice,
                image: courseImage
            };

            localStorage.setItem("checkoutData", JSON.stringify(checkoutData));

            // Pindah ke halaman checkout
            window.location.href = "checkout.html";
        });
    }

    // Tambahkan event listener pada tombol tambah kursus
    addCourseButton.addEventListener("click", addCourse);
});
