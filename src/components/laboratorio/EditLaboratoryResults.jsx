import { Button, Card, Col, message, Row, Space } from 'antd'
import React, { useEffect, useRef, useState, useContext } from 'react'
import { LaboratoryPatientCard } from './LaboratoryPatientCard'
import { useParams } from 'react-router-dom'
import { LaboratoryResultService } from '../../services/LaboratoryResultService'
import { LaboratoryOrderCard } from './LaboratoryOrderCard'
import { roundToTwo } from '../../utils/functions'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { Parser } from 'expr-eval'

import LoaderContext from '../../contexts/LoaderContext'
import { END_POINT } from '../../utils/conf'
import { axiosErrorHandler } from '../../handlers/axiosErrorHandler'
import { ContentNotFound } from '../not-found/ContentNotFound'

const getPatientInfo = (result) => {
	return {
		name: result.name,
		lastname: result.lastname,
		address: result.address,
		gender: result.gender,
		identification: result.identification,
		cellphone: result.cellpone,
	}
}

const getOrderInfo = (result) => {
	return {
		orderId: result.orderId,
		date: result.orderDate,
		hour: result.orderHour,
		orderItems: result.orderItems,
		orderTotal: result.orderTotal,
	}
}

export const EditLaboratoryResults = () => {
	const gridRef = useRef(null)
	const { openLoader, closeLoader } = useContext(LoaderContext)
	const { resultId } = useParams()
	const [patientInfo, setPatientInfo] = useState(null)
	const [orderInfo, setOrderInfo] = useState(null)
	const [tests, setTests] = useState(null)
	const [responseError, setResponseError] = useState(false)
  const [notFound, setNotFound] = useState(false)
	/**
	 * Este metodo agrega la propiedad "result" para evitar errores en
	 * el valueGetter de la columna resultado de la tabla
	 * @param {Array} tests
	 * @returns
	 */
	const addIsFirstTimePropertyToData = (tests) => {
		return tests.map((test) => ({
			...test,
			isFirstTime: true,
			result:
				test.isNumeric === 1
					? test.numericResult
					: test.stringResult
					? test.stringResult
					: '',
		}))
	}

	const loadResult = () => {
		openLoader('Cargando datos...')
		setPatientInfo(null)
		setOrderInfo(null)
		setTests([])
		LaboratoryResultService.getResultById(resultId)
			.then((result) => {
				console.log(result)
				setPatientInfo(getPatientInfo(result))
				setOrderInfo(getOrderInfo(result))
				//console.log(addIsFirstTimePropertyToData(result.tests))
				setTests(addIsFirstTimePropertyToData(result.tests))
			})
			.catch((error) => {
				console.log(error)
				const { status } = axiosErrorHandler(error)
				if (status && status === 404) {
					setNotFound(true)
				}
			})
			.finally(() => closeLoader())
	}
	const columnDefs = [
		{
			headerName: 'Código',
			valueGetter: function (params) {
				if (params.data.formula) {
					return '⚗️ ' + params.data.code
				}
				return params.data.code
			},
			maxWidth: 150,
			sortable: true,
			filter: true,
			floatingFilter: true,
			suppressMenu: true,
		},
		{
			headerName: 'Prueba',
			field: 'name',
			width: 400,
			sortable: true,
			filter: true,
			floatingFilter: true,
			suppressMenu: true,
		},
		{
			colId: 'resultado',
			headerName: 'Resultado',
			editable: (params) => {
				return !params.data.formula
			},
			valueGetter: function (params) {
				return params.data.result
			},
			valueSetter: function (params) {
				params.data.result = params.newValue
				return true
			},
			valueParser: (params) => {
				if (params.newValue === '') return null
				if (params.data.isNumeric === 1) {
					if (isNaN(params.newValue)) {
						return null
					} else {
						return Number(params.newValue)
					}
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
				if (params.data.refValue === '') return null

				if (params.data.refValue === 'M') {
					const value = params.data.result
					if (params.data.operatorType === 'range') {
						const of = parseFloat(params.data.of)
						const until = parseFloat(params.data.until)
						//console.log(value, of, until);
						return !(value >= of && value <= until)
							? { color: 'red' }
							: null //Si no está en el rango pinta de rojo
					} else if (params.data.operatorType === '<') {
						const operatorValue = parseFloat(
							params.data.operatorValue
						)
						return value < operatorValue ? null : { color: 'red' }
					} else if (params.data.operatorType === '>') {
						const operatorValue = parseFloat(
							params.data.operatorValue
						)
						return value > operatorValue ? null : { color: 'red' }
					} else if (params.data.operatorType === '=') {
						const operatorValue = parseFloat(
							params.data.operatorValue
						)
						return value === operatorValue ? null : { color: 'red' }
					}
				} else if (params.data.refValue === 'C') {
					if (
						params.data.result.toLowerCase() !==
						params.data.qualitativeValue.toLowerCase()
					) {
						return { color: 'red' }
					}
					return null
				} else {
					//Si el valor de referencia es de tipo sexo
					const value = params.data.result
					const femaleOf = parseFloat(params.data.femaleOf)
					const femaleUntil = parseFloat(params.data.femaleUntil)
					const maleOf = parseFloat(params.data.maleOf)
					const maleUntil = parseFloat(params.data.maleUntil)

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
		},
		{
			headerName: 'Valores normales',
			valueGetter: function (params) {
				if (params.data.refValue === 'S') {
					if (patientInfo.gender === 'Masculino') {
						return params.data.maleInterpretation
					} else {
						return params.data.femaleInterpretation
					}
				}
				return params.data.interpretation
			},
		},
		{
			colId: 'observaciones',
			headerName: 'Observaciones',
			editable: true,
			flex: 1,
			valueGetter: function (params) {
				if (params.data.remarks) {
					return params.data.remarks
				} else {
					return undefined
				}
			},
			valueSetter: function (params) {
				/*if (!params.data.observaciones) {
        params.data.observaciones = "0"
       
      }*/
				params.data.remarks = params.newValue
				return true
			},
		},
	]

	/**
	 * Devuelve un objeto con los operandos y sus valores
	 * @param {Event} e evento del dataGrid
	 * @param {*} nodeParam
	 * @returns object | Array
	 */
	const getValuesOfOperands = (e, nodeParam) => {
		const valores = {}
		//console.log(Object.key);
		const operands = nodeParam.data.operands.split(',')
		//Recorremos todos los nodos para encontrar los valores de los operandos
		e.api.forEachNode((node) => {
			//Si el nodo(fila) codigo está en los operandos
			if (operands.some((oper) => oper === node.data.code)) {
				valores[node.data.code] = parseFloat(node.data.result) //Validar cuando es undefined, vacio y NAN
			}
		})
		const keys = Object.keys(valores)
		const operandsNotFound = operands.filter((oper) => {
			if (!keys.includes(oper) || isNaN(valores[oper])) {
				return oper
			}
			return undefined
		})
		console.log(operands, keys, operandsNotFound, valores)

		return operandsNotFound.length > 0 ? operandsNotFound : valores
	}

	/**
	 * Manejador para calcular el valor de las pruebas con formula
	 * @param {*} e
	 */
	const handleCellChange = (e) => {
		//Solo se autocalculará los valores de la columna resultado
		if (e.colDef.colId !== 'resultado') return
		const { isNumeric, code, formula } = e.data
		//Verificamos que el campo sea numerico
		if (isNumeric !== 1) return
		//Si es un campo que tiene formula entonces evitamos el cellchange
		if (formula) return
		//Si no es un numero, cambiamos a undefined los nodos que incluyen el codigo en su formula
		if (isNaN(e.data.result)) {
			e.api.forEachNode((node) => {
				if (node.data.formula && node.data.formula.includes(code)) {
					node.setDataValue('resultado', 'Incalculable')
				}
			})
			return
		}
		//Recorremos las filas
		e.api.forEachNode((node) => {
			//Verificamos si el nodo(fila) tiene formula
			//Si el codigo de la celda editada está en la formula del nodo actual
			if (node.data.formula && node.data.formula.includes(code)) {
				//Buscar valores de los operandos de la formula en las pruebas
				const valores = getValuesOfOperands(e, node)
				if (Array.isArray(valores)) {
					//Si es array entonces faltan operandos
					node.setDataValue(
						'resultado',
						'Incalculable: ' + valores.join(',')
					)
				} else {
					const parser = new Parser()
					const expr = parser.parse(node.data.formula)
					const result = roundToTwo(expr.evaluate(valores))
					node.setDataValue('resultado', result)
				}
			}
		})
	}

	useEffect(() => {
		loadResult()
	}, [])

	const getAgGridRows = () => {
		const rowData = []
		gridRef.current.api.forEachNode((node) => rowData.push(node.data))
		return rowData
	}

	const handleSave = async () => {
		try {
			openLoader('Guardando resultados...')
			const tests = getAgGridRows()
			const testsConverted = tests.map((node) => {
				return {
					remarks: node.remarks,
					result:
						typeof node.result === 'string' &&
						node.result.includes('Incalculable')
							? undefined
							: node.result,
					isNumeric: node.isNumeric,
					detailId: node.detailId,
				}
			})

			const captura = {
				resultId,
				tests: testsConverted,
			}
			console.log(captura)
			await LaboratoryResultService.updateResults(captura, resultId)
			message.success('Resultados guardados correctamente')
			//setTests([])
			openLoader('Actualizando parámetros de la UI...')
			loadResult(resultId)
		} catch (error) {
			console.log(error)
		} finally {
			closeLoader()
		}
	}


  if (notFound) {
		return <ContentNotFound />
	}

	return (
		<Card title='Actualizar resultados'>
			<Row justify='end' style={{ marginBottom: '10px' }}>
				<Space>
					<Button
						danger
						href={END_POINT + `resultado/pdf/${resultId}`}
						target='_blank'
						size='large'
						disabled={!resultId || responseError}
					>
						Ver PDF
					</Button>
					<Button
						type='primary'
						size='large'
						onClick={handleSave}
						disabled={!resultId || responseError}
					>
						Actualizar
					</Button>
				</Space>
			</Row>
			<Row gutter={20} style={{ marginBottom: '10px' }}>
				<Col span={12}>
					<LaboratoryPatientCard data={patientInfo} />
				</Col>
				<Col span={12}>
					<LaboratoryOrderCard data={orderInfo} />
				</Col>
			</Row>
			<div
				className='ag-theme-alpine'
				style={{ height: 400, width: '100%' }}
			>
				<AgGridReact
					ref={gridRef}
					rowData={tests}
					resetRowDataOnUpdate
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
				/>
			</div>
		</Card>
	)
}
