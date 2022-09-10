import { Card, Table } from 'antd'
import React from 'react'
import { createDateFromString } from '../../utils/functions'

export const PendingOrdersCard = ({ orders, onOrderChange }) => {
	const columns = [
		{
			title: 'N° orden',
			dataIndex: 'id',
		},
		{
			title: 'Fecha',
			dataIndex: 'date',
			render: (_, record) => {
				return createDateFromString(record.date).format('DD/MM/YYYY')
			},
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
					pagination={{
						pageSize: 3,
					}}
					rowSelection={{
						type: 'radio',
						...rowSelection,
					}}
				/>
			</Card>
		</>
	)
}
