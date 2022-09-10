import { Button, message, Popconfirm, Space, Table } from 'antd'
import { useEffect, useState } from 'react'
import { ExpedientService } from '../../services/ExpedientService'
import CustomSearch from '../qr/CustomSearch'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { axiosErrorHandler } from '../../handlers/axiosErrorHandler'

export const SearchExpedient = () => {
	//States
	const [expedients, setExpedients] = useState(undefined)

	const [loading, setLoading] = useState(false)
	const [page, setPage] = useState(1)

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

	const deleteExpedient = async (id) => {
		try {
			setLoading(true)
			await ExpedientService.deleteExpedient(id)
			message.success('Expediente eliminado correctamente')
			onReload()
		} catch (error) {
			console.log(error)
			const { message: errorMessage } = axiosErrorHandler(error)
			message.error(errorMessage)
		} finally {
			setLoading(false)
		}
	}

	const columns = [
		{
			title: 'Id',
			dataIndex: 'id',
		},
		{
			title: 'Cedula',
			dataIndex: 'identification',
			responsive: ['md'],
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
			title: 'Acciones',
			render: (_, record) => {
				return (
					<Space>
						<Link to={`${record.id}/editar`}>
							<Button
								type='primary'
								//onClick={() => openModal(record)}
							>
								<EditOutlined />
							</Button>
						</Link>
						<Popconfirm
							title='Está seguro de eliminar?'
							onConfirm={() => deleteExpedient(record.id)}
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

	return (
		<>
			<h2>Expedientes</h2>
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
				dataSource={expedients?.result}
				rowKey={(record) => record.id}
				pagination={{
					total: expedients?.pagination?.total,
					current: expedients?.pagination?.currentPage,
					pageSize: expedients?.pagination?.perPage,
					onChange: setPage,
				}}
				loading={loading}
			/>
		</>
	)
}
