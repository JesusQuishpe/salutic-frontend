import { Card, Checkbox, Col, Form, Input, Row } from 'antd'
import React from 'react'
import useLifeStyleForm from '../../../hooks/useLifeStyleForm'
import { updateFeedingHabits } from '../../../store/slices/expedient/expedientSlice'
import { connect } from 'react-redux'
import { CustomInputNumber } from '../../antd/CustomInputNumber'
const { TextArea } = Input

const FeedingHabits = ({ feedingHabits, update }) => {
	const { form, onValuesChange } = useLifeStyleForm(feedingHabits, update)

	return (
		<Card title='Hábitos alimenticios'>
			<Form
				form={form}
				labelCol={{
					span: 8,
				}}
				wrapperCol={{
					span: 18,
				}}
				labelAlign='left'
				onValuesChange={onValuesChange}
			>
				<Form.Item label='¿Desayuna?'>
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
								name='breakfast'
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
							<Form.Item
								label='Número de comidas al día'
								name='mealsPerDay'
							>
								<CustomInputNumber />
							</Form.Item>
						</Col>
					</Row>
				</Form.Item>

				<Form.Item label='Toma café?'>
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
								name='drinkCoffe'
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
							<Form.Item
								label='Número de tazas al día'
								name='cupsPerDay'
							>
								<CustomInputNumber />
							</Form.Item>
						</Col>
					</Row>
				</Form.Item>

				<Form.Item
					label='¿Toma refresco?'
					valuePropName='checked'
					name='drinkSoda'
				>
					<Checkbox />
				</Form.Item>
				<Form.Item
					label='¿Hace dieta?'
					name='doDiet'
					valuePropName='checked'
				>
					<Checkbox />
				</Form.Item>
				<Form.Item
					label='Información de la dieta'
					name='dietDescription'
				>
					<TextArea rows={2} />
				</Form.Item>
			</Form>
		</Card>
	)
}
const mapStateToProps = (state) => {
	return {
		feedingHabits: state.expedient.feedingHabits,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		update: (value) => dispatch(updateFeedingHabits(value)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedingHabits)
