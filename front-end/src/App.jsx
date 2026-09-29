import React, { useState, useEffect } from 'react';

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

	// Subscriptions state
	const [subscriptions, setSubscriptions] = useState([]);
	const [loadingSubs, setLoadingSubs] = useState(true);
	const [expandedCards, setExpandedCards] = useState({});

	// Edit state
	const [editData, setEditData] = useState(null);

	// Delete confirm state
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [deleteLoading, setDeleteLoading] = useState(false);

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

	// ── Fetch subscriptions ──
	const fetchSubs = async () => {
		if (!isAuthenticated) return;
		try {
			const storedUser = localStorage.getItem('kept_user');
			if (storedUser) {
				const user = JSON.parse(storedUser);
				if (user.id) {
					const res = await fetch(`http://localhost:3000/api/subscriptions/${user.id}`);
					if (res.ok) {
						const data = await res.json();
						setSubscriptions(data.subscriptions || []);
					}
				}
			}
		} catch (e) {
			console.error('Error fetching subscriptions:', e);
		} finally {
			setLoadingSubs(false);
		}
	};

	useEffect(() => { fetchSubs(); }, [isAuthenticated]);

	// ── CRUD handlers ──
	const handleEdit = (sub) => {
		setEditData(sub);
		setAddModalOpen(true);
	};

	const handleEditDone = () => {
		setEditData(null);
		fetchSubs();
	};

	const handleDeleteRequest = (sub) => {
		setDeleteTarget(sub);
	};

	const handleDeleteConfirm = async () => {
		if (!deleteTarget) return;
		setDeleteLoading(true);
		try {
			const res = await fetch(`http://localhost:3000/api/subscriptions/${deleteTarget.id}`, { method: 'DELETE' });
			if (res.ok) {
				showToast(`"${deleteTarget.name}" deleted.`);
				fetchSubs();
			} else {
				showToast('Failed to delete.', 'error');
			}
		} catch (e) {
			showToast('An error occurred.', 'error');
		} finally {
			setDeleteLoading(false);
			setDeleteTarget(null);
		}
	};

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				setAddModalOpen(false);
				setConfirmModalOpen(false);
				setDeleteTarget(null);
				setFabOpen(false);
				setEditData(null);
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

	// Shared props
	const cardProps = { subscriptions, expandedCards, toggleCard, onEdit: handleEdit, onDelete: handleDeleteRequest };

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
						{...cardProps}
						setActivePage={setActivePage}
						setAddModalOpen={setAddModalOpen}
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
				{activePage === 'analytics'     && <Analytics activePage={activePage} subscriptions={subscriptions} setAddModalOpen={setAddModalOpen} />}
				{activePage === 'calendar'      && <Calendar subscriptions={subscriptions} />}
				{activePage === 'settings'      && <Settings showToast={showToast} />}
				{activePage === 'profile'       && <Profile setConfirmModalOpen={setConfirmModalOpen} showToast={showToast} />}
			</div>

			<Fab
				fabOpen={fabOpen}
				setFabOpen={setFabOpen}
				setAddModalOpen={setAddModalOpen}
				setActivePage={setActivePage}
			/>

			{/* Add / Edit modal — shared */}
			<AddModal
				addModalOpen={addModalOpen}
				setAddModalOpen={setAddModalOpen}
				showToast={showToast}
				onAdd={fetchSubs}
				editData={editData}
				onEditDone={handleEditDone}
				onAddSubscription={onAddSubscription}
			/>

			{/* Delete confirm */}
			{deleteTarget && !deleteTarget._account && (
				<div className="overlay open" onClick={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
					<div className="modal confirm-modal">
						<h3>Delete "{deleteTarget.name}"?</h3>
						<p className="sub">This subscription will be permanently removed. This action cannot be undone.</p>
						<div className="modal-actions">
							<button className="btn btn-ghost" onClick={() => setDeleteTarget(null)} disabled={deleteLoading}>Cancel</button>
							<button className="btn btn-danger" onClick={handleDeleteConfirm} disabled={deleteLoading}
								style={{ background: 'var(--danger)', color: '#1a0605', borderColor: 'var(--danger)' }}>
								{deleteLoading ? 'Deleting…' : 'Yes, delete'}
							</button>
						</div>
					</div>
				</div>
			)}

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
