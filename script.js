// Thay thế các giá trị dưới đây bằng thông tin thực tế của bạn
const CLIENT_ID = 'e2afa952-d255-4df8-aea2-7fe323f55bcf'; // Thay 'YOUR_CLIENT_ID' bằng Client ID thực tế của bạn
const API_KEY = '2f53c721-acb2-44db-866a-21bddedeaeb7';     // Thay 'YOUR_API_KEY' bằng API Key thực tế của bạn

document.getElementById('scanBtn').addEventListener('click', () => {
    const qrResult = document.getElementById('qrData');
    const responseData = document.getElementById('responseData');
    const video = document.getElementById('video');
  
    // Clear any previous data
    qrResult.textContent = '';
    responseData.textContent = '';
  
    // Access camera permissions and initialize the scanner
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        video.srcObject = stream;
        video.setAttribute('playsinline', true); // Ensures iOS plays it properly
        video.play();
  
        // Start the QR code scanner
        const html5QrCode = new Html5Qrcode("video");
        html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          qrCodeMessage => {
            qrResult.textContent = qrCodeMessage;
  
            // Stop scanning once a code is detected
            html5QrCode.stop().then(() => {
              video.srcObject.getTracks().forEach(track => track.stop()); // Stop video stream
            });
  
            // Call the API with the scanned QR code
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
                Số tiền: ${data.amount}
                Trạng thái: ${data.status}
                Ngày tạo: ${data.created_at}
              `;
            })
            .catch(err => {
              responseData.textContent = 'Lỗi khi lấy thông tin từ API.';
              console.error('API error:', err);
            });
          },
          errorMessage => {
            console.log(`QR Code no match: ${errorMessage}`);
          }
        );
      })
      .catch(err => {
        console.error('Camera permission error:', err);
        alert('Không thể truy cập camera, vui lòng cấp quyền.');
      });
  });
  