import { Result, Row } from 'antd'
import React from 'react'

export const CitationWarning = ({ message }) => {
	return (
		<Row
			justify='center'
			align='center'
			style={{ width: '100%', height: '100%' }}
		>
			<Result
				status='error'
				title={message}
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
