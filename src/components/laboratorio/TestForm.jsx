import React, { useContext, useEffect, useState } from 'react'
import {
	Form,
	Row,
	Col,
	Card,
	Input,
	Select,
	Divider,
	Button,
	Checkbox,
	message,
} from 'antd'
import { useParams } from 'react-router-dom'
import { GroupService } from '../../services/GroupService'
import { MeasurementUnitService } from '../../services/MeasurementUnitService'
import { MathematicLayout } from './MathematicLayout'
import { QualitativeLayout } from './QualitativeLayout'
import { GenderLayout } from './GenderLayout'
import { CustomInputNumber } from '../antd/CustomInputNumber'
import { TestService } from '../../services/TestService'
import { getOperands } from '../../utils/functions'
import LoaderContext from '../../contexts/LoaderContext'
import CalculatorIcon from '../../assets/png/calculator.png'
import { ModalFormula } from './ModalFormula'

const { Option } = Select

const initialForm = {
	groupId: null,
	unitId: null,
	code: '',
	name: '',
	refValue: null,
	operatorType: 'range',
	of: 0,
	until: 0,
	operatorValue: '',
	interpretation: '',
	maleOf: 0,
	maleUntil: 0,
	maleInterpretation: '',
	femaleOf: 0,
	femaleUntil: 0,
	femaleInterpretation: '',
	qualitativeValue: '',
	price: 0,
	isNumeric: false,
	formula: '',
	notes: '',
}

