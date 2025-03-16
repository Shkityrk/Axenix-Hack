import { useModal } from '../../context/ModalContext';
import Button from '../Button';
import Icon from '../Icon';
import style from './Card.module.css';

function Card() {
	const { openModal } = useModal();

	return (
		<div className={style.card}>
			<div className={style.left}>
				<div className={style.column_56}>
					<Icon src="Car.svg" />
				</div>
				<div className={style.column}>
					<p className={style.title}>На такси + пешком</p>
					<span className={style.distance}>71 км</span>
					<a className={style.more} onClick={openModal}>
						Посмотреть подробнее
					</a>
					<Button content="Поехали" isHaveIcon={false} />
				</div>
			</div>
			<div className={style.column}>
				<p className={style.result}>1 ч 42 мин</p>
				<p className={style.result}>58 000 руб.</p>
			</div>
		</div>
	);
}

export default Card;
