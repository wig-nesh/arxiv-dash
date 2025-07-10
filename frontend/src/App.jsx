import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Scrape from './pages/Scrape';

function App() {
  // This function provides dynamic styling for the navigation links.
  // It's a feature of react-router-dom's NavLink component.
  const navLinkStyle = ({ isActive }) => 
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive 
      ? 'bg-cyan-500 text-slate-900' 
      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
    }`;

  return (
    // Main container for the entire app
    <div className="bg-slate-900 text-white min-h-screen">
      
      {/* 
        This header is sticky, meaning it stays at the top of the screen as you scroll.
        The backdrop-blur-sm and transparent background give it a modern, glassy look.
      */}
      <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
        <nav className="max-w-5xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-xl font-bold text-cyan-400">arXiv Digest</h1>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <NavLink to="/" className={navLinkStyle}>Dashboard</NavLink>
            <NavLink to="/scrape" className={navLinkStyle}>Scrape</NavLink>
            <NavLink to="/settings" className={navLinkStyle}>Settings</NavLink>
          </div>
        </nav>
      </header>

      {/* 
        This is the main content area. The router will swap components in here
        based on the current URL path.
      */}
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