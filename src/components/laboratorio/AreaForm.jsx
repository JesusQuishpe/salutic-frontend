import { Form, Input, Row, Card, Col, Button, message } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import LoaderContext from '../../contexts/LoaderContext'
import { axiosErrorHandler } from '../../handlers/axiosErrorHandler'
import { AreaService } from '../../services/AreaService'
import { CustomInputNumber } from '../antd/CustomInputNumber'
import { ContentNotFound } from '../not-found/ContentNotFound'

const initialForm = {
	code: '',
	name: '',
	price: 0,
}

export const AreaForm = () => {
	const { openLoader, closeLoader } = useContext(LoaderContext)
	const [form] = Form.useForm()
	const { areaId } = useParams()
	const [notFound, setNotFound] = useState(false)
	const isEdit = !!areaId

	/**
	 * Handler para guardar los datos del area
	 * @param {Event} e
	 * @returns
	 */
	const handleSubmit = async () => {
		try {
			openLoader(isEdit ? 'Actualizando datos...' : 'Creando area...')
			const data = { ...form.getFieldsValue() }
			if (!isEdit) {
				await AreaService.createArea(data)
				form.resetFields(['code', 'name', 'price'])
				message.success('Datos creados correctamente')
			} else {
				await AreaService.updateArea(data, areaId)
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
	 * Carga los valores del area en el formulario dado el id
	 * @param {number} id identificador del area
	 */
	const getAreaById = async (id) => {
		try {
			const area = await AreaService.getById(id)
			console.log(area)
			form.setFieldsValue({
				name: area.name,
				code: area.code,
				price: area.price,
			})
		} catch (error) {
			console.log(error)
			const { status } = axiosErrorHandler(error)
			if (status && status === 404) {
				setNotFound(true)
			}
		}
	}

	useEffect(() => {
		if (isEdit) {
			getAreaById(areaId)
		}
	}, [isEdit])

	if (notFound) {
		return <ContentNotFound />
	}

	return (
		<Row style={{ width: '100%' }}>
			<Col span={24}>
				<Card title={isEdit ? 'Actualizar area' : 'Crear area'}>
					<Form
						form={form}
						initialValues={initialForm}
						onFinish={handleSubmit}
						labelCol={{
							span: 2,
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
							wrapperCol={{
								span: 6,
							}}
						>
							<Input />
						</Form.Item>
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
							label='Precio'
							name='price'
							rules={[
								{
									required: true,
									message: 'El campo es requerido',
								},
							]}
						>
							<CustomInputNumber />
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
