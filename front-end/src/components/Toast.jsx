import React from 'react';

const icons = {
        success: (
                <svg className="toast-icon" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M7.5 12.5l3 3 6-6.5" />
                </svg>
        ),
        error: (
                <svg className="toast-icon toast-icon--error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
        ),
        info: (
                <svg className="toast-icon toast-icon--info" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
        ),
};

export default function Toast({ toastMsg, toastType = 'success' }) {
        return (
                <div className={`toast toast--${toastType} ${toastMsg ? 'show' : ''}`}>
                        {icons[toastType] || icons.success}
                        <span>{toastMsg}</span>
                </div>
        );
}
