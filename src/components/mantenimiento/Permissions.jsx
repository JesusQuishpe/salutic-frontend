import { Button, Checkbox, Form, message, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { axiosErrorHandler } from '../../handlers/axiosErrorHandler'
import { useLoader } from '../../hooks/useLoader'
import { ModuleService } from '../../services/ModuleService'
import { PermissionService } from '../../services/PermissionService'
import { RolService } from '../../services/RolService'

export const Permissions = () => {
	const { openLoader, closeLoader } = useLoader()
	const [roles, setRoles] = useState([])
	const [modules, setModules] = useState([])
	const [submodules, setSubmodules] = useState([])
	const [form1] = Form.useForm()

	const rolesOptions = roles.map((rol) => ({
		label: rol.name,
		value: rol.id,
	}))

	const loadRoles = () => {
		RolService.getRoles().then((roles) => {
			console.log(roles)
			setRoles(roles)
		})
	}

	const loadModules = () => {
		ModuleService.getModules().then((modules) => {
			setModules(
				modules.map((module) => ({
					label: module.name,
					value: module.id,
				}))
			)
		})
	}

	const loadSubmodules = (rolId, moduleId) => {
		if (!rolId) {
			form1.setFields([
				{
					name: 'rolId',
					errors: ['Seleccione un rol'],
				},
			])
			return
		}

		const rol = roles.find((rol) => rol.id === rolId)
		ModuleService.getSubmodules(moduleId).then((submodules) => {
			const submodulesChecked = []
			submodules.forEach((sub) => {
				if (rol.permissions.find((per) => per.moduleId === sub.id)) {
					submodulesChecked.push(sub.id)
				}
			})
			setSubmodules(submodules)
			form1.setFieldValue('submodules', submodulesChecked)
		})
	}

	const handleOnValuesChangeForm1 = (value, values) => {
		const key = Object.keys(value)[0]
		if (key === 'rolId' && values.moduleId) {
			loadSubmodules(values.rolId, values.moduleId)
		}

		if (key === 'moduleId') {
			loadSubmodules(values.rolId, values.moduleId)
		}
	}

	useEffect(() => {
		loadRoles()
		loadModules()
	}, [])

	const handleFinish = (values) => {
		console.log(values)
		openLoader('Guardando permisos...')
		PermissionService.savePermissions(values)
			.then((res) => {
				message.success('Permisos guardados correctamente')
			})
			.catch((error) => {
				console.log(error)
				const { message: errorMessage } = axiosErrorHandler(error)
				message.error(errorMessage)
			})
			.finally(() => {
				closeLoader()
			})
	}

	return (
		<>
			<h2 style={{ marginBottom: '30px' }}>Roles y permisos</h2>
			<Form
				layout='vertical'
				form={form1}
				onValuesChange={handleOnValuesChangeForm1}
				wrapperCol={{
					span: 12,
				}}
				onFinish={handleFinish}
			>
				<Form.Item
					label='Roles'
					name='rolId'
					rules={[
						{ required: true, message: 'El campo es requerido' },
					]}
				>
					<Select
						options={rolesOptions}
						placeholder='Seleccione un rol'
					/>
				</Form.Item>
				<Form.Item
					label='Modulos'
					name='moduleId'
					rules={[
						{ required: true, message: 'El campo es requerido' },
					]}
				>
					<Select
						options={modules}
						placeholder='Seleccione un módulo'
					/>
				</Form.Item>
				<Form.Item label='Submódulos' name='submodules'>
					<Checkbox.Group>
						{submodules.map((sub) => (
							<Row key={sub.id}>
								<Checkbox value={sub.id}>{sub.name}</Checkbox>
							</Row>
						))}
					</Checkbox.Group>
				</Form.Item>
				<Form.Item
					wrapperCol={{
						offset: 10,
					}}
				>
					<Button type='primary' htmlType='submit'>
						Guardar
					</Button>
				</Form.Item>
			</Form>
		</>
	)
}
