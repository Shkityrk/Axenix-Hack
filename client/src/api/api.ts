import { WithPath } from '../components/SideBar';
import { RouteData } from '../context/RouteContext';

interface FetchCoordinatesParams {
	points: { lat: number; lng: number }[];
	selectedTransport: string;
	selectedDate: string | null;
}

interface WithMin {
	duration_min: number;
}

export const fetchCoordinates = async ({
	points,
	selectedTransport,
	selectedDate,
}: FetchCoordinatesParams): Promise<RouteData> => {
	try {
		let url = '';
		const body = {
			start: {
				latitude: points[0].lat,
				longitude: points[0].lng,
			},
			end: {
				latitude: points[1].lat,
				longitude: points[1].lng,
			},
			date: '14.04.2025',
		};

		if (
			selectedTransport === 'hybrid' ||
			selectedTransport === 'car' ||
			selectedTransport === 'taxi'
		) {
			url = 'http://localhost:8001/locate/car';
		} else if (selectedTransport === 'plane') {
			url = 'http://localhost:8001/locate/plane';
			body.date = selectedDate || '18.03.2025';
		} else if (selectedTransport === 'foot') {
			url = 'http://localhost:8001/locate/foot';
		} else if (
			selectedTransport === 'electric_train_1' ||
			selectedTransport === 'electric_train_2'
		) {
			url = 'http://localhost:8001/locate/train';
			body.date = selectedDate || '18.03.2025';
		} else if (selectedTransport === 'bicycle' || selectedTransport === 'scooter') {
			url = 'http://localhost:8001/locate/bike';
		} else {
			throw new Error('Неизвестный тип транспорта');
		}

		console.log(body);

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			throw new Error('Ошибка при выполнении запроса');
		}

		const data = await response.json();

		console.log(data);

		if (
			selectedTransport === 'plane' ||
			selectedTransport === 'electric_train_1' ||
			selectedTransport === 'electric_train_2'
		) {
			return {
				distance_km: 1488,
				duration_min: Math.floor(
					data.reduce((count: number, item: WithMin) => item.duration_min + count, 0)
				),
				path: data.flatMap((item: WithPath) => item.path),
				type: selectedTransport,
				price: 0,
			};
		} else {
			return {
				distance_km: Math.floor(data.distance_km),
				duration_min: Math.floor(data.duration_min),
				path: data.path,
				type: selectedTransport,
				price: 0,
			};
		}
	} catch (error) {
		console.error('Ошибка при получении координат:', error);
		throw error;
	}
};
