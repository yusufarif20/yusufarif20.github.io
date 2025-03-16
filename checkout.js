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
        
        // Remove the modal after transition
        setTimeout(() => {
          document.body.removeChild(modal);
        }, 300);
      }
      
      // Add click event to pay button
      payButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Simulate payment processing
        payButton.textContent = 'Memproses...';
        payButton.disabled = true;
        
        // Show success popup after a short delay (simulating payment processing)
        setTimeout(() => {
          showSuccessModal();
          payButton.textContent = 'Bayar';
          payButton.disabled = false;
        }, 1500);
      });

    if (checkoutData) {
        // Tampilkan data kursus di halaman checkout
        document.querySelector(".order-info h3").innerText = checkoutData.title;
        document.querySelector(".order-info p").innerText = checkoutData.description;
        document.querySelector(".total-btn").innerText = `Total ${checkoutData.price}`;
        document.querySelector(".order-item img").src = checkoutData.image;

        // Hapus data dari localStorage setelah diambil (opsional)
        localStorage.removeItem("checkoutData");
    }
});
