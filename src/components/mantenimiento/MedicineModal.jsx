import { Button, Form, Input, message, Modal } from 'antd'
import React, { useEffect } from 'react'
import { MedicineService } from '../../services/MedicineService'

const initialForm = {
	genericName: '',
	comercialName: '',
	pharmaceuticalForm: '',
	presentation: '',
}

export const MedicineModal = ({
	modalParams,
	loadMedicines,
	closeModal,
	updateRowSelected,
}) => {
	const [form] = Form.useForm()
	const isEdit = !!modalParams?.data

	useEffect(() => {
		if (modalParams?.data) {
			const {
				genericName,
				comercialName,
				pharmaceuticalForm,
				presentation,
			} = modalParams.data
			form.setFieldsValue({
				genericName,
				comercialName,
				pharmaceuticalForm,
				presentation,
			})
		}
	}, [modalParams])

	const handleCancel = () => {
		form.resetFields()
		closeModal()
	}

	const handleOk = async (values) => {
		try {
			if (isEdit) {
				await MedicineService.updateMedicine(
					values,
					modalParams?.data.id
				)
			} else {
				await MedicineService.createMedicine(values)
			}
			message.success(
				isEdit
					? 'Medicamento actualizado correctamente'
					: 'Medicamento creado correctamente'
			)
			loadMedicines(1)
			updateRowSelected({ ...values, id: modalParams?.data.id })
			closeModal()
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Modal
			title='Agregar medicamento'
			forceRender
			visible={modalParams?.show}
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
					label='Nombre genérico'
					name='genericName'
					rules={[
						{ required: true, message: 'El campo es requerido' },
					]}
				>
					<Input maxLength={100} />
				</Form.Item>
				<Form.Item label='Nombre comercial' name='comercialName'>
					<Input maxLength={150} />
				</Form.Item>
				<Form.Item label='Forma farmacéutica' name='pharmaceuticalForm'>
					<Input maxLength={100} />
				</Form.Item>
				<Form.Item label='Presentación' name='presentation'>
					<Input maxLength={100} />
				</Form.Item>
			</Form>
		</Modal>
	)
}
