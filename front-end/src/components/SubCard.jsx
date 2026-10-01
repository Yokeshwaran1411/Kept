import React from 'react';
import ReactDOM from 'react-dom';

/* ─── Payment icon map ─── */
const METHOD_ICON = {
    UPI: {
        icon: (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
        ),
        label: 'UPI', color: '#7c6af7',
    },
    Card: {
        icon: (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
            </svg>
        ),
        label: 'Card', color: '#3ddc97',
    },
    Cash: {
        icon: (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" />
            </svg>
        ),
        label: 'Cash', color: '#e5a95f',
    },
};

function PaymentBadge({ method, method_details }) {
    if (!method) return <span style={{ color: 'var(--text-faint)', fontSize: '12px' }}>Not set</span>;
    const meta = METHOD_ICON[method] || { icon: null, label: method, color: 'var(--text-muted)' };
    const detail = !method_details ? null
        : method === 'Card' ? `•••• ${method_details.replace(/\D/g, '').slice(-4)}`
        : method_details;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: `${meta.color}18`, color: meta.color,
                border: `1px solid ${meta.color}40`,
                borderRadius: '20px', padding: '2px 9px', fontSize: '11.5px', fontWeight: 500,
            }}>
                <span>{meta.icon}</span><span>{meta.label}</span>
            </span>
            {detail && <span style={{ color: 'var(--text-muted)', fontSize: '11.5px', fontFamily: 'monospace' }}>{detail}</span>}
        </span>
    );
}

function RenewalBadge({ renewal_date }) {
    if (!renewal_date) return <span style={{ color: 'var(--text-faint)' }}>—</span>;
    const date = new Date(renewal_date);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((date - today) / 86400000);
    const label = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const urgentColor = diffDays <= 3 ? 'var(--danger)' : diffDays <= 7 ? '#e5a95f' : 'var(--accent)';
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--text)' }}>{label}</span>
            {diffDays >= 0 && (
                <span style={{ fontSize: '11px', color: urgentColor, fontWeight: 600 }}>
                    {diffDays === 0 ? 'Today!' : `in ${diffDays}d`}
                </span>
            )}
        </span>
    );
}

/* ─── Portal popover — rendered at document.body so it never affects grid ─── */
function SubCardPopover({ s, closePopover, onEdit, onDelete }) {
    const amount   = Number(s.amount || s.duration || s.price || 0);
    const plan     = s.plan || 'Standard';
    const category = s.type || s.category || '—';
    const renewal_date = s.renewal_date || null;

    return ReactDOM.createPortal(
        <>
            {/* Backdrop */}
            <div className="sub-popover-backdrop" onClick={closePopover} />

            {/* Floating card */}
            <div className="sub-popover-card" role="dialog" aria-modal="true">
                {/* Header */}
                <div className="popover-header">
                    <div className="popover-title-group">
                        <span className="dot" />
                        <span className="popover-title-name">{s.name}</span>
                        <span className="popover-category-tag">{category}</span>
                    </div>
                    <button type="button" className="popover-close-btn" onClick={closePopover} title="Close">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Compact details */}
                <div className="popover-details-compact">
                    <div className="pop-detail-item">
                        <span className="pop-lbl">Payment</span>
                        <PaymentBadge method={s.method} method_details={s.method_details} />
                    </div>
                    <div className="pop-detail-item">
                        <span className="pop-lbl">Renews</span>
                        <RenewalBadge renewal_date={renewal_date} />
                    </div>
                </div>

                {/* Amount row */}
                <div className="popover-amount-row">
                    <span className="popover-plan-label">{plan}</span>
                    <span className="mono popover-amount">₹{amount.toLocaleString('en-IN')}<span style={{ fontSize: '11px', color: 'var(--text-faint)', fontWeight: 400 }}> /mo</span></span>
                </div>

                {/* Action rows */}
                <div className="popover-actions-menu">
                    <div
                        className="popover-action-item edit-action-item"
                        onClick={() => { closePopover(); if (onEdit) onEdit(s); }}
                        role="button" tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && (closePopover(), onEdit && onEdit(s))}
                    >
                        <div className="action-icon-wrapper edit-icon-bg">
                            <svg className="action-icon edit-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path className="pencil-body" d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                <path className="pencil-line" d="M15 5l4 4" />
                            </svg>
                        </div>
                        <div className="action-text-content">
                            <div className="action-title">Edit Subscription</div>
                            <div className="action-description">Update plan, amount or renewal date</div>
                        </div>
                        <div className="action-arrow">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </div>
                    </div>

                    <div
                        className="popover-action-item delete-action-item"
                        onClick={() => { closePopover(); if (onDelete) onDelete(s); }}
                        role="button" tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && (closePopover(), onDelete && onDelete(s))}
                    >
                        <div className="action-icon-wrapper delete-icon-bg">
                            <svg className="action-icon delete-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path className="trash-lid" d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <path className="trash-body" d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                <line className="trash-stripe-1" x1="10" y1="11" x2="10" y2="17" />
                                <line className="trash-stripe-2" x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </div>
                        <div className="action-text-content">
                            <div className="action-title">Delete Subscription</div>
                            <div className="action-description">Remove permanently from your account</div>
                        </div>
                        <div className="action-arrow">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}

/* ─── Card component — stays plain, no expanding ─── */
export default function SubCard({ s, isActive, openPopover, closePopover, onEdit, onDelete }) {
    const amount = Number(s.amount || s.duration || s.price || 0);
    const plan   = s.plan || 'Standard';
    const status = s.status || 'Active';
    const renewal_date = s.renewal_date || null;
    const daysLeft = renewal_date
        ? Math.ceil((new Date(renewal_date) - new Date().setHours(0,0,0,0)) / 86400000)
        : null;
    const soon = daysLeft !== null && daysLeft <= 3;

    const handleCardClick = (e) => {
        e.stopPropagation();
        // If this card's popover is open, close it; else open it (closing any other open one)
        if (isActive) {
            closePopover();
        } else {
            openPopover(s);
        }
    };

    return (
        <>
            <div
                className={`card sub-card${isActive ? ' active-popover-card' : ''}`}
                onClick={handleCardClick}
            >
                <div className="sub-top">
                    <div className="sub-name">
                        <span className="dot" />
                        {s.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <span className={`status-pill${soon ? ' soon' : ''}`}>{status}</span>
                        <button
                            type="button"
                            className="sub-options-trigger"
                            onClick={handleCardClick}
                            title="Actions"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                                <circle cx="12" cy="5"  r="1.2" />
                                <circle cx="12" cy="12" r="1.2" />
                                <circle cx="12" cy="19" r="1.2" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="sub-plan">{plan}</div>
                <div className="sub-price mono">
                    ₹{amount.toLocaleString('en-IN')}
                    <span style={{ fontSize: '12px', color: 'var(--text-faint)', fontWeight: 400 }}> / month</span>
                </div>
                <div className="sub-renew">
                    {daysLeft === null ? 'No renewal date set'
                        : daysLeft === 0 ? 'Renewing today!'
                        : daysLeft < 0  ? 'Expired'
                        : `Renews in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`}
                </div>
                <div className="view-link">Quick actions</div>
            </div>

            {/* Portal — lives at body, zero layout impact */}
            {isActive && (
                <SubCardPopover
                    s={s}
                    closePopover={closePopover}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )}
        </>
    );
}
