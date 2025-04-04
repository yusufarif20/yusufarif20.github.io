document.addEventListener("DOMContentLoaded", function () {
    if (typeof firebase === "undefined") {
        console.error("Firebase belum dimuat!");
        return;
    }
    
    const database = firebase.database();
    const priceElement = document.querySelector(".text-lg.font-semibold");
    const titleElement = document.querySelector(".text-lg.mb-6");
    const descriptionElement = document.querySelector(".text-gray-600.mb-4");
    
    // Get the course ID from URL parameters or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("id") || localStorage.getItem("selectedCourseId");
    
    if (courseId && priceElement) {
        const courseRef = database.ref('courses/' + courseId);
        
        courseRef.once('value')
            .then((snapshot) => {
                const courseData = snapshot.val();
                if (courseData) {
                    // Update the course title with the name from Firebase
                    if (courseData.name && titleElement) {
                        titleElement.innerText = courseData.name;
                    }

                    if (courseData.description && descriptionElement) {
                        descriptionElement.innerText = courseData.description;
                    }
                    
                    // Update price elements if price exists in course data
                    if (courseData.price && priceElement) {
                        priceElement.innerText = courseData.price;
                        
                        // Also update other price elements as needed
                        const totalPriceElement = document.querySelector(".total-price span:last-child");
                        if (totalPriceElement) {
                            totalPriceElement.innerText = courseData.price;
                        }
                    }
                } else {
                    console.warn("Data kursus tidak ditemukan di Firebase");
                }
            })
            .catch((error) => {
                console.error("Error fetching course data:", error);
            });
    } else {
        console.warn("Course ID tidak ditemukan atau elemen harga tidak ada di halaman");
    }
});