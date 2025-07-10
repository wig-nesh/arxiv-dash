// frontend/src/App.jsx

function App() {
  return (
    <div className="bg-slate-900 text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-400">arXiv Digest</h1>
        <p className="mt-2 text-slate-300">
          Your personalized dashboard for arXiv papers.
        </p>
        
        <div className="mt-8 p-6 bg-slate-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold">Frontend is Running!</h2>
          <p className="mt-2">Tailwind CSS is properly configured.</p>
        </div>
      </div>
    </div>
  )
}

export default App