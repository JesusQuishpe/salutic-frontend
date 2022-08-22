import React, { useEffect } from 'react'
import { Button, Form, Input, Modal } from 'antd'
import { generateUniqueId } from '../../../utils/functions'

const initialForm = {
	sesion: 1,
	complications: '',
	procedures: '',
	prescriptions: '',
}

const OdoTreatmentModal = ({ modalParams, closeModal }) => {
	const [form] = Form.useForm()

	useEffect(() => {
		if (modalParams.data) {
			const { data } = modalParams
			form.setFieldsValue({
				sesion: data.sesion,
				complications: data.complications,
				procedures: data.procedures,
				prescriptions: data.prescriptions,
			})
		} else {
			form.setFieldValue('sesion', modalParams.sesion)
		}
	}, [modalParams])

	const onCancel = () => {
		form.resetFields(['complications', 'procedures', 'prescriptions'])
		closeModal()
	}

	const onFinish = (values) => {
		const newData = {
			sesion: modalParams.isEdit
				? modalParams.data.sesion
				: values.sesion,
			complications: values.complications,
			procedures: values.procedures,
			prescriptions: values.prescriptions,
			rowId: modalParams.isEdit
				? modalParams.data.rowId
				: generateUniqueId(),
		}
		console.log(newData)
		if (modalParams.isEdit) {
			modalParams.editTreatment(newData)
		} else {
			modalParams.addTreatment(newData)
		}
		onCancel()
	}
	return (
		<Modal
			title='Agregar tratamiento'
			forceRender
			visible={modalParams.show}
			onCancel={onCancel}
			okText='Guardar'
			cancelText='Cancelar'
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
								onFinish(values)
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
			<Form
				name='form-treatments'
				form={form}
				layout='vertical'
				initialValues={initialForm}
			>
				<Form.Item label='Sesión' name='sesion'>
					<Input disabled />
				</Form.Item>
				<Form.Item
					label='Diagnósticos y complicaciones'
					name='complications'
					rules={[
						{
							required: true,
							message: 'El campo es requerido',
						},
					]}
				>
					<Input.TextArea rows={5} />
				</Form.Item>
				<Form.Item
					label='Procedimientos'
					name='procedures'
					rules={[
						{
							required: true,
							message: 'El campo es requerido',
						},
					]}
				>
					<Input.TextArea rows={5} />
				</Form.Item>
				<Form.Item
					label='Prescripciones'
					name='prescriptions'
					rules={[
						{
							required: true,
							message: 'El campo es requerido',
						},
					]}
				>
					<Input.TextArea rows={5} />
				</Form.Item>
			</Form>
		</Modal>
	)
}
export default OdoTreatmentModal
