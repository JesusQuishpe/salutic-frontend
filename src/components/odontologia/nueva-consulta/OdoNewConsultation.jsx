import {
	Button,
	Col,
	Row,
	Space,
	Tabs,
	Card,
	Typography,
	Alert,
	Modal,
	message,
} from 'antd'
import React, { useEffect, useState, useRef, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { END_POINT } from '../../../utils/conf'
import { useDispatch, useSelector } from 'react-redux/es/exports'
import {
	getData,
	getDataForEdit,
	//getDataForEdit,
} from '../../../store/slices/odontology/thunks'
import OdoIndicatorsTab from './OdoIndicatorsTab'
import OdoFamilyHistoryTab from './OdoFamilyHistoryTab'
import OdoGeneralInfoTab from './OdoGeneralInfoTab'
import OdoNursingInfo from './OdoNursingInfo'
import OdoPatientCard from './OdoPatientCard'
import OdoCpoCeoRatioTab from './OdoCpoCeoRatioTab'
import OdoDiagnosticsTab from './OdoDiagnosticsTab'
import OdoTreatmentsTab from './OdoTreatmentsTab'
import OdoOdontogramTab from './OdoOdontogramTab'
import '../../../css/Odontology.css'
import OdoAct from './OdoAct'
import { isObjectEmpty } from '../../../utils/functions'
import { toBlob } from 'html-to-image'
import LoaderContext from '../../../contexts/LoaderContext'
import { OdontologyService } from '../../../services/OdontologyService'
import useUser from '../../../hooks/useUser'
import { axiosErrorHandler } from '../../../handlers/axiosErrorHandler'
import { resetStateOnOdontology } from '../../../store/slices/odontology/odontologySlice'
import { CitationWarning } from '../../not-found/CitationWarning'
import { PrevLoadingPage } from '../../antd/PrevLoadingPage'

const { TabPane } = Tabs
const { Title } = Typography

const TAB_WARNINGS = {
	GENERAL: 'Debe completar al menos un campo en la sección general',
	ANTECEDENTES:
		'Debe completar al menos un campo en la sección de antecedentes',
	INDICADORES:
		'Debe completar al menos un campo en la sección de indicadores de salud bucal',
	INDICES:
		'Debe completar al menos un campo en la sección de indices CPO-CEO',
	DIAGNOSTICOS:
		'Debe completar al menos un campo en la sección de diagnósticos',
	TRATAMIENTOS:
		'Debe completar al menos un campo en la sección de tratamientos',
	ODONTOGRAMA:
		'Debe completar al menos un campo en la sección de odontograma',
}

export const OdoNewConsultation = () => {
	const navigate = useNavigate()
	const { openLoader, closeLoader } = useContext(LoaderContext)
	const { user } = useUser()
	const { appoId, recId } = useParams()
	const [key, setKey] = useState('general')
	const [alertMessage, setAlertMessage] = useState('')
	const odontogramRef = useRef(null)
	const [visible, setVisible] = useState(false)
	const odoActRef = useRef(null)
	const dispatch = useDispatch()
	const {
		data,
		odoCitationError,
		generalInfo,
		familyHistory,
		indicator,
		cpoCeoRatios,
		planAndDiagnostics,
		treatments,
		movilitiesRecessions,
		teeth,
		isActaChanged,
	} = useSelector((state) => state.odontology)

	const isEdit = !!recId

	const validateTabsForm = () => {
		if (isObjectEmpty(generalInfo)) {
			setKey('general')
			setAlertMessage(TAB_WARNINGS.GENERAL)
			return false
		}
		if (isObjectEmpty(familyHistory)) {
			setKey('antecedentes')
			setAlertMessage(TAB_WARNINGS.ANTECEDENTES)
			return false
		}
		if (isObjectEmpty(indicator)) {
			setKey('indicadores')
			setAlertMessage(TAB_WARNINGS.INDICADORES)
			return false
		}
		if (isObjectEmpty(cpoCeoRatios)) {
			setKey('indices')
			setAlertMessage(TAB_WARNINGS.INDICES)
			return false
		}
		if (isObjectEmpty(planAndDiagnostics)) {
			setKey('diagnosticos')
			setAlertMessage(TAB_WARNINGS.DIAGNOSTICOS)
			return false
		}
		if (isObjectEmpty(treatments)) {
			setKey('tratamientos')
			setAlertMessage(TAB_WARNINGS.TRATAMIENTOS)
			return false
		}
		if (isObjectEmpty(movilitiesRecessions) || isObjectEmpty(teeth)) {
			setKey('odontograma')
			setAlertMessage(TAB_WARNINGS.ODONTOGRAMA)
			return false
		}
		return true
	}

	const takePicture = () => {
		return new Promise((resolve, reject) => {
			console.log(odontogramRef.current)
			if (key !== 'odontograma') {
				setKey('odontograma')
			}
			//Esperamos a que se actualice el estado key, para que sea visible el odontograma
			//Y odontogramRef.current no sea null
			setTimeout(() => {
				toBlob(document.getElementById('odontogram'), { quality: 0.5 })
					.then((blob) => {
						//return window.URL.createObjectURL(blob)
						return new File([blob], 'odontogram-img.png', {
							type: 'image/png',
						})
					})
					.then((file) => {
						resolve(file)
					})
					.catch((err) => {
						reject(err)
					})
			}, 300)
		})
	}

	const onSave = async () => {
		try {
			//if (!validateTabsForm()) return
			openLoader('Generando imagen del odontograma...')
			const odoImg = await takePicture()
			if (!odoImg)
				return alert('No se pudo capturar la imagen del odontograma')
			openLoader('Preparando datos...')
			const dataToSend = {
				appoId: data?.appoId || appoId,
				recId,
				nurId: data?.nursingInfo?.id,
				userId: user.id,
				generalInfo: {
					...generalInfo,
					odontogramPath: data?.patientRecord?.odontogramPath || null,
					actaPath: data?.patientRecord?.actaPath || null,
				},
				familyHistory,
				indicator,
				cpoCeoRatios,
				planAndDiagnostics,
				treatments,
				odontogram: {
					odontogramId: data?.odontogram?.id || null,
					movilitiesRecessions,
					teeth,
				},
				isActaChanged,
			}
			console.log(dataToSend)
			const formData = new FormData()
			formData.append('odontogram_image', odoImg)
			formData.append('data', JSON.stringify(dataToSend))
			formData.append('acta', odoActRef.current?.acta)
			console.log(odoImg)
			console.log(dataToSend)
			console.log(odoActRef.current?.acta)
			if (isEdit) {
				formData.append('_method', 'PUT')
				await OdontologyService.updatePatientRecord(formData, recId)
				message.success('Datos actualizados correctamente')
				openLoader('Actualizando datos de la UI...')
				dispatch(getDataForEdit(recId))
			} else {
				await OdontologyService.savePatientRecord(formData)
				message.success('Datos guardados correctamente')
				openLoader('Redirigiendo a sala de espera...')
				setTimeout(() => {
					navigate('/odontologia/citas', { replace: true })
				}, 1000)
			}
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
			dispatch(getDataForEdit(recId))
		} else {
			dispatch(getData(appoId))
		}
		return () => {
			dispatch(resetStateOnOdontology())
			odontogramRef.current = null
			odoActRef.current = null
		}
	}, [])

	if (odoCitationError) {
		return <CitationWarning message={odoCitationError.message} />
	}

	if (!data) {
		return <PrevLoadingPage />
	}

	return (
		<>
			<div className='ficha-container'>
				<Row align='end'>
					<Col span={6}>
						<Title level={2}>
							{isEdit ? 'Actualizar ficha' : 'Nueva ficha'}
						</Title>
					</Col>
					<Col span={18}>
						<Row justify='end'>
							<Space>
								{isEdit && (
									<>
										<Button
											type='default'
											danger
											href={
												END_POINT +
												`odontologia/pdf/${recId}`
											}
											target='_blank'
										>
											Ver PDF
										</Button>
										<Button
											type='default'
											href={
												END_POINT +
												`acta/${recId}/download`
											}
											target='_blank'
											disabled={!data?.acta?.url}
										>
											Descargar acta
										</Button>
									</>
								)}
								<Button
									type='primary'
									onClick={() => setVisible(true)}
									//disabled={data ? false : true}
								>
									{isEdit
										? 'Actualizar ficha'
										: 'Guardar ficha'}
								</Button>
							</Space>
						</Row>
					</Col>
				</Row>

				<Row gutter={20} style={{ marginBottom: '20px' }}>
					<Col span={10}>
						<OdoPatientCard />
					</Col>
					<Col span={8}>
						<OdoNursingInfo />
					</Col>
				</Row>
				{alertMessage !== '' && (
					<Alert
						showIcon
						closable
						message={alertMessage}
						type='warning'
						style={{ marginBottom: '10px' }}
					/>
				)}
				<Card>
					<Tabs
						activeKey={key}
						tabPosition='left'
						onTabClick={setKey}
					>
						<TabPane tab='General' key='general'>
							<OdoGeneralInfoTab />
						</TabPane>
						<TabPane tab='Antecedentes' key='antecedentes'>
							<OdoFamilyHistoryTab />
						</TabPane>
						<TabPane tab='Indicadores' key='indicadores'>
							<OdoIndicatorsTab />
						</TabPane>
						<TabPane tab='Indices' key='indices'>
							<OdoCpoCeoRatioTab />
						</TabPane>
						<TabPane tab='Diagnósticos' key='diagnosticos'>
							<OdoDiagnosticsTab />
						</TabPane>
						<TabPane tab='Tratamientos' key='tratamientos'>
							<OdoTreatmentsTab />
						</TabPane>
						<TabPane
							tab='Odontograma'
							key='odontograma'
							forceRender
						>
							<OdoOdontogramTab ref={odontogramRef} />
						</TabPane>
						<TabPane tab='Acta' key='acta'>
							<OdoAct ref={odoActRef} recId={recId} />
						</TabPane>
					</Tabs>
				</Card>
			</div>
			<Modal
				title='Confirmación'
				visible={visible}
				okText='Guardar'
				cancelText='Cancelar'
				onOk={() => {
					setVisible(false)
					setTimeout(() => {
						onSave()
					}, 100)
				}}
				onCancel={() => setVisible(false)}
			>
				<p>¿Estas seguro de guardar?</p>
			</Modal>
		</>
	)
}
