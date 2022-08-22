import { Button, Space, Table, Popconfirm } from 'antd'
import React from 'react'
import { useFetchTests } from '../../hooks/useFetchTests'
import { Link } from 'react-router-dom'
import {
	EditOutlined,
	DeleteOutlined,
	FileAddOutlined,
} from '@ant-design/icons'

import CustomSearch from '../qr/CustomSearch'

export const Tests = () => {
	const {
		tests,
		filterText,
		loading,
		page,
		handleSearch,
		handleReload,
		handleDeleteClick,
		setPage,
	} = useFetchTests()

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
			title: 'Grupo',
			dataIndex: 'group',
			render: (_, record) => record.group.name,
		},
		{
			title: 'Precio',
			dataIndex: 'price',
			render: (_, record) => '$' + record.price,
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
			<h2 className='mb-3'>Pruebas de laboratorio</h2>
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
				placeholder='Buscar prueba por nombre'
				showQrButton={false}
				allowClear
				disabled={loading}
				onSearch={handleSearch}
				onReload={handleReload}
			/>
			<Table
				columns={columns}
				dataSource={tests.filter((test) =>
					test.name.toLowerCase().includes(filterText.toLowerCase())
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
