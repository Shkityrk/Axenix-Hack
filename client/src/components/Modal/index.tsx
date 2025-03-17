import React from 'react';
import { useModal } from '../../context/ModalContext';
import style from './Modal.module.css';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../Icon';

const Modal: React.FC = () => {
	const { isModalOpen, closeModal } = useModal();

	return (
		<AnimatePresence>
			{isModalOpen && (
				<motion.div
					className={style.back}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<div className={style.modal}>
						<button
							className={style.close}
							onClick={() => {
								closeModal();
							}}
						>
							<Icon src="Close.svg" />
						</button>
						<img src="./Laptop.png" alt="laptop" className={style.image} />
						<p className={style.text}>В разработке</p>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Modal;
