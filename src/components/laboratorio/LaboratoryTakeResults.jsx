import React, { useState, useContext, useRef, useMemo } from 'react'
import { Button, Card, Col, Form, Input, message, Row, Space } from 'antd'
import { LaboratoryPatientCard } from './LaboratoryPatientCard'
import { PatientService } from '../../services/PatientService'
import { PendingOrdersCard } from './PendingOrdersCard'
import { OrderService } from '../../services/OrderService'
import LoaderContext from '../../contexts/LoaderContext'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { roundToTwo } from '../../utils/functions'
import { Parser } from 'expr-eval'
import { LaboratoryResultService } from '../../services/LaboratoryResultService'

export const LaboratoryTakeResults = () => {
	const gridRef = useRef(null)
	const { openLoader, closeLoader } = useContext(LoaderContext)
	const [patientInfo, setPatientInfo] = useState(null)
	const [pendingOrders, setPendingOrders] = useState([])
	const [tests, setTests] = useState([])
	const [form] = Form.useForm()
	const orderId = Form.useWatch('orderId', form)
  
	/**
	 * Handler para obtener los valores de la orden seleccionada
	 * Establece el valor de orderId en el form
	 * @param {object} currentOrder es la orden actualmente seleccionada
	 */
	const handleOrderSelected = (currentOrder) => {
		form.setFieldValue('orderId', currentOrder.id)
		gridRef.current.api.showLoadingOverlay()
		OrderService.getById(currentOrder.id)
			.then((order) => {
				const { tests } = order
				setTests(tests)
			})
			.finally(() => gridRef.current.api.hideOverlay())
	}

	/**
	 * Hanlder que busca el paciente por cédula y trae las ordenes pendientes
	 * Guarda la identification en el formulario , en caso de que lo borre del input
	 * @param {string} identification
	 */
	const handleSearch = async (identification) => {
		const p1 = PatientService.getByIdentification(identification)
		const p2 = OrderService.getPendingOrdersByIdentification(identification)

		form.setFieldValue('identification', identification)
		setPendingOrders([])
		setPatientInfo(null)
		setTests([])
		openLoader('Cargando información...')
		Promise.all([p1, p2])
			.then((values) => {
				const patient = values[0]
				const orders = values[1]
				console.log(patient, orders)
				setPatientInfo(patient)
				setPendingOrders(orders)
			})
			.catch((err) => console.log(err))
			.finally(() => closeLoader())
	}

	//Coldefs para las ag-grid
	const columnDefs = useMemo(() => {
		return [
			{
				headerName: 'Código',
				valueGetter: function (params) {
					if (params.data.test.formula) {
						return '⚗️ ' + params.data.test.code
					}
					return params.data.test.code
				},
				maxWidth: 150,
				sortable: true,
				filter: true,
				floatingFilter: true,
				suppressMenu: true,
			},
			{
				headerName: 'Prueba',
				field: 'test.name',
				flex: 1,
				sortable: true,
				filter: true,
				floatingFilter: true,
				suppressMenu: true,
			},
			{
				colId: 'resultado',
				headerName: 'Resultado',
				editable: (params) => {
					return !params.data.test.formula
				},
				valueGetter: function (params) {
					if (params.data.result) {
						return params.data.result
					} else {
						return undefined
					}
				},
				valueSetter: function (params) {
					params.data.result = params.newValue
					return true
				},
				valueParser: (params) => {
					if (params.newValue === '') return undefined
					if (params.data.test.isNumeric === 1) {
						if (isNaN(params.newValue)) {
							return undefined
						} else return Number(params.newValue)
					}
					return params.newValue
				},
				cellStyle: (params) => {
					if (
						typeof params.data.result === 'undefined' ||
						params.data.result === ''
					) {
						return null
					}

					if (params.colDef.colId !== 'resultado') return null
					if (
						typeof params.data.result === 'string' &&
						params.data.result.includes('Incalculable')
					)
						return { color: 'red' }
					if (params.data.test.refValue === '') return null

					if (params.data.test.refValue === 'M') {
						console.log(params.data.result)
						const value = params.data.result
						//if (isNaN(value)) return { color: "red" }
						if (params.data.test.operatorType === 'range') {
							const of = parseFloat(params.data.test.of)
							const until = parseFloat(params.data.test.until)
							console.log(value, of, until)
							return !(value >= of && value <= until)
								? { color: 'red' }
								: null //Si no está en el rango pinta de rojo
						} else if (params.data.test.operatorType === '<') {
							const operatorValue = parseFloat(
								params.data.test.operatorValue
							)
							return value < operatorValue
								? null
								: { color: 'red' }
						} else if (params.data.test.operatorType === '>') {
							const operatorValue = parseFloat(
								params.data.test.operatorValue
							)
							return value > operatorValue
								? null
								: { color: 'red' }
						} else if (params.data.test.operatorType === '=') {
							const operatorValue = parseFloat(
								params.data.test.operatorValue
							)
							return value === operatorValue
								? null
								: { color: 'red' }
						}
					} else if (params.data.test.refValue === 'C') {
						if (
							params.data.result.toLowerCase() !==
							params.data.test.qualitativeValue.toLowerCase()
						) {
							return { color: 'red' }
						}
						return null
					} else {
						//Si el valor de referencia es de tipo sexo
						const value = params.data.result
						const femaleOf = parseFloat(params.data.test.femaleOf)
						const femaleUntil = parseFloat(
							params.data.test.femaleUntil
						)
						const maleOf = parseFloat(params.data.test.maleOf)
						const maleUntil = parseFloat(params.data.test.maleUntil)

						if (!patientInfo.gender) return null
						if (patientInfo.gender === 'Masculino')
							return value >= maleOf && value <= maleUntil
								? null
								: { color: 'red' }
						if (patientInfo.gender === 'Femenino')
							return value >= femaleOf && value <= femaleUntil
								? null
								: { color: 'red' }
					}
				},
				//#F3748A
			},
			{
				headerName: 'Valores normales',
				valueGetter: function (params) {
					if (params.data.test.refValue === 'S') {
						console.log(patientInfo.gender)
						if (patientInfo.gender === 'Masculino') {
							return params.data.test.maleInterpretation
						} else if (patientInfo.gender === 'Femenino') {
							return params.data.test.femaleInterpretation
						}
					}
					return params.data.test.interpretation
					/*if (params.data.test.interpretation) {
            return params.data.test.interpretation
          } else {
            return params.data.test.qualitativeValue
          }*/
				},
			},
			{
				colId: 'observaciones',
				headerName: 'Observaciones',
				editable: true,
				valueGetter: function (params) {
					if (params.data.remarks) {
						return params.data.remarks
					} else {
						return undefined
					}
				},
				valueSetter: function (params) {
					/*if (!params.data.remarks) {
            params.data.remarks = "0"
           
          }*/
					params.data.remarks = params.newValue
					return true
				},
			},
		]
	}, [patientInfo])

	/**
	 * Devuelve un objeto con los operandos y sus valores necesarios para evaluar la formula
	 * con Parser library
	 * @param {Event} e evento del dataGrid
	 * @param {*} nodeParam nodo o fila del dataGrid
	 * @returns
	 */
	const getValuesOfOperands = (e, nodeParam) => {
		const valores = {}

		const operands = nodeParam.data.test.operands.split(',')
		//Recorremos todos los nodos para encontrar los valores de los operandos
		e.api.forEachNode((node) => {
			//Si el nodo(fila) codigo está en los operandos
			if (operands.some((oper) => oper === node.data.test.code)) {
				valores[node.data.test.code] = parseFloat(node.data.result)
			}
		})
		const keys = Object.keys(valores)
		const operandsNotFound = operands.filter((oper) => {
			if (!keys.includes(oper) || isNaN(valores[oper])) {
				return oper
			}
			return undefined
		})
		console.log(operands, keys, operandsNotFound)

		return operandsNotFound.length > 0 ? operandsNotFound : valores
	}

	/**
	 * Handler para calcular el valor de las pruebas con fórmula
	 * @param {Event} e
	 */
	const handleCellChange = (e) => {
		//Solo se autocalculará los valores de la columna resultado
		if (e.colDef.colId !== 'resultado') return
		const { isNumeric, code, formula } = e.data.test
		//Validamos que el campo sea numerico
		if (isNumeric !== 1) return
		//Si es un campo que tiene formula entonces evitamos el cellchange
		if (formula) return
		//Si el valor actual de la celda no es un número,
		//cambiamos a undefined los nodos que incluyen el código del nodo actual(prueba) en su formula
		if (isNaN(e.data.result)) {
			e.api.forEachNode((node) => {
				if (
					node.data.test.formula &&
					node.data.test.formula.includes(code)
				) {
					node.setDataValue('resultado', 'Incalculable')
				}
			})
			return
		}
		//Recorremos las filas
		e.api.forEachNode((node) => {
			//Verificamos si el nodo(prueba) tiene formula y
			//Validamos si el codigo de la celda editada está en la formula del nodo actual
			if (
				node.data.test.formula &&
				node.data.test.formula.includes(code)
			) {
				//Buscar valores de los operandos de la formula del nodo
				const valores = getValuesOfOperands(e, node)
				console.log(valores)
				if (Array.isArray(valores)) {
					//Si es un array entonces faltan operandos
					//Agregamos los operandos que faltan a la celda
					node.setDataValue(
						'resultado',
						'Incalculable: ' + valores.join(',')
					)
				} else {
					//Evaluamos la formula con los valores devueltos
					const parser = new Parser()
					const expr = parser.parse(node.data.test.formula)
					const result = roundToTwo(expr.evaluate(valores))
					node.setDataValue('resultado', result)
				}
			}
		})
	}

	const handleSave = async () => {
		try {
			openLoader('Guardando resultados...')
			//Preparar array solo con los datos necesarios
			const testConverted = tests.map((node) => {
				return {
					remarks: node.remarks,
					result:
						typeof node.result === 'string' &&
						node.result.includes('Incalculable')
							? undefined
							: node.result,
					isNumeric: node.test.isNumeric,
					id: node.test.id,
				}
			})
			const resultados = {
				orderId: form.getFieldValue('orderId'),
				tests: testConverted,
			}
			console.log(resultados)
			await LaboratoryResultService.saveResults(resultados)
			message.success('Resultados guardados correctamente')

			const ordenes = await OrderService.getPendingOrdersByIdentification(
				form.getFieldValue('identification')
			)

			setPendingOrders(ordenes)
			setTests([])
			form.resetFields(['orderId', 'identification'])
		} catch (error) {
			console.log(error)
		} finally {
			closeLoader()
		}
	}

	return (
		<Card title='Captura de resultados'>
			<Row justify='end' gutter={20} style={{ marginBottom: '10px' }}>
				<Col span={12}>
					<Input.Search
						placeholder='Buscar paciente por cédula'
						style={{ marginBottom: '10px' }}
						onSearch={handleSearch}
					/>
				</Col>
				<Col span={12}>
					<Row justify='end'>
						<Button
							type='primary'
							size='large'
							onClick={handleSave}
							disabled={!orderId}
						>
							Guardar
						</Button>
					</Row>
				</Col>
			</Row>
			<Form form={form}>
				<Form.Item noStyle hidden name='orderId'>
					<Input />
				</Form.Item>
				<Form.Item noStyle hidden name='identification'>
					<Input />
				</Form.Item>
			</Form>
			<Row gutter={20} style={{ marginBottom: '20px' }}>
				<Col span={12}>
					<LaboratoryPatientCard data={patientInfo} />
				</Col>
				<Col span={12}>
					<PendingOrdersCard
						orders={pendingOrders}
						onOrderChange={handleOrderSelected}
					/>
				</Col>
			</Row>

			<Card title='Pruebas seleccionadas'>
				<Row justify='end'>
					<Space direction='vertical'>
						<span>⚗️: Pruebas con fórmula</span>
						<span>
							<span style={{ color: 'red' }}>Incalculable</span>:
							Pruebas con valores faltantes para la formula
						</span>
						<span>
							<div
								style={{
									display: 'inline-block',
									width: '10px',
									height: '10px',
									backgroundColor: 'red',
									marginRight: '2px',
								}}
							/>
							<span>
								: Valores que no concuerdan con los valores
								normales
							</span>
						</span>
						<div style={{ display: 'inline-block' }}>
							<div></div>
						</div>
					</Space>
				</Row>
				<div
					className='ag-theme-alpine'
					style={{ height: 400, width: '100%' }}
				>
					<AgGridReact
						ref={gridRef}
						rowData={tests}
						columnDefs={columnDefs}
						rowSelection={'single'}
						debounceVerticalScrollbar={true}
						//pagination
						onCellValueChanged={handleCellChange}
						overlayLoadingTemplate={
							'<span class="ag-overlay-loading-center">Cargando pruebas...</span>'
						}
						overlayNoRowsTemplate={
							'<span class="text-center">No hay pruebas que mostrar</span>'
						}
						/*getRowStyle={(params)=>{
            if(params.data.test.formula) return {pointerEvents:"none",
            backgroundColor:"#886CE4",opacity:"0.4"}
            return null
          }}*/
						/*onCellKeyDown={(e) => {
            e.event.preventDefault()
            console.log(e);
            if (e.event.key === "Enter") {
              addTestToOrder({ ...e.data, tipo: "P" })
            }
          }}
          //tabToNextCell={tabToNextCell}
          onFilterChanged={(ev) => {
            const node = ev.api.getDisplayedRowAtIndex(0)
            if (node) node.setSelected(true)
          }}
          onRowDoubleClicked={(e) => {
            addTestToOrder({ ...e.data, tipo: "P" })
          }}*/
					></AgGridReact>
				</div>
			</Card>
		</Card>
	)
}
