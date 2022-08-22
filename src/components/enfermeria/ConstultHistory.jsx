import {
	Button,
	Card,
	Col,
	Descriptions,
	message,
	Popconfirm,
	Row,
	Space,
	Spin,
	Table,
} from 'antd'
import { useCallback, useContext, useMemo, useState } from 'react'
import QrModalContext from '../../contexts/QrModalContext'
import { NursingService } from '../../services/NursingService'
import CustomSearch from '../qr/CustomSearch'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import NursingModal from './NursingModal'
import { QRModal } from '../qr/QRModal'
import useUser from '../../hooks/useUser'

const mapData = (data) => {
	return data.map((item) => {
		return {
			key: item.appoId,
			...item,
		}
	})
}

export const ConstultHistory = () => {
	const { user } = useUser()
	//Contexts
	const { visible } = useContext(QrModalContext)
	//States
	const [parametersModal, setParametersModal] = useState({})
	const [resultados, setResultados] = useState([])
	const [singleResult, setSingleResult] = useState({})
	const [loading, setLoading] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState(false)
	const [resultLoading, setResultLoading] = useState(false)

	/**
	 * Elimina un registro de enfermeria
	 * @param {number} appoId
	 */
	const deleteRecord = useCallback(async (id) => {
		try {
			setConfirmLoading(true)
			//await EnfermeriaService.delete(id)
			setConfirmLoading(false)
		} catch (error) {
			console.log(error)
		} finally {
			setConfirmLoading(false)
		}
	}, [])

	/**
	 * Muestra el modal  para agregar los datos de enfermeria
	 * @param {object} data
	 */
	const openModal = (nurId, appoId) => {
		setParametersModal({
			show: true,
			nurId,
			userId: user?.id,
			appoId,
		})
	}

	/**
	 * Cierra el modal de enfermeria
	 */
	const closeModal = () => {
		setParametersModal({
			show: false,
			appoId: undefined,
			userId: undefined,
		})
	}

	const columns = useMemo(
		() => [
			{
				title: 'N° cita',
				dataIndex: 'appoId',
				width: 100,
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
					return (
						<Space>
							<Button
								type='primary'
								onClick={() =>
									openModal(record.nurId, record.appoId)
								}
							>
								<EditOutlined />
							</Button>
							<Popconfirm
								title='Está seguro de eliminar?'
								//visible={visible}
								onConfirm={() => deleteRecord(record.appoId)}
								okButtonProps={{
									loading: confirmLoading,
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
		],
		[confirmLoading, deleteRecord]
	)

	/**
	 * Carga los resultados del paciente por cedula
	 * @param {string} identification
	 */
	const searchHistory = async (identification) => {
		try {
			setLoading(true)
			const history = await NursingService.getHistoryByIdentification(
				identification
			)
			console.log(history)
			if (!history || history.length === 0) {
				message.error(
					'No hay resultados para el paciente con CI: ' +
						identification
				)
			} else {
				setResultados(mapData(history))
			}
		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
	}

	/**
	 * Handler para buscar los resultados del paciente por cedula
	 * @param {Event} e
	 */
	const handleSubmitSearch = (identification) => {
		if (!identification) return
		searchHistory(identification)
	}

	const loadResult = async (nurId) => {
		try {
			setResultLoading(true)
			const data = await NursingService.getById(nurId)
			console.log(data)
			setSingleResult(data)
		} catch (error) {
			console.log(error)
		} finally {
			setResultLoading(false)
		}
	}

	const rowSelecion = {
		onChange: (_, selectedRows) => {
			const record = selectedRows[0]
			loadResult(record.nurId)
		},
	}

	return (
		<div className='p-4'>
			<h2 className='mb-4'>Consultar historial</h2>
			<CustomSearch
				placeholder='Buscar por número de cédula'
				allowClear
				onSearch={handleSubmitSearch}
			/>

			<Row gutter={20}>
				<Col span={14}>
					<Table
						columns={columns}
						dataSource={resultados}
						loading={loading}
						size='small'
						rowSelection={{
							type: 'radio',
							...rowSelecion,
						}}
					/>
				</Col>
				<Col span={10}>
					<Card style={{ marginBottom: '10px' }}>
						<Spin spinning={resultLoading}>
							<Descriptions
								title='Información del paciente'
								column={1}
							>
								<Descriptions.Item label='Peso (kg)'>
									{singleResult.weight}
								</Descriptions.Item>
								<Descriptions.Item label='Estatura (cm)'>
									{singleResult.stature}
								</Descriptions.Item>
								<Descriptions.Item label='I.M.C'>
									{singleResult.imc}
								</Descriptions.Item>
								<Descriptions.Item label='Diagnóstico I.M.C'>
									{singleResult.imcDiagnostic}
								</Descriptions.Item>
								<Descriptions.Item label='Frec. Respiratoria (x minuto)'>
									{singleResult.breathingFrequency}
								</Descriptions.Item>
								<Descriptions.Item label='Nivel de discapacidad (%)'>
									{singleResult.disability}
								</Descriptions.Item>
								<Descriptions.Item label='Presión'>
									{singleResult.pressure}
								</Descriptions.Item>
								<Descriptions.Item label='Temperatura (°C)'>
									{singleResult.temperature}
								</Descriptions.Item>
								<Descriptions.Item label='Frec. Cardiaca (x minuto)'>
									{singleResult.heartFrequency}
								</Descriptions.Item>
							</Descriptions>
						</Spin>
					</Card>
				</Col>
			</Row>
			<NursingModal
				closeModal={closeModal}
				parameters={parametersModal}
			/>
			{visible && <QRModal handleSearch={handleSubmitSearch} />}
		</div>
	)
}
