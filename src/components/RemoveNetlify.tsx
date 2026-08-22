'use client';

import { useEffect } from 'react';

export default function RemoveNetlify() {
  useEffect(() => {
    const removeToolbar = () => {
      // Find any element that Netlify might inject and forcefully remove it from the DOM
      const elements = document.querySelectorAll(
        '[id*="netlify"], netlify-drawer, netlify-toolbar, netlify-portal, iframe[title*="Netlify"]'
      );
      
      elements.forEach(el => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };

    // Run immediately
    removeToolbar();
    
    // Run periodically to catch it if it injects late
    const interval = setInterval(removeToolbar, 500);

    return () => clearInterval(interval);
  }, []);

  return null;
}
