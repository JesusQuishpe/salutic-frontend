import { DatePicker, Form, Input, Select, TimePicker } from 'antd'
import React, { useEffect } from 'react'
import moment from 'moment'

const { Option } = Select

const Interrogation = ({ data, update }) => {
	const [form] = Form.useForm()

	const onValuesChange = (_, values) => {
		console.log(values)
		update(values)
	}

	useEffect(() => {
		if (data) {
			console.log('ENTRO INTERRROGATION')
			form.setFieldsValue({
				date: data.date ? moment(data.date) : null,
				hour: data.hour ? moment(data.hour, 'HH:mm:ss') : null,
				consultationType: data.consultationType,
				reasonConsultation: data.reasonConsultation,
				symptoms: data.symptoms,
				apparatusAndSystems: data.apparatusAndSystems,
			})
		}
	}, [data])

	return (
		<div>
			<Form
				form={form}
				style={{ marginBottom: '20px' }}
				labelCol={{ span: 5 }}
				initialValues={{
					date: moment(),
					hour: moment(),
					consultationType: null,
					reasonConsultation: '',
					symptoms: '',
					apparatusAndSystems: '',
				}}
				onValuesChange={onValuesChange}
			>
				<Form.Item label='Fecha' name='date'>
					<DatePicker
						format={'DD/MM/YYYY'}
						placeholder='Seleccione la fecha'
					/>
				</Form.Item>
				<Form.Item label='Hora' name='hour'>
					<TimePicker placeholder='Seleccione la hora' />
				</Form.Item>
				<Form.Item label='Tipo de consulta' name='consultationType'>
					<Select placeholder='Seleccione el tipo de consulta'>
						<Option value='Angiología'>Angiología</Option>
						<Option value='Cardiología'>Cardiología</Option>
						<Option value='Clínica general'>Clínica general</Option>
						<Option value='Dermatología'>Dermatología</Option>
						<Option value='Medicina interna'>
							Medicina interna
						</Option>
						<Option value='Medicina de trabajo'>
							Medicina de trabajo
						</Option>
						<Option value='Neurología'>Neurología</Option>
						<Option value='Pediatría'>Pediatría</Option>
						<Option value='Otorrinolaringología'>
							Otorrinolaringología
						</Option>
						<Option value='Psicología'>Psicología</Option>
						<Option value='Urología'>Urología</Option>
						<Option value='Traumatología'>Traumatología</Option>
						<Option value='Psicopedagogía'>Psicopedagogía</Option>
					</Select>
				</Form.Item>
				<Form.Item
					label='Motivo de la consulta'
					name='reasonConsultation'
				>
					<Input.TextArea rows={5} maxLength={500} />
				</Form.Item>
				<Form.Item label='Síntomas' name='symptoms'>
					<Input.TextArea rows={5} maxLength={500} />
				</Form.Item>
				<Form.Item
					label='Aparatos y sistemas'
					name='apparatusAndSystems'
				>
					<Input.TextArea rows={5} maxLength={500} />
				</Form.Item>
			</Form>
		</div>
	)
}
export default React.memo(Interrogation)
