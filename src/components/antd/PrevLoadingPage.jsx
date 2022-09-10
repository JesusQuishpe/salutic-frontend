import { Spin } from 'antd'
import React from 'react'

export const PrevLoadingPage = () => {
	return (
		<Spin
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
			spinning
			tip='Cargando...'
		></Spin>
	)
}
