import React, { useContext, useEffect, useState } from 'react'
import {
	Form,
	Input,
	Row,
	Card,
	Col,
	Button,
	message,
	Select,
	Checkbox,
} from 'antd'
import { useParams } from 'react-router-dom'
import LoaderContext from '../../contexts/LoaderContext'
import { axiosErrorHandler } from '../../handlers/axiosErrorHandler'
import { AreaService } from '../../services/AreaService'
import { GroupService } from '../../services/GroupService'
import { CustomInputNumber } from '../antd/CustomInputNumber'
import { ContentNotFound } from '../not-found/ContentNotFound'

const initialForm = {
	code: '',
	name: '',
	areaId: null,
	price: 0,
	showAtPrint: false,
}

export const GroupForm = () => {
	const { openLoader, closeLoader } = useContext(LoaderContext)
	const [form] = Form.useForm()
	const { groupId } = useParams()
	const [areas, setAreas] = useState([])
	const [notFound, setNotFound] = useState(false)
	const isEdit = !!groupId

	const loadAreas = () => {
		AreaService.getAreas()
			.then((areas) => {
				setAreas(
					areas.map((area) => ({
						label: area.name,
						value: area.id,
					}))
				)
			})
			.catch((err) => console.log(err))
	}

	/**
	 * Handler para guardar los datos del area
	 * @param {Event} e
	 * @returns
	 */
	const handleSubmit = async (values) => {
		try {
			//console.log(values)
			openLoader(isEdit ? 'Actualizando datos...' : 'Creando grupo...')
			const data = { ...values }
			//console.log(data)
			if (!isEdit) {
				await GroupService.createGroup(data)
				form.resetFields([
					'code',
					'areaId',
					'name',
					'price',
					'showAtPrint',
				])
				message.success('Datos creados correctamente')
			} else {
				await GroupService.updateGroup(data, groupId)
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
	 * Carga los valores del group en el formulario dado el id
	 * @param {number} id identificador del group
	 */
	const getGroupById = async (id) => {
		try {
			const group = await GroupService.getById(id)
			//console.log(group)
			form.setFieldsValue({
				name: group.name,
				areaId: group.area.id,
				code: group.code,
				price: group.price,
				showAtPrint: group.showAtPrint === 1,
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
		loadAreas()
	}, [])

	useEffect(() => {
		if (isEdit) {
			getGroupById(groupId)
		}
	}, [isEdit])

	if (notFound) {
		return <ContentNotFound />
	}

	return (
		<Row style={{ width: '100%' }}>
			<Col span={24}>
				<Card title={isEdit ? 'Actualizar grupo' : 'Crear grupo'}>
					<Form
						form={form}
						initialValues={initialForm}
						onFinish={handleSubmit}
						labelCol={{
							span: 4,
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
							label='Area'
							name='areaId'
							wrapperCol={{
								span: 6,
							}}
							rules={[
								{
									required: true,
									message: 'El campo es requerido',
								},
							]}
						>
							<Select
								placeholder='Seleccione un area'
								allowClear
								options={areas}
							/>
						</Form.Item>
						<Form.Item
							label='Mostrar nombre en PDF'
							name='showAtPrint'
							valuePropName='checked'
						>
							<Checkbox />
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
								offset: 8,
								span: 16,
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
