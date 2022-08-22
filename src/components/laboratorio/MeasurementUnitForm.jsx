import { Form, Input, Row, Card, Col, Button, message } from 'antd'
import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import LoaderContext from '../../contexts/LoaderContext'
import { axiosErrorHandler } from '../../handlers/axiosErrorHandler'
import { MeasurementUnitService } from '../../services/MeasurementUnitService'

const initialForm = {
	name: '',
	abbreviation: '',
}

export const MeasurementUnitForm = () => {
	const { openLoader, closeLoader } = useContext(LoaderContext)
	const [form] = Form.useForm()
	const { unitId } = useParams()
	const isEdit = !!unitId

	/**
	 * Handler para guardar los datos
	 * @param {Event} e
	 * @returns
	 */
	const handleSubmit = async () => {
		try {
			openLoader(isEdit ? 'Actualizando datos...' : 'Creando registro...')
			const data = { ...form.getFieldsValue() }
			if (!isEdit) {
				await MeasurementUnitService.createUnit(data)
				form.resetFields(['name', 'abbreviation'])
				message.success('Datos creados correctamente')
			} else {
				await MeasurementUnitService.updateUnit(data, unitId)
				message.success('Datos actualizados correctamente')
			}
			closeLoader()
		} catch (error) {
			console.log(error)
			const { message: errorMessage } = axiosErrorHandler(error)
			closeLoader()
			message.error(errorMessage)
		}
	}

	/**
	 * Carga la unidad de medida dado su id
	 * @param {number} id
	 */
	const getUnitById = async (id) => {
		const unit = await MeasurementUnitService.getById(id)
		form.setFieldsValue({
			name: unit.name,
			abbreviation: unit.abbreviation,
		})
	}

	useEffect(() => {
		if (isEdit) {
			getUnitById(unitId)
		}
	}, [isEdit])

	return (
		<Row style={{ width: '100%' }}>
			<Col span={24}>
				<Card
					title={
						isEdit
							? 'Actualizar unidad de medida'
							: 'Crear unidad de medida'
					}
				>
					<Form
						form={form}
						initialValues={initialForm}
						onFinish={handleSubmit}
						labelCol={{
							span: 2,
						}}
					>
						<Form.Item
							label='Nombre'
							name='name'
							extra='Máx 50 caracteres'
							wrapperCol={{
								span: 6,
							}}
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
							label='Abreviatura'
							name='abbreviation'
							extra='Máx 20 caracteres'
							rules={[
								{
									required: true,
									message: 'El campo es requerido',
								},
							]}
							wrapperCol={{
								span: 6,
							}}
						>
							<Input maxLength={20} />
						</Form.Item>

						<Form.Item
							wrapperCol={{
								offset: 6,
								span: 18,
							}}
						>
							<Button type='primary' htmlType='submit'>
								{isEdit ? 'Actualizar' : 'Guardar'}
							</Button>
						</Form.Item>
					</Form>
				</Card>
			</Col>
		</Row>
	)
}
