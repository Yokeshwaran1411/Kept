import React from 'react';

export default function SubCard({ s, isOpen, toggleCard }) {
        const soon = s.renewIn <= 3;
        return (
                <div className={`card sub-card ${isOpen ? 'open' : ''}`} onClick={() => toggleCard(s.id)}>
                        <div className="sub-top">
                                <div className="sub-name"><span className="dot"></span>{s.name}</div>
                                <span className={`status-pill ${soon ? 'soon' : ''}`}>{s.status}</span>
                        </div>
                        <div className="sub-plan">{s.plan}</div>
                        <div className="sub-price mono">₹{s.price.toLocaleString('en-IN')} <span style={{ fontSize: '12px', color: 'var(--text-faint)', fontWeight: 400 }}>/ month</span></div>
                        <div className="sub-renew">{s.renewIn === 0 ? 'Renewing today' : `Renews in ${s.renewIn} days`}</div>
                        <div className="view-link">View details</div>
                        <div className="sub-details">
                                <div className="row"><span>Payment method</span><span>{s.method}</span></div>
                                <div className="row"><span>Started</span><span>{s.started}</span></div>
                                <div className="row"><span>Category</span><span>{s.category}</span></div>
                                <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
                                        <button className="btn btn-ghost" style={{ flex: 1, padding: '7px', fontSize: '12.5px' }} onClick={(e) => { e.stopPropagation(); alert('Edit clicked for ' + s.name); }}>Edit</button>
                                        <button className="btn btn-danger" style={{ flex: 1, padding: '7px', fontSize: '12.5px' }} onClick={(e) => { e.stopPropagation(); alert('Delete clicked for ' + s.name); }}>Delete</button>
                                </div>
                        </div>
                </div>
        );
}
