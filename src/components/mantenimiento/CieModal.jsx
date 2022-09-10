import { Button, Form, Input, message, Modal } from 'antd'
import React, { useEffect } from 'react'
import { CieService } from '../../services/CieService'

const initialForm = {
	code: '',
	disease: '',
}

export const CieModal = ({
	cieModalParams,
	updateRowSelected,
	loadCies,
	closeModal,
}) => {
	const [form] = Form.useForm()
	const isEdit = !!cieModalParams?.data

	useEffect(() => {
		if (cieModalParams?.data) {
			const { code, disease } = cieModalParams.data
			form.setFieldsValue({
				code,
				disease,
			})
		}
	}, [cieModalParams])

	const handleCancel = () => {
		form.resetFields()
		closeModal()
	}

	const handleOk = async (values) => {
		try {
			if (isEdit) {
				await CieService.updateCie(values, cieModalParams?.data.id)
			} else {
				await CieService.createCie(values)
			}
			message.success(
				isEdit
					? 'Cie actualizado correctamente'
					: 'Cie creado correctamente'
			)
			loadCies(1)
			updateRowSelected({ ...values })
			closeModal()
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Modal
			title='Agregar medicamento'
			visible={cieModalParams?.show}
			onCancel={handleCancel}
			footer={[
				<Button key='cancel' onClick={handleCancel}>
					Cancelar
				</Button>,
				<Button
					key='submit'
					type='primary'
					onClick={() => {
						form.validateFields()
							.then((values) => {
								handleOk(values)
							})
							.catch((info) => {
								console.log('Validate Failed:', info)
							})
					}}
				>
					Aceptar
				</Button>,
			]}
		>
			<Form layout='vertical' form={form} initialValues={initialForm}>
				<Form.Item
					label='Código'
					name='code'
					rules={[
						{ required: true, message: 'El campo es requerido' },
					]}
				>
					<Input maxLength={100} />
				</Form.Item>
				<Form.Item
					label='Nombre'
					name='disease'
					rules={[
						{ required: true, message: 'El campo es requerido' },
					]}
				>
					<Input maxLength={150} />
				</Form.Item>
			</Form>
		</Modal>
	)
}
