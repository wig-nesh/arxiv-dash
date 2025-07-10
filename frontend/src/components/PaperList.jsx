import PaperCard from './PaperCard';
import Pagination from './Pagination'; // We will create this next

// PaperList is now a "dumb" component. It just receives props and renders UI.
const PaperList = ({ papers, isLoading, error, totalCount, filters, onPageChange }) => {

  if (isLoading) {
    return <div className="text-center p-10 text-lg">Loading papers...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-400 bg-red-900/20 rounded-lg">{error}</div>;
  }

  const currentPage = Math.floor(filters.skip / filters.limit) + 1;
  const totalPages = Math.ceil(totalCount / filters.limit);

  return (
    <div>
      {papers.length > 0 ? (
        <>
          {papers.map(paper => <PaperCard key={paper.arxiv_id} paper={paper} />)}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      ) : (
        <div className="text-center p-10 bg-slate-800 rounded-lg">
          No papers found for the selected filters.
        </div>
      )}
    </div>
  );
};

export default PaperList;