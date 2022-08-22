import { Checkbox, Col, Divider, Form, Input, Radio, Row, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { setIndicator } from '../../../store/slices/odontology/odontologySlice'
import { connect } from 'react-redux'
import { EditableRow } from '../../antd/EditableRow'
import { EditableCell } from '../../antd/EditableCell'

/*const mapIndicators = (indicators) => {
	return indicators.map((ind) => ({
		...ind,
		selectedPieces: ind.selectedPieces.join(','),
	}))
}*/

const CheckCell = ({ pieces, selectedPieces, rowKey, onCheckChange }) => {
	//Handlers
	const handleChange = (value) => {
		onCheckChange(value, rowKey)
	}

	return (
		<>
			<Checkbox.Group
				options={pieces}
				onChange={handleChange}
				defaultValue={selectedPieces}
			/>
		</>
	)
}

const FILAS_PIEZAS = 6

const PIEZAS_DENTALES = [
	[16, 17, 55],
	[11, 21, 51],
	[26, 27, 65],
	[36, 37, 75],
	[31, 41, 71],
	[46, 47, 85],
]

export const createDataToIndicators = (details = []) => {
	const data = []
	for (let index = 0; index < FILAS_PIEZAS; index++) {
		const indicator = details.find((detail) => detail.rowPos === index)
		data.push({
			id: indicator?.id || null,
			key: 'pos' + index,
			rowPos: indicator?.rowPos || index,
			plaque: indicator?.plaque || 0,
			calc: indicator?.calc || 0,
			gin: indicator?.gin || 0,
			pieces: PIEZAS_DENTALES[index],
			selectedPieces: indicator?.selectedPieces
				? indicator?.selectedPieces
						.split(',')
						.map((piece) => parseInt(piece))
				: [],
		})
	}
	console.log(data)
	return data
}

const initialForm = {
	id: null,
	perDisease: null,
	badOcclu: null,
	fluorosis: null,
	plaqueTotal: 0,
	calcTotal: 0,
	ginTotal: 0,
}

const OdoIndicatorsTab = ({ indicator, update }) => {
	//States
	const [form] = Form.useForm()
	//const [form, setForm] = useState(initialForm)
	const [indicators, setIndicators] = useState([])

	/**
	 * Handler que actualiza el valor de los checks en la columna 'piezas dentales
	 * @param {Array} selectedKeys
	 * @param {string} rowKey
	 */
	const handleChecksCell = (selectedKeys, rowKey) => {
		console.log(selectedKeys)
		const newData = [...indicators]
		const index = newData.findIndex((item) => rowKey === item.key)
		const item = { ...newData[index] }
		item.selectedPieces = selectedKeys
		newData.splice(index, 1, { ...item })
		setIndicators(newData)
		update({
			...form.getFieldsValue(),
			indicators: newData,
		})
	}

	const defaultColumns = [
		{
			title: 'Piezas dentales',
			dataIndex: 'pieces',
			render: (_, record) => {
				return (
					<CheckCell
						rowKey={record.key}
						pieces={record?.pieces?.map((piece) => ({
							label: piece,
							value: piece,
						}))}
						selectedPieces={record.selectedPieces}
						onCheckChange={handleChecksCell}
					/>
				)
			},
		},
		{
			title: 'Placa 0-1-2-3-9',
			dataIndex: 'plaque',
			editable: true,
		},
		{
			title: 'Cálculo 0-1-2-3',
			dataIndex: 'calc',
			editable: true,
		},
		{
			title: 'Gingivitis 0-1',
			dataIndex: 'gin',
			editable: true,
		},
	]

	/**
	 * Handler para administrar cuando se guarda un cambio en la celda
	 * @param {object} row
	 */
	const handleCellSave = (row, dataIndex) => {
		const newData = [...indicators]
		const index = newData.findIndex((item) => row.key === item.key)
		const item = newData[index]
		newData.splice(index, 1, { ...item, ...row })
		const total = newData.reduce((previousValue, currentValue) => {
			return previousValue + parseFloat(currentValue[dataIndex])
		}, 0)
		console.log(total)
		form.setFieldValue(`${dataIndex}Total`, total)
		setIndicators(newData)
		update({ ...form.getFieldsValue(), indicators: newData })
	}

	const columns = defaultColumns.map((col) => {
		if (!col.editable) {
			return col
		}

		return {
			...col,
			onCell: (record) => ({
				record,
				editable: col.editable,
				dataIndex: col.dataIndex,
				title: col.title,
				parseCell: (currentValue) => {
					console.log(record)
					const newValue = parseInt(currentValue)
					return isNaN(newValue) ? 0 : newValue
				},
				handleSave: handleCellSave,
			}),
		}
	})

	const components = {
		body: {
			row: EditableRow,
			cell: EditableCell,
		},
	}

	const handleValuesChange = (values) => {
		update({
			...form.getFieldsValue(),
			indicators,
		})
	}

	useEffect(() => {
		setIndicators(createDataToIndicators([]))
	}, [])

	useEffect(() => {
		if (indicator) {
			const dataForEdit = {
				id: indicator.id,
				perDisease: indicator.perDisease,
				badOcclu: indicator.badOcclu,
				fluorosis: indicator.fluorosis,
				calcTotal: indicator.calcTotal,
				plaqueTotal: indicator.plaqueTotal,
				ginTotal: indicator.ginTotal,
			}
			form.setFieldsValue(dataForEdit)
			const details = createDataToIndicators(indicator.details)
			setIndicators(details)
			update({
				...dataForEdit,
				indicators: details,
			})
		}
	}, [indicator])

	return (
		<>
			<div>
				<h3>Indicadores de salud bucal</h3>
				<div>
					<Form
						layout='vertical'
						form={form}
						initialValues={initialForm}
						onValuesChange={handleValuesChange}
					>
						<Form.Item noStyle hidden name='id'>
							<Input type='hidden' />
						</Form.Item>
						<Row>
							<Col span={12}>
								<Form.Item
									label='Enfermedad periodontal'
									name='perDisease'
								>
									<Radio.Group>
										<Radio value={'Leve'}>Leve</Radio>
										<Radio value={'Moderada'}>
											Moderada
										</Radio>
										<Radio value={'Severa'}>Severa</Radio>
									</Radio.Group>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label='Mal oclusión' name='badOcclu'>
									<Radio.Group>
										<Radio value={'Angle I'}>Angle I</Radio>
										<Radio value={'Angle II'}>
											Angle II
										</Radio>
										<Radio value={'Angle III'}>
											Angle III
										</Radio>
									</Radio.Group>
								</Form.Item>
							</Col>
						</Row>

						<Row>
							<Col span={12}>
								<Form.Item label='Fluorosis' name='fluorosis'>
									<Radio.Group>
										<Radio value={'Leve'}>Leve</Radio>
										<Radio value={'Moderada'}>
											Moderada
										</Radio>
										<Radio value={'Severa'}>Severa</Radio>
									</Radio.Group>
								</Form.Item>
							</Col>
						</Row>
						<Divider />
						<Row gutter={10}>
							<Col span={8}>
								<Form.Item
									label='Total placa'
									name='plaqueTotal'
								>
									<Input disabled />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item
									label='Total calculo'
									name='calcTotal'
								>
									<Input disabled />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item
									label='Total gingivitis'
									name='ginTotal'
								>
									<Input disabled />
								</Form.Item>
							</Col>
						</Row>
					</Form>

					{/*<TablaIndicadores />*/}
					<Table
						columns={columns}
						dataSource={indicators}
						components={components}
						rowClassName={() => 'editable-row'}
					/>
				</div>
			</div>
		</>
	)
}

const mapStateToProps = (state) => {
	return {
		indicator: state.odontology.data.indicator,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		update: (value) => dispatch(setIndicator(value)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(OdoIndicatorsTab)
