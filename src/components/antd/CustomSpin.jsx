import { Spin } from 'antd'
import React from 'react'
import { createPortal } from 'react-dom'
import '../../css/CustomSpin.css'
import { useLoader } from '../../hooks/useLoader'

export const CustomSpin = () => {
	const { visible, tip } = useLoader()
	if (!visible) {
		return null
	}
	return createPortal(
		<div className='custom-spin-wrapper'>
			<div className='custom-spin-content'>
				<Spin tip={tip} spinning={visible} />
			</div>
		</div>,
		document.getElementById('loader')
	)
}
