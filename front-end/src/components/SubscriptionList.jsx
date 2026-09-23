import React from 'react';
import SubCard from './SubCard';

export default function SubscriptionList({ subscriptions, expandedCards, toggleCard, setAddModalOpen }) {
        return (
                <div className="page active">
                        <div className="section-head" style={{ marginTop: '6px' }}>
                                <div><h2 style={{ fontSize: '20px' }}>Your subscriptions</h2><div className="sub">Everything you're paying for, in one place.</div></div>
                                <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>+ Add subscription</button>
                        </div>
                        <div className="sub-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                                {subscriptions.map(s => <SubCard key={s.id} s={s} isOpen={expandedCards[s.id]} toggleCard={toggleCard} />)}
                        </div>
                </div>
        );
}
