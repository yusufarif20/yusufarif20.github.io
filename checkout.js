document.addEventListener("DOMContentLoaded", function () {
  const checkoutData = JSON.parse(localStorage.getItem("checkoutData"));
  const payButton = document.querySelector('.pay-button');

  const createPopup = () => {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Add header with title and close button
    const header = document.createElement('div');
    header.className = 'modal-header';
    
    const title = document.createElement('h2');
    title.textContent = 'Pesanan Berhasil!';
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = closeModal;
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    // Add divider
    const divider = document.createElement('hr');
    
    // Add success icon
    const iconContainer = document.createElement('div');
    iconContainer.className = 'success-icon';
    
    const checkmark = document.createElement('div');
    checkmark.className = 'checkmark';
    
    iconContainer.appendChild(checkmark);
    
    // Add OK button
    const okButton = document.createElement('button');
    okButton.className = 'ok-button';
    okButton.textContent = 'OK';
    okButton.onclick = closeModal;
    
    // Assemble the modal
    modalContent.appendChild(header);
    modalContent.appendChild(divider);
    modalContent.appendChild(iconContainer);
    modalContent.appendChild(okButton);
    modal.appendChild(modalContent);
    
    return modal;
  };
  
  // Function to show the modal
  const showSuccessModal = () => {
    const modal = createPopup();
    document.body.appendChild(modal);
    
    // Show the modal with animation
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
  };
  
  // Function to close the modal
  function closeModal() {
    const modal = document.querySelector('.success-modal');
    modal.style.opacity = '0';
    
    // Hapus metode pembayaran setelah popup ditutup
    const paymentRow = document.querySelector(".summary-row:nth-child(3) span:nth-child(2)");
    if (paymentRow) {
        paymentRow.innerText = ": -"; // Mengosongkan metode pembayaran
    }
    
    // Remove the modal after transition
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 300);
    window.location.href = "productpageafterlogin.html"; 
  }
  
  // Add click event to pay button
  payButton.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Simulate payment processing
    payButton.textContent = 'Memproses...';
    payButton.disabled = true;
    
    // Show success popup after a short delay (simulating payment processing)
    setTimeout(() => {
      // Ambil data dari localStorage
      const data = JSON.parse(localStorage.getItem("checkoutData"));
    
      // Simpan ke Firebase
      if (data && data.title && data.description) {
        // Misal: simpan ke dalam path users/{userId}/checkoutHistory (gunakan user ID yang sesuai)
        const userId = firebase.auth().currentUser ? firebase.auth().currentUser.uid : "guest_user";
    
        database.ref('users/' + userId + '/checkoutHistory').push({
          courseId: data.courseId,
          title: data.title,
          description: data.description,
          paymentMethod: data.paymentMethod || "Unknown",
          price: data.price || "Rp.100.000,00",
          province: data.province || "",
          city: data.city || "",
          timestamp: new Date().toISOString()
        });
      }
    
      // Tampilkan popup
      showSuccessModal();
      payButton.textContent = 'Bayar';
      payButton.disabled = false;
    }, 1500);    
  });

  // Province and City Data
  const citiesByProvince = {
    'aceh': ['Banda Aceh', 'Langsa', 'Lhokseumawe', 'Sabang', 'Subulussalam'],
    'sumut': ['Medan', 'Binjai', 'Padang Sidempuan', 'Pematangsiantar', 'Sibolga', 'Tanjungbalai', 'Tebing Tinggi'],
    'sumbar': ['Padang', 'Bukittinggi', 'Padang Panjang', 'Pariaman', 'Payakumbuh', 'Sawahlunto', 'Solok'],
    'jakarta': ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur', 'Kepulauan Seribu'],
    'jabar': ['Bandung', 'Bekasi', 'Bogor', 'Cimahi', 'Cirebon', 'Depok', 'Sukabumi', 'Tasikmalaya'],
    'jatim': ['Surabaya', 'Batu', 'Blitar', 'Kediri', 'Madiun', 'Malang', 'Mojokerto', 'Pasuruan', 'Probolinggo'],
    'jateng': ['Semarang', 'Magelang', 'Pekalongan', 'Salatiga', 'Surakarta', 'Tegal'],
    'yogya': ['Yogyakarta', 'Bantul', 'Gunungkidul', 'Kulon Progo', 'Sleman'],
    'banten': ['Serang', 'Cilegon', 'Tangerang', 'Tangerang Selatan', 'South Tangerang'],
    'bali': ['Denpasar', 'Badung', 'Bangli', 'Buleleng', 'Gianyar', 'Jembrana', 'Karangasem', 'Klungkung', 'Tabanan']
    // Add more provinces as needed
  };

  // Populate provinces dropdown
  const provinceSelect = document.getElementById('province');
  if (provinceSelect) {
    // List of all provinces
    const provinces = [
      { value: 'aceh', name: 'Aceh' },
      { value: 'sumut', name: 'Sumatera Utara' },
      { value: 'sumbar', name: 'Sumatera Barat' },
      { value: 'riau', name: 'Riau' },
      { value: 'jambi', name: 'Jambi' },
      { value: 'sumsel', name: 'Sumatera Selatan' },
      { value: 'bengkulu', name: 'Bengkulu' },
      { value: 'lampung', name: 'Lampung' },
      { value: 'babel', name: 'Bangka Belitung' },
      { value: 'kepri', name: 'Kepulauan Riau' },
      { value: 'jakarta', name: 'DKI Jakarta' },
      { value: 'jabar', name: 'Jawa Barat' },
      { value: 'jateng', name: 'Jawa Tengah' },
      { value: 'yogya', name: 'DI Yogyakarta' },
      { value: 'jatim', name: 'Jawa Timur' },
      { value: 'banten', name: 'Banten' },
      { value: 'bali', name: 'Bali' },
      { value: 'ntb', name: 'Nusa Tenggara Barat' },
      { value: 'ntt', name: 'Nusa Tenggara Timur' },
      { value: 'kalbar', name: 'Kalimantan Barat' },
      { value: 'kalteng', name: 'Kalimantan Tengah' },
      { value: 'kalsel', name: 'Kalimantan Selatan' },
      { value: 'kaltim', name: 'Kalimantan Timur' },
      { value: 'kaltara', name: 'Kalimantan Utara' },
      { value: 'sulut', name: 'Sulawesi Utara' },
      { value: 'sulteng', name: 'Sulawesi Tengah' },
      { value: 'sulsel', name: 'Sulawesi Selatan' },
      { value: 'sultengg', name: 'Sulawesi Tenggara' },
      { value: 'gorontalo', name: 'Gorontalo' },
      { value: 'sulbar', name: 'Sulawesi Barat' },
      { value: 'maluku', name: 'Maluku' },
      { value: 'malut', name: 'Maluku Utara' },
      { value: 'papuabarat', name: 'Papua Barat' },
      { value: 'papua', name: 'Papua' }
    ];

    // Create default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Pilih Provinsi';
    defaultOption.selected = true;
    defaultOption.disabled = true;
    provinceSelect.appendChild(defaultOption);

    // Add province options to select element
    provinces.forEach(province => {
      const option = document.createElement('option');
      option.value = province.value;
      option.textContent = province.name;
      provinceSelect.appendChild(option);
    });

    // Event listener for province selection
    provinceSelect.addEventListener('change', function() {
      updateCities(this.value);
    });
  }

  // Function to update cities based on selected province
  function updateCities(provinceValue) {
    const citySelect = document.getElementById('city');
    if (!citySelect) return;
    
    // Clear current options
    citySelect.innerHTML = '';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Pilih Kota/Kabupaten';
    defaultOption.selected = true;
    defaultOption.disabled = true;
    citySelect.appendChild(defaultOption);
    
    // If the selected province has cities in our data
    if (citiesByProvince[provinceValue]) {
      // Add new options
      citiesByProvince[provinceValue].forEach(city => {
        const option = document.createElement('option');
        option.value = city.toLowerCase().replace(/\s+/g, '');
        option.textContent = city;
        citySelect.appendChild(option);
      });
    }
  }

  // Store selected province and city in checkout data
  const saveAddressBtn = document.querySelector('#save-address-btn');
  if (saveAddressBtn) {
    saveAddressBtn.addEventListener('click', function() {
      const selectedProvince = document.getElementById('province');
      const selectedCity = document.getElementById('city');
      
      if (selectedProvince && selectedCity && selectedProvince.value && selectedCity.value) {
        // Get current checkout data or create new object
        let currentData = localStorage.getItem("checkoutData") ? 
                         JSON.parse(localStorage.getItem("checkoutData")) : {};
        
        // Add address info
        currentData.province = selectedProvince.options[selectedProvince.selectedIndex].text;
        currentData.city = selectedCity.options[selectedCity.selectedIndex].text;
        
        // Save back to localStorage
        localStorage.setItem("checkoutData", JSON.stringify(currentData));
        
        // Optional: Show confirmation to user
        alert("Alamat berhasil disimpan!");
      } else {
        alert("Silakan pilih Provinsi dan Kota/Kabupaten terlebih dahulu!");
      }
    });
  }

  // Load checkout data from localStorage
  if (checkoutData) {
    // Course title and description
    const courseTitle = document.querySelector(".course-details h3");
    if (courseTitle) courseTitle.innerText = checkoutData.title;
    
    const courseDesc = document.querySelector(".course-details p");
    if (courseDesc) courseDesc.innerText = checkoutData.description;
    
    // Total price
    const totalPrice = document.querySelector(".total-price span:last-child");
    if (totalPrice) totalPrice.innerText = checkoutData.price || "Rp.100.000,00";

    const price = document.querySelector(".summary-price span:last-child");
    if (price) price.innerText = checkoutData.price || "Kosong";

    const paymentMethod = document.querySelector(".summary-payment span:last-child");
    if (paymentMethod) paymentMethod.innerText = checkoutData.paymentMethod || "Kosong";

    const summaryTotalPrice = document.querySelector(".summary-total span:last-child");
    if (summaryTotalPrice) summaryTotalPrice.innerText = checkoutData.price || "Rp.100.000,00";
    
    // Course image
    const courseImage = document.querySelector(".course-image img");
    if (courseImage) courseImage.src = checkoutData.image || "/api/placeholder/120/120";

    // Set province and city if they exist in checkout data
    if (checkoutData.province && provinceSelect) {
      for (let i = 0; i < provinceSelect.options.length; i++) {
        if (provinceSelect.options[i].text === checkoutData.province) {
          provinceSelect.selectedIndex = i;
          // Update cities dropdown
          updateCities(provinceSelect.value);
          break;
        }
      }
    }

    // Set city if it exists in checkout data
    if (checkoutData.city) {
      const citySelect = document.getElementById('city');
      if (citySelect) {
        setTimeout(() => {
          for (let i = 0; i < citySelect.options.length; i++) {
            if (citySelect.options[i].text === checkoutData.city) {
              citySelect.selectedIndex = i;
              break;
            }
          }
        }, 100); // Small delay to ensure cities are populated
      }
    }
  }

  // Don't remove checkout data on page load, only on successful checkout
  // localStorage.removeItem("checkoutData");
});