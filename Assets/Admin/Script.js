<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script>

    const BASE_URL = "<?= ApiTokenDetails::backEndBaseUrl(); ?>";
    const siteHostAddress = "<?= ltSiteHostAddress() ?>";
    const getTokenName = "<?= ApiTokenDetails::tokenName(); ?>";

    const LW_TOKEN = localStorage.getItem(`${getTokenName}`);
    const USERID = localStorage.getItem('userId');


    let loaderCount = 0;
    function fx_lifetech_button_loader_open() {
      loaderCount++;
    
      let loaderEl = document.querySelector('.lifetech_button_loader');
      let overlayEl = document.querySelector('.lifetech_page_overlay');
    
      if (!overlayEl) {
        overlayEl = document.createElement('div');
        overlayEl.className = 'lifetech_page_overlay';
        document.body.appendChild(overlayEl);
      }
    
      if (!loaderEl) {
        loaderEl = document.createElement('div');
        loaderEl.className = 'lifetech_button_loader';
        document.body.appendChild(loaderEl);
      }
    
      overlayEl.style.display = 'block';
      loaderEl.style.display = 'block';
    }
    
    function fx_lifetech_button_loader_close() {
      loaderCount--;
    
      if (loaderCount <= 0) {
        loaderCount = 0;
    
        const loaderEl = document.querySelector('.lifetech_button_loader');
        const overlayEl = document.querySelector('.lifetech_page_overlay');
    
        if (loaderEl) loaderEl.style.display = 'none';
        if (overlayEl) overlayEl.style.display = 'none';
      }
    }



</script> 