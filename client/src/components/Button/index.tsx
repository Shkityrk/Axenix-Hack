import Icon from "../Icon";
import style from "./Button.module.css"

interface ButtonProps{
	content: string;
	isHaveIcon: boolean;
	icon?: string
}

function Button(props: ButtonProps) {
const {content, isHaveIcon, icon} = props

	return ( 
	<button className={style.button}>
		{content}
		{isHaveIcon && <Icon src={icon || ""} isSelected={true}/>}
	</button> );
}

export default Button;