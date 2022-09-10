import { Button, Card, Form, Input, message } from 'antd'
import React, { useEffect, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import LoaderContext from '../../contexts/LoaderContext'
import { axiosErrorHandler } from '../../handlers/axiosErrorHandler'
import { RolService } from '../../services/RolService'
import { ContentNotFound } from '../not-found/ContentNotFound'

export const RolForm = () => {
	const { rolId } = useParams()
	const { openLoader, closeLoader } = useContext(LoaderContext)
	const [form] = Form.useForm()
	const [notFound, setNotFound] = useState(false)
	const isEdit = !!rolId

	const handleSubmit = async (values) => {
		try {
			openLoader(isEdit ? 'Actualizando rol...' : 'Creando rol...')
			if (isEdit) {
				await RolService.updateRol(values, rolId)
			} else {
				await RolService.createRol(values)
				form.resetFields(['name'])
			}
			message.success(
				isEdit
					? 'Rol actualizado correctamente'
					: 'Rol creado correctamente'
			)
		} catch (error) {
			const { message: errorMessage } = axiosErrorHandler(error)
			console.log(error)
			message.error(errorMessage)
		} finally {
			closeLoader()
		}
	}

	const loadRolById = () => {
		RolService.getById(rolId)
			.then((rol) => {
				form.setFieldValue('name', rol.name)
			})
			.catch((error) => {
				console.log(error)
				const { status } = axiosErrorHandler(error)
				if (status && status === 404) {
					setNotFound(true)
				}
			})
	}

	useEffect(() => {
		if (isEdit) {
			loadRolById()
		}
	}, [])

	if (notFound) {
		return <ContentNotFound />
	}

	return (
		<Card title={isEdit ? 'Actualizar rol' : 'Crear rol'}>
			<Form
				form={form}
				onFinish={handleSubmit}
				layout='vertical'
				initialValues={{
					name: '',
				}}
			>
				<Form.Item
					label='Nombre'
					name='name'
					extra='Máx 50 caracteres'
					rules={[
						{
							required: true,
							message: 'El campo es requerido',
						},
					]}
				>
					<Input maxLength={50} />
				</Form.Item>
				<Form.Item>
					<Button htmlType='submit' type='primary'>
						{isEdit ? 'Actualizar' : 'Guardar'}
					</Button>
				</Form.Item>
			</Form>
		</Card>
	)
}
