import React, { useState } from 'react';

const Toggle = ({ defaultOn }) => {
        const [on, setOn] = useState(defaultOn);
        return (
                <div className={`toggle ${on ? 'on' : ''}`} onClick={() => setOn(!on)} style={{ cursor: 'pointer' }}>
                        <div className="knob"></div>
                </div>
        );
};

export default function Settings() {
        const [activeTab, setActiveTab] = useState('Dashboard');
        const tabs = ['General', 'Dashboard', 'Notifications', 'Appearance', 'Currency & Region', 'Integrations', 'Security', 'Data & Privacy'];

        return (
                <div className="page active">
                        <div className="section-head" style={{ marginTop: '6px' }}><div><h2 style={{ fontSize: '20px' }}>Settings</h2><div className="sub">Customize how Kept works for you.</div></div></div>
                        <div className="settings-wrap">
                                <div className="settings-nav">
                                        {tabs.map(tab => (
                                                <button
                                                        key={tab}
                                                        className={activeTab === tab ? 'active' : ''}
                                                        onClick={() => setActiveTab(tab)}
                                                >
                                                        {tab}
                                                </button>
                                        ))}
                                </div>
                                <div>
                                        {activeTab === 'General' && (
                                                <div className="card setting-card">
                                                        <div style={{ fontWeight: 600, fontSize: '14.5px', marginBottom: '8px' }}>General Settings</div>
                                                        <div className="setting-row"><div><div className="t">Auto-sync across devices</div><div className="d">Keep your data synced securely.</div></div><Toggle defaultOn={true} /></div>
                                                        <div className="setting-row"><div><div className="t">Offline mode</div><div className="d">Allow reading data without internet.</div></div><Toggle defaultOn={false} /></div>
                                                </div>
                                        )}

                                        {activeTab === 'Dashboard' && (
                                                <div className="card setting-card">
                                                        <div style={{ fontWeight: 600, fontSize: '14.5px', marginBottom: '2px' }}>Dashboard</div>
                                                        <div style={{ fontSize: '12.5px', color: 'var(--text-faint)', marginBottom: '6px' }}>Customize your dashboard layout</div>
                                                        <div className="setting-row"><div><div className="t">Show monthly spending</div></div><Toggle defaultOn={true} /></div>
                                                        <div className="setting-row"><div><div className="t">Show yearly estimate</div></div><Toggle defaultOn={true} /></div>
                                                        <div className="setting-row"><div><div className="t">Show upcoming renewals</div></div><Toggle defaultOn={true} /></div>
                                                </div>
                                        )}

                                        {activeTab === 'Notifications' && (
                                                <div className="card setting-card">
                                                        <div style={{ fontWeight: 600, fontSize: '14.5px', marginBottom: '8px' }}>Alerts & Emails</div>
                                                        <div className="setting-row"><div><div className="t">Renewal reminders</div><div className="d">We'll remind you before a subscription renews.</div></div><Toggle defaultOn={true} /></div>
                                                        <div className="setting-row"><div><div className="t">Weekly spending summary</div><div className="d">A short email every Monday with what changed.</div></div><Toggle defaultOn={false} /></div>
                                                        <div className="setting-row"><div><div className="t">Price increase alerts</div><div className="d">We'll flag it if a subscription gets more expensive.</div></div><Toggle defaultOn={true} /></div>
                                                </div>
                                        )}

                                        {activeTab === 'Appearance' && (
                                                <div className="card setting-card">
                                                        <div style={{ fontWeight: 600, fontSize: '14.5px', marginBottom: '8px' }}>Theme & Visuals</div>
                                                        <div className="setting-row"><div><div className="t">Use system theme</div><div className="d">Automatically match your OS theme.</div></div><Toggle defaultOn={false} /></div>
                                                        <div className="setting-row"><div><div className="t">Compact lists</div><div className="d">Reduce padding in subscription views.</div></div><Toggle defaultOn={false} /></div>
                                                </div>
                                        )}

                                        {['Currency & Region', 'Integrations', 'Security', 'Data & Privacy'].includes(activeTab) && (
                                                <div className="card setting-card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px', opacity: 0.5 }}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                                        <div>Settings for {activeTab} are coming soon!</div>
                                                </div>
                                        )}
                                </div>
                        </div>
                </div>
        );
}
