import { useModal } from '../../context/ModalContext';
import Button from '../Button';
import Icon from '../Icon';
import style from './Card.module.css';

interface CardProps {
	distance?: number;
	time?: number;
	price?: number;
	type?: string;
}

function Card(props: CardProps) {
	const { distance, time, price } = props;
	const { openModal } = useModal();

	return (
		<div className={style.card}>
			<div className={style.left}>
				<div className={style.column_56}>
					<Icon src="Taxi.svg" />
					<Icon src="Foot.svg" />
					<Icon src="Plane.svg" />
				</div>
				<div className={style.column}>
					<p className={style.title}>Ваш транспорт</p>
					<span className={style.distance}>{distance} км</span>
					<a className={style.more} onClick={openModal}>
						Посмотреть подробнее
					</a>
					<Button content="Поехали" isHaveIcon={false} />
				</div>
			</div>
			<div className={style.column}>
				<p className={style.result}>{time} мин</p>
				<p className={style.result}>{price} руб.</p>
			</div>
		</div>
	);
}

export default Card;
