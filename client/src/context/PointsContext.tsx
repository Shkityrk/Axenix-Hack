import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Point {
	lat: number;
	lng: number;
	address: string;
}

interface PointsContextType {
	points: Point[];
	addPoint: (point: Point) => void;
	removePoint: (index: number) => void;
	setPoints: (points: Point[]) => void;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export const PointsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [points, setPoints] = useState<Point[]>([]);

	const addPoint = (point: Point) => {
		setPoints((prev) => [...prev, point]);
	};

	const removePoint = (index: number) => {
		setPoints((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<PointsContext.Provider value={{ points, addPoint, removePoint, setPoints }}>
			{children}
		</PointsContext.Provider>
	);
};

export const usePoints = () => {
	const context = useContext(PointsContext);
	if (!context) {
		throw new Error('usePoints must be used within a PointsProvider');
	}
	return context;
};
