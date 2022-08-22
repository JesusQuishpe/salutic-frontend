import { Button, Popconfirm, Space, Table } from 'antd'
import { useCallback, useContext, useEffect, useState } from 'react'
import QrModalContext from '../../contexts/QrModalContext'
import useUser from '../../hooks/useUser'
import { NursingService } from '../../services/NursingService'
import CustomSearch from '../qr/CustomSearch'
import { QRModal } from '../qr/QRModal'
import { FileAddOutlined, DeleteOutlined } from '@ant-design/icons'
import NursingModal from './NursingModal'

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
			await NursingService.delete(appoId)
			loadPatientQueue()
		} catch (error) {
			console.log(error)
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
		},
		{
			title: 'Paciente',
			dataIndex: 'fullname',
		},
		{
			title: 'Area',
			dataIndex: 'area',
		},
		{
			title: 'Fecha',
			dataIndex: 'date',
		},
		{
			title: 'Acciones',
			render: (_, record) => {
				return (
					<Space>
						<Button
							type='primary'
							onClick={() => openModal(record)}
						>
							<FileAddOutlined />
						</Button>
						<Popconfirm
							title='Está seguro de eliminar?'
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
