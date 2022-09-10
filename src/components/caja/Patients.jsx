import { Button, Popconfirm, Space, Table } from 'antd'
import {
	DeleteOutlined,
	FileAddOutlined,
	EditOutlined,
} from '@ant-design/icons'
import CustomSearch from '../qr/CustomSearch'
import { mapDataForTableAntDesign } from '../../utils/functions'
import { Link } from 'react-router-dom'
import { QRModal } from '../qr/QRModal'
import { useFetchPatients } from '../../hooks/useFetchPatients'

export const Patients = () => {
	const {
		patients,
		loading,
		visible,
		onSearch,
		onReload,
		updatePage,
		deleteRecord,
	} = useFetchPatients()

	const columns = [
		{
			title: 'Id',
			dataIndex: 'id',
		},
		{
			title: 'Paciente',
			dataIndex: 'fullname',
		},
		{
			title: 'Ciudad',
			dataIndex: 'city',
			responsive: ['lg'],
		},
		{
			title: 'Edad',
			dataIndex: 'age',
			responsive: ['lg'],
			render: (_, record) => {
				return record.age + ' años'
			},
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
							title='Está seguro de eliminar el paciente?'
							onConfirm={() => deleteRecord(record.id)}
							okButtonProps={{
								loading,
							}}
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
			<h2 className='mb-3'>Pacientes</h2>
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
				placeholder='Buscar por número de cédula'
				allowClear
				disabled={loading}
				onSearch={onSearch}
				onReload={onReload}
				showQrButton={false}
			/>
			<Table
				columns={columns}
				dataSource={mapDataForTableAntDesign(patients?.result)}
				pagination={{
					total: patients?.pagination?.total,
					current: patients?.pagination?.currentPage,
					pageSize: patients?.pagination?.perPage,
					onChange: updatePage,
				}}
				loading={loading}
			/>
			{visible && <QRModal handleSearch={onSearch} />}
		</>
	)
}
