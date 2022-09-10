import { DeleteOutlined } from '@ant-design/icons'
import { Button, Col, Table, Typography } from 'antd'
import React, { useMemo } from 'react'

const { Title } = Typography

const TestTable = ({ tests, deleteTest }) => {
	const columns = useMemo(() => {
		return [
			{
				title: 'Código',
				dataIndex: 'code',
				onCell: (record, index) => {
					if (record.children) {
						return {
							colSpan: 1,
						}
					}
					return { colSpan: 2 }
				},
				render: (_, record) => {
					return record.children ? '' : record.code
				},
			},
			{
				title: 'Prueba',
				dataIndex: 'name',
				onCell: (record, index) => {
					console.log(index)
					if (record.children) {
						return {
							colSpan: 4,
						}
					}
					return { colSpan: 2 }
				},
			},
			{
				title: 'Precio',
				dataIndex: 'price',
				onCell: (record, index) => {
					console.log(record)
					if (record.children) {
						return {
							colSpan: 0,
						}
					}
					return { colSpan: 2 }
				},
				render: (_, record) => {
					return record.children ? '' : '$' + record.price
				},
			},
			{
				title: 'Acciones',
				onCell: (record, index) => {
					if (record.children) {
						return { colSpan: 0 }
					}
					return { colSpan: 2 }
				},
				render: (_, record) => {
					const onClick = (record) => {
						if (deleteTest) {
							deleteTest(record)
						}
					}

					return (
						<Button
							type='primary'
							danger
							onClick={() => onClick(record)}
						>
							<DeleteOutlined />
						</Button>
					)
				},
			},
		]
	}, [deleteTest])

	return (
		<Col span={16}>
			<Title level={4} type='secondary'>
				Pruebas seleccionadas
			</Title>
			<Table
				size='small'
				columns={columns}
				dataSource={tests}
				pagination
				scroll={{
					x: 0,
					y: 500,
				}}

				//disabled={!showLaboratorioInfo}
			/>
		</Col>
	)
}
export default React.memo(TestTable)
