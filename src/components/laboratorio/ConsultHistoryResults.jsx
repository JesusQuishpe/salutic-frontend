import { Button, Card, Popconfirm, Space, Table } from 'antd'
import React from 'react'

import {
	EditOutlined,
	DeleteOutlined,
	FilePdfOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useFetchLaboratoryResults } from '../../hooks/useFetchLaboratoryResults'
import { END_POINT } from '../../utils/conf'
import CustomFilterSearch from '../qr/CustomFilterSearch'

export const ConsultHistoryResults = () => {
	const {
		formRef,
		results,
		loading,
		handleDeleteClick,
		handleSubmitSearch,
		updatePage,
	} = useFetchLaboratoryResults()

	const columns = [
		{
			title: 'Id',
			dataIndex: 'id',
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
						<Link to={`${record.id}/editar`}>
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
			<h2>Consulta de resultados</h2>
			<CustomFilterSearch
				ref={formRef}
				placeholder='Cédula del paciente'
				allowClear
				onSearch={handleSubmitSearch}
				cardType='inner'
			/>
			<Card title='Resultados' type='inner'>
				<Table
					columns={columns}
					dataSource={results?.result}
					rowKey={(record) => record.orderId}
					loading={loading}
					pagination={{
						total: results?.pagination?.total || 0,
						current: results?.pagination?.currentPage || 1,
						pageSize: results?.pagination?.perPage || 10,
						onChange: updatePage,
					}}
				/>
			</Card>
		</>
	)
}
