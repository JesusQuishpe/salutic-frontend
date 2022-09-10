import { Button, Card, Form, Input, message, Select } from 'antd'
import React, { useEffect, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import LoaderContext from '../../contexts/LoaderContext'
import { axiosErrorHandler } from '../../handlers/axiosErrorHandler'
import { useFetchRoles } from '../../hooks/useFetchRoles'
import useUser from '../../hooks/useUser'
import { UserService } from '../../services/UserService'
import { ContentNotFound } from '../not-found/ContentNotFound'

const initialForm = {
	name: '',
	email: '',
	rolId: null,
	password: '',
}

export const UserForm = () => {
	const { user } = useUser()
	const { userId } = useParams()
	const { openLoader, closeLoader } = useContext(LoaderContext)
	const { roles } = useFetchRoles()
	const [form] = Form.useForm()
	const [notFound, setNotFound] = useState(false)

	const isEdit = !!userId

	const handleSubmit = async (values) => {
		try {
			openLoader(
				isEdit ? 'Actualizando usuario...' : 'Creando usuario...'
			)
			if (isEdit) {
				await UserService.updateUser(
					{ ...values, companyId: user.companyId },
					userId
				)
			} else {
				await UserService.createUser({
					...values,
					companyId: user.companyId,
				})
				form.resetFields(['name', 'email', 'rolId', 'password'])
			}
			message.success(
				isEdit
					? 'Usuario actualizado correctamente'
					: 'Usuario creado correctamente'
			)
		} catch (error) {
			const { message: errorMessage } = axiosErrorHandler(error)
			console.log(error)
			message.error(errorMessage)
		} finally {
			closeLoader()
		}
	}

	const loadUserById = () => {
		UserService.getById(userId)
			.then((user) => {
				console.log(user)
				form.setFieldsValue({
					name: user.name,
					email: user.email,
					rolId: user.rolId,
				})
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
			loadUserById()
		}
	}, [])

	if (notFound) {
		return <ContentNotFound />
	}

  
	return (
		<Card title={isEdit ? 'Actualizar usuario' : 'Crear usuario'}>
			<Form
				form={form}
				onFinish={handleSubmit}
				layout='vertical'
				initialValues={initialForm}
			>
				<Form.Item
					label='Nombre'
					name='name'
					extra='Máx 20 caracteres'
					rules={[
						{
							required: true,
							message: 'El campo es requerido',
						},
					]}
				>
					<Input
						maxLength={20}
						onChange={(e) =>
							form.setFieldValue('name', e.target.value.trim())
						}
					/>
				</Form.Item>
				<Form.Item label='Correo electrónico' name='email'>
					<Input maxLength={150} />
				</Form.Item>
				<Form.Item
					label='Rol'
					name='rolId'
					rules={[
						{
							required: true,
							message: 'El campo es requerido',
						},
					]}
				>
					<Select
						placeholder='Seleccione un rol'
						options={roles.map((rol) => ({
							label: rol.name,
							value: rol.id,
						}))}
					/>
				</Form.Item>
				{!isEdit && (
					<Form.Item label='Contraseña' name='password'>
						<Input type='password' />
					</Form.Item>
				)}
				<Form.Item>
					<Button htmlType='submit' type='primary'>
						{isEdit ? 'Actualizar' : 'Guardar'}
					</Button>
				</Form.Item>
			</Form>
		</Card>
	)
}
