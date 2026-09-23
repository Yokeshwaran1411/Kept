import React, { useState, useEffect } from 'react';

const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5 12 3l9 6.5" /><path d="M5 10v10h14V10" /></svg> },
        { id: 'subscriptions', label: 'Subscriptions', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /></svg> },
        { id: 'analytics', label: 'Analytics', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10" /><path d="M12 20V4" /><path d="M20 20v-7" /></svg> },
        { id: 'calendar', label: 'Calendar', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg> }
];

const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return name.substring(0, 2).toUpperCase();
};

export default function Sidebar({ sidebarCollapsed, setSidebarCollapsed, activePage, setActivePage }) {
        const [user, setUser] = useState({ name: '', mail: '' });

        useEffect(() => {
                const storedUser = localStorage.getItem('kept_user');
                if (storedUser) setUser(JSON.parse(storedUser));
        }, [activePage]); // re-read when page changes so edits in Profile reflect immediately

        return (
                <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                        <div className="brand">
                                <div className="brand-mark">K</div>
                                <div className="brand-name">Kept</div>
                        </div>
                        <div className="nav-group">
                                <div className="nav-label">Menu</div>
                                {navItems.map(item => (
                                        <button key={item.id} className={`nav-item ${activePage === item.id ? 'active' : ''}`} onClick={() => setActivePage(item.id)}>
                                                {item.icon}
                                                <span className="label">{item.label}</span>
                                        </button>
                                ))}
                        </div>
                        <div className="nav-group">
                                <div className="nav-label">You</div>
                                <button className={`nav-item ${activePage === 'settings' ? 'active' : ''}`} onClick={() => setActivePage('settings')}>
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.56 1.04H21a2 2 0 1 1 0 4h-.09A1.7 1.7 0 0 0 19.4 15Z" /></svg>
                                        <span className="label">Settings</span>
                                </button>
                                <button className={`nav-item ${activePage === 'profile' ? 'active' : ''}`} onClick={() => setActivePage('profile')}>
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" /></svg>
                                        <span className="label">Profile</span>
                                </button>
                        </div>
                        <div className="sidebar-spacer"></div>
                        <button className="collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17-5-5 5-5M18 17l-5-5 5-5" /></svg>
                                <span className="label">Collapse</span>
                        </button>
                        <div className="user-chip">
                                <div className="avatar">{getInitials(user.name)}</div>
                                <div className="who"><div className="n">{user.name}</div><div className="e">{user.mail}</div></div>
                        </div>
                </aside>
        );
}
