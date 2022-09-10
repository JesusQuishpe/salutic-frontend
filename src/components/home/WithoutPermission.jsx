import React from 'react'
import WarningIcon from '../../assets/png/advertencia.png'
import '../../css/WithoutPermission.css'

export const WithoutPermission = () => {
	return (
		<div className='permission-wrapper'>
			<div className='permission-content'>
				<img src={WarningIcon} />
				<span>El usuario no tiene permiso a este modulo</span>
			</div>
		</div>
	)
}
