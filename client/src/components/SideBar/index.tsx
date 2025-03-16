import { useEffect, useState } from 'react';
import Card from '../Card';
import TransportType from '../TransportType';
import style from './SideBar.module.css';
import { Carousel, DatePicker, List, Select } from 'antd';
import Points from '../Points';
import Icon from '../Icon';
import { ButtonHTMLAttributes } from 'react';
import { usePoints } from '../../context/PointsContext';

type ArrowProps = ButtonHTMLAttributes<HTMLButtonElement>;

const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
const options = [
	{
		value: '1',
		label: '1 человек',
	},
	{
		value: '2',
		label: '2 человека',
	},
	{
		value: '3',
		label: '3 человека',
	},
	{
		value: 'more',
		label: 'Более 3-х человек',
	},
];

const CustomPrevArrow: React.FC<ArrowProps> = (props) => {
	return (
		<button {...props} className={`${style.button} ${style.button_left}`}>
			<Icon src="./Button.svg" />
		</button>
	);
};

const CustomNextArrow: React.FC<ArrowProps> = (props) => {
	return (
		<button {...props} className={`${style.button} ${style.button_right}`}>
			<Icon src="./Button.svg" />
		</button>
	);
};

function SideBar() {
	const [sortBy, setSortBy] = useState<string>('time');
	const [loading, setLoading] = useState(false);
	const [pageSize, setPageSize] = useState<number>(3);
	const { points, setPoints } = usePoints();
	const [heights, setHeights] = useState<number[]>([]);

	const initializedPoints =
		points.length === 0
			? [
					{ lat: 0, lng: 0, address: '' },
					{ lat: 0, lng: 0, address: '' },
			  ]
			: points;

	const calculatePageSize = () => {
		const containerHeight = window.innerHeight;
		const cardHeight = 150;
		const newPageSize = Math.floor((containerHeight - 600) / cardHeight);
		console.log(newPageSize);
		setPageSize(newPageSize);
	};

	useEffect(() => {
		calculatePageSize();
	}, []);

	const fetchCoordinates = async () => {
		setLoading(true);
		try {
			const updatedPoints = await Promise.all(
				initializedPoints.map(async (point) => {
					if (!point.address) return point;
					const response = await fetch(
						`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
							point.address
						)}`
					);
					const data = await response.json();
					if (data.length > 0) {
						return { ...point, lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
					}
					return point;
				})
			);
			setPoints(updatedPoints);
		} catch (error) {
			console.error('Ошибка при получении координат:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSortByTime = () => {
		setSortBy('time');
	};

	const handleSortByPrice = () => {
		setSortBy('price');
	};

	const onChange = (value: string) => {
		console.log(`selected ${value}`);
	};

	const onSearch = (value: string) => {
		console.log('search:', value);
	};

	const shouldShowPagination = data.length > pageSize;

	useEffect(() => {
		const newHeights = Array.from(
			{ length: 14 },
			() => Math.floor(Math.random() * (76 - 40 + 1)) + 40
		);
		setHeights(newHeights);
	}, []);

	return (
		<aside className={style.sidebar}>
			<div className={style.sidebar_top}>
				<a style={{ cursor: 'pointer' }} href="/">
					<img src="./logo.svg" className={style.logo} alt="Логотип" />
				</a>
				<TransportType />
				<Points />
				<div className={style.flex_container}>
					<DatePicker
						placement={'bottomLeft'}
						placeholder="Когда"
						style={{
							width: 211,
							height: 40,
							fontFamily: 'Montserrat',
							backgroundColor: '#f6f6f6',
							border: 'none',
						}}
					/>
					<Select
						placeholder="Количество человек"
						optionFilterProp="label"
						defaultValue="1"
						onChange={onChange}
						onSearch={onSearch}
						options={options}
						style={{
							width: 211,
							height: 40,
							fontFamily: 'Montserrat',
						}}
					/>
				</div>
				<button onClick={fetchCoordinates} disabled={loading} className={style.submit}>
					{loading ? 'Загрузка...' : 'Поиск'}
				</button>
				<Carousel
					arrows
					infinite={true}
					draggable
					dots={false}
					prevArrow={<CustomPrevArrow />}
					nextArrow={<CustomNextArrow />}
					className={style.carousel}
				>
					<div>
						<div className={style.calendar__line}>
							{['20 чт', '21 пт', '22 сб', '23 вс', '24 пн', '25 вт', '26 ср'].map((day, index) => (
								<div key={index} className={style.day}>
									<div
										className={style.calendar__column}
										style={{ height: `${heights[index]}px` }}
									></div>
									<h3 className={style.calendar__text}>{day}</h3>
								</div>
							))}
						</div>
					</div>
					<div>
						<div className={style.calendar__line}>
							{['27 чт', '28 пт', '29 сб', '30 вс', '31 пн', '1 вт', '2 ср'].map((day, index) => (
								<div key={index} className={style.day}>
									<div
										className={style.calendar__column}
										style={{ height: `${heights[index + 7]}px` }}
									></div>
									<h3 className={style.calendar__text}>{day}</h3>
								</div>
							))}
						</div>
					</div>
				</Carousel>

				<div className={style.flex_container}>
					<button
						className={`${style.selection_button} ${
							sortBy === 'time' ? style.selected_button : ''
						}`}
						onClick={handleSortByTime}
					>
						<p>По времени</p>
						<img
							src="Sorting_1.svg"
							className={`${style.icon} ${sortBy === 'time' ? style.selected_icon : ''}`}
							alt="Сортировка по времени"
						/>
					</button>
					<button
						className={`${style.selection_button} ${
							sortBy === 'price' ? style.selected_button : ''
						}`}
						onClick={handleSortByPrice}
					>
						<p>По цене</p>
						<img
							src="Sorting_1.svg"
							className={`${style.icon} ${sortBy === 'price' ? style.selected_icon : ''}`}
							alt="Сортировка по цене"
						/>
					</button>
				</div>
			</div>
			<div className={style.sidebar_bottom}>
				<List
					split={false}
					pagination={shouldShowPagination ? { pageSize, align: 'center' } : false}
					dataSource={data}
					renderItem={() => (
						<List.Item style={{ padding: 0, margin: 0 }}>
							<Card />
						</List.Item>
					)}
				/>
			</div>
		</aside>
	);
}

export default SideBar;
