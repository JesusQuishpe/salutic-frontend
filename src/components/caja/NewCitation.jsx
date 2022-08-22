import { Alert, Button, Form, Row, Space, message } from 'antd'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import LoaderContext from '../../contexts/LoaderContext'
import QrModalContext from '../../contexts/QrModalContext'
import useUser from '../../hooks/useUser'
import { AreaService } from '../../services/AreaService'
import CustomSearch from '../qr/CustomSearch'
import { FolderOutlined } from '@ant-design/icons'
import { PatientService } from '../../services/PatientService'
import TestTree from './TestTree'
import PatientCard from './PatientCard'
import NewCitationCard from './NewCitationCard'
import { QRModal } from '../qr/QRModal'
import TestTable from './TestTable'
import { CitationService } from '../../services/CitationService'

const getItem = ({ id, code, price, key, title, icon, children }) => {
	return {
		id,
		code,
		price,
		key,
		title,
		icon,
		children,
	}
}

const getAreasMapped = (areas) => {
	return areas.map((area) => {
		return {
			title: area.name,
			key: `area-${area.id}`,
			icon: <FolderOutlined />,
			children: area.groups.map((group) => {
				return {
					title: group.name,
					key: `group-${group.id}`,
					icon: <FolderOutlined />,
					children: group.tests.map((test) => {
						return {
							id: test.id,
							code: test.code,
							price: test.price,
							title: test.name,
							key: `test-${test.id}`,
						}
					}),
				}
			}),
		}
	})
}

