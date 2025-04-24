import './index.css';
import { useState, useEffect } from 'react';
import { ToastContainer, Bounce } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { getRoutesByRole } from './routes';

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
	useEffect(() => {
		const storedProfile = localStorage.getItem('profile');
		if (storedProfile) {
			setProfile(JSON.parse(storedProfile));
		}
	}, []);

	const role = profile?.resContractDTO?.roleName;
	const roleRoutes = getRoutesByRole(role);
	console.log(roleRoutes);

	return (
		<Router>
			<Routes>
				{roleRoutes.map((route, index) => {
					let Layout = route.layout;

					if (route.layout) {
						Layout = route.layout;
					} else if (route.layout === null) {
						Layout = ({ mainContent }) => <>{mainContent}</>;
					}

					return <Route key={index} path={route.path} element={<Layout mainContent={<route.component />} />} />;
				})}

				<Route
					path='*'
					element={
						<div className='m-8'>
							<Alert variant='destructive'>
								<AlertCircle className='h-4 w-4' />
								<AlertTitle>Lỗi</AlertTitle>
								<AlertDescription>
									Trang bạn đang tìm không tồn tại hoặc không đủ quyền truy cập. Vui lòng kiểm tra lại đường dẫn hoặc
									vào lại{' '}
									<a href='/' className='text-blue-400 underline'>
										trang chủ
									</a>
									.
								</AlertDescription>
							</Alert>
						</div>
					}
				/>
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
