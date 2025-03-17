import React, { createContext, useContext, useState } from 'react';

export type PathPoint = {
	point_number: number;
	latitude: number;
	longitude: number;
};

type PathContextType = {
	path: PathPoint[];
	setPath: (path: PathPoint[]) => void;
};

const PathContext = createContext<PathContextType | undefined>(undefined);

export const usePath = () => {
	const context = useContext(PathContext);
	if (!context) {
		throw new Error('usePath must be used within a PathProvider');
	}
	return context;
};

export const PathProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [path, setPath] = useState<PathPoint[]>([]);

	return <PathContext.Provider value={{ path, setPath }}>{children}</PathContext.Provider>;
};
