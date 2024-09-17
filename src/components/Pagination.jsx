export default function Pagination({ currentPage, setPage, metaPagination }) {

    const handlePrevious = () => {
        if (currentPage > 1) {
            setPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < metaPagination?.last_page) {
            setPage(currentPage + 1);
        }
    };

    return (
        <nav
            aria-label="Pagination"
            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
        >
            <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{metaPagination?.from}</span> to <span className="font-medium">{metaPagination?.to}</span> of{' '}
                    <span className="font-medium">{metaPagination?.total}</span> results
                </p>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 
          ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50 focus-visible:outline-offset-0'}`}
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentPage === metaPagination?.last_page}
                    className={`relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 
          ${currentPage === metaPagination?.last_page ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50 focus-visible:outline-offset-0'}`}
                >
                    Next
                </button>
            </div>
        </nav>
    )
}
