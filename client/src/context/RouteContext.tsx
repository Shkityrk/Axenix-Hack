import React, { createContext, useContext, useState } from 'react';
import { PathPoint } from './PathContext';

export interface RouteData {
	distance_km: number;
	duration_min: number;
	path: PathPoint[];
	type: string;
	price: number;
}

interface RouteContextType {
	route: RouteData | null;
	setRoute: (route: RouteData) => void;
	calculatePrice: (distance: number, type: string) => number;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const useRoute = () => {
	const context = useContext(RouteContext);
	if (!context) {
		throw new Error('useRoute must be used within a RouteProvider');
	}
	return context;
};

export const RouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [route, setRoute] = useState<RouteData | null>(null);

	const calculatePrice = (distance: number, type: string): number => {
		const baseRate = 10;
		let multiplier = 1;

		switch (type) {
			case 'car':
				multiplier = 0;
				break;
			case 'plane':
				multiplier = 5;
				break;
			case 'train':
				multiplier = 2;
				break;
			case 'bicycle':
				multiplier = 0.5;
				break;
			case 'foot':
				multiplier = 0;
				break;
			case 'taxi':
				multiplier = 5;
				break;
			default:
				multiplier = 0;
		}

		return Math.round(distance * baseRate * multiplier);
	};

	return (
		<RouteContext.Provider value={{ route, setRoute, calculatePrice }}>
			{children}
		</RouteContext.Provider>
	);
};
