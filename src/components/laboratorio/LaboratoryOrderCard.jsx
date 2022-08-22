import { Card, Descriptions } from 'antd'
import React from 'react'

export const LaboratoryOrderCard = ({ data }) => {
	return (
		<Card title='Datos de la orden' bordered>
			<Descriptions title='' column={1}>
				<Descriptions.Item label='N° orden'>
					{data?.orderId}
				</Descriptions.Item>
				<Descriptions.Item label='Fecha'>
					{data?.date}
				</Descriptions.Item>
				<Descriptions.Item label='Hora'>{data?.hour}</Descriptions.Item>
				<Descriptions.Item label='N° pruebas'>
					{data?.orderItems}
				</Descriptions.Item>
				<Descriptions.Item label='Total'>
					{'$' + data?.orderTotal}
				</Descriptions.Item>
			</Descriptions>
		</Card>
	)
}
