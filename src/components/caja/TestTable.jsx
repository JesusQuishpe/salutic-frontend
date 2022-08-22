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
			},
			{
				title: 'Prueba',
				dataIndex: 'name',
			},
			{
				title: 'Precio',
				dataIndex: 'price',
			},
			{
				title: 'Acciones',
				render: (_, record) => {
					const onClick = (record) => {
						if (deleteTest) {
							deleteTest(record.id)
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
