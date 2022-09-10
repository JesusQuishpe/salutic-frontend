import { Card, Checkbox, Col, Form, Input, Row } from 'antd'
import React from 'react'
import useLifeStyleForm from '../../../hooks/useLifeStyleForm'
import { updatePhysicalActivity } from '../../../store/slices/expedient/expedientSlice'
import { connect } from 'react-redux'
import { CustomInputNumber } from '../../antd/CustomInputNumber'

const PhysicalActivityComp = ({ physicalActivity, update }) => {
	const { form, onValuesChange } = useLifeStyleForm(physicalActivity, update)

	return (
		<Card title='Actividad física'>
			<Form
				form={form}
				labelCol={{
					span: 10,
				}}
				wrapperCol={{
					span: 18,
				}}
				labelAlign='left'
				onValuesChange={onValuesChange}
			>
				<Form.Item label='¿Realiza ejercicio?'>
					<Row gutter={8}>
						<Col
							span={4}
							style={{
								maxHeight: '32px',
								height: '32px',
								lineHeight: '32px',
							}}
						>
							<Form.Item
								name='doExercise'
								noStyle
								valuePropName='checked'
							>
								<Checkbox />
							</Form.Item>
						</Col>
						<Col
							span={20}
							style={{ maxHeight: '32px', height: '32px' }}
						>
							<Form.Item label='Minutos al día' name='minPerDay'>
								<CustomInputNumber />
							</Form.Item>
						</Col>
					</Row>
				</Form.Item>

				<Form.Item
					label='¿Practica algún deporte?'
					valuePropName='checked'
					name='doSport'
				>
					<Checkbox />
				</Form.Item>
				<Form.Item label='¿Qué deporte?' name='sportDescription'>
					<Input />
				</Form.Item>
				<Form.Item
					label='Frecuencia con la que practica'
					name='sportFrequency'
				>
					<Input />
				</Form.Item>
				<Form.Item label='¿Duerme durante el día?'>
					<Row gutter={8} align='middle'>
						<Col
							span={4}
							style={{
								maxHeight: '32px',
								height: '32px',
								lineHeight: '32px',
							}}
						>
							<Form.Item
								name='sleep'
								noStyle
								valuePropName='checked'
							>
								<Checkbox />
							</Form.Item>
						</Col>
						<Col span={20} style={{ height: '32px' }}>
							<Form.Item
								label='Horas que duerme al día'
								name='sleepHours'
							>
								<CustomInputNumber
									style={{ width: '100%' }}
									min={0}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form.Item>
			</Form>
		</Card>
	)
}
const mapStateToProps = (state) => {
	return {
		physicalActivity: state.expedient.data.physicalActivity,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		update: (value) => dispatch(updatePhysicalActivity(value)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PhysicalActivityComp)
