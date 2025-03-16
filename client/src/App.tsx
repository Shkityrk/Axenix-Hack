import './App.css';
import SideBar from './components/SideBar';
import Map from './components/Map';
import { ConfigProvider } from 'antd';
import { PointsProvider } from './context/PointsContext';
import Modal from './components/Modal';
// import { ModalProvider } from './context/ModalContext';

function App() {
	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#F37022',
					fontFamily: 'Montserrat',
				},
			}}
		>
			<PointsProvider>
				<main className="main">
					<SideBar />
					<Map />
				</main>
				<Modal />
			</PointsProvider>
		</ConfigProvider>
	);
}

export default App;
