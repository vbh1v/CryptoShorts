// Snap Scrolling Enhancement for CryptoShorts
(function() {
  'use strict';
  
  // Wait for DOM to be ready
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
  
  ready(function() {
    // Inject CSS for snap scrolling
    const style = document.createElement('style');
    style.innerHTML = `
      /* Enhanced snap scrolling */
      html, body {
        scroll-behavior: smooth !important;
      }
      
      /* Hide all scrollbars */
      *::-webkit-scrollbar {
        display: none !important;
      }
      
      * {
        -ms-overflow-style: none !important;
        scrollbar-width: none !important;
      }
      
      /* Target the scrollable container */
      div[style*="overflow"] {
        scroll-snap-type: y mandatory !important;
        -webkit-scroll-snap-type: y mandatory !important;
        scroll-behavior: smooth !important;
      }
      
      /* Each news item */
      div[style*="height: 100vh"],
      div[style*="height:100vh"] {
        scroll-snap-align: start !important;
        -webkit-scroll-snap-align: start !important;
        scroll-snap-stop: always !important;
      }
      
      /* React Native Web generated classes */
      .css-view-1dbjc4n[style*="overflow"] {
        scroll-snap-type: y mandatory !important;
      }
      
      .css-view-1dbjc4n > .css-view-1dbjc4n {
        scroll-snap-align: start !important;
      }
      
      /* Force snap on mobile browsers */
      @media (max-width: 768px) {
        body {
          -webkit-overflow-scrolling: touch !important;
        }
        
        div[role="list"] {
          -webkit-scroll-snap-type: y mandatory !important;
          scroll-snap-type: y mandatory !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Monitor for dynamic content and reapply snap scrolling
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          const scrollContainers = document.querySelectorAll('div[style*="overflow"]');
          scrollContainers.forEach(function(container) {
            container.style.scrollSnapType = 'y mandatory';
            container.style.webkitScrollSnapType = 'y mandatory';
          });
        }
      });
    });
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
})();