import { Card, Checkbox, Col, Form, Row } from 'antd'
import React from 'react'
import useLifeStyleForm from '../../../hooks/useLifeStyleForm'
import { updateSmoking } from '../../../store/slices/expedient/expedientSlice'
import { connect } from 'react-redux'
import { CustomInputNumber } from '../../antd/CustomInputNumber'

const Smoking = ({ smoking, update }) => {
	const { form, onValuesChange } = useLifeStyleForm(smoking, update)

	return (
		<Card title='Tabaquismo'>
			<Form form={form} labelAlign='left' onValuesChange={onValuesChange}>
				<Form.Item label='¿Fuma?' labelCol={{ span: 6 }}>
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
								name='smoke'
								noStyle
								valuePropName='checked'
							>
								<Checkbox />
							</Form.Item>
						</Col>
						<Col span={20} style={{ height: '32px' }}>
							<Form.Item
								label='Edad en la que comenzó a fumar'
								labelCol={{ span: 17 }}
								name='startSmokingAge'
							>
								<CustomInputNumber />
							</Form.Item>
						</Col>
					</Row>
				</Form.Item>
				<Form.Item label='¿Ex-fumador?' labelCol={{ span: 6 }}>
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
								name='formerSmoker'
								noStyle
								valuePropName='checked'
							>
								<Checkbox />
							</Form.Item>
						</Col>
						<Col span={20} style={{ height: '32px' }}>
							<Form.Item
								label='Número de cigarros al día'
								labelCol={{ span: 17 }}
								name='cigarsPerDay'
							>
								<CustomInputNumber />
							</Form.Item>
						</Col>
					</Row>
				</Form.Item>
				<Form.Item label='¿Fumador pasivo?' labelCol={{ span: 6 }}>
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
								name='passiveSmoker'
								noStyle
								valuePropName='checked'
							>
								<Checkbox />
							</Form.Item>
						</Col>
						<Col span={20} style={{ height: '32px' }}>
							<Form.Item
								label='Edad en la que dejó de fumar'
								labelCol={{ span: 17 }}
								name='stopSmokingAge'
							>
								<CustomInputNumber />
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
		smoking: state.expedient.smoking,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		update: (value) => dispatch(updateSmoking(value)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Smoking)
