import { Form, Input, message, Modal } from 'antd'
import React, { useState } from 'react'
import { axiosErrorHandler } from '../../handlers/axiosErrorHandler'
import { UserService } from '../../services/UserService'

export const ChangePasswordModal = ({ params, closeModal }) => {
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)

	const handleOk = () => {
		form.validateFields()
			.then((values) => {
				setLoading(true)
				UserService.changePassword(values.newPassword, params.userId)
					.then((res) => {
						message.success('Contraseña actualizada correctamente')
						closeModal()
					})
					.catch((err) => {
						console.log(err)
						const { message: errorMessage } = axiosErrorHandler(err)
						message.error(errorMessage)
					})
					.finally(() => setLoading(false))
			})
			.catch((info) => {
				console.log('Validate Failed:', info)
			})
	}

	return (
		<Modal
			visible={params.show}
			onCancel={closeModal}
			title='Cambiar contraseña'
			onOk={handleOk}
			okText='Actualizar'
			cancelText='Cancelar'
			confirmLoading={loading}
		>
			<Form form={form} layout='vertical'>
				<Form.Item
					label='Nueva contraseña'
					name='newPassword'
					rules={[
						{ required: true, message: 'El campo es requerido' },
					]}
				>
					<Input type='password' />
				</Form.Item>
			</Form>
		</Modal>
	)
}
