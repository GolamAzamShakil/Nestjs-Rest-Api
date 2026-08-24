window.addEventListener('load', () => {
  const MAX_LIMIT = 20;

  // V4 - Removing the MutationObserver entirely removes DOM loop overhead entirely.
  // 1. Create a single floating banner container
  const banner = document.createElement('div');
  banner.id = 'swagger-ratelimit-banner';
  banner.style.position = 'fixed';
  banner.style.top = '10px';
  banner.style.right = '20px';
  banner.style.zIndex = '9999';
  banner.style.pointerEvents = 'none'; // Keeps UI behind it clickable
  document.body.appendChild(banner);

  function updateGlobalBadge() {
    // Read cached value, fallback to maximum capacity if empty
    let remainingValue = localStorage.getItem('swagger_latest_ratelimit');
    if (remainingValue === null) {
      remainingValue = MAX_LIMIT;
    }

    const remaining = parseInt(remainingValue, 10);
    if (isNaN(remaining)) return;

    // Apply color logic
    let statusClass = '';
    if (remaining <= 3) statusClass = 'limit-low';
    if (remaining === 0) statusClass = 'limit-empty';

    // Clear old text and set up floating element structure
    banner.innerHTML = `
      <div class="limit-badge ${statusClass}" style="box-shadow: 0 4px 6px rgba(0,0,0,0.15); pointer-events: auto;">
        Rate Limit: ${remaining} / ${MAX_LIMIT} Left
      </div>
    `;
  }

  // 2. Intercept "Try it out" network hits
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch(...args);

    const remainingHeader = response.headers.get('x-ratelimit-remaining');
    if (remainingHeader !== null) {
      localStorage.setItem('swagger_latest_ratelimit', remainingHeader);
      updateGlobalBadge();
    }

    return response;
  };

  // Run on page load (calculates cache vs fallback instantly)
  updateGlobalBadge();

  /* // V3 - Extending the script to read the response headers (X-RateLimit-Remaining) after clicking "Try it out"
  // so the badge updates live without a page refresh
  // 1. Helper function to update or create badges inside Swagger UI route rows
    function updateBadgesOnScreen(remainingValue) {
      const remaining = parseInt(remainingValue, 10);
      if (isNaN(remaining)) return;

      // Determine the color class based on the numerical state
      let statusClass = '';
      if (remaining === 1) statusClass = 'limit-low';
      if (remaining === 0) statusClass = 'limit-empty';

      const routes = document.querySelectorAll('.swagger-ui .opblock-summary');
      routes.forEach(summary => {
        let badge = summary.querySelector('.limit-badge');
        
        // If it doesn't exist, build it
        if (!badge) {
          badge = document.createElement('span');
          summary.appendChild(badge);
        }
        
        // Update both style state and inner text instantly
        badge.className = 'limit-badge ' + statusClass;
        badge.innerText = remaining + ' / 20 Left';
      });
    }

    // 2. Intercept all global browser HTTP requests ("Try it out" calls)
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
      const response = await originalFetch(...args);
      
      // Look for the rate limit headers returned by your Upstash Guard
      const remainingHeader = response.headers.get('x-ratelimit-remaining');
      if (remainingHeader !== null) {
        updateBadgesOnScreen(remainingHeader);
      }
      
      return response;
    };

    // 3. Perform the initial baseline fetch for the first page render
    originalFetch('/api/rate-limit-status')
      .then(res => res.json())
      .then(data => {
        updateBadgesOnScreen(data.remaining);

        // 4. Handle UI changes (expanding/collapsing route tags) via a MutationObserver
        const observer = new MutationObserver(() => {
          updateBadgesOnScreen(data.remaining);
        });

        const swaggerRoot = document.getElementById('swagger-ui');
        if (swaggerRoot) {
          observer.observe(swaggerRoot, { childList: true, subtree: true });
        }
      })
      .catch(err => console.error('Failed to resolve initial badge data', err)); */
});
