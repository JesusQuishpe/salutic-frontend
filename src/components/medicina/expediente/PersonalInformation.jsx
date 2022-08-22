import { Col, DatePicker, Form, Input, Row, Select } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import moment from 'moment'
import React, { useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { setPersonalInformation } from '../../../store/slices/expedient/expedientSlice'

const { Option } = Select

const getBirthDayAndAge = (birthDate) => {
	if (!birthDate) return { birthDate: null, age: 0 }
	let newBirthDate = null
	let newAge = 0
	if (typeof birthDate === 'string') {
		newBirthDate = moment(birthDate)
	} else {
		newBirthDate = birthDate.format('YYYY-MM-DD')
	}
	newAge = moment().diff(newBirthDate, 'years', false)
	return {
		birthDate: newBirthDate,
		age: newAge,
	}
}

const PersonalInformation = ({ data, update }) => {
	const [form] = Form.useForm()

	useEffect(() => {
		if (data.patient) {
			const { birthDate, age } = getBirthDayAndAge(data.patient.birthDate)
			form.setFieldsValue({ ...data.patient, birthDate, age })
		}
	}, [])

	const onValuesChange = useCallback((value, values) => {
		const { birthDate, age } = getBirthDayAndAge(values.birthDate)
		update({ ...values, birthDate, age })
	}, [])

	return (
		<Form
			name='basic'
			labelCol={{
				span: 6,
			}}
			wrapperCol={{
				span: 18,
			}}
			form={form}
			onValuesChange={onValuesChange}
		>
			<Form.Item label='Expediente N°' name='id'>
				<Input disabled />
			</Form.Item>
			<Form.Item label='Nombres' name='name'>
				<Input />
			</Form.Item>
			<Form.Item label='Apellidos' name='lastname'>
				<Input />
			</Form.Item>
			<Form.Item label='Fecha de nacimiento' style={{ marginBottom: 0 }}>
				<Row gutter={10}>
					<Col span={12}>
						<Form.Item noStyle name='birthDate'>
							<DatePicker
								placeholder='Selecciona la fecha'
								style={{ width: '100%' }}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='age'>
							<Input disabled />
						</Form.Item>
					</Col>
				</Row>
			</Form.Item>

			<Form.Item name='gender' label='Sexo'>
				<Select
					placeholder='Selecciona un género'
					//onChange={this.onGenderChange}
					allowClear
				>
					<Option value='Masculino'>Masculino</Option>
					<Option value='Femenino'>Femenino</Option>
				</Select>
			</Form.Item>

			<Form.Item label='Teléfono' name='cellphone'>
				<Input maxLength={20} />
			</Form.Item>
			<Form.Item label='Domicilio' name='address'>
				<Input maxLength={150} />
			</Form.Item>

			<Form.Item name='province' label='Provincia'>
				<Select
					placeholder='Selecciona una provincia'
					//onChange={this.onGenderChange}
					allowClear
				>
					<Option value='El Oro'>El Oro</Option>
					<Option value='Azuay'>Azuay</Option>
					<Option value='Bolívar'>Bolívar</Option>
					<Option value='Cañar'>Cañar</Option>
					<Option value='Carchi'>Carchi</Option>
					<Option value='Chimborazo'>Chimborazo</Option>
					<Option value='Cotopaxi'>Cotopaxi</Option>
					<Option value='Esmeraldas'>Esmeraldas</Option>
					<Option value='Galápagos'>Galápagos</Option>
					<Option value='Guayas'>Guayas</Option>
					<Option value='Imbabura'>Imbabura</Option>
					<Option value='Loja'>Loja</Option>
					<Option value='Los Rios'>Los Rios</Option>
					<Option value='Manabi'>Manabi</Option>
					<Option value='Morona Santiago'>Morona Santiago</Option>
					<Option value='Napo'>Napo</Option>
					<Option value='Orellana'>Orellana</Option>
					<Option value='Pastaza'>Pastaza</Option>
					<Option value='Pichincha'>Pichincha</Option>
					<Option value='Santa Elena'>Santa Elena</Option>
					<Option value='Santo Domingo'>Santo Domingo</Option>
					<Option value='Sucumbíos'>Sucumbíos</Option>
					<Option value='Tungurahua'>Tungurahua</Option>
					<Option value='Zamora'>Zamora</Option>
				</Select>
			</Form.Item>

			<Form.Item name='city' label='Ciudad'>
				<Select
					placeholder='Selecciona una ciudad'
					//onChange={this.onGenderChange}
					allowClear
				>
					<Option value='Machala'>Machala</Option>
					<Option value='Arenilla'>Arenillas</Option>
					<Option value='Atahualpa'>Atahualpa</Option>
					<Option value='Balsas'>Balsas</Option>
					<Option value='Chilla'>Chilla</Option>
					<Option value='El Guabo'>El Guabo</Option>
					<Option value='Guayaquil'>Guayaquil</Option>
					<Option value='Huaquillas'>Huaquillas</Option>
					<Option value='Las Lajas'>Las Lajas</Option>
					<Option value='Marcabeli'>Marcabeli</Option>
					<Option value='Pasaje'>Pasaje</Option>
					<Option value='Piñas'>Piñas</Option>
					<Option value='Portovelo'>Portovelo</Option>
					<Option value='Santa Rosa'>Santa Rosa</Option>
					<Option value='Zaruma'>Zaruma</Option>
				</Select>
			</Form.Item>
			<Form.Item label='Correo electrónico' name='email'>
				<Input maxLength={150} />
			</Form.Item>
			<Form.Item label='Notas' name='notes'>
				<TextArea />
			</Form.Item>
		</Form>
	)
}
const mapStateToProps = (state) => {
	return {
		data: state.expedient.data,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		update: (value) => dispatch(setPersonalInformation(value)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalInformation)
