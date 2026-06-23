import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import CreateRoadmap from './pages/CreateRoadmap.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import MyRoadmaps from './pages/MyRoadmaps.jsx';
import NotFound from './pages/NotFound.jsx';
import ProfileSetup from './pages/ProfileSetup.jsx';
import Progress from './pages/Progress.jsx';
import ProgressDetails from './pages/ProgressDetails.jsx';
import Register from './pages/Register.jsx';
import RoadmapDetails from './pages/RoadmapDetails.jsx';
import Settings from './pages/Settings.jsx';

function ProtectedAppPage({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />
      <Route
        path="/login"
        element={
          <>
            <Navbar />
            <main className="mx-auto max-w-5xl px-4 py-8">
              <Login />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/register"
        element={
          <>
            <Navbar />
            <main className="mx-auto max-w-5xl px-4 py-8">
              <Register />
            </main>
            <Footer />
          </>
        }
      />
      <Route path="/dashboard" element={<ProtectedAppPage><Dashboard /></ProtectedAppPage>} />
      <Route path="/profile-setup" element={<ProtectedAppPage><ProfileSetup /></ProtectedAppPage>} />
      <Route path="/create-roadmap" element={<ProtectedAppPage><CreateRoadmap /></ProtectedAppPage>} />
      <Route path="/roadmaps" element={<ProtectedAppPage><MyRoadmaps /></ProtectedAppPage>} />
      <Route path="/roadmaps/:id" element={<ProtectedAppPage><RoadmapDetails /></ProtectedAppPage>} />
      <Route path="/progress" element={<ProtectedAppPage><Progress /></ProtectedAppPage>} />
      <Route path="/progress/:id" element={<ProtectedAppPage><ProgressDetails /></ProtectedAppPage>} />
      <Route path="/settings" element={<ProtectedAppPage><Settings /></ProtectedAppPage>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
