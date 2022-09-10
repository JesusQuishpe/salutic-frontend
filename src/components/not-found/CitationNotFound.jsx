import { Result, Row } from 'antd'
import React from 'react'

export const CitationNotFound = () => {
	return (
		<Row
			justify='center'
			align='center'
			style={{ width: '100%', height: '100%' }}
		>
			<Result
				status='error'
				title='La cita no existe!'
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			/>
		</Row>
	)
}
