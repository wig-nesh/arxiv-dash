import { Routes, Route, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react'; // <-- Make sure useState and useEffect are imported
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Scrape from './pages/Scrape';
import WelcomeModal from './components/WelcomeModal'; // <-- Import the new modal component

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // This effect runs only once when the app first loads
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      // If the user has never visited, open the modal
      setIsModalOpen(true);
    }
  }, []); // The empty array [] ensures this runs only on mount

  const handleCloseModal = () => {
    // When the user closes the modal, hide it...
    setIsModalOpen(false);
    // ...and set the flag in local storage so it doesn't appear again.
    localStorage.setItem('hasVisited', 'true');
  };

  const navLinkStyle = ({ isActive }) => 
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive 
      ? 'bg-cyan-500 text-slate-900' 
      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
    }`;

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      {/* The modal will render on top of everything else */}
      <WelcomeModal isOpen={isModalOpen} onClose={handleCloseModal} />
      
      <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
        <nav className="max-w-5xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-xl font-bold text-cyan-400">ar X dash</h1>
          <div className="flex items-center gap-4">
            <NavLink to="/" className={navLinkStyle}>Dashboard</NavLink>
            <NavLink to="/scrape" className={navLinkStyle}>Scrape</NavLink>
            <NavLink to="/settings" className={navLinkStyle}>Settings</NavLink>
          </div>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto p-4 sm:p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/scrape" element={<Scrape />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;