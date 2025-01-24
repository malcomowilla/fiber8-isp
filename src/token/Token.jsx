// import { useState, useEffect } from 'react';

// function Token() {
//   const [csrfToken, setCsrfToken] = useState('');

//   useEffect(() => {
//     async function fetchCsrfToken() {
//       try {
//         const response = await fetch('/api/csrf_token');
//         if (!response.ok) {
//           throw new Error('Failed to fetch CSRF token');
//         }
//         setCsrfToken(csrf_token);
//         console.log(csrf_token)
//       } catch (error) {
//       }
//     }

//     fetchCsrfToken();
//   }, []);

  
// }

// export default Token;
