// ✅ Pagination Component đơn giản - dễ xài
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const handleClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    className={`page-btn ${i === currentPage ? "active" : ""}`}
                    onClick={() => handleClick(i)}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="pagination">
            <button onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}>
                ◀
            </button>
            {renderPageNumbers()}
            <button onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages}>
                ▶
            </button>
        </div>
    );
};

export default Pagination;
