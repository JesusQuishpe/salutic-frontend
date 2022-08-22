import { Button, Space, Table, Popconfirm } from 'antd'
import React from 'react'
import { useFetchUnits } from '../../hooks/useFetchUnits'
import { Link } from 'react-router-dom'
import {
	EditOutlined,
	DeleteOutlined,
	FileAddOutlined,
} from '@ant-design/icons'

import CustomSearch from '../qr/CustomSearch'

export const MeasurementUnits = () => {
	const {
		units,
		filterText,
		loading,
		page,
		handleSearch,
		handleReload,
		handleDeleteClick,
		setPage,
	} = useFetchUnits()

	const columns = [
		{
			title: 'Id',
			dataIndex: 'id',
		},
		{
			title: 'Nombre',
			dataIndex: 'name',
		},
		{
			title: 'Abreviatura',
			dataIndex: 'abbreviation',
			//responsive: ['lg'],
		},
		{
			title: 'Acciones',

			render: (_, record) => {
				return (
					<Space>
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
			<h2 className='mb-3'>Unidades de medida</h2>
			<div style={{ marginBottom: '10px' }}>
				<Link className='btn btn-success' to={'nuevo'}>
					<Button
						type='primary'
						style={{
							background: 'rgb(37,184,100)',
							borderColor: 'rgb(37,184,100)',
							color: '#fff',
						}}
					>
						<FileAddOutlined /> Nuevo
					</Button>
				</Link>
			</div>
			<CustomSearch
				placeholder='Buscar unidad de medida por nombre'
				showQrButton={false}
				allowClear
				disabled={loading}
				onSearch={handleSearch}
				onReload={handleReload}
			/>
			<Table
				columns={columns}
				dataSource={units.filter((unit) =>
					unit.name.toLowerCase().includes(filterText.toLowerCase())
				)}
				rowKey={(record) => record.id}
				loading={loading}
				pagination={{
					onChange: setPage,
					current: page,
				}}
			/>
		</>
	)
}
