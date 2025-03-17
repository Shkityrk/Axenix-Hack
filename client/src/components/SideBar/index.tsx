// src/components/SideBar.tsx
import { useEffect, useState } from 'react';
import Card from '../Card';
import TransportType from '../TransportType';
import style from './SideBar.module.css';
import { Carousel, DatePicker, List, Select } from 'antd';
import Points from '../Points';
import Icon from '../Icon';
import { ButtonHTMLAttributes } from 'react';
import { usePoints } from '../../context/PointsContext';
import { useTransport } from '../../context/TransportContext';
import { usePath } from '../../context/PathContext';
import moment from 'moment';
import { fetchCoordinates } from '../../api/api';
import { useRoute } from '../../context/RouteContext'; // Импортируем useRoute
import dayjs from 'dayjs';

type ArrowProps = ButtonHTMLAttributes<HTMLButtonElement>;

export interface WithPath {
	path: { latitude: number; longitude: number }[];
}

const data = [{ id: 1 }];
const options = [
	{ value: '1', label: '1 человек' },
	{ value: '2', label: '2 человека' },
	{ value: '3', label: '3 человека' },
	{ value: 'more', label: 'Более 3-х человек' },
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
	const { setPath } = usePath();
	const { selectedTransport } = useTransport();
	const [heights, setHeights] = useState<number[]>([]);
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const { route, setRoute, calculatePrice } = useRoute(); // Используем контекст

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
		setPageSize(newPageSize);
	};

	useEffect(() => {
		calculatePageSize();
	}, []);

	const handleDateChange = (date: moment.Moment | null) => {
		if (date) {
			const formattedDate = date.format('DD.MM.YYYY');
			setSelectedDate(formattedDate);
		} else {
			setSelectedDate(null);
		}
	};

	const handleFetchCoordinates = async () => {
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

			const routeData = await fetchCoordinates({
				points: updatedPoints,
				selectedTransport,
				selectedDate,
			});

			const price = calculatePrice(routeData.distance_km, selectedTransport);

			// Сохраняем данные о маршруте в контекст
			setRoute({
				...routeData,
				type: selectedTransport,
				price,
			});

			setPath(routeData.path);
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

	const dateFormat = 'DD.MM.YYYY'; // Новый формат даты

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
						minDate={dayjs()}
						onChange={handleDateChange}
						format={dateFormat}
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
				<button onClick={handleFetchCoordinates} disabled={loading} className={style.submit}>
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
							{route && (
								<Card
									distance={route?.distance_km}
									time={route?.duration_min}
									price={route?.price}
									type="car"
								/>
							)}
						</List.Item>
					)}
				/>
			</div>
		</aside>
	);
}

export default SideBar;
