import React from 'react';
import { useModal } from '../../context/ModalContext';
import style from './Overlay.module.css';
import Icon from '../Icon';

const Overlay: React.FC = () => {
	const { openModal } = useModal();

	return (
		<div className={style.container}>
			<div className={style.chat_bot} onClick={openModal}>
				<img src="./Logo_mini.svg" alt="logo" />
			</div>
			<div className={style.menu}>
				<div className={style.block}>
					<button className={style.button} onClick={openModal}>
						<Icon src="./Bus.svg"></Icon>
					</button>
					<button className={style.button} onClick={openModal}>
						<Icon src="./Hart.svg"></Icon>
					</button>
				</div>
				<div className={style.block}>
					<button className={style.button} onClick={openModal}>
						<Icon src="./Layer.svg"></Icon>
					</button>
					<button className={style.button} onClick={openModal}>
						<Icon src="./Dots.svg"></Icon>
					</button>
				</div>
				<div className={style.avatar}>
					<button className={style.button} onClick={openModal}>
						<img src="./Avatar.png" alt="avatar"></img>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Overlay;
