document.addEventListener("DOMContentLoaded", function() {
  
  // 1. Inizializzazione Swiper Carousel
  const swiper = new Swiper(".mySwiper", {
    effect: "slide",
    speed: 500,
    allowTouchMove: true
  });

  const heroContainer = document.getElementById('heroContainer');
  const sectionCamera = document.getElementById('sectionCamera');
  const sectionMenu = document.getElementById('sectionMenu');
  const sectionMessaggi = document.getElementById('sectionMessaggi');
  
  const videoElement = document.getElementById('webcamVideo');
  const previewImage = document.getElementById('previewImage');
  const previewVideo = document.getElementById('previewVideo');
  
  const cameraLiveControls = document.getElementById('cameraLiveControls');
  const previewCaptionBar = document.getElementById('previewCaptionBar');
  const camTopControls = document.getElementById('camTopControls');
  const mediaCaption = document.getElementById('mediaCaption');

  let currentStream = null;
  let useFacingMode = "environment";
  let isFlashOn = false;
  let currentMode = 'photo'; 
  let mediaRecorder = null;
  let recordedChunks = [];
  let pendingBlob = null;
  let pendingFileName = '';

  // BOTTONI SLIDE
  document.getElementById('btnSlide1').addEventListener('click', () => swiper.slideTo(1));

  document.getElementById('btnSlide2').addEventListener('click', function() {
    document.body.classList.add('camera-open');
    heroContainer.classList.add('slide-up');
    sectionCamera.classList.add('active');
    resetPreviewState();
    startCamera(useFacingMode);
  });

  document.getElementById('btnSlide3').addEventListener('click', function() {
    sectionMessaggi.classList.remove('active');
    sectionMenu.classList.add('active');
    heroContainer.classList.add('slide-up');
  });

  document.getElementById('btnSlide4').addEventListener('click', function() {
    sectionMenu.classList.remove('active');
    sectionMessaggi.classList.add('active');
    heroContainer.classList.add('slide-up');
    loadMessages();
  });

  window.resetSlider = function() {
    heroContainer.classList.remove('slide-up');
  };

  // CAMERA: Avvio Stream
  async function startCamera(facingMode) {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
    }
    try {
      const constraints = { video: { facingMode: { exact: facingMode } }, audio: (currentMode === 'video') };
      currentStream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = currentStream;
    } catch (err) {
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: (currentMode === 'video') });
        videoElement.srcObject = currentStream;
      } catch (e) {
        alert("Consenti l'accesso alla fotocamera per scattare foto direttamente dal sito.");
      }
    }
  }

  window.switchCamera = function() {
    useFacingMode = (useFacingMode === "environment") ? "user" : "environment";
    startCamera(useFacingMode);
  };

  // TOGGLE FLASH CON STATO GRAFICO DINAMICO
  window.toggleFlash = function() {
    isFlashOn = !isFlashOn;
    const btn = document.getElementById('btnToggleFlash');
    btn.innerText = isFlashOn ? '⚡ ON' : '⚡ OFF';
    btn.classList.toggle('flash-on', isFlashOn);

    if (currentStream && useFacingMode === "environment") {
      const track = currentStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? track.getCapabilities() : {};
      if (capabilities.torch) {
        track.applyConstraints({ advanced: [{ torch: isFlashOn }] }).catch(() => {});
      }
    }
  };

  window.setCameraMode = function(mode) {
    if (currentMode === mode) return;
    currentMode = mode;
    document.getElementById('modePhoto').classList.toggle('active', mode === 'photo');
    document.getElementById('modeVideo').classList.toggle('active', mode === 'video');
    startCamera(useFacingMode);
  };

  // AZIONI ANNULLA / CHIUDI
  window.handleCancelOrClose = function() {
    if (pendingBlob) {
      resetPreviewState();
      startCamera(useFacingMode);
    } else {
      if (currentStream) currentStream.getTracks().forEach(track => track.stop());
      document.body.classList.remove('camera-open');
      sectionCamera.classList.remove('active');
      heroContainer.classList.remove('slide-up');
    }
  };

  function resetPreviewState() {
    pendingBlob = null;
    pendingFileName = '';
    mediaCaption.value = '';
    previewImage.style.display = 'none';
    previewVideo.style.display = 'none';
    videoElement.style.display = 'block';
    
    cameraLiveControls.style.display = 'flex';
    previewCaptionBar.style.display = 'none';
    camTopControls.style.display = 'flex';
  }

  function showPreviewState(blob, fileName, isVideo) {
    pendingBlob = blob;
    pendingFileName = fileName;

    if (currentStream) currentStream.getTracks().forEach(track => track.stop());

    videoElement.style.display = 'none';
    cameraLiveControls.style.display = 'none';
    camTopControls.style.display = 'none';

    if (isVideo) {
      previewVideo.src = URL.createObjectURL(blob);
      previewVideo.style.display = 'block';
    } else {
      previewImage.src = URL.createObjectURL(blob);
      previewImage.style.display = 'block';
    }

    previewCaptionBar.style.display = 'flex';
  }

  // SCATTO FOTO / VIDEO
  window.handleShutterClick = function() {
    if (currentMode === 'photo') {
      takePhotoWithFlash();
    } else {
      toggleVideoRecording();
    }
  };

  function takePhotoWithFlash() {
    const flashOverlay = document.getElementById('flashOverlay');
    if (isFlashOn && useFacingMode === "user") {
      flashOverlay.classList.add('active');
      setTimeout(() => {
        capturePhotoBlob();
        setTimeout(() => flashOverlay.classList.remove('active'), 250);
      }, 150);
    } else {
      capturePhotoBlob();
    }
  }

  function capturePhotoBlob() {
    const canvas = document.getElementById('photoCanvas');
    const context = canvas.getContext('2d');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(function(blob) {
      showPreviewState(blob, 'scatto_matrimonio.jpg', false);
    }, 'image/jpeg', 0.9);
  }

  function toggleVideoRecording() {
    const shutterBtn = document.getElementById('btnShutter');
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      shutterBtn.classList.remove('recording');
    } else {
      recordedChunks = [];
      const options = MediaRecorder.isTypeSupported('video/mp4') ? { mimeType: 'video/mp4' } : {};
      mediaRecorder = new MediaRecorder(currentStream, options);
      
      mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/mp4' });
        showPreviewState(blob, 'video_matrimonio.mp4', true);
      };
      
      mediaRecorder.start();
      shutterBtn.classList.add('recording');
    }
  }

  // GALLERIA
  window.handleGalleryUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    showPreviewState(file, file.name, isVideo);
  };

  // INVIO EFFETTIVO CON DIDASCALIA
  window.confirmAndUploadMedia = function() {
    if (!pendingBlob) return;
    const captionText = mediaCaption.value;
    uploadMediaBlob(pendingBlob, pendingFileName, captionText);
  };

  function uploadMediaBlob(fileBlob, fileName, caption) {
    const statusDiv = document.getElementById('uploadStatus');
    statusDiv.innerText = "Caricamento in corso...";
    statusDiv.style.display = "block";

    const formData = new FormData();
    formData.append('action', 'upload_wedding_photo');
    formData.append('wedding_file', fileBlob, fileName);
    if (caption) {
      formData.append('media_caption', caption);
    }

    fetch(wedding_ajax.ajax_url, {
      method: 'POST',
      body: formData
    })
    .then(r => r.json())
    .then(data => {
      statusDiv.innerText = data.success ? "❤️ Contenuto condiviso con successo!" : "⚠️ Errore nel caricamento.";
      setTimeout(() => { 
        statusDiv.style.display = "none";
        resetPreviewState();
        startCamera(useFacingMode);
      }, 2000);
    })
    .catch(() => {
      statusDiv.innerText = "⚠️ Errore di connessione.";
      setTimeout(() => { statusDiv.style.display = "none"; }, 2500);
    });
  }

  // MESSAGGI
  const guestForm = document.getElementById('guestbookForm');
  if(guestForm) {
    guestForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('guestName').value;
      const msg = document.getElementById('guestMsg').value;

      const formData = new FormData();
      formData.append('action', 'send_wedding_message');
      formData.append('guest_name', name);
      formData.append('message_text', msg);

      fetch(wedding_ajax.ajax_url, { method: 'POST', body: formData })
      .then(r => r.json())
      .then(data => {
        if(data.success) {
          document.getElementById('guestMsg').value = '';
          loadMessages();
        }
      });
    });
  }

  function loadMessages() {
    const formData = new FormData();
    formData.append('action', 'get_wedding_messages');

    fetch(wedding_ajax.ajax_url, { method: 'POST', body: formData })
    .then(r => r.json())
    .then(data => {
      if(data.success && Array.isArray(data.data)) {
        const list = document.getElementById('messagesList');
        list.innerHTML = '';
        data.data.forEach(m => {
          list.innerHTML += `
            <div class="msg-bubble">
              <div class="msg-author">
                <span>${m.author}</span>
                <span class="msg-time">${m.time}</span>
              </div>
              <p style="color:#444; font-size:0.9rem;">${m.text}</p>
            </div>
          `;
        });
      }
    });
  }

});
