import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';
import './index.css';

import { fetchProfile } from '@/redux/slices/profileSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import NotFound from './pages/NotFound';
import { getRoutesByRole } from './routes';
import { logoutUser } from './redux/slices/authSlice';
import { getMe } from './services/userService';

function App() {
	const dispatch = useAppDispatch();
	const { isAuthenticated } = useAppSelector(state => state.auth);
	const { profile } = useAppSelector(state => state.profile);
	const [isRedirecting, setIsRedirecting] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isAuthenticated && !isRedirecting) {
			setIsLoading(true);
			dispatch(fetchProfile()).then(() => {
				setIsLoading(false);
			});
		}
	}, [dispatch, isAuthenticated, isRedirecting]);

	useEffect(() => {
		if (isAuthenticated && !profile && !isLoading && !isRedirecting) {
			setIsLoading(true);
			const accessToken = localStorage.getItem('accessToken');

			if (!accessToken) {
				console.log('No access token found, redirecting to login');
				setIsRedirecting(true);
				dispatch(logoutUser()).then(() => {
					window.location.href = '/login';
				});
				return;
			}

			const checkAccessTokenExpired = async () => {
				try {
					const response = await getMe();
					if (!response || !response.id) {
						setIsRedirecting(true);
						dispatch(logoutUser()).then(() => {
							window.location.href = '/login';
						});
					}
				} catch (error) {
					console.error('Error fetching profile:', error);
					setIsRedirecting(true);
					dispatch(logoutUser()).then(() => {
						window.location.href = '/login';
					});
				}
			};

			checkAccessTokenExpired();
			setIsLoading(false);
		}
	}, [profile, dispatch, isAuthenticated, isLoading, isRedirecting]);

	if (isLoading) {
		return <div className='flex h-screen items-center justify-center'>Loading...</div>;
	}

	const role = profile?.resContractDTO?.roleName;
	const roleRoutes = getRoutesByRole(role);

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
							) : role === 'EMPLOYEE' ? (
								<Navigate to='/employee' />
							) : role === 'ADMIN' ? (
								<Navigate to='/hr' />
							) : (
								<Navigate to='/employee' />
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
