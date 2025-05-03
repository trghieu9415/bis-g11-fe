import './index.css';
import { useState, useEffect } from 'react';
import { ToastContainer, Bounce } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { getRoutesByRole } from './routes';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { refreshUserProfile } from '@/redux/slices/authSlice';
import NotFound from './pages/NotFound';

type ResContractDTO = {
	baseSalary: number;
	endDate: string;
	expiryDate: string;
	fullName: string;
	id: number;
	idString: string;
	levelName: string;
	roleName: string;
	salaryCoefficient: number;
	seniorityId: number;
	startDate: string;
	status: number;
	userId: number;
};

type UserInfo = {
	id: number;
	idString: string;
	fullName: string;
	email: string;
	phoneNumber: string;
	gender: 'MALE' | 'FEMALE' | string;
	dateOfBirth: string;
	address: string;
	username: string;
	createdAt: string;
	status: number;
	resContractDTO?: ResContractDTO;
};

function App() {
	const [profile, setProfile] = useState<UserInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const dispatch = useAppDispatch();
	const { isAuthenticated } = useAppSelector(state => state.auth);

	useEffect(() => {
		const loadProfile = async () => {
			const storedProfile = localStorage.getItem('profile');
			const accessToken = localStorage.getItem('accessToken');

			if (storedProfile) {
				setProfile(JSON.parse(storedProfile));
			}

			// If we have an access token but no profile in Redux, fetch it
			if (accessToken && isAuthenticated) {
				try {
					await dispatch(refreshUserProfile()).unwrap();
				} catch (error) {
					console.error('Failed to refresh profile:', error);
				}
			}

			setLoading(false);
		};

		loadProfile();

		// Listen for auth changes
		const handleAuthChange = () => {
			const storedProfile = localStorage.getItem('profile');
			if (storedProfile) {
				setProfile(JSON.parse(storedProfile));
			}
		};

		window.addEventListener('auth-change', handleAuthChange);
		return () => window.removeEventListener('auth-change', handleAuthChange);
	}, [dispatch, isAuthenticated]);

	if (loading) {
		return <div className='flex h-screen items-center justify-center'>Loading...</div>;
	}

	const role = profile?.resContractDTO?.roleName;
	const roleRoutes = getRoutesByRole(role);
	// console.log(roleRoutes);

	return (
		<Router>
			<Routes>
				{/* Handle initial redirect based on authentication */}
				<Route
					path='/'
					element={
						isAuthenticated ? (
							role === 'HR_MANAGER' ? (
								<Navigate to='/hr' />
							) : role === 'BUSINESS_MANAGER' ? (
								<Navigate to='/business' />
							) : role === 'WAREHOUSE_MANAGER' ? (
								<Navigate to='/warehouse' />
							) : (
								<Navigate to='/sales' />
							)
						) : (
							<Navigate to='/login' />
						)
					}
				/>

				{/* Map role-specific routes */}
				{roleRoutes.map((route, index) => {
					let Layout = route.layout;

					if (route.layout) {
						Layout = route.layout;
					} else if (route.layout === null) {
						Layout = ({ mainContent }) => <>{mainContent}</>;
					}

					return <Route key={index} path={route.path} element={<Layout mainContent={<route.component />} />} />;
				})}

				{/* 404 Route */}
				<Route path='*' element={<NotFound />} />
			</Routes>

			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='light'
				transition={Bounce}
			/>
		</Router>
	);
}

export default App;
