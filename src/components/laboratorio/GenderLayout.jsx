import React from 'react'
import { Row, Col, Input, Form } from 'antd'
import { CustomInputNumber } from '../antd/CustomInputNumber'

export const GenderLayout = () => {
	return (
		<Form.Item wrapperCol={{ offset: 3 }}>
			<Row gutter={10}>
				<Col span={6}>
					<Form.Item label='Sexo' labelCol={{ span: 24 }}>
						<Input disabled defaultValue='F' />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item
						label='De'
						name='femaleOf'
						labelCol={{ span: 24 }}
					>
						<CustomInputNumber style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item
						label='Hasta'
						name='femaleUntil'
						labelCol={{ span: 24 }}
					>
						<CustomInputNumber style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item
						label='Interpretación'
						name='femaleInterpretation'
						labelCol={{ span: 24 }}
					>
						<Input />
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={10}>
				<Col span={6}>
					<Form.Item label='Sexo' labelCol={{ span: 24 }}>
						<Input disabled defaultValue='M' />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item label='De' name='maleOf' labelCol={{ span: 24 }}>
						<CustomInputNumber style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item
						label='Hasta'
						name='maleUntil'
						labelCol={{ span: 24 }}
					>
						<CustomInputNumber style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item
						label='Interpretación'
						name='maleInterpretation'
						labelCol={{ span: 24 }}
					>
						<Input />
					</Form.Item>
				</Col>
			</Row>
		</Form.Item>
	)
}
