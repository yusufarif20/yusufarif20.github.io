function deleteReview(reviewId) {
    if (confirm("Yakin ingin menghapus review ini?")) {
        firebase.database().ref('ratings/' + reviewId).remove()
        .then(() => {
            alert("Review berhasil dihapus.");
            location.reload(); // Atau panggil ulang fetch review
        }).catch((error) => {
            console.error("Gagal hapus:", error);
        });
    }
}

function editReview(reviewId, currentComment, currentRating) {
    const newComment = prompt("Edit komentar:", currentComment);
    const newRating = prompt("Edit rating (1-5):", currentRating);

    if (newComment !== null && newRating !== null) {
        firebase.database().ref('ratings/' + reviewId).update({
            comment: newComment,
            rating: parseInt(newRating)
        }).then(() => {
            alert("Review berhasil diupdate.");
            location.reload();
        }).catch((error) => {
            console.error("Gagal update:", error);
        });
    }
}
document.addEventListener("DOMContentLoaded", function () {
    if (typeof firebase === "undefined") {
        console.error("Firebase belum dimuat!");
        return;
    }
    
    const database = firebase.database(); // Inisialisasi database
    const userButton = document.getElementById('addToCart-user');
    const guestButton = document.getElementById('guest');
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("id")
    const reviewsContainer = document.querySelector('.reviews');

    firebase.auth().onAuthStateChanged((currentUser) => {
        database.ref('ratings').once('value', (snapshot) => {
            reviewsContainer.innerHTML = '';
    
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                const reviewId = childSnapshot.key;
                const stars = '★ '.repeat(data.rating).trim();
                const userId = data.userId;
                const courseId = data.courseId;
    
                // Get User Name
                database.ref('users/' + userId).once('value', (userSnapshot) => {
                    const userName = userSnapshot.val()?.name || 'User';
    
                    // Get Course Name
                    database.ref('courses/' + courseId).once('value', (courseSnapshot) => {
                        const courseName = courseSnapshot.val()?.name || 'Course';
    
                        // Tambahkan tombol edit/hapus jika review milik user yang login
                        const isOwnReview = currentUser && currentUser.uid === userId;
                        const actionButtons = isOwnReview ? `
                            <div class="review-actions">
                                <button onclick="editReview('${reviewId}', '${data.comment}', ${data.rating})" style="background-color: #3b82f6; color: white; border: none; padding: 6px 12px; margin-right: 6px; border-radius: 6px; cursor: pointer;">Edit</button>
                                <button onclick="deleteReview('${reviewId}')" style="background-color: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">Hapus</button>
                            </div>
                        ` : '';
    
                        const reviewHTML = `
                            <div class="review-card">
                                <div class="reviewer">
                                    <span class="reviewer-badge">${userName}</span>
                                    <span class="reviewer-badge">${courseName}</span>
                                </div>
                                <p class="review-text">${data.comment || '-'}</p>
                                <div class="star-rating">${stars}</div>
                                ${actionButtons}
                            </div>
                        `;
    
                        reviewsContainer.innerHTML += reviewHTML;
                    });
                });
            });
        });
    });

    if (guestButton) {
        guestButton.addEventListener('click', function () {
            // Langsung arahkan ke halaman registrasi
            window.location.href = "register.html";
        });
    }

    if (userButton) {
        userButton.addEventListener('click', function() {
            // Fetch course data from Firebase first
            if (courseId) {
                const courseRef = database.ref('courses/' + courseId);
                
                courseRef.once('value', (snapshot) => {
                    const courseData = snapshot.val();
                    if (courseData) {
                        const courseTitle = courseData.name || "Codeing Class";
                        const courseDescription = courseData.description || "nothing";
                        const coursePrice = courseData.price || "Rp.100.000,00";
                        const courseThumbnail = courseData.thumbnailUrl || "course-image.jpg";
                        
                        addToCart(courseId, courseDescription, courseTitle, coursePrice, courseThumbnail);
                    } else {
                        console.error("Data course tidak ditemukan");
                        // Fallback to hardcoded values if needed
                        addToCart(courseId || "default-id", 
                                 "Codeing Class", 
                                 "Rp.100.000,00", 
                                 "course-image.jpg");
                    }
                }).catch(error => {
                    console.error("Error fetching course data:", error);
                });
            } else {
                // If no course ID is available, use default values
                addToCart("default-course", "Codeing Class", "Rp.100.000,00", "course-image.jpg");
            }
        });
    }

    function addToCart(courseId, courseDescription, courseTitle, coursePrice, courseThumbnail) {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const userId = user.uid; // Get the logged-in user's UID
                const cartRef = database.ref(`cart/${userId}/${courseId}`);
        
                cartRef.set({
                    id: courseId,
                    description: courseDescription,
                    title: courseTitle,
                    price: coursePrice,
                    thumbnail: courseThumbnail
                }).then(() => {
                    window.location.href = "keranjang.html";
                }).catch((error) => {
                    console.error("Gagal menambahkan kursus ke keranjang:", error);
                    alert("Gagal menambahkan kursus. Silakan coba lagi.");
                });
            } else {
                alert("Silakan login terlebih dahulu untuk menambahkan ke keranjang.");
            }
        });
    }

    function fetchCourses() {
        const coursesContainer = document.getElementById('coursesContainer');
        
        // Cek apakah elemen ditemukan sebelum mengaksesnya
        if (!coursesContainer) {
            console.warn("Elemen coursesContainer tidak ditemukan. Fungsi fetchCourses() tidak dijalankan.");
            return;
        }

        coursesContainer.innerHTML = ''; // Kosongkan sebelum memuat data baru
        const coursesRef = database.ref('courses');

        coursesRef.once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const course = childSnapshot.val();
                
                const courseCard = document.createElement('div');
                courseCard.classList.add('course-card');

                courseCard.innerHTML = `
                    <div class="course-image" style="background-image: url('${course.thumbnailUrl}'); background-size: cover; height: 150px;"></div>
                    <p class="course-price">${course.price}</p>
                    <p class="course-desc">${course.description}</p>
                    <button class="course-btn" onclick="goToClass('${childSnapshot.key}')">Lihat Course</button>
                `;

                coursesContainer.appendChild(courseCard);
            });
        });
    }

    function goToClass(courseId) {
        window.location.href = `class.html?id=${courseId}`;
    }

    if (document.getElementById('coursesContainer')) {
        fetchCourses(); // Jalankan hanya jika elemen ditemukan
    }

    if (courseId) {
        const courseRef = database.ref('courses/' + courseId);

        courseRef.once('value', (snapshot) => {
            const course = snapshot.val();
            
            if (course && course.videoHeaderUrl) {
                const videoContainer = document.getElementById('videoContainer');
                const videoElement = document.getElementById('courseVideo');

                if (videoContainer && videoElement) {
                    videoElement.src = course.videoHeaderUrl; // Gunakan videoHeaderUrl dari Firebase
                    videoElement.classList.remove('hidden'); // Tampilkan video
                    videoContainer.classList.remove('bg-blue-200'); // Hapus background default
                }
            } else {
                console.error("Video tidak ditemukan untuk course ini.");
            }
        }).catch((error) => {
            console.error("Error fetching course:", error);
        });
    }

    // Fungsi untuk membuka dan menutup popup kontak
    const contactUsBtn = document.getElementById("contactUsBtn");
    if (contactUsBtn) {
        contactUsBtn.onclick = function () {
            document.getElementById("popup").style.display = "flex";
        };
    }

    function closePopup() {
        const popup = document.getElementById("popup");
        if (popup) popup.style.display = "none";
    }   
});


