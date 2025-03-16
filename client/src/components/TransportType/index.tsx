import Icon from '../Icon';
import style from './TransportType.module.css';
import { useModal } from '../../context/ModalContext';
import { useTransport } from '../../context/TransportContext';

function TransportType() {
	// const [selectedTransport, setSelectedTransport] = useState<string>('hybrid');
	const { selectedTransport, setSelectedTransport } = useTransport();
	const { openModal } = useModal();

	const handleTransportClick = (transport: string) => {
		if (transport === 'metro') {
			transport = 'hybrid';
			openModal();
		}
		setSelectedTransport(transport);
	};

	const transports = [
		{ id: 'hybrid', src: 'Hybrid.svg', label: 'Гибрид' },
		{ id: 'car', src: 'Car.svg' },
		{ id: 'bus', src: 'Bus.svg' },
		{ id: 'foot', src: 'Foot.svg' },
		{ id: 'bicycle', src: 'Bicycle.svg' },
		{ id: 'scooter', src: 'Scooter.svg' },
		{ id: 'taxi', src: 'Taxi.svg' },
		{ id: 'plane', src: 'Plane.svg' },
		{ id: 'electric_train_1', src: 'Electric_train_1.svg' },
		{ id: 'electric_train_2', src: 'Electric_train_2.svg' },
		{ id: 'metro', src: 'Metro.svg' },
	];

	return (
		<div className={style.container}>
			{transports.map((transport) => (
				<div
					key={transport.id}
					className={`${style.transportItem} ${
						selectedTransport === transport.id ? style.selected : ''
					}`}
					onClick={() => handleTransportClick(transport.id)}
				>
					<Icon src={transport.src} isSelected={selectedTransport === transport.id} />
					{transport.label && <p className={style.text}>{transport.label}</p>}
				</div>
			))}
		</div>
	);
}

export default TransportType;
