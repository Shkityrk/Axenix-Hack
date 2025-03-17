import React from 'react';
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	ZoomControl,
	useMapEvent,
	Polyline,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import style from './Map.module.css';
import L from 'leaflet';
import { usePoints } from '../../context/PointsContext';
import Overlay from '../Overlay';
import { usePath } from '../../context/PathContext'; // Импортируем usePath

// Типы для пропсов и состояний
interface MapClickHandlerProps {
	onMapClick: (lat: number, lng: number) => void;
}

interface Point {
	lat: number;
	lng: number;
	address: string;
}

interface AddressData {
	display_name: string;
}

// Кастомная иконка для маркера
const customIconStart = L.icon({
	iconUrl: './Point.svg', // Путь к SVG или PNG
	iconSize: [48, 48], // Размер иконки
	iconAnchor: [24, 48], // Точка привязки иконки (центр по горизонтали, низ по вертикали)
	popupAnchor: [0, -48], // Точка привязки всплывающего окна (над маркером)
});

const customIconEnd = L.icon({
	iconUrl: './Point_grey.svg', // Путь к SVG или PNG
	iconSize: [48, 48], // Размер иконки
	iconAnchor: [24, 48], // Точка привязки иконки (центр по горизонтали, низ по вертикали)
	popupAnchor: [0, -48], // Точка привязки всплывающего окна (над маркером)
});

// Компонент для обработки левого клика на карте
const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onMapClick }) => {
	useMapEvent('click', (e: L.LeafletMouseEvent) => {
		const { lat, lng } = e.latlng;
		onMapClick(lat, lng); // Передаем координаты в родительский компонент
	});
	return null;
};

const Map: React.FC = () => {
	const { points, addPoint, removePoint } = usePoints(); // Используем контекст точек
	const { path } = usePath(); // Используем контекст пути

	// Функция для получения адреса по координатам
	const getAddress = async (lat: number, lng: number): Promise<string> => {
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
			);
			const data: AddressData = await response.json();
			return data.display_name;
		} catch (error) {
			console.error('Ошибка при получении адреса:', error);
			return 'Адрес не найден';
		}
	};

	// Функция для обработки левого клика (добавление точки)
	const handleMapClick = async (lat: number, lng: number) => {
		const address = await getAddress(lat, lng); // Получаем адрес
		const newPoint: Point = { lat, lng, address }; // Создаем новую точку
		addPoint(newPoint); // Добавляем точку через контекст
	};

	// Преобразуем путь в массив координат для Polyline
	const pathPositions: [number, number][] = path.map((point) => [point.latitude, point.longitude]);

	return (
		<>
			<MapContainer
				center={[55.752004, 37.617734]}
				zoom={11}
				zoomControl={false}
				style={{ height: '100vh', width: 'calc(100% - 462px)', position: 'relative' }}
			>
				<TileLayer
					attribution="&copy; Axenix | Справка | Условия использования"
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{/* Отображаем маркеры для всех точек */}
				{points.map((point, index) => (
					<Marker
						icon={index === 0 ? customIconStart : customIconEnd}
						key={index}
						position={[point.lat, point.lng]}
						eventHandlers={{
							contextmenu: () => removePoint(index), // Удаляем точку при правом клике
						}}
					>
						<Popup>
							<b>Точка {index + 1}</b>
							<br />
							{point.address}
						</Popup>
					</Marker>
				))}

				{/* Отрисовываем путь, если он есть */}
				{path.length > 0 && (
					<Polyline positions={pathPositions} color="green" weight={3} opacity={0.7} />
				)}

				{/* Обработчик левого клика */}
				<MapClickHandler onMapClick={handleMapClick} />

				<ZoomControl position="bottomleft" />
			</MapContainer>
			<Overlay />
			<div className={style.hide}></div>
		</>
	);
};

export default Map;
