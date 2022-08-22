import {
	Button,
	Card,
	DatePicker,
	Form,
	Input,
	Popconfirm,
	Row,
	Space,
	Table,
} from 'antd'
import React, { useState } from 'react'
import CustomSearch from '../qr/CustomSearch'
import {
	EditOutlined,
	DeleteOutlined,
	FilePdfOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useFetchLaboratoryResults } from '../../hooks/useFetchLaboratoryResults'
import { END_POINT } from '../../utils/conf'

export const ConsultHistoryResults = () => {
	const [form] = Form.useForm()
	const { results, loading, handleDeleteClick, searchResults } =
		useFetchLaboratoryResults()

	const columns = [
		{
			title: 'N° orden',
			dataIndex: 'orderId',
		},
		{
			title: 'Paciente',
			dataIndex: 'patient',
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
			title: 'Acciones',
			render: (_, record) => {
				return (
					<Space>
						<Button
							danger
							href={END_POINT + `resultado/pdf/${record.orderId}`}
							target='_blank'
						>
							<FilePdfOutlined />
						</Button>
						<Link to={`${record.orderId}/editar`}>
							<Button type='primary'>
								<EditOutlined />
							</Button>
						</Link>
						<Popconfirm
							title='Está seguro de eliminar?'
							onConfirm={() => handleDeleteClick(record.id)}
							okButtonProps={{
								loading,
							}}
							//onCancel={() => setVisible(false)}
						>
							<Button type='primary' danger>
								<DeleteOutlined />
							</Button>
						</Popconfirm>
					</Space>
				)
			},
		},
	]

	return (
		<>
			{/*<Row style={{ marginBottom: '10px' }}>
				<Form layout='inline' form={form}>
					<Form.Item label='Desde' name='startDate'>
						<DatePicker />
					</Form.Item>
					<Form.Item label='Hasta' name='endDate'>
						<DatePicker />
					</Form.Item>
				</Form>
  </Row>*/}
			<Card title='Consulta de resultados'>
				<CustomSearch
					placeholder='Buscar por número de cédula'
					onSearch={searchResults}
					showReloadButton={false}
					allowClear
				/>
				<Table
					columns={columns}
					dataSource={results}
					rowKey={(record) => record.orderId}
				/>
			</Card>
		</>
	)
}
