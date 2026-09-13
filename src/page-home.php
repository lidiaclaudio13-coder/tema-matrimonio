<?php
/*
Template Name: Wedding Home Page
*/
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Claudio & Lidia — Matrimonio</title>
    <!-- Importazione Google Fonts Eleganti -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:wght@600&family=Great+Vibes&display=swap" rel="stylesheet">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<!-- Header con Logo e Scritta Elegante -->
<header class="wedding-header">
  <div class="header-brand">
    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/logo.png" alt="Logo Claudio & Lidia" class="header-logo">
    <span class="header-names">Claudio e Lidia</span>
  </div>
</header>

<!-- Hero Slider Wrapper -->
<div class="hero-container" id="heroContainer">
  <div class="swiper mySwiper">
    <div class="swiper-wrapper">
      
      <!-- SLIDE 1 -->
      <div class="swiper-slide" style="background-image: url('/wp-content/themes/wedding-theme/assets/images/foto1.jpg');">
        <div class="top-welcome-box">
          <h2 class="welcome-title">Benvenuti al nostro matrimonio</h2>
          <span class="wedding-date">- 18 Settembre 2026 -</span>
        </div>
        <button class="btn-wedding" id="btnSlide1">Inizia</button>
      </div>

      <!-- SLIDE 2 -->
      <div class="swiper-slide" style="background-image: url('/wp-content/themes/wedding-theme/assets/images/foto2.jpg');">
        <div class="slide-content">
          <h2>Condividi i tuoi scatti con gli sposi</h2>
        </div>
        <button class="btn-wedding" id="btnSlide2">Scatta / Carica Foto</button>
      </div>

      <!-- SLIDE 3 -->
      <div class="swiper-slide" style="background-image: url('/wp-content/themes/wedding-theme/assets/images/foto3.jpg');">
        <div class="slide-content">
          <h2>Leggi il menù</h2>
        </div>
        <button class="btn-wedding" id="btnSlide3">Vedi il Menù</button>
      </div>

      <!-- SLIDE 4 -->
      <div class="swiper-slide" style="background-image: url('/wp-content/themes/wedding-theme/assets/images/foto4.jpg');">
        <div class="slide-content">
          <h2>Invia dei messaggi agli sposi</h2>
        </div>
        <button class="btn-wedding" id="btnSlide4">Scrivi Auguri</button>
      </div>

    </div>
  </div>
</div>

<!-- SEZIONE FOTOCAMERA NATIVA IN-SITE -->
<section class="camera-section" id="sectionCamera">
  <!-- Overlay Flash per Selfie -->
  <div id="flashOverlay" class="flash-overlay"></div>

  <!-- Header Nativo Fotocamera -->
  <div class="camera-header-native">
    <button class="btn-cam-icon" id="btnCancelPreview" onclick="handleCancelOrClose()" title="Chiudi">✕</button>
    <div class="cam-top-right" id="camTopControls">
      <button class="btn-cam-icon" id="btnToggleFlash" onclick="toggleFlash()">⚡ OFF</button>
      <button class="btn-cam-icon" id="btnFlipCam" onclick="switchCamera()">🔄</button>
    </div>
  </div>

  <!-- Viewfinder e Modulo Anteprima -->
  <div class="camera-viewfinder">
    <video id="webcamVideo" autoplay playsinline muted></video>
    <img id="previewImage" style="display:none;" alt="Anteprima Foto">
    <video id="previewVideo" style="display:none;" controls playsinline></video>
    <canvas id="photoCanvas" style="display:none;"></canvas>
  </div>

  <!-- Controlli Inferiori: Scatto Nativo -->
  <div class="camera-bottom-wrapper" id="cameraLiveControls">
    <div class="mode-switch">
      <span class="mode-opt active" id="modePhoto" onclick="setCameraMode('photo')">FOTO</span>
      <span class="mode-opt" id="modeVideo" onclick="setCameraMode('video')">VIDEO</span>
    </div>

    <div class="camera-controls">
      <label for="galleryInput" class="btn-gallery-label">
        🖼️ Galleria
        <input type="file" id="galleryInput" accept="image/*,video/*" multiple style="display:none;" onchange="handleGalleryUpload(event)">
      </label>

      <button class="btn-shutter" id="btnShutter" onclick="handleShutterClick()"></button>
      
      <div style="width:75px;"></div>
    </div>
  </div>

  <!-- Barra Stile WhatsApp per Anteprima & Didascalia -->
  <div class="preview-caption-bar" id="previewCaptionBar" style="display:none;">
    <div class="caption-input-wrapper">
      <span class="caption-icon">📷</span>
      <input type="text" id="mediaCaption" class="caption-input" placeholder="Aggiungi una didascalia..." autocomplete="off">
    </div>
    <button class="btn-send-whatsapp" onclick="confirmAndUploadMedia()">➤</button>
  </div>

  <div id="uploadStatus" class="upload-status"></div>
</section>

<!-- SEZIONE MENU -->
<section class="content-section" id="sectionMenu">
  <button class="btn-back" onclick="resetSlider()">← Torna Indietro</button>
  <h2 style="margin-bottom:20px; font-weight:400; color:var(--color-salvia-dark);">Il Menù del Matrimonio</h2>
  
  <div class="menu-card">
    <h3>Il nostro benvenuto</h3>
    <p>Drinks con prosecco, spritz, birre artigianali e succhi con mini snack salati</p>
    
    <h3>I Primi</h3>
    <p>Placeholder: Risotto agli agrumi con erbe e scampi.<br>Placeholder: Casoncelli tradizionali con burro e salvia.</p>

    <h3>Il Secondo</h3>
    <p>Placeholder: Filetto alle erbe aromatiche con contorno di stagione.</p>

    <h3>Dolce & Frutta</h3>
    <p>Torta Nuziale, buffet di dolci e composizione di frutta fresca.</p>
  </div>
</section>

<!-- SEZIONE MESSAGGI (GUESTBOOK) -->
<section class="content-section" id="sectionMessaggi">
  <button class="btn-back" onclick="resetSlider()">← Torna Indietro</button>
  <h2 style="margin-bottom:20px; font-weight:400; color:var(--color-salvia-dark);">I vostri auguri per Claudio & Lidia</h2>
  
  <div class="guest-form">
    <form id="guestbookForm">
      <input type="text" id="guestName" class="guest-input" placeholder="Il tuo nome" required>
      <textarea id="guestMsg" class="guest-textarea" rows="4" placeholder="Scrivi un pensiero o un augurio per gli sposi..." required></textarea>
      <button type="submit" class="btn-wedding" style="width:100%;">Invia Messaggio</button>
    </form>
  </div>

  <h3 style="margin-bottom:15px; font-size:1.1rem; color:var(--color-text);">Bacheca degli Auguri</h3>
  <div class="messages-list" id="messagesList">
    <!-- Chiamata AJAX che popolerà i messaggi -->
  </div>
</section>

<?php wp_footer(); ?>
</body>
</html>
