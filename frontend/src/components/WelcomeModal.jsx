// This component represents the popup UI. It's "dumb" and only knows
// how to display itself and report when the close button is clicked.

const WelcomeModal = ({ isOpen, onClose }) => {
  // If the modal is not supposed to be open, render nothing.
  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop: a semi-transparent overlay that covers the entire screen
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      
      {/* Modal Panel: the actual content box */}
      <div className="bg-slate-800 text-white p-8 rounded-lg shadow-2xl max-w-lg w-full mx-4">
        
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">
          Welcome to arXiv Digest!
        </h2>

        <p className="text-slate-300 mb-4">
          Here’s a quick guide to get you started:
        </p>

        <ul className="list-disc list-inside space-y-3 text-slate-300">
          <li>
            <strong>Dashboard:</strong> This is your main feed. It shows papers based on your saved preferences that have been scraped already.
          </li>
          <li>
            <strong>Scrape:</strong> A power-user tool to fetch the very latest papers from arXiv on-demand. Use it to get papers that match your specific interests right now.
          </li>
          <li>
            <strong>Settings:</strong> Your control panel! Go here to set your favorite keywords, categories, and default date range. Your dashboard will automatically update.
          </li>
        </ul>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          Got it, let's go!
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;