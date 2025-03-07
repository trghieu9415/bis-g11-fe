import './index.css';
import { ToastContainer, Bounce } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HREmployees from './pages/dashboard/HREmployees';

import DashboardLayout from '@/layouts/dashboard-layout';
import { publicRoutes } from './routes';

function App() {
	return (
		<Router>
			<Routes>
				{publicRoutes.map((route, index) => {
					let Layout = DashboardLayout;

					if (route.layout) {
						Layout = route.layout;
					} else if (route.layout === null) {
						Layout = ({ mainContent }) => <>{mainContent}</>;
					}

					return <Route key={index} path={route.path} element={<Layout mainContent={<route.component />} />} />;
				})}
			</Routes>
		</Router>
		// <HREmployees />

		// <ToastContainer
		// 	position='top-right'
		// 	autoClose={5000}
		// 	hideProgressBar={false}
		// 	newestOnTop={false}
		// 	closeOnClick={false}
		// 	rtl={false}
		// 	pauseOnFocusLoss
		// 	draggable
		// 	pauseOnHover
		// 	theme='light'
		// 	transition={Bounce}
		// />
	);
}

export default App;
