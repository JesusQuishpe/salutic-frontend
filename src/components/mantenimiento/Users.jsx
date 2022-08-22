import { Button, Space, Table, Popconfirm, Tooltip } from 'antd'
import React, { useState } from 'react'
import { useFetchUsers } from '../../hooks/useFetchUsers'
import { Link } from 'react-router-dom'
import {
	EditOutlined,
	DeleteOutlined,
	FileAddOutlined,
	LockOutlined,
} from '@ant-design/icons'

import CustomSearch from '../qr/CustomSearch'
import { ChangePasswordModal } from './ChangePasswordModal'

export const Users = () => {
	const {
		users,
		filterText,
		loading,
		page,
		handleSearch,
		handleReload,
		handleDeleteClick,
		setPage,
	} = useFetchUsers()
	const [showModalParams, setShowModalParams] = useState({})

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
			title: 'Rol',
			dataIndex: 'rol',
			render: (_, record) => record.rol.name,
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
						<Tooltip title='Cambiar contraseña'>
							<Button
								onClick={() =>
									setShowModalParams({
										show: true,
										userId: record.id,
									})
								}
							>
								<LockOutlined />
							</Button>
						</Tooltip>
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
			<h2 className='mb-3'>Usuarios</h2>
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
				placeholder='Buscar rol por nombre'
				showQrButton={false}
				allowClear
				disabled={loading}
				onSearch={handleSearch}
				onReload={handleReload}
			/>
			<Table
				columns={columns}
				dataSource={users.filter((user) =>
					user.name.toLowerCase().includes(filterText.toLowerCase())
				)}
				rowKey={(record) => record.id}
				loading={loading}
				pagination={{
					onChange: setPage,
					current: page,
				}}
			/>
			<ChangePasswordModal
				params={showModalParams}
				closeModal={() =>
					setShowModalParams({ show: false, userId: null })
				}
			/>
		</>
	)
}
