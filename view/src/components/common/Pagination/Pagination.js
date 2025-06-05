import React, { useState, useEffect } from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const [goToValue, setGoToValue] = useState(currentPage);

    useEffect(() => {
        setGoToValue(currentPage);
    }, [currentPage]);

    if (totalPages <= 1) return null;

    const maxVisible = 2;
    let pages = [];

    if (totalPages <= 7) {
        pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
        const start = Math.max(2, currentPage - maxVisible);
        const end = Math.min(totalPages - 1, currentPage + maxVisible);

        pages = [1];
        if (start > 2) pages.push("...");
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
    }

    const handlePageInput = () => {
        const val = parseInt(goToValue);
        if (!isNaN(val) && val >= 1 && val <= totalPages) {
            onPageChange(val);
        }
    };

    return (
        <div className="pagination-advanced">
            <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>◀</button>

            {pages.map((p, i) =>
                p === "..." ? (
                    <span key={`dots-${i}`} className="dots">...</span>
                ) : (
                    <button
                        key={`page-${p}`}
                        className={p === currentPage ? "active-page" : ""}
                        onClick={() => onPageChange(p)}
                    >
                        {p}
                    </button>
                )
            )}

            <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>▶</button>

            <div className="goto-page">
                Go to page:
                <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={goToValue}
                    onChange={(e) => setGoToValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePageInput()}
                    onBlur={handlePageInput}
                />
            </div>
        </div>
    );
};

export default Pagination;
