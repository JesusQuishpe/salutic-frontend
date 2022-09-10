import { Button, message, Popconfirm, Space, Table, Tooltip } from 'antd'
import { useCallback, useContext, useEffect, useState } from 'react'
import QrModalContext from '../../contexts/QrModalContext'
import CustomSearch from '../qr/CustomSearch'
import { QRModal } from '../qr/QRModal'
import { FileAddOutlined, DeleteOutlined } from '@ant-design/icons'
import { ExpedientService } from '../../services/ExpedientService'
import { useNavigate } from 'react-router-dom'
import { MedConsultationService } from '../../services/MedConsultationService'
import { axiosErrorHandler } from '../../handlers/axiosErrorHandler'
import { createDateFromString } from '../../utils/functions'

export const MedPatientQueue = () => {
	const navigate = useNavigate()
	const { visible } = useContext(QrModalContext)
	//States
	const [patientQueue, setPatientQueue] = useState([])

	const [filterText, setFilterText] = useState('')
	const [loading, setLoading] = useState(false)

	const patientQueueMapped = patientQueue?.map((item) => ({
		key: item.appoId,
		...item,
	}))

	/**
	 * Elimina un registro de enfermeria
	 * @param {number} appoId
	 */
	const deleteRecord = async (appoId) => {
		try {
			setLoading(true)
			await MedConsultationService.removeOfQueue(appoId)
			message.success('Paciente quitado de la lista de espera')
			loadPatientQueue()
		} catch (error) {
			//console.log(error)
			const { message: errorMessage } = axiosErrorHandler(error)
			message.error(errorMessage)
		} finally {
			setLoading(false)
		}
	}

	/**
	 * Carga los pacientes que están en espera
	 */
	const loadPatientQueue = useCallback(async () => {
		try {
			setLoading(true)
			const patientQueue = await ExpedientService.getPatientQueue()
			console.log(patientQueue)
			setPatientQueue(patientQueue)
		} catch (error) {
			const { message: errorMessage } = axiosErrorHandler(error)
			message.error(errorMessage)
		} finally {
			setLoading(false)
		}
	}, [])

	/**
	 * Recarga los pacientes en espera
	 */
	const handleReload = () => {
		setFilterText('')
		loadPatientQueue()
	}

	useEffect(() => {
		loadPatientQueue()
	}, [])

	const columns = [
		{
			title: 'N° cita',
			dataIndex: 'appoId', //Id is the appoId
		},
		{
			title: 'Paciente',
			dataIndex: 'fullname',
		},
		{
			title: 'Fecha',
			dataIndex: 'date',
			responsive: ['md'],
			render: (_, record) => {
				return createDateFromString(record.date).format('DD/MM/YYYY')
			},
		},
		{
			title: 'Hora',
			dataIndex: 'hour',
			responsive: ['lg'],
		},
		{
			title: 'Acciones',
			render: (_, record) => {
				console.log(record)
				const onClick = () => {
					navigate(`${record.appoId}/nuevo`, {
						state: { isEdit: false },
					})
				}
				return (
					<Space>
						<Tooltip title='Nueva consulta'>
							<Button type='primary' onClick={onClick}>
								<FileAddOutlined />
							</Button>
						</Tooltip>
						<Tooltip title='Quitar paciente de la lista de espera'>
							<Popconfirm
								title='Está seguro de quitar al paciente?'
								onConfirm={() => deleteRecord(record.appoId)}
								okButtonProps={{
									loading,
								}}
								//onCancel={() => setVisible(false)}
							>
								<Button type='primary' danger>
									<DeleteOutlined />
								</Button>
							</Popconfirm>
						</Tooltip>
					</Space>
				)
			},
		},
	]

	const onSearch = (identification) => {
		setFilterText(identification)
	}

	return (
		<>
			<div className='w-100 p-4'>
				<h2 style={{ marginBottom: '20px' }}>Area de medicina</h2>
				<CustomSearch
					onSearch={onSearch}
					allowClear
					placeholder={'Buscar paciente por número de cédula'}
					onReload={handleReload}
					showQrButton={false}
				/>
				<Table
					columns={columns}
					dataSource={patientQueueMapped.filter((row) =>
						row.identification.includes(filterText)
					)}
					loading={loading}
				/>
			</div>

			{visible && <QRModal handleSearch={onSearch} />}
		</>
	)
}
