import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Descriptions, message, Row, Space, Tabs } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import { parseDate, parseHour } from '../../../utils/functions'
import { LaboratoryExams } from './LaboratoryExams'
import Interrogation from './Interrogation'
import Exploration from './Exploration'
import MedCies from './MedCies'
import Evaluation from './Evaluation'
import useUser from '../../../hooks/useUser'
import LoaderContext from '../../../contexts/LoaderContext'
import { MedConsultationService } from '../../../services/MedConsultationService'
import { axiosErrorHandler } from '../../../handlers/axiosErrorHandler'
import { CitationWarning } from '../../not-found/CitationWarning'

import { PrevLoadingPage } from '../../antd/PrevLoadingPage'
import { PrescriptionTab } from './PrescriptionTab'

const { TabPane } = Tabs

const initialInterrogatory = {
	date: moment(),
	hour: moment(),
	consultationType: null,
	reasonConsultation: '',
	symptoms: '',
	apparatusAndSystems: '',
}

const initialExploration = {
	weight: 0,
	stature: 0,
	temperature: 0,
	frequency: 0,
	pressure: '',
	physicalExploration: '',
}

const initialEvaluation = {
	laboratoryStudies: '',
	diagnostics: '',
	treatments: '',
}

export const NewConsultation = () => {
	const navigate = useNavigate()
	const { openLoader, closeLoader } = useContext(LoaderContext)
	const { appoId, consultationId } = useParams()
	const isEdit = !!consultationId
	const { user } = useUser()
	const [interrogatory, setInterrogatory] = useState(initialInterrogatory)
	const [exploration, setExploration] = useState(initialExploration)
	const [evaluation, setEvaluation] = useState(initialEvaluation)
	const [cies, setCies] = useState([])
	const [prescriptions, setPrescriptions] = useState([])
	const [citationInfo, setCitationInfo] = useState(null)
	const [data, setData] = useState(null)
	const [citationError, setCitationError] = useState(null)

	const loadPatientInfo = async () => {
		try {
			const citation =
				await MedConsultationService.getDataForNewConsultation(appoId)
			setCitationInfo(citation)
			console.log(citation)
		} catch (error) {
			console.log(error)
			const { message: errorMessage, status } = axiosErrorHandler(error)
			console.log(status)
			if (status === 404) {
				setCitationError({ message: errorMessage, status })
			}
		}
	}

	const loadDataForEdit = async () => {
		try {
			const consultation = await MedConsultationService.getById(
				consultationId
			)
			setData(consultation)
			if (consultation) {
				setInterrogatory({
					date: moment(consultation?.date),
					hour: moment(consultation?.hour, 'HH:mm:ss'),
					consultationType: consultation?.consultationType,
					reasonConsultation: consultation?.reasonConsultation,
					symptoms: consultation?.symptoms,
					apparatusAndSystems: consultation?.apparatusAndSystems,
				})
				setExploration({
					physicalExploration: consultation?.physicalExploration,
				})
				setEvaluation({
					laboratoryStudies: consultation?.laboratoryStudies,
					diagnostics: consultation?.diagnostics,
					treatments: consultation?.treatments,
				})
				setCies(
					consultation?.cies.map((item) => ({
						...item,
						code: item.cie.code,
						disease: item.cie.disease,
					}))
				)
				setPrescriptions(
					consultation?.prescriptions.map((item) => ({
						medicineId: item.medicineId,
						medicineName: item.medicine.genericName,
						dosification: item.dosification,
					}))
				)
			}
			console.log(consultation)
		} catch (error) {
			console.log(error)
			const { message: errorMessage, status } = axiosErrorHandler(error)
			console.log(status)
			if (status === 404) {
				setCitationError({ message: errorMessage, status })
			}
		}
	}

	const onSave = async () => {
		try {
			openLoader('Creando consulta...')
			const interrogatoryData = {
				...interrogatory,
				date: parseDate(interrogatory.date, 'YYYY-MM-DD'),
				hour: parseHour(interrogatory.hour),
			}
			const formatCies = cies.map((cie) => ({
				...cie,
				diagnosticDate: parseDate(cie.diagnosticDate, 'YYYY-MM-DD'),
				cured: parseDate(cie.cured, 'YYYY-MM-DD'),
			}))

			const dataToSend = {
				userId: user.id,
				appoId: isEdit
					? data?.nursingArea?.medicalAppointment?.id
					: appoId,
				nurId: isEdit
					? data?.nursingArea?.id
					: citationInfo?.nursingArea?.id,
				...interrogatoryData,
				...exploration,
				...evaluation,
				cies: formatCies,
				prescriptions,
			}
			if (isEdit) {
				await MedConsultationService.updateConsultation(
					dataToSend,
					consultationId
				)
				message.success('Consulta actualizada correctamente')
			} else {
				await MedConsultationService.createConsultation(dataToSend)
				message.success('Consulta creada correctamente')
				navigate('/medicina/citas')
			}
			console.log(dataToSend)
		} catch (error) {
			console.log(error)
			const { message: errorMessage } = axiosErrorHandler(error)
			message.error(errorMessage)
		} finally {
			closeLoader()
		}
	}

	useEffect(() => {
		if (isEdit) {
			loadDataForEdit()
		} else {
			loadPatientInfo()
		}
	}, [])

	if (citationError) {
		return <CitationWarning message={citationError.message} />
	}

	//Estos if muestran primero el loading y no la UI, hasta que los datos estén listos
	if (isEdit && !data) {
		return <PrevLoadingPage />
	}

	if (!isEdit & !citationInfo) {
		return <PrevLoadingPage />
	}

	return (
		<>
			<Row style={{ marginBottom: '20px' }} gutter={10} justify='end'>
				<Space>
					<Button onClick={onSave} type='primary'>
						<SaveOutlined />
						{isEdit ? 'Actualizar consulta' : 'Guardar consulta'}
					</Button>
				</Space>
			</Row>
			<Card
				style={{ marginBottom: '10px' }}
				title='Información del paciente'
				type='inner'
			>
				<Descriptions column={3}>
					<Descriptions.Item label='Cédula'>
						{isEdit
							? data?.nursingArea?.medicalAppointment?.patient
									?.identification
							: citationInfo?.patient?.identification}
					</Descriptions.Item>
					<Descriptions.Item label='Nombres'>
						{isEdit
							? data?.nursingArea?.medicalAppointment?.patient
									?.name
							: citationInfo?.patient?.name}
					</Descriptions.Item>
					<Descriptions.Item label='Apellidos'>
						{isEdit
							? data?.nursingArea?.medicalAppointment?.patient
									?.lastname
							: citationInfo?.patient?.lastname}
					</Descriptions.Item>
					<Descriptions.Item label='Teléfono'>
						{isEdit
							? data?.nursingArea?.medicalAppointment?.patient
									?.cellphone
							: citationInfo?.patient?.cellphone}
					</Descriptions.Item>
					<Descriptions.Item label='Domicilio'>
						{isEdit
							? data?.nursingArea?.medicalAppointment?.patient
									?.address
							: citationInfo?.patient?.address}
					</Descriptions.Item>
				</Descriptions>
			</Card>
			<Tabs
				tabPosition='top'
				defaultActiveKey='interrogatorio'
				type='card'
			>
				<TabPane tab='Interrogatorio' key='interrogatorio'>
					<Interrogation data={data} update={setInterrogatory} />
				</TabPane>
				<TabPane tab='Exploración' key='exploracion'>
					<Exploration
						nursingInfo={
							isEdit
								? data?.nursingArea
								: citationInfo?.nursingArea
						}
						explorationValue={data?.physicalExploration}
						update={setExploration}
					/>
				</TabPane>
				<TabPane tab='Enfermedades CIE' key='cies'>
					<MedCies
						isEdit={isEdit}
						data={data?.cies}
						update={setCies}
					/>
				</TabPane>
				<TabPane tab='Evaluación' key='evaluacion'>
					<Evaluation data={data} update={setEvaluation} />
				</TabPane>
				<TabPane tab='Recetas' key='recetas'>
					<PrescriptionTab
						isEdit={isEdit}
						data={prescriptions}
						update={setPrescriptions}
					/>
				</TabPane>
				<TabPane tab='Exámenes de lab...' key='examenes'>
					<LaboratoryExams
						patientId={
							isEdit
								? data?.nursingArea?.medicalAppointment?.patient
										?.id
								: citationInfo?.patient?.id
						}
					/>
				</TabPane>
			</Tabs>
		</>
	)
}
