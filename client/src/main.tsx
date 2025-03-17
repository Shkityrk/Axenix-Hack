import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ModalProvider } from './context/ModalContext.tsx';
import { TransportProvider } from './context/TransportContext.tsx';
import { PathProvider } from './context/PathContext.tsx';
import { RouteProvider } from './context/RouteContext.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ModalProvider>
			<TransportProvider>
				<PathProvider>
					<RouteProvider>
						<App />
					</RouteProvider>
				</PathProvider>
			</TransportProvider>
		</ModalProvider>
	</StrictMode>
);
