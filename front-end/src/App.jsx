import React, { useState, useEffect } from 'react';
import { subscriptionsData } from './data';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import SubscriptionList from './components/SubscriptionList';
import Analytics from './components/Analytics';
import Calendar from './components/Calendar';
import Settings from './components/Settings';
import Profile from './components/Profile';
import Fab from './components/Fab';
import AddModal from './components/AddModal';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import BottomNav from './components/BottomNav';
import { isSessionValid, clearSession, saveSession } from './utils/session';

export default function App() {
	// Initialize auth state by checking session validity on every load
	const [isAuthenticated, setIsAuthenticated] = useState(() => isSessionValid());
	const [userMail, setUserMail] = useState(() => {
		try {
			const u = localStorage.getItem('kept_user');
			return u ? JSON.parse(u)?.mail || 'user@example.com' : 'user@example.com';
		} catch {
			return 'user@example.com';
		}
	});

	const [activePage, setActivePage] = useState('dashboard');
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [fabOpen, setFabOpen] = useState(false);
	const [addModalOpen, setAddModalOpen] = useState(false);
	const [confirmModalOpen, setConfirmModalOpen] = useState(false);
	const [toastMsg, setToastMsg] = useState(null);
	const [toastType, setToastType] = useState('success');

	const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

	const [subscriptions, setSubscriptions] = useState(subscriptionsData);
	const [expandedCards, setExpandedCards] = useState({});

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}, [theme]);

	const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

	const toggleCard = (id) => setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
	const showToast = (msg, type = 'success') => {
		setToastType(type);
		setToastMsg(msg);
		setTimeout(() => setToastMsg(null), 2800);
	};

	const onAddSubscription = (newSub) => {
		setSubscriptions(prev => [newSub, ...prev]);
	};

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				setAddModalOpen(false);
				setConfirmModalOpen(false);
				setFabOpen(false);
			}
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				showToast('Search — press Esc to close', 'info');
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	const handleLogin = (user) => {
		saveSession();
		setIsAuthenticated(true);
		if (user && user.mail) {
			setUserMail(user.mail);
		}
	};

	if (!isAuthenticated) {
		return <Auth onLogin={handleLogin} showToast={showToast} />;
	}

	const handleLogout = () => {
		clearSession();
		setIsAuthenticated(false);
		setActivePage('dashboard');
		showToast('Signed out successfully', 'info');
	};

	return (
		<div className="shell">
			<Sidebar
				sidebarCollapsed={sidebarCollapsed}
				setSidebarCollapsed={setSidebarCollapsed}
				activePage={activePage}
				setActivePage={setActivePage}
			/>
			<div className="main">
				<Topbar theme={theme} toggleTheme={toggleTheme} setActivePage={setActivePage} onLogout={handleLogout} />

				{activePage === 'dashboard' && (
					<Dashboard 
						subscriptions={subscriptions} 
						expandedCards={expandedCards} 
						toggleCard={toggleCard} 
						setActivePage={setActivePage} 
					/>
				)}
				{activePage === 'subscriptions' && (
					<SubscriptionList 
						subscriptions={subscriptions}
						setSubscriptions={setSubscriptions}
						expandedCards={expandedCards} 
						toggleCard={toggleCard} 
						setAddModalOpen={setAddModalOpen} 
						showToast={showToast}
						userEmail={userMail}
						onAddSubscription={onAddSubscription}
					/>
				)}
				{activePage === 'analytics' && <Analytics activePage={activePage} subscriptions={subscriptions} />}
				{activePage === 'calendar' && <Calendar subscriptions={subscriptions} />}
				{activePage === 'settings' && <Settings showToast={showToast} />}
				{activePage === 'profile' && <Profile setConfirmModalOpen={setConfirmModalOpen} showToast={showToast} />}
			</div>

			<Fab
				fabOpen={fabOpen}
				setFabOpen={setFabOpen}
				setAddModalOpen={setAddModalOpen}
				setActivePage={setActivePage}
			/>

			<AddModal 
				addModalOpen={addModalOpen} 
				setAddModalOpen={setAddModalOpen} 
				showToast={showToast}
				onAddSubscription={onAddSubscription}
			/>
			<ConfirmModal 
				confirmModalOpen={confirmModalOpen} 
				setConfirmModalOpen={setConfirmModalOpen} 
				showToast={showToast} 
			/>
			<Toast toastMsg={toastMsg} toastType={toastType} />
			<BottomNav activePage={activePage} setActivePage={setActivePage} />
		</div>
	);
}
