import style from "./Icon.module.css"

interface IconProps {
	src: string
	isSelected?: boolean
}

function Icon(props: IconProps) {
	const {src, isSelected} = props

	return (
		<div className={style.container}>
			<img src={src} className={`${style.icon} ${isSelected && style.selected}`}/>
		</div>
	 );
}

export default Icon;