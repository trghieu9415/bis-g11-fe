import { useEffect } from 'react';
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
	// const [profile, setProfile] = useState<UserInfo | null>(null);
	// const [loading, setLoading] = useState(true);
	const dispatch = useAppDispatch();
	const { isAuthenticated } = useAppSelector(state => state.auth);
	const { profile, isLoading } = useAppSelector(state => state.profile);
	useEffect(() => {
		dispatch(fetchProfile());
	}, [dispatch, isAuthenticated]);

	useEffect(() => {
		if (!profile) {
			// Refresh token
			// But we don't have a refresh token
			// So we need to logout
			const accessToken = localStorage.getItem('accessToken');
			if (!accessToken) {
				dispatch(logoutUser());
				<Navigate to='/login' />;
			}

			const checkAccessTokenExpired = async () => {
				try {
					const response = await getMe();
					if (!response.id) {
						dispatch(logoutUser());
						<Navigate to='/login' />;
					}
				} catch (error) {
					console.error('Error fetching profile:', error);
					dispatch(logoutUser());
					<Navigate to='/login' />;
				}
			};

			checkAccessTokenExpired();
		}
	}, [profile, dispatch]);

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
