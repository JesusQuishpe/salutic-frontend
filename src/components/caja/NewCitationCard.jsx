import { Card, Col, DatePicker, Form, InputNumber, Select } from 'antd'
import moment from 'moment'
import React from 'react'

const { Option } = Select
const NewCitationCard = ({ enableTests, form, onSubmit }) => {
	const onChangeArea = (value) => {
		console.log(value)
		if (value === 'Laboratorio') {
			enableTests(true)
		} else {
			enableTests(false)
		}
	}

	return (
		<Col span={12}>
			<Card title='Datos de la cita' bordered>
				<Form
					name='form-citas'
					labelAlign='left'
					labelCol={{
						span: 3,
					}}
					wrapperCol={{
						span: 16,
					}}
					form={form}
					onFinish={onSubmit}
					initialValues={{
						date: moment(),
						value: 0,
					}}
				>
					<Form.Item
						label='Fecha'
						name='date'
						rules={[
							{
								required: true,
								message: 'El campo es requerido',
							},
						]}
					>
						<DatePicker
							placeholder='Seleccione la fecha'
							style={{ width: '200px' }}
							format='DD/MM/YYYY'
						/>
					</Form.Item>
					<Form.Item
						label='Area'
						name='area'
						rules={[
							{
								required: true,
								message: 'El campo es requerido',
							},
						]}
					>
						<Select
							placeholder='Selecciona un area'
							onChange={onChangeArea}
							allowClear
							style={{ width: '100%' }}
						>
							<Option value='Medicina'>Medicina</Option>
							<Option value='Laboratorio'>Laboratorio</Option>
							<Option value='Odontologia'>Odontologia</Option>
						</Select>
					</Form.Item>
					<Form.Item
						label='Valor'
						name='value'
						rules={[
							{
								required: true,
								message: 'El campo es requerido',
							},
						]}
					>
						<InputNumber
							//defaultValue={0}
							formatter={(value) =>
								`$ ${value}`.replace(
									/\B(?=(\d{3})+(?!\d))/g,
									','
								)
							}
							parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
							//onChange={onChange}
						/>
					</Form.Item>
				</Form>
			</Card>
		</Col>
	)
}
export default React.memo(NewCitationCard)
