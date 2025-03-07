
import { useEffect } from 'react';

/**
 * Component to inject print-specific styles when the page is printed
 */
const PrintStyles = () => {
  useEffect(() => {
    // Create a style element
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.media = 'print';
    
    // CSS to apply only when printing
    const printCss = `
      @media print {
        /* Hide navigation and non-essential elements */
        header, footer, nav, .no-print, button, iframe {
          display: none !important;
        }
        
        /* Make sure the content is visible */
        body, main, .print-content {
          display: block !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          color: black !important;
          font-size: 12pt !important;
        }
        
        /* Property details specific styles */
        .property-image {
          max-height: 300px !important;
          max-width: 100% !important;
          page-break-inside: avoid !important;
        }
        
        .property-details {
          page-break-after: always !important;
        }
        
        /* Add page URL in the footer */
        @page {
          margin: 1.5cm !important;
        }
        
        @page:first {
          margin-top: 2cm !important;
        }
        
        body::after {
          content: "Printed from AI Spain Homes (www.aispain.homes)" !important;
          display: block !important;
          text-align: center !important;
          font-size: 9pt !important;
          margin-top: 2em !important;
        }
        
        /* Expand all collapsed sections */
        details, .collapsible {
          display: block !important;
        }
        
        details > summary {
          display: none !important;
        }
        
        details > div {
          display: block !important;
        }
        
        /* Ensure text is readable */
        p, h1, h2, h3, h4, h5, h6, li, td, th, blockquote {
          color: black !important;
          background: transparent !important;
        }
        
        /* Ensure links show their URL */
        a {
          color: blue !important;
          text-decoration: underline !important;
        }
        
        a::after {
          content: " (" attr(href) ")" !important;
          font-size: 80% !important;
          word-wrap: break-word !important;
        }
        
        /* Internal links don't need to show the full URL */
        a[href^="/"]:after {
          content: "" !important;
        }
      }
    `;
    
    styleElement.appendChild(document.createTextNode(printCss));
    document.head.appendChild(styleElement);
    
    return () => {
      // Clean up the style element when the component unmounts
      document.head.removeChild(styleElement);
    };
  }, []);

  return null;
};

export default PrintStyles;
