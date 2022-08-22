import { Button, Popconfirm, Space, Table } from 'antd'
import { useContext, useEffect, useState } from 'react'
import QrModalContext from '../../contexts/QrModalContext'
import { ExpedientService } from '../../services/ExpedientService'
import CustomSearch from '../qr/CustomSearch'
import { FileAddOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const mapData = (data) => {
	if (!data) return []
	return data.map((item) => {
		return {
			key: item.id,
			...item,
		}
	})
}

export const SearchExpedient = () => {
	//Contexts
	const { visible } = useContext(QrModalContext)
	//States
	const [expedients, setExpedients] = useState(undefined)

	const [loading, setLoading] = useState(false)
	const [page, setPage] = useState(1)

	const columns = [
		{
			title: 'Id',
			dataIndex: 'id',
		},
		{
			title: 'Cedula',
			dataIndex: 'identification',
		},
		{
			title: 'Paciente',
			dataIndex: 'fullname',
		},
		{
			title: 'Ciudad',
			dataIndex: 'city',
		},
		{
			title: 'Acciones',
			render: (_, record) => {
				return (
					<Space>
						<Link to={`${record.id}/editar`}>
							<Button
								type='primary'
								//onClick={() => openModal(record)}
							>
								<FileAddOutlined />
							</Button>
						</Link>
						<Popconfirm
							title='Está seguro de eliminar?'
							//onConfirm={() => deleteRecord(record.appoId)}
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

	/**
	 * Carga los pacientes paginados
	 */
	const loadExpedientes = async (page) => {
		try {
			setLoading(true)
			console.log('HOLA:' + page)
			const expedients = await ExpedientService.getExpedients(page)
			console.log(expedients)
			setExpedients(expedients)
		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
	}

	/**
	 * Carga los pacientes cuando la page del ag-grid cambia
	 */
	useEffect(() => {
		loadExpedientes(page)
	}, [page])

	const onSearch = async (identification) => {
		if (!identification) return
		try {
			setLoading(true)
			const expedient =
				await ExpedientService.getExpedientByIdentification(
					identification
				)
			setExpedients({
				result: expedient ? [{ ...expedient }] : [],
				pagination: {
					total: 1,
					perPage: 10,
					currentPage: 1,
				},
			})
		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
	}

	const onReload = () => {
		loadExpedientes(1)
	}

	return (
		<>
			<h2>Expedientes</h2>
			<CustomSearch
				placeholder='Buscar por número de cédula'
				allowClear
				disabled={loading}
				onSearch={onSearch}
				onReload={onReload}
			/>
			<Table
				columns={columns}
				dataSource={mapData(expedients?.result)}
				pagination={{
					total: expedients?.pagination?.total,
					current: page,
					pageSize: expedients?.pagination?.perPage,
					onChange: setPage,
				}}
				loading={loading}
			/>
		</>
	)
}
