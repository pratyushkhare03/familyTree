// import React from 'react';
// import FamilyTreeViewer from './FamilyTreeViewer'; // adjust path if your file is elsewhere

// export default function App() {
//   return <FamilyTreeViewer />;
// }

// App.jsx
// import { useEffect, useState } from 'react';
// import { onAuth } from './services/auth';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import FamilyTreeViewer from './FamilyTreeViewer';
// import ProfilePage from './pages/ProfilePage';

// function Protected({ children }) {
//   const [user, setUser] = useState(undefined);
//   useEffect(() => onAuth(setUser), []);
//   if (user === undefined) return null;
//   return user ? children : <Navigate to="/login" replace />;
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Protected><FamilyTreeViewer /></Protected>} />
//         <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
//         {/* Add /login … */}
//       </Routes>
//     </BrowserRouter>
//   );
// }



// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FamilyTreeViewer from './FamilyTreeViewer';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FamilyTreeViewer />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

