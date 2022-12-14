import { Button, Card, Row, Space, Spin, Tabs, message } from 'antd'
import { useParams } from 'react-router-dom'
import PatientRecordTab from './PatientRecordTab'
import PersonalInformationTab from './PersonalInformationTab'
import { SaveOutlined } from '@ant-design/icons'
import PhysicalExplorationTab from './PhysicalExplorationTab'
import InterrogationTab from './InterrogationTab'
import LifeStyleTab from './LifeStyleTab'
import { useDispatch, useSelector } from 'react-redux/es/exports'
import { useContext, useEffect } from 'react'
import { getExpedientById } from '../../../store/slices/expedient/thunks'

import { ExpedientService } from '../../../services/ExpedientService'
import LoaderContext from '../../../contexts/LoaderContext'
import AllergiesTab from './AllergiesTab'
import { ConsultationsTab } from './ConsultationsTab'
import { axiosErrorHandler } from '../../../handlers/axiosErrorHandler'
import { PrevLoadingPage } from '../../antd/PrevLoadingPage'
import { ContentNotFound } from '../../not-found/ContentNotFound'
import { resetExpedientData } from '../../../store/slices/expedient/expedientSlice'
const { TabPane } = Tabs

export const Expedient = () => {
	const { expedientId } = useParams()
	const dispatch = useDispatch()
	const {
		isLoading,
		notFound,
		data,
		personalInformation,
		aditionalInformation,
		patientRecord,
		physicalExploration,
		physicalActivity,
		feedingHabits,
		smoking,
		interrogation,
		others,
		allergies,
	} = useSelector((state) => state.expedient)
	const isEdit = !!expedientId
	const { openLoader, closeLoader } = useContext(LoaderContext)

	const onSave = async () => {
		try {
			openLoader('Guardando cambios...')
			const expedient = {
				id: data.id,
				patient: {
					...data.patient,
					...personalInformation,
					...aditionalInformation,
				},
				patientRecord,
				physicalExploration,
				interrogation,
				physicalActivity,
				smoking,
				feedingHabits,
				others,
				allergies,
			}
			console.log(expedient)
			await ExpedientService.updateExpedient(expedient, data.id)
			message.success('Expediente actualizado correctamente')
			closeLoader()
		} catch (error) {
			console.log(error)
			const { message: errorMessage } = axiosErrorHandler(error)
			message.error(errorMessage)
			closeLoader()
		}
	}

	useEffect(() => {
		dispatch(getExpedientById(parseInt(expedientId)))
		return () => {
			dispatch(resetExpedientData())
		}
	}, [])

	if (isLoading) {
		return <PrevLoadingPage />
	}

	if (notFound) {
		return <ContentNotFound />
	}

	return (
		<Card
			title={isEdit ? 'Actualizar expediente' : 'Crear expendiente'}
			type='inner'
		>
			<Row style={{ marginBottom: '20px' }} gutter={10} justify='end'>
				<Space>
					<Button onClick={onSave} disabled={!data.id}>
						<SaveOutlined />
						{isEdit ? 'Actualizar expediente' : 'Crear expendiente'}
					</Button>
				</Space>
			</Row>
			<Tabs tabPosition='top' defaultActiveKey='info' type='card'>
				<TabPane tab='Informaci??n personal' key='tabInfo'>
					<PersonalInformationTab />
				</TabPane>
				<TabPane tab='Antecedentes' key='antecedentes'>
					<PatientRecordTab />
				</TabPane>
				<TabPane tab='Exploraci??n f??sica' key='exploracion'>
					<PhysicalExplorationTab />
				</TabPane>
				<TabPane tab='Interrogatorio' key='interrogatorio'>
					<InterrogationTab />
				</TabPane>
				<TabPane tab='Estilo de vida' key='estiloDeVida'>
					<LifeStyleTab />
				</TabPane>
				<TabPane tab='Alergias' key='alergias'>
					<AllergiesTab />
				</TabPane>
				<TabPane tab='Consultas' key='consultas'>
					<ConsultationsTab patientId={data?.patient?.id} />
				</TabPane>
			</Tabs>
		</Card>
	)
}
