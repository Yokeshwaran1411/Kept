import React, { useState, useRef, useEffect } from 'react';

const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return name.substring(0, 2).toUpperCase();
};

export default function Topbar({ theme, toggleTheme, setActivePage, onLogout }) {
        const [menuOpen, setMenuOpen] = useState(false);
        const [user, setUser] = useState({ name: '', mail: '' });
        const menuRef = useRef();

        useEffect(() => {
                const storedUser = localStorage.getItem('kept_user');
                if (storedUser) setUser(JSON.parse(storedUser));
        }, []);

        useEffect(() => {
                const handleClickOutside = (e) => {
                        if (menuRef.current && !menuRef.current.contains(e.target)) {
                                setMenuOpen(false);
                        }
                };
                document.addEventListener('mousedown', handleClickOutside);
                return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        return (
                <div className="topbar">
                        <div className="search">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                                Search subscriptions…
                                <kbd>⌘K</kbd>
                        </div>
                        <div className="topbar-right">
                                <button className="icon-btn" title="Toggle Theme" onClick={toggleTheme}>
                                        {theme === 'dark' ? (
                                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                                        ) : (
                                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                                        )}
                                </button>
                                <button className="icon-btn" title="Notifications">
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
                                </button>

                                <div style={{ position: 'relative' }} ref={menuRef}>
                                <div className="avatar" style={{ cursor: 'pointer' }} onClick={() => setMenuOpen(!menuOpen)}>{getInitials(user.name)}</div>

                                        <div className={`fab-menu ${menuOpen ? 'open' : ''}`} style={{
                                                top: '45px',
                                                bottom: 'auto',
                                                right: 0,
                                                width: '160px',
                                                opacity: menuOpen ? 1 : 0,
                                                transform: menuOpen ? 'none' : 'translateY(-8px) scale(0.97)',
                                                pointerEvents: menuOpen ? 'auto' : 'none',
                                                zIndex: 100
                                        }}>
                                                <button onClick={() => { setActivePage('profile'); setMenuOpen(false); }}>
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" /></svg>
                                                        Profile Settings
                                                </button>
                                                <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }}></div>
                                                <button onClick={onLogout} style={{ color: 'var(--danger)' }}>
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                                        Logout
                                                </button>
                                        </div>
                                </div>
                        </div>
                </div>
        );
}
