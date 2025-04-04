document.addEventListener("DOMContentLoaded", function () {
    if (typeof firebase === "undefined") {
        console.error("Firebase belum dimuat!");
        return;
    }
    
    const database = firebase.database(); // Inisialisasi database
    const addToCartButton = document.querySelector('.bg-blue-600.text-white');
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("id")

    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
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