export const NewCitation = () => {
	//Custom hook
	const { user } = useUser()
	//Contexts
	//const { openToast } = useContext(ToastContext)
	const { openLoader, closeLoader } = useContext(LoaderContext)
	const { visible } = useContext(QrModalContext)
	//States
	const [form] = Form.useForm()
	const [areas, setAreas] = useState([])
	const [showLaboratorioInfo, setShowLaboratorioInfo] = useState(false)
	const [hiddenAlert, setHiddenAlert] = useState(true)
	//const [showPdfQr, setShowPdfQr] = useState(false)
	const [showPatientNotFoundAlert, setShowPatientNotFoundAlert] =
		useState(false)
	const [patient, setPatient] = useState({})
	const [testsOfPatient, setTestsOfPatient] = useState([])
	const [searchValue, setSearchValue] = useState('')

	const areasMapped = getAreasMapped(areas)

	const treeData = useMemo(() => {
		const loop = (data) => {
			return data.map((item) => {
				const strTitle = item.title
				const titleLower = strTitle.toLowerCase()
				const title =
					searchValue &&
					titleLower.includes(searchValue.toLowerCase()) ? (
						<span style={{ backgroundColor: '#FAAD14' }}>
							{strTitle}
						</span>
					) : (
						<span>{strTitle}</span>
					)

				if (item.children) {
					return getItem({
						id: item.id,
						code: item.code,
						price: item.price,
						key: item.key,
						title,
						children: loop(item.children),
					})
				}
				return getItem({
					id: item.id,
					code: item.code,
					price: item.price,
					key: item.key,
					title,
				})
			})
		}
		return loop(areasMapped)
	}, [searchValue, areasMapped])

	const loadAreas = async () => {
		const areas = await AreaService.getAreasWithGroupsAndTests()
		console.log(areas)
		setAreas(areas)
	}

	/**
	 * Guarda la cita y las pruebas seleccionadas en caso del area Laboratorio
	 * @param {Event} e
	 * @returns
	 */
	const save = useCallback(
		async (values) => {
			try {
				console.log(values)
				if (!patient.id) {
					setShowPatientNotFoundAlert(true)
					return
				}
				openLoader('Guardando cita...')
				await CitationService.createCitation({
					...values,
					patientId: patient.id,
					userId: user?.id,
					tests: testsOfPatient,
				})
				form.resetFields()
				setTestsOfPatient([])
				message.success('Cita creada')
			} catch (error) {
				console.log(error)
				message.error('No se pudo crear la cita')
			} finally {
				closeLoader()
			}
		},
		[patient, testsOfPatient]
	)

	useEffect(() => {
		loadAreas()
	}, [])

	const addTest = useCallback(
		(testParam) => {
			const index = testsOfPatient.findIndex(
				(test) => test.id === testParam.id
			)
			const newTests = [
				...testsOfPatient,
				{ key: testParam.id, ...testParam },
			]
			console.log(newTests)
			if (index < 0) {
				const total = newTests.reduce((acc, current) => {
					return acc + (current.price ?? 0)
				}, 0)
				console.log(total)
				const values = form.getFieldsValue()
				form.setFieldsValue({ ...values, value: total })
				setTestsOfPatient(newTests)
			}
		},
		[testsOfPatient]
	)

	const deleteTest = useCallback(
		(id) => {
			const newTests = testsOfPatient.filter((test) => test.id !== id)
			const total = newTests.reduce((acc, current) => {
				return acc + (current.price ?? 0)
			}, 0)
			const values = form.getFieldsValue()
			form.setFieldsValue({ ...values, value: total })
			setTestsOfPatient(newTests)
		},
		[testsOfPatient]
	)

	const onNodeClick = useCallback(
		(e, node) => {
			console.log(e, node)
			const { id, code, title, price, children } = node
			const strTitle = title.props.children
			if (typeof children === 'undefined' && showLaboratorioInfo)
				addTest({ id, code, name: strTitle, price })
		},
		[addTest, showLaboratorioInfo]
	)

	/**
	 *
	 * @param {string} code es el numero de cedula del paciente
	 */
	const searchByQR = async (code) => {
		try {
			if (!code) return
			openLoader('Buscando...')
			const patient = await PatientService.getByIdentification(code)
			setPatient({ ...patient })
			closeLoader()
		} catch (error) {
			if (error.response.status === 404) {
				alert('Registro no encontrado')
			}
			console.log(error)
		} finally {
			closeLoader()
		}
	}

	const enableTests = useCallback((value) => {
		setShowLaboratorioInfo(value)
	}, [])

	return (
		<>
			{
				<div className='p-4'>
					<div>
						<h2>Nueva cita</h2>
						<Row justify='end' style={{ marginBottom: 20 }}>
							<Space>
								<Link to={'/pacientes/nuevo'}>
									<Button type='primary'>
										Nuevo paciente
									</Button>
								</Link>
								<Button
									type='default'
									htmlType='submit'
									form='form-citas'
								>
									Crear cita
								</Button>
							</Space>
						</Row>

						<CustomSearch
							onSearch={searchByQR}
							allowClear
							placeholder={'Buscar paciente por número de cédula'}
						/>
						{!hiddenAlert && (
							<Alert
								type='error'
								message='No existe el paciente'
								showIcon
								closable
								onClose={() => setHiddenAlert(true)}
							/>
						)}
						{showPatientNotFoundAlert && (
							<Alert
								type='error'
								message='Debe buscar un paciente para poder crear la cita'
								showIcon
								closable
								onClose={() =>
									setShowPatientNotFoundAlert(false)
								}
							/>
						)}
					</div>

					<Row
						style={{ marginTop: '20px', marginBottom: '20px' }}
						gutter={20}
					>
						<PatientCard patient={patient} />
						<NewCitationCard
							enableTests={enableTests}
							form={form}
							onSubmit={save}
						/>
					</Row>
					<Row gutter={20}>
						<TestTree
							defaultTreeData={areasMapped}
							treeData={treeData}
							showLaboratorioInfo={showLaboratorioInfo}
							onNodeClick={onNodeClick}
							updateSearchValue={(value) => setSearchValue(value)}
						/>
						<TestTable
							tests={testsOfPatient}
							deleteTest={deleteTest}
						/>
					</Row>
					{visible && <QRModal handleSearch={searchByQR} />}
				</div>
			}
		</>
	)
}
