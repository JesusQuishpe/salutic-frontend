import { Card, Col, Form, Input, InputNumber, Row } from 'antd'
import React, { useEffect } from 'react'

const Exploration = ({ explorationValue, nursingInfo, update }) => {
	const [form] = Form.useForm()

	const onValuesChange = (_, values) => {
		update(values)
	}

	useEffect(() => {
		if (nursingInfo) {
			form.setFieldsValue({
				...nursingInfo,
			})
		}
	}, [nursingInfo])

	useEffect(() => {
		if (explorationValue) {
			form.setFieldValue('physicalExploration', explorationValue)
		}
	}, [explorationValue])

	return (
		<Form
			form={form}
			labelCol={{ span: 12 }}
			onValuesChange={onValuesChange}
			initialValues={{
				weight: 0,
				stature: 0,
				temperature: 0,
				frequency: 0,
				pressure: '',
				physicalExploration: '',
			}}
		>
			<Row gutter={10}>
				<Col span={8}>
					<Card title='General'>
						<Form.Item label='Peso (kg)' name='weight'>
							<InputNumber disabled />
						</Form.Item>
						<Form.Item label='Estatura (cm)' name='stature'>
							<InputNumber disabled />
						</Form.Item>
						<Form.Item
							label='Frec. respiratoria (x min)'
							name='breathingFrequency'
						>
							<InputNumber disabled />
						</Form.Item>
						<Form.Item label='Presión' name='pressure'>
							<Input disabled />
						</Form.Item>
						<Form.Item label='Temperatura (°C)' name='temperature'>
							<InputNumber disabled />
						</Form.Item>
					</Card>
				</Col>
				<Col span={16}>
					<Card title='Exploración de física'>
						<Form.Item name='physicalExploration'>
							<Input.TextArea rows={25}></Input.TextArea>
						</Form.Item>
					</Card>
				</Col>
			</Row>
		</Form>
	)
}
export default React.memo(Exploration)
