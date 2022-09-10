import { Alert, Button, Form, Row, Space, message } from 'antd'
import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	useRef,
} from 'react'
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
import { axiosErrorHandler } from '../../handlers/axiosErrorHandler'

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
							area: {
								name: area.name,
								code: area.code,
								key: `area-${area.id}`,
							},
							group: {
								name: group.name,
								code: group.code,
								key: `group-${group.id}`,
							},
							key: `test-${test.id}`,
						}
					}),
				}
			}),
		}
	})
}

export const NewCitation = () => {
	const { user } = useUser()
	const { openLoader, closeLoader } = useContext(LoaderContext)
	const { visible } = useContext(QrModalContext)
	//States
	const selectedTests = useRef([])
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
					return {
						id: item.id,
						code: item.code,
						price: item.price,
						key: item.key,
						title,
						area: item.area,
						group: item.group,
						children: loop(item.children),
					}
				}
				return {
					id: item.id,
					code: item.code,
					price: item.price,
					key: item.key,
					title,
					area: item.area,
					group: item.group,
				}
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
				console.log(selectedTests.current)
				if (!patient.id) {
					setShowPatientNotFoundAlert(true)
					return
				}
				openLoader('Guardando cita...')
				await CitationService.createCitation({
					...values,
					patientId: patient.id,
					userId: user?.id,
					tests: selectedTests.current,
				})
				form.resetFields()
				setTestsOfPatient([])
				selectedTests.current = []
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
			const newTests = [...testsOfPatient]
			const area = newTests.find(
				(area) => area.code === testParam.area.code
			)
			if (!area) {
				const newArea = {
					key: testParam.area.key,
					code: testParam.area.code,
					name: testParam.area.name,
					price: 0,
					children: [
						{
							code: testParam.group.code,
							name: testParam.group.name,
							price: 0,
							key: testParam.group.key,
							children: [testParam],
						},
					],
				}
				newTests.push(newArea)
				selectedTests.current.push(testParam)
				setTestsOfPatient(newTests)
				console.log(selectedTests)
			}
			if (area) {
				const group = area.children.find(
					(group) => group.code === testParam.group.code
				)

				if (group) {
					const index = group.children.findIndex(
						(test) => test.code === testParam.code
					)

					if (index < 0) {
						//No permite tests duplicados
						group.children.push(testParam)
						selectedTests.current.push(testParam)
						setTestsOfPatient(newTests)
					}
				} else {
					//Si no existe el grupo, se agregar el grupo con el test pasado por parametro
					area.children.push({
						code: testParam.group.code,
						name: testParam.group.name,
						key: testParam.group.key,
						children: [testParam],
					})
					selectedTests.current.push(testParam)
					setTestsOfPatient(newTests)
				}
			}
			const total = selectedTests.current.reduce((acc, current) => {
				return acc + (current.price ?? 0)
			}, 0)
			form.setFieldValue('value', total)
		},
		[testsOfPatient]
	)

	const deleteTest = useCallback(
		(record) => {
			const newTests = [...testsOfPatient]
			const areaIndex = newTests.findIndex(
				(area) => area.code === record.area.code
			)
			const area = newTests[areaIndex]
			const groupIndex = area.children.findIndex(
				(group) => group.code === record.group.code
			)
			if (groupIndex >= 0) {
				const group = area.children[groupIndex]
				const filterTests = group.children.filter(
					(test) => test.code !== record.code
				)
				if (filterTests.length === 0) {
					//Si se eliminaron todos los test del grupo, entonces se borra el grupo tambien
					area.children.splice(groupIndex, 1)
					if (area.children.length === 0) {
						newTests.splice(areaIndex, 1)
					}
				} else {
					group.children = filterTests
				}

				setTestsOfPatient(newTests)
				selectedTests.current = selectedTests.current.filter(
					(test) => test.code !== record.code
				)
				const total = selectedTests.current.reduce((acc, current) => {
					return acc + (current.price ?? 0)
				}, 0)
				form.setFieldValue('value', total)
			}
		},
		[testsOfPatient]
	)

	const onNodeClick = useCallback(
		(e, node) => {
			console.log(e, node)
			const { id, code, title, price, children, area, group } = node
			const strTitle = title.props.children
			if (typeof children === 'undefined' && showLaboratorioInfo)
				addTest({
					id,
					code,
					name: strTitle,
					price,
					area,
					group,
					key: `test-${id}`,
				})
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
			const { message: errorMessage } = axiosErrorHandler(error)
			message.error(errorMessage)
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
								<Link to={'/caja/pacientes/nuevo'}>
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
							showQrButton={false}
							showReloadButton={false}
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
