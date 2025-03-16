import React, { createContext, useContext, useState } from 'react';

type TransportContextType = {
	selectedTransport: string;
	setSelectedTransport: (transport: string) => void;
};

const TransportContext = createContext<TransportContextType | undefined>(undefined);

export const useTransport = () => {
	const context = useContext(TransportContext);
	if (!context) {
		throw new Error('useTransport must be used within a TransportProvider');
	}
	return context;
};

export const TransportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [selectedTransport, setSelectedTransport] = useState<string>('hybrid');

	return (
		<TransportContext.Provider value={{ selectedTransport, setSelectedTransport }}>
			{children}
		</TransportContext.Provider>
	);
};
