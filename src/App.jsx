import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FamilyTreeViewer from './FamilyTreeViewer';
import ProfilePageContainer from './pages/ProfilePage.container';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FamilyTreeViewer />} />
      <Route path="/profile" element={<ProfilePageContainer />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
