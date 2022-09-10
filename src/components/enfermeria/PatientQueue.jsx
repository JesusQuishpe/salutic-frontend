import { Button, message, Popconfirm, Space, Table, Tooltip } from 'antd'
import { useCallback, useContext, useEffect, useState } from 'react'
import QrModalContext from '../../contexts/QrModalContext'
import useUser from '../../hooks/useUser'
import { NursingService } from '../../services/NursingService'
import CustomSearch from '../qr/CustomSearch'
import { QRModal } from '../qr/QRModal'
import { FileAddOutlined, DeleteOutlined } from '@ant-design/icons'
import NursingModal from './NursingModal'
import { axiosErrorHandler } from '../../handlers/axiosErrorHandler'
import { createDateFromString } from '../../utils/functions'

export const PatientQueue = () => {
	const { user } = useUser()
	const { visible } = useContext(QrModalContext)
	//States
	const [patientQueue, setPatientQueue] = useState([])
	const [parametersModal, setParametersModal] = useState({})
	const [filterText, setFilterText] = useState('')
	const [loading, setLoading] = useState(false)

	const patientQueueMapped = patientQueue.map((item) => ({
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
			await NursingService.removeOfQueue(appoId)
			message.success('Paciente eliminado de la lista de espera')
			loadPatientQueue()
		} catch (error) {
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
			const patientQueue = await NursingService.getPatientQueue()
			console.log(patientQueue)
			setPatientQueue(patientQueue)
		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
	}, [])

	/**
	 * Muestra el modal para agregar los datos de enfermeria
	 * @param {object} data
	 */
	const openModal = (data) => {
		setParametersModal({
			show: true,
			appoId: data.appoId,
			userId: user?.id,
		})
	}

	/**
	 * Cierra el modal de enfermeria
	 */
	const closeModal = useCallback(() => {
		setParametersModal({
			show: false,
			appoId: undefined,
			userId: undefined,
		})
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
			responsive: ['md'],
		},
		{
			title: 'Paciente',
			dataIndex: 'fullname',
			//responsive: ['lg'],
		},
		{
			title: 'Area',
			dataIndex: 'area',
		},
		{
			title: 'Fecha',
			dataIndex: 'date',
			responsive: ['lg'],
			render: (_, record) => {
				return createDateFromString(record.date).format('DD/MM/YYYY')
			},
		},
		{
			title: 'Acciones',
			render: (_, record) => {
				return (
					<Space>
						<Tooltip title='Ingresar datos'>
							<Button
								type='primary'
								onClick={() => openModal(record)}
							>
								<FileAddOutlined />
							</Button>
						</Tooltip>
						<Tooltip title='Quitar paciente de la lista de espera'>
							<Popconfirm
								title='Está seguro de quitar el paciente?'
								onConfirm={() => deleteRecord(record.appoId)}
								okButtonProps={{
									loading,
								}}
								cancelText='Cancelar'
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
				<h2 style={{ marginBottom: '20px' }}>Area de enfermería</h2>
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

			<NursingModal
				closeModal={closeModal}
				parameters={parametersModal}
				loadPatientQueue={loadPatientQueue}
			/>

			{visible && <QRModal handleSearch={onSearch} />}
		</>
	)
}
