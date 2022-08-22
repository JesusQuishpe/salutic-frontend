import { Button, Popconfirm, Space, Table } from 'antd'
import { useCallback, useContext, useEffect, useState } from 'react'
import QrModalContext from '../../contexts/QrModalContext'
import useUser from '../../hooks/useUser'
import { NursingService } from '../../services/NursingService'
import CustomSearch from '../qr/CustomSearch'
import { QRModal } from '../qr/QRModal'
import { FileAddOutlined, DeleteOutlined } from '@ant-design/icons'
import { ExpedientService } from '../../services/ExpedientService'
import { useNavigate } from 'react-router-dom'

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
			const patientQueue = await ExpedientService.getPatientQueue()
			console.log(patientQueue)
			setPatientQueue(patientQueue)
		} catch (error) {
			console.log(error)
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
		},
		{
			title: 'Hora',
			dataIndex: 'hour',
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
						<Button type='primary' onClick={onClick}>
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
				<h2 style={{ marginBottom: '20px' }}>Area de medicina</h2>
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

			{visible && <QRModal handleSearch={onSearch} />}
		</>
	)
}
