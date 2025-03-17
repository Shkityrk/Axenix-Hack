import { createContext, useState, useContext, ReactNode } from 'react';

// Типы для контекста
type ModalContextType = {
	isModalOpen: boolean;
	openModal: () => void;
	closeModal: () => void;
};

// Создаем контекст с начальным значением
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Тип для провайдера
type ModalProviderProps = {
	children: ReactNode;
};

// Провайдер для контекста
export const ModalProvider = ({ children }: ModalProviderProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	return (
		<ModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
			{children}
		</ModalContext.Provider>
	);
};

// Хук для использования контекста
export const useModal = () => {
	const context = useContext(ModalContext);
	if (context === undefined) {
		throw new Error('useModal must be used within a ModalProvider');
	}
	return context;
};
