import './index.css';
import { useState, useEffect } from 'react';
import { ToastContainer, Bounce } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { getRoutesByRole } from './routes';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { refreshUserProfile } from '@/redux/slices/authSlice';
import { fetchProfile } from '@/redux/slices/profileSlice';
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
	// const [profile, setProfile] = useState<UserInfo | null>(null);
	// const [loading, setLoading] = useState(true);
	const dispatch = useAppDispatch();
	const { isAuthenticated } = useAppSelector(state => state.auth);
	const { profile, isLoading } = useAppSelector(state => state.profile);
	useEffect(() => {
		dispatch(fetchProfile());
	}, [dispatch, isAuthenticated]);

	if (isLoading) {
		return <div className='flex h-screen items-center justify-center'>Loading...</div>;
	}

	const role = profile?.resContractDTO?.roleName;
	const roleRoutes = getRoutesByRole(role);

	console.log(role);

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
