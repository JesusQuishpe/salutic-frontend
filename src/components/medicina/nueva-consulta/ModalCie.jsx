import {
	Button,
	Card,
	Checkbox,
	Col,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Modal,
	Row,
	Select,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { SearchCie } from './SearchCie'

const { Option } = Select

const ModalCie = ({ params, closeModal, crudOperations }) => {
	const [showSearchModal, setShowSearchModal] = useState(false)
	const [form] = Form.useForm()
	const { onAdd, onUpdate } = crudOperations

	const initialForm = {
		cieId: null,
		code: '',
		disease: '',
		cured: null,
		diseaseState: null,
		activeDisease: false,
		diagnosticAge: null,
		severity: null,
		infectiousDisease: false,
		observations: '',
		diagnosticDate: null,
		aditionalInformation: '',
		weekContracted: null,
		warningsDuringPregnancy: false,
		currentlyInTreatment: false,
		allergicDisease: false,
		allergyType: '',
	}

	const updateCodeAndDiseaseCie = (cie) => {
		form.setFieldsValue({
			...form.getFieldsValue(),
			cieId: cie.id,
			code: cie.code,
			disease: cie.disease,
		})
	}

	const onOk = (values) => {
		if (params.isEdit) {
			onUpdate(values, params.data.code)
		} else {
			onAdd(values)
		}
		closeModal()
	}

	useEffect(() => {
		if (params.data) {
			form.setFieldsValue({ ...params.data })
		} else {
			form.setFieldsValue(initialForm)
		}
	}, [params, form])

	return (
		<div>
			<Modal
				visible={params.visible}
				title='Agregar enfermedad-CIE'
				onOk={onOk}
				onCancel={closeModal}
				width={1000}
				forceRender
				footer={[
					<Button key='cancel' onClick={closeModal}>
						Cancelar
					</Button>,
					<Button
						key='submit'
						type='primary'
						onClick={() => {
							form.validateFields()
								.then((values) => {
									onOk(values)
								})
								.catch((info) => {
									console.log('Validate Failed:', info)
								})
						}}
					>
						Guardar
					</Button>,
				]}
			>
				<Row justify='center' style={{ marginBottom: '10px' }}>
					<Button onClick={() => setShowSearchModal(true)}>
						Buscar enfermedad-CIE
					</Button>
				</Row>
				<Form
					form={form}
					labelCol={{
						span: 12,
					}}
					initialValues={{
						...initialForm,
					}}
				>
					<Form.Item noStyle name='cieId'>
						<Input type='hidden' />
					</Form.Item>
					<Row gutter={10}>
						<Col span={12}>
							<Form.Item
								label='Código'
								name='code'
								rules={[
									{
										required: true,
										message: 'El campo es requerido',
									},
								]}
							>
								<Input disabled />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								label=''
								name='disease'
								rules={[
									{
										required: true,
										message: 'El campo es requerido',
									},
								]}
							>
								<Input disabled />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={10}>
						<Col span={12}>
							<Form.Item
								label='Estado de la enfermedad'
								name='diseaseState'
							>
								<Select placeholder='Seleccione una enfermedad'>
									<Option value='Agravamiento'>
										Agravamiento
									</Option>
									<Option value='Agudo'>Agudo</Option>
									<Option value='Crónico'>Crónico</Option>
									<Option value='Curado'>Curado</Option>
									<Option value='Mejorando'>Mejorando</Option>
									<Option value='Recaída'>Recaída</Option>
									<Option value='Status quo'>
										Status quo
									</Option>
								</Select>
							</Form.Item>
							<Form.Item
								label='Enfermedad activa'
								valuePropName='checked'
								name='activeDisease'
							>
								<Checkbox />
							</Form.Item>
							<Form.Item
								label='Fecha de diagnóstico'
								name='diagnosticDate'
								format='DD/MM/YYYY'
							>
								<DatePicker
									placeholder='Selecciona la fecha'
									format='DD/MM/YYYY'
									style={{ width: '100%' }}
								/>
							</Form.Item>
							<Form.Item
								label='Edad al momento del diagnóstico'
								name='diagnosticAge'
							>
								<InputNumber />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label='Severidad' name='severity'>
								<Select placeholder='Seleccione la severidad'>
									<Option value='Leve'>Leve</Option>
									<Option value='Moderado'>Moderado</Option>
									<Option value='Severo'>Severo</Option>
								</Select>
							</Form.Item>
							<Form.Item
								label='Enfermedad infecciosa'
								valuePropName='checked'
								name='infectiousDisease'
							>
								<Checkbox />
							</Form.Item>
							<Form.Item
								label='Observaciones'
								name='observations'
							>
								<Input.TextArea />
							</Form.Item>
							<Form.Item label='Curada' name='cured'>
								<DatePicker
									placeholder='Selecciona la fecha'
									format='DD/MM/YYYY'
									style={{ width: '100%' }}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Card title='Alergias' style={{ marginBottom: '10px' }}>
						<Row gutter={10}>
							<Col span={12}>
								<Form.Item
									label='Enfermedad alergica'
									valuePropName='checked'
									name='allergicDisease'
								>
									<Checkbox />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label='Tipo de alergia'
									name='allergyType'
								>
									<Input />
								</Form.Item>
							</Col>
						</Row>
					</Card>
					<Card
						title='Información de embarazo'
						style={{ marginBottom: '10px' }}
					>
						<Row gutter={10}>
							<Col span={12}>
								<Form.Item
									label='Advertencias durante el embarazo'
									valuePropName='checked'
									name='warningsDuringPregnancy'
								>
									<Checkbox />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label='Contraido en la semana #'
									name='weekContracted'
								>
									<InputNumber />
								</Form.Item>
							</Col>
						</Row>
					</Card>
					<Card
						title='Información adicional'
						style={{ marginBottom: '10px' }}
					>
						<Form.Item
							label='Actualmente en tratamiento'
							valuePropName='checked'
							labelCol={{ span: 5 }}
							name='currentlyInTreatment'
						>
							<Checkbox />
						</Form.Item>
						<Form.Item
							label='Información adicional'
							labelCol={{ span: 5 }}
							name='aditionalInformation'
						>
							<Input.TextArea rows={6}></Input.TextArea>
						</Form.Item>
					</Card>
				</Form>
			</Modal>
			<SearchCie
				visible={showSearchModal}
				setParentCie={updateCodeAndDiseaseCie}
				closeModal={() => setShowSearchModal(false)}
			/>
		</div>
	)
}
export default React.memo(ModalCie)