export const TestForm = () => {
	const { testId } = useParams()
	const { openLoader, closeLoader } = useContext(LoaderContext)
	const [groups, setGroups] = useState([])
	const [units, setUnits] = useState([])
	const [showModal, setShowModal] = useState(false)
	const [form] = Form.useForm()
	const refValue = Form.useWatch('refValue', form)
	const formula = Form.useWatch('formula', form)

	const isEdit = !!testId

	const loadGroups = () => {
		GroupService.getGroups().then((groups) => {
			setGroups(
				groups.map((group) => ({
					label: group.name,
					value: group.id,
				}))
			)
		})
	}

	const loadUnits = () => {
		MeasurementUnitService.getUnits().then((units) => {
			setUnits(
				units.map((unit) => ({
					label: unit.name + '  ' + unit.abbreviation,
					value: unit.id,
				}))
			)
		})
	}

	const loadTestById = () => {
		TestService.getById(testId).then((test) => {
			console.log(test)
			form.setFieldsValue({
				groupId: test.groupId,
				unitId: test.measureId,
				code: test.code,
				name: test.name,
				refValue: test.refValue,
				operatorType: test.operatorType,
				of: test.of,
				until: test.until,
				operatorValue: test.operatorValue,
				interpretation: test.interpretation,
				maleOf: test.maleOf,
				maleUntil: test.maleUntil,
				maleInterpretation: test.maleInterpretation,
				femaleOf: test.femaleOf,
				femaleUntil: test.femaleUntil,
				femaleInterpretation: test.femaleInterpretation,
				qualitativeValue: test.qualitativeValue,
				price: test.price,
				isNumeric: test.isNumeric,
				formula: test.formula,
				notes: test.notes,
			})
		})
	}
	const handleSubmit = async (values) => {
		console.log(values)
		try {
			openLoader(isEdit ? 'Actualizando datos...' : 'Creando prueba...')
			const operands = getOperands(values.formula)
			const newValues = { ...values, operands }
			if (isEdit) {
				await TestService.updateTest(newValues, testId)
			} else {
				await TestService.createTest(newValues)
			}
			message.success(
				isEdit
					? 'Datos actualizados correctamente'
					: 'Prueba creada correctamente'
			)
		} catch (error) {
			console.log(error)
		} finally {
			closeLoader()
		}
	}

	/**
	 * Handler para setear el valor de isNumeric dependiendo del valor
	 * de referencia seleccionado
	 * @param {string} value
	 */
	const handleOnChangeValueRef = (value) => {
		if (value === 'M' && !form.getFieldValue('operatorType')) {
			form.setFieldValue('operatorType', 'range')
		}
		if (value === 'M' || value === 'S') {
			form.setFieldValue('isNumeric', true)
		} else {
			form.setFieldValue('isNumeric', false)
		}
	}

	useEffect(() => {
		loadGroups()
		loadUnits()
		if (testId) {
			loadTestById(testId)
		}
	}, [])

	const updateFormulaInForm = (value) => {
		form.setFieldValue('formula', value)
	}
	return (
		<>
			<Row style={{ width: '100%' }}>
				<Col span={24}>
					<Card title={isEdit ? 'Actualizar prueba' : 'Crear prueba'}>
						<Row justify='end' style={{ marginBottom: '10px' }}>
							<Button
								type='primary'
								htmlType='submit'
								form='form-test'
							>
								{isEdit ? 'Actualizar' : 'Guardar'}
							</Button>
						</Row>
						<Form
							name='form-test'
							form={form}
							initialValues={initialForm}
							onFinish={handleSubmit}
							labelCol={{
								span: 3,
							}}
						>
							<Form.Item
								label='Código'
								name='code'
								extra='Máx 20 caracteres'
								rules={[
									{
										required: true,
										message: 'El campo es requerido',
									},
								]}
							>
								<Input />
							</Form.Item>
							<Form.Item
								label='Nombre'
								name='name'
								extra='Máx 50 caracteres'
								rules={[
									{
										required: true,
										message: 'El campo es requerido',
									},
									{
										max: 50,
										message: 'Caracteres permitidos 50 max',
									},
								]}
							>
								<Input maxLength={50} />
							</Form.Item>
							<Form.Item
								label='Grupo'
								name='groupId'
								rules={[
									{
										required: true,
										message: 'El campo es requerido',
									},
								]}
							>
								<Select
									placeholder='Seleccione un grupo'
									allowClear
									options={groups}
								/>
							</Form.Item>
							<Form.Item label='Unidad' name='unitId'>
								<Select
									placeholder='Seleccione una unidad de medida'
									allowClear
									options={units}
								/>
							</Form.Item>
							<Form.Item
								label='Valor de referencia'
								name='refValue'
								rules={[
									{
										required: true,
										message: 'El campo es requerido',
									},
								]}
							>
								<Select
									placeholder='Seleccione un valor de referencia'
									allowClear
									onChange={handleOnChangeValueRef}
								>
									<Option value='M'>Matemático</Option>
									<Option value='C'>Cualitativo</Option>
									<Option value='S'>Sexo</Option>
								</Select>
							</Form.Item>
							{refValue === 'M' ? (
								<MathematicLayout />
							) : refValue === 'C' ? (
								<QualitativeLayout />
							) : refValue === 'S' ? (
								<GenderLayout />
							) : (
								''
							)}
							<Divider />
							<Form.Item
								valuePropName='checked'
								label='Es numérico'
								name='isNumeric'
							>
								<Checkbox disabled />
							</Form.Item>
							<Form.Item label='Fórmula'>
								<Row gutter={8}>
									<Col flex={5}>
										<Form.Item name='formula' noStyle>
											<Input disabled />
										</Form.Item>
									</Col>
									<Col flex={'none'}>
										<Button
											onClick={() => setShowModal(true)}
										>
											<img
												src={CalculatorIcon}
												width={18}
											/>
										</Button>
									</Col>
								</Row>
							</Form.Item>
							<Form.Item label='Precio' name='price'>
								<CustomInputNumber />
							</Form.Item>
							<Form.Item label='Notas/Indicaciones' name='notes'>
								<Input.TextArea rows={3} />
							</Form.Item>
						</Form>
					</Card>
				</Col>
			</Row>
			<ModalFormula
				show={showModal}
				testFormula={formula}
				closeModal={() => setShowModal(false)}
				updateFormulaInForm={updateFormulaInForm}
			/>
		</>
	)
}
