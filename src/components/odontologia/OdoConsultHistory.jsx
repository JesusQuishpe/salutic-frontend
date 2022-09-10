import { Button, Card, Popconfirm, Space, Table } from 'antd'
import React from 'react'

import {
	EditOutlined,
	DeleteOutlined,
	FilePdfOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useFetchOdontologyHistory } from '../../hooks/useFetchOdontologyHistory'
import CustomFilterSearch from '../qr/CustomFilterSearch'
import { END_POINT } from '../../utils/conf'
import { createDateFromString } from '../../utils/functions'

export const OdoConsultHistory = () => {
	const {
		formRef,
		results,
		loading,
		handleDeleteClick,
		handleSubmitSearch,
		updatePage,
	} = useFetchOdontologyHistory()

	const columns = [
		{
			title: 'N° cita',
			dataIndex: 'appoId',
		},
		{
			title: 'Paciente',
			dataIndex: 'patient',
		},
		{
			title: 'Fecha',
			dataIndex: 'date',
			render: (_, record) => {
				console.log(record)
				return createDateFromString(record.date).format('DD/MM/YYYY')
			},
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
							href={END_POINT + `odontologia/pdf/${record.recId}`}
							target='_blank'
						>
							<FilePdfOutlined />
						</Button>
						<Link to={`/odontologia/citas/${record.recId}/editar`}>
							<Button type='primary'>
								<EditOutlined />
							</Button>
						</Link>
						<Popconfirm
							title='Está seguro de eliminar?'
							onConfirm={() => handleDeleteClick(record.recId)}
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
			<h2>Consultar historial</h2>
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
					rowKey={(record) => record.appoId}
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
