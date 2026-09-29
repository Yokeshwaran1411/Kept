import React from 'react';
import './EmptySubscriptions.css';

export default function EmptySubscriptions({ setAddModalOpen }) {
    return (
        <div className="empty-state stagger">
            <div className="empty-illustration">
                <div className="empty-circle empty-pulse1"></div>
                <div className="empty-circle empty-pulse2"></div>
                <div className="empty-icon">💳</div>
            </div>
            <h2 className="empty-title">No subscriptions found</h2>
            <p className="empty-desc">
                Looks like you haven't added any subscriptions yet.<br/>
                Add your first one to start tracking your expenses!
            </p>
            <button className="btn btn-primary add-first-btn" onClick={() => setAddModalOpen(true)}>
                + Add Subscription
            </button>
        </div>
    );
}
