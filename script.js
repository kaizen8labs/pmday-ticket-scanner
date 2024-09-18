// Thay thế các giá trị dưới đây bằng thông tin thực tế của bạn
const CLIENT_ID = 'e2afa952-d255-4df8-aea2-7fe323f55bcf'; // Thay 'YOUR_CLIENT_ID' bằng Client ID thực tế của bạn
const API_KEY = '2f53c721-acb2-44db-866a-21bddedeaeb7';     // Thay 'YOUR_API_KEY' bằng API Key thực tế của bạn


document.getElementById('scanBtn').addEventListener('click', () => {
    const qrResult = document.getElementById('qrData');
    const responseTable = document.getElementById('responseContainer');
    const idData = document.getElementById('idData');
    const amountData = document.getElementById('amountData');
    const statusData = document.getElementById('statusData');
    const createdAtData = document.getElementById('createdAtData');
  
    qrResult.textContent = '';
    responseTable.classList.add('hidden');
  
    // Initialize the QR code reader
    const html5QrCode = new Html5Qrcode("qr-reader");

    Html5Qrcode.getCameras().then(cameras => {
      if (cameras && cameras.length) {
        const cameraId = cameras[0].id;
        const qrCodeSuccessCallback = (decodedText, decodedResult) =>  {
            qrResult.textContent = `Ticket Order Code: ${decodedText}`;
  
            // Stop scanner after QR code is detected
            html5QrCode.stop().then(() => {
              console.log("QR scanning stopped.");
            }).catch(err => console.error("Stop failed: ", err));
  
            // Call the API with scanned QR code data
            const paymentRequestId = encodeURIComponent(decodedText.trim());
            const apiUrl = `https://api-merchant.payos.vn/v2/payment-requests/${paymentRequestId}`;
  
            fetch(apiUrl, {
              method: 'GET',
              headers: {
                'x-client-id': CLIENT_ID,
                'x-api-key': API_KEY,
                'Content-Type': 'application/json'
              }
            })
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {

                // Populate the table with API data
                idData.textContent = data.data.status == 'PAID' ? 'Valid Ticket' : 'Invalid ticket';
                amountData.textContent = data.data.amount;
                statusData.textContent = data.data.status == 'PAID' ? '✅' : '🚫';
                createdAtData.textContent = data.data.createdAt;

                // Show the table
                responseTable.classList.remove('hidden');
            })
            .catch(err => {
              qrResult.textContent = 'Error fetching API data.';
              console.error('API error:', err);
            });
          };
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        
        // If you want to prefer front camera
        html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);
      }
    }).catch(err => {
      console.error("Camera access error: ", err);
      alert("Unable to access the camera. Please grant camera permissions.");
    });
  });
  