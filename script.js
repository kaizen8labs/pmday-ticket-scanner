// Thay thế các giá trị dưới đây bằng thông tin thực tế của bạn
const CLIENT_ID = 'e2afa952-d255-4df8-aea2-7fe323f55bcf'; // Thay 'YOUR_CLIENT_ID' bằng Client ID thực tế của bạn
const API_KEY = '2f53c721-acb2-44db-866a-21bddedeaeb7';     // Thay 'YOUR_API_KEY' bằng API Key thực tế của bạn
document.getElementById('scanBtn').addEventListener('click', () => {
    const qrResult = document.getElementById('qrData');
    const responseData = document.getElementById('responseData');
    const video = document.getElementById('video');
  
    qrResult.textContent = '';
    responseData.textContent = '';
  
    // Start the QR code scanner
    const html5QrCode = new Html5Qrcode("video");
    Html5Qrcode.getCameras().then(cameras => {
      if (cameras && cameras.length) {
        // Use the back camera if available
        const cameraId = cameras[0].id;
  
        html5QrCode.start(
          cameraId, 
          {
            fps: 10,    // Optional: Scan 10 frames per second
            qrbox: { width: 250, height: 250 }  // Optional: Define scanner box
          },
          qrCodeMessage => {
            qrResult.textContent = `Scanned QR Code: ${qrCodeMessage}`;
  
            // Stop the scanner after success
            html5QrCode.stop().then(() => {
              console.log("QR Code scanning stopped.");
            }).catch(err => console.error("Stop failed: ", err));
  
            // Call your API with the scanned data
            const paymentRequestId = encodeURIComponent(qrCodeMessage.trim());
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
              responseData.textContent = `
                ID: ${data.id}
                Amount: ${data.amount}
                Status: ${data.status}
                Created At: ${data.created_at}
              `;
            })
            .catch(err => {
              responseData.textContent = 'Error fetching API data.';
              console.error('API error:', err);
            });
          },
          errorMessage => {
            console.warn(`QR Code scan failed: ${errorMessage}`);
          }
        ).catch(err => {
          console.error("Unable to start scanning: ", err);
        });
      }
    }).catch(err => {
      console.error("Camera access error: ", err);
      alert("Unable to access the camera. Please grant camera permissions.");
    });
  });
  