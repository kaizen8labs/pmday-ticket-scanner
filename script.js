document.getElementById('scanBtn').addEventListener('click', () => {
    const qrResult = document.getElementById('qrData');
    const responseData = document.getElementById('responseData');
    const video = document.getElementById('video');
  
    video.classList.remove('hidden');
  
    // Start the QR code scanner
    const html5QrCode = new Html5Qrcode("video");
  
    html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 },
      qrCodeMessage => {
        qrResult.textContent = qrCodeMessage;
  
        // Make the GET request to the API with the QR code data
        fetch(`https://example-api.com/data?code=${qrCodeMessage}`)
          .then(response => response.json())
          .then(data => { 
            responseData.textContent = JSON.stringify(data);
          })
          .catch(err => {
            responseData.textContent = 'Error fetching API';
          });
  
        html5QrCode.stop(); // Stop scanning after reading a QR code
        video.classList.add('hidden');
      },
      errorMessage => {
        console.log(`QR Code no match: ${errorMessage}`);
      }
    );
  });
  