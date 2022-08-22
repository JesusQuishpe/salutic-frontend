import { Button, Form, Input, InputNumber, Modal, message } from 'antd'
import React, { useEffect } from 'react'
import { NursingService } from '../../services/NursingService'
import { roundToTwo } from '../../utils/functions'

const IMC_DIAGNOSTICS = {
	LOWER: 'Bajo peso',
	NORMAL: 'Normal',
	OVERWEIGHT: 'Sobrepeso',
	OBESITY: 'Obesidad',
}

const NursingModal = ({ closeModal, parameters, loadPatientQueue }) => {
	const [form] = Form.useForm()
	const { show, userId, appoId, nurId } = parameters
	const initialForm = {
		weight: 0,
		stature: 0,
		temperature: 0,
		pressure: 0,
		disability: 0,
		imc: 0,
		imcDiagnostic: 0,
		breathingFrequency: 0,
		heartFrequency: 0,
	}

	const onOk = async (values) => {
		console.log(values)
		try {
			if (!nurId) {
				await NursingService.create({ userId, appoId, ...values })
				loadPatientQueue()
				closeModal()
				message.success('Datos guardados')
			} else {
				await NursingService.update(
					{ userId, ...values, appoId },
					nurId
				)
				message.success('Datos actualizados')
				closeModal()
			}
		} catch (error) {
			console.log(error)
		}
	}
	/**
	 * Carga los datos de enfemeria para poder editar
	 * @param {number} nurId
	 */
	const loadDataForEdit = async (nurId) => {
		const result = await NursingService.getById(nurId)
		form.setFieldsValue({
			appo_id: result.appoId,
			weight: result.weight,
			stature: result.stature,
			temperature: result.temperature,
			pressure: result.pressure,
			disability: result.disability,
			imc: result.imc,
			imcDiagnostic: result.imcDiagnostic,
			breathingFrequency: result.breathingFrequency,
			heartFrequency: result.heartFrequency,
		})
		console.log(result)
	}

	useEffect(() => {
		if (nurId) {
			loadDataForEdit(nurId)
		}
	}, [nurId])

	const onValuesChange = (value, values) => {
		const key = Object.keys(value)[0]
		if (key === 'weight' || key === 'stature') {
			const statureInMeters = values.stature / 100
			let imc
			let imcDiagnostic = ''
			if (
				!values.stature ||
				!values.weight ||
				values.stature === 0 ||
				values.weight === 0
			) {
				imc = 0
				imcDiagnostic = IMC_DIAGNOSTICS.LOWER
			} else {
				imc = roundToTwo(values.weight / Math.pow(statureInMeters, 2))
				imcDiagnostic =
					imc < 18.5
						? IMC_DIAGNOSTICS.LOWER
						: imc >= 18.5 && imc <= 24.9
						? IMC_DIAGNOSTICS.NORMAL
						: imc >= 25 && imc <= 29.9
						? IMC_DIAGNOSTICS.OVERWEIGHT
						: IMC_DIAGNOSTICS.OBESITY
			}
			//const imc_diagnostic=
			form.setFieldsValue({
				imc,
				imcDiagnostic,
			})
		}
	}

	return (
		<Modal
			title='Ingreso de datos'
			visible={show}
			onCancel={closeModal}
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
								onOk(values)
							})
							.catch((info) => {
								console.log('Validate Failed:', info)
							})
					}}
				>
					Ok
				</Button>,
			]}
		>
			<Form
				form={form}
				labelCol={{
					span: 10,
				}}
				initialValues={initialForm}
				labelAlign='left'
				onValuesChange={onValuesChange}
			>
				<Form.Item label='Peso (kg)' name='weight'>
					<InputNumber min={0} max={500} />
				</Form.Item>
				<Form.Item label='Estatura (cm)' name='stature'>
					<InputNumber min={0} max={300} />
				</Form.Item>
				<Form.Item label='I.M.C' name='imc'>
					<InputNumber disabled />
				</Form.Item>
				<Form.Item label='Diagnóstico I.M.C' name='imcDiagnostic'>
					<Input disabled />
				</Form.Item>
				<Form.Item
					label='Frec. Respiratoria (x minuto)'
					name='breathingFrequency'
				>
					<InputNumber />
				</Form.Item>
				<Form.Item label='Nivel de discapacidad (%)' name='disability'>
					<InputNumber min={0} max={100} />
				</Form.Item>
				<Form.Item label='Presión' name='pressure'>
					<Input />
				</Form.Item>
				<Form.Item label='Temperatura (°C)' name='temperature'>
					<InputNumber />
				</Form.Item>
				<Form.Item
					label='Frec. Cardiaca (x minuto)'
					name='heartFrequency'
				>
					<InputNumber />
				</Form.Item>
			</Form>
		</Modal>
	)
}
export default React.memo(NursingModal)
