import React, { useEffect } from 'react'
import { Form, DatePicker, Select, InputNumber, Input } from 'antd'
import { setGeneralInfo } from '../../../store/slices/odontology/odontologySlice'
import { connect } from 'react-redux'
import moment from 'moment'

const { Option } = Select
const { TextArea } = Input

const PRICES = {
	Exodoncia: 5,
	Provicionales: 3,
	Cirugías: 10,
	Profilaxis: 5,
	Fluorización: 2,
	Sutura: 3,
	'Resinas simples (1 lado)': 7,
	'Resinas compuestas (2 lados)': 14,
	'Resinas complejas (3 lados)': 21,
	'Anestésicos adicionales': 2,
}

const OdoGeneralInfoTab = ({ patientRecord, update }) => {
	const [form] = Form.useForm()

	const onValuesChange = (value, values) => {
		console.log('VALUES')
		const date = values.date.format('YYYY-MM-DD')
		console.log(value)
		if (Object.keys(value)[0] === 'procedure') {
			console.log('ENTRO')
			form.setFieldValue('value', PRICES[values.procedure])
		}
		update({ ...form.getFieldsValue(), date })
	}

	useEffect(() => {
		if (patientRecord) {
			const data = {
				id: patientRecord.id,
				date: moment(patientRecord.date),
				ageRange: patientRecord.ageRange,
				reasonConsultation: patientRecord.reasonConsultation,
				currentDiseaseAndProblems:
					patientRecord.currentDiseaseAndProblems,
				procedure: null,
				value: patientRecord.value,
			}
			form.setFieldsValue(data)
		}
	}, [patientRecord])

	return (
		<Form
			form={form}
			labelCol={{
				span: 6,
			}}
			wrapperCol={{
				span: 16,
			}}
			onValuesChange={onValuesChange}
			initialValues={{
				id: null,
				date: moment(),
				ageRange: null,
				reasonConsultation: '',
				currentDiseaseAndProblems: '',
				procedure: null,
				value: 0,
			}}
		>
			<Form.Item noStyle hidden name='id'>
				<Input type='hidden' />
			</Form.Item>
			<Form.Item label='Fecha' name='date'>
				<DatePicker placeholder='Selecciona la fecha' />
			</Form.Item>
			<Form.Item label='Rango de edad' name='ageRange'>
				<Select placeholder='Seleccione un rango de edad'>
					<Option value='Menor de 1 año'>Menor de 1 año</Option>
					<Option value='1-4 años'>1-4 años</Option>
					<Option value='5-9 años programado'>
						5-9 años programado
					</Option>
					<Option value='5-14 años no programado'>
						5-14 años no programado
					</Option>
					<Option value='15-19 años'>15-19 años</Option>
					<Option value='20-34 años'>20-34 años</Option>
					<Option value='35-49 año'>35-49 años</Option>
					<Option value='50-64 años'>50-64 años</Option>
					<Option value='65 +'>65 +</Option>
				</Select>
			</Form.Item>
			<Form.Item label='Motivo de la consulta' name='reasonConsultation'>
				<TextArea rows={3} maxLength={300} />
			</Form.Item>
			<Form.Item
				label='Enfermedad o problema actual'
				name='currentDiseaseAndProblems'
			>
				<TextArea rows={3} maxLength={300} />
			</Form.Item>
			<Form.Item label='Procedimiento' name='procedure'>
				<Select placeholder='Seleccione un procedimiento'>
					<Option value={'Exodoncia'}>Exodoncia</Option>
					<Option value={'Provicionales'}>Provicionales</Option>
					<Option value={'Cirugías'}>Cirugías</Option>
					<Option value={'Profilaxis'}>Profilaxis</Option>
					<Option value={'Fluorización'}>Fluorización</Option>
					<Option value={'Sutura'}>Sutura</Option>
					<Option value={'Resinas simples (1 lado)'}>
						Resinas simples (1 lado)
					</Option>
					<Option value={'Resinas compuestas (2 lados)'}>
						Resinas compuestas (2 lados)
					</Option>
					<Option value={'Resinas complejas (3 lados)'}>
						Resinas complejas (3 lados)
					</Option>
					<Option value={'Anestésicos adicionales'}>
						Anestésicos adicionales
					</Option>
				</Select>
			</Form.Item>
			<Form.Item label='Valor de la consulta' name='value'>
				<InputNumber
					step={0.5}
					formatter={(value) =>
						`$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
					}
					parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
				/>
			</Form.Item>
		</Form>
	)
}

const mapStateToProp = (state) => {
	return {
		patientRecord: state.odontology.data?.patientRecord,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		update: (value) => dispatch(setGeneralInfo(value)),
	}
}

export default connect(mapStateToProp, mapDispatchToProps)(OdoGeneralInfoTab)
