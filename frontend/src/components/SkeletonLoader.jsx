import React from 'react';

// Shimmer row for tables
export const SkeletonRow = ({ cols = 4 }) => (
    <tr className="skeleton-row">
        {Array.from({ length: cols }).map((_, i) => (
            <td key={i} style={{ padding: '1rem' }}>
                <div className="skeleton-bar" style={{ width: i === 0 ? '60%' : i === cols - 1 ? '40%' : '80%' }} />
            </td>
        ))}
    </tr>
);

// Shimmer stat card
export const SkeletonStatCard = () => (
    <div className="skeleton-card">
        <div>
            <div className="skeleton-bar" style={{ width: '50%', height: '12px', marginBottom: '12px' }} />
            <div className="skeleton-bar" style={{ width: '30%', height: '32px' }} />
        </div>
        <div className="skeleton-icon" />
    </div>
);

export default SkeletonRow;
