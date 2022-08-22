import { Card, Table } from 'antd'
import React from 'react'

export const PendingOrdersCard = ({ orders, onOrderChange }) => {
	const columns = [
		{
			title: 'N° orden',
			dataIndex: 'id',
		},
		{
			title: 'Fecha',
			dataIndex: 'date',
		},
		{
			title: 'Hora',
			dataIndex: 'hour',
		},
		{
			title: 'Pruebas',
			dataIndex: 'testItems',
		},
	]

	const rowSelection = {
		onChange: (_, selectedRows) => {
			onOrderChange(selectedRows[0])
		},
	}

	return (
		<>
			<Card title='Órdenes pendientes' bordered>
				<Table
					size='small'
					columns={columns}
					dataSource={orders}
					rowKey={(record) => record.id}
					rowSelection={{
						type: 'radio',
						...rowSelection,
					}}
				/>
			</Card>
		</>
	)
}
