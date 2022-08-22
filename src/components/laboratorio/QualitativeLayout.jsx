import React from 'react'
import { Row, Col, Input, Form } from 'antd'

export const QualitativeLayout = () => {
	return (
		<Form.Item wrapperCol={{ offset: 3 }}>
			<Row gutter={10}>
				<Col span={12}>
					<Form.Item
						label='Valor'
						name='qualitativeValue'
						labelCol={{ span: 24 }}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						label='Interpretación'
						name='interpretation'
						labelCol={{ span: 24 }}
					>
						<Input />
					</Form.Item>
				</Col>
			</Row>
		</Form.Item>
	)
}
