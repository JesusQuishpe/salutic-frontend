import React, { useEffect } from 'react'
import { Form, Radio, Row, Col, Input } from 'antd'
import { CustomInputNumber } from '../antd/CustomInputNumber'

export const MathematicLayout = () => {
	const formInstance = Form.useFormInstance()
	const operatorType = Form.useWatch('operatorType', formInstance)

	useEffect(() => {
		/*if (operatorType === 'range') {
			formInstance.setFieldsValue({
				operatorValue: '',
			})
		} else {
			formInstance.setFieldsValue({
				of: '',
				until: '',
			})
		}
		formInstance.setFieldsValue({
			operatorValue: '',
			interpretation: '',
		})*/
	}, [operatorType])

	return (
		<>
			<Form.Item wrapperCol={{ offset: 3 }}>
				<Form.Item
					name='operatorType'
					label=''
					rules={[
						{
							required: true,
							message: 'Seleccione un tipo de valor',
						},
					]}
				>
					<Radio.Group>
						<Radio value='<'>Menor que</Radio>
						<Radio value='>'>Mayor que</Radio>
						<Radio value='='>Igual que</Radio>
						<Radio value='range'>Rango</Radio>
					</Radio.Group>
				</Form.Item>
				{operatorType === 'range' ? (
					<div>
						<Row gutter={10}>
							<Col span={12}>
								<Form.Item
									label='De'
									name='of'
									labelCol={{ span: 24 }}
								>
									<CustomInputNumber
										style={{ width: '100%' }}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label='Hasta'
									name='until'
									labelCol={{ span: 24 }}
								>
									<CustomInputNumber
										style={{ width: '100%' }}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Form.Item
							label='Interpretation'
							name='interpretation'
							labelCol={{ span: 24 }}
						>
							<Input />
						</Form.Item>
					</div>
				) : (
					<Row gutter={10}>
						<Col span={12}>
							<Form.Item
								label='Valor'
								name='operatorValue'
								labelCol={{ span: 24 }}
							>
								<CustomInputNumber style={{ width: '100%' }} />
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
				)}
			</Form.Item>
		</>
	)
}
