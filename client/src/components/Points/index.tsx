import { usePoints } from '../../context/PointsContext';
import style from './Points.module.css';
import Icon from '../Icon';

function Points() {
	const { points, addPoint, removePoint, setPoints } = usePoints(); // Используем контекст

	// Если points пустой, инициализируем его двумя пустыми точками
	const initializedPoints =
		points.length === 0
			? [
					{ lat: 0, lng: 0, address: '' },
					{ lat: 0, lng: 0, address: '' },
			  ]
			: points;

	const handleAddPoint = () => {
		addPoint({ lat: 0, lng: 0, address: '' });
	};

	const handleRemovePoint = (index: number) => {
		removePoint(index);
	};

	const handleResetPoints = () => {
		setPoints([]);
	};

	const handleAddressChange = (index: number, value: string) => {
		const newPoints = [...initializedPoints];
		newPoints[index].address = value;
		setPoints(newPoints);
	};

	return (
		<>
			<div>
				{initializedPoints.map((point, index) => (
					<div key={index} className={style.flex_container} style={{ justifyContent: 'left' }}>
						<div
							className={`${style.dot} ${index === 0 ? style.dot_orange : style.dot_grey}`}
						></div>
						<input
							type="text"
							placeholder={index === 0 ? 'Откуда' : 'Куда'}
							value={point.address}
							onChange={(e) => handleAddressChange(index, e.target.value)}
							className={`${style.input} ${style.input_address}`}
						/>
						{index > 1 && (
							<button onClick={() => handleRemovePoint(index)} className={style.button_remove}>
								<Icon src="Close.svg" />
							</button>
						)}
					</div>
				))}
			</div>
			<div className={style.flex_container}>
				<button className={style.button_grey} onClick={handleAddPoint}>
					Добавить
				</button>
				<button className={style.button_grey} onClick={handleResetPoints}>
					Сбросить
				</button>
			</div>
		</>
	);
}

export default Points;
