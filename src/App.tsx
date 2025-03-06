import './index.css';
import { ToastContainer, Bounce } from 'react-toastify';
import HREmployees from './pages/dashboard/HREmployees';

function App() {
	return (
		<>
			<HREmployees />
			{/* <div>HELLO</div> */}

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
		</>
	);
}

export default App;
