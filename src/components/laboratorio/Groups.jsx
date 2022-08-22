import { Button, Space, Table, Popconfirm } from 'antd'
import React from 'react'
import { useFetchGroups } from '../../hooks/useFetchGroups'
import { Link } from 'react-router-dom'
import {
	EditOutlined,
	DeleteOutlined,
	FileAddOutlined,
} from '@ant-design/icons'

import CustomSearch from '../qr/CustomSearch'

export const Groups = () => {
	const {
		groups,
		filterText,
		loading,
		page,
		handleSearch,
		handleReload,
		handleDeleteClick,
		setPage,
	} = useFetchGroups()

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
			title: 'Area',
			dataIndex: 'area',
			render: (_, record) => record.area.name,
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
			<h2 className='mb-3'>Grupos de laboratorio</h2>
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
				placeholder='Buscar grupo por nombre'
				showQrButton={false}
				allowClear
				disabled={loading}
				onSearch={handleSearch}
				onReload={handleReload}
			/>
			<Table
				columns={columns}
				dataSource={groups.filter((group) =>
					group.name.toLowerCase().includes(filterText.toLowerCase())
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
