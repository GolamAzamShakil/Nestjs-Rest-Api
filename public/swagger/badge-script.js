window.addEventListener('load', () => {

  // V3 - Extending the script to read the response headers (X-RateLimit-Remaining) after clicking "Try it out"
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
      .catch(err => console.error('Failed to resolve initial badge data', err));

  /* // V2 - Feeding live data to the script
    // from a hidden metadata endpoint/route (api/rate-limit/status) in nestjs
  // 1. Fetch the live limit from your new endpoint
  fetch('/api/rate-limit-status')
    .then((res) => res.json())
    .then((data) => {
      const remaining = data.remaining;

      // Pick class based on current state
      let statusClass = '';
      if (remaining === 1) statusClass = 'limit-low';
      if (remaining === 0) statusClass = 'limit-empty';

      // 2. Set up observer to inject the badge into all route bars
      const observer = new MutationObserver(() => {
        const routes = document.querySelectorAll(
          '.swagger-ui .opblock-summary',
        );

        routes.forEach((summary) => {
          if (summary.querySelector('.limit-badge')) return;

          const badge = document.createElement('span');
          badge.className = 'limit-badge ' + statusClass;
          badge.innerText = remaining + ' / 3 Left';

          summary.appendChild(badge);
        });
      });

      const swaggerRoot = document.getElementById('swagger-ui');
      if (swaggerRoot) {
        observer.observe(swaggerRoot, { childList: true, subtree: true });
      }
    })
    .catch((err) => console.error('Failed to fetch limit badge data', err)); */

  /* // V1 - Badge style on every item of routes/controllers of the project
  
  // MutationObserver watches for Swagger UI async rendering finishes
  const observer = new MutationObserver((mutations, obs) => {
    const routes = document.querySelectorAll('.swagger-ui .opblock');

    if (routes.length > 0) {
      routes.forEach((route) => {
        // Prevent duplicate badges on re-renders
        if (route.querySelector('.route-badge')) return;

        // 1. Extract route information to calculate your state
        const method =
          route.querySelector('.opblock-summary-method')?.textContent || '';
        const path =
          route.querySelector('.opblock-summary-path')?.textContent || '';

        // 2. Perform your state calculation logic here
        let badgeText = 'Standard';
        let badgeClass = 'badge-standard';

        if (path.includes('/admin') || method === 'DELETE') {
          badgeText = 'Admin Only';
          badgeClass = 'badge-restricted';
        }

        // 3. Create and push the badge element
        const badge = document.createElement('span');
        badge.className = 'route-badge ' + badgeClass;
        badge.innerText = badgeText;

        // Target the header summary container row
        const summaryContainer = route.querySelector('.opblock-summary');
        if (summaryContainer) {
          summaryContainer.appendChild(badge);
        }
      });
    }
  });

  // Start observing the Swagger UI root layout element
  const swaggerRoot = document.getElementById('swagger-ui');
  if (swaggerRoot) {
    observer.observe(swaggerRoot, { childList: true, subtree: true });
  } */

  /* // V0
  const customBadgeJs = `
      window.addEventListener('load', () => {
        setTimeout(() => {
          const titleContainer = document.querySelector('.swagger-ui .info .title');
          if (titleContainer) {
            const badge = document.createElement('span');
            badge.className = 'custom-badge';
            badge.innerText = 'PROD';
            titleContainer.appendChild(badge);
          }
        }, 500);
      });
    `;
  const base64Js = Buffer.from(customBadgeJs).toString('base64');
  const customBadgeJsUri = `data:text/javascript;base64,${base64Js}`; */
});
