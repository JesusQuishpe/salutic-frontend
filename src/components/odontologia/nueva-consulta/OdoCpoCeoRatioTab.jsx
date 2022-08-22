import { Col, Form, Input, InputNumber, Row } from 'antd'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { setCpoCeoRatios } from '../../../store/slices/odontology/odontologySlice'

const sumarIndices = (n1, n2, n3) => {
	const num1 = parseFloat(n1) || 0
	const num2 = parseFloat(n2) || 0
	const num3 = parseFloat(n3) || 0
	//if (isNaN(num1) || isNaN(num2) || isNaN(num3)) return 0
	return num1 + num2 + num3
}

const OdoCpoCeoRatioTab = ({ cpoCeoRatios, update }) => {
	const [form] = Form.useForm()

	const handleFormChange = (value, values) => {
		const newValues = { ...values, ...value }
		newValues.cpoTotal = sumarIndices(
			newValues.cpoC,
			newValues.cpoP,
			newValues.cpoO
		)
		newValues.ceoTotal = sumarIndices(
			newValues.ceoC,
			newValues.ceoE,
			newValues.ceoO
		)
		console.log(values)
		form.setFieldsValue(newValues)
		update(newValues)
	}

	useEffect(() => {
		if (cpoCeoRatios) {
			form.setFieldsValue({
				id: cpoCeoRatios.id,
				cpoC: cpoCeoRatios.cd,
				cpoP: cpoCeoRatios.pd,
				cpoO: cpoCeoRatios.od,
				cpoTotal: cpoCeoRatios.cpoTotal,
				ceoC: cpoCeoRatios.ce,
				ceoE: cpoCeoRatios.ee,
				ceoO: cpoCeoRatios.oe,
				ceoTotal: cpoCeoRatios.ceoTotal,
			})
		}
	}, [cpoCeoRatios])

	return (
		<>
			<h2>Indices cpo-ceo</h2>
			<Row justify='center'>
				<Form
					form={form}
					labelCol={{
						span: 8,
					}}
					wrapperCol={{
						span: 16,
					}}
					initialValues={{
						id: null,
						cpoC: null,
						cpoP: null,
						cpoO: null,
						cpoTotal: null,
						ceoC: null,
						ceoE: null,
						ceoO: null,
						ceoTotal: null,
					}}
					onValuesChange={handleFormChange}
				>
					<Form.Item noStyle hidden name='id'>
						<Input type='hidden' />
					</Form.Item>
					<Row gutter={20}>
						<Col span={12}>
							<Form.Item label='C' name='cpoC'>
								<InputNumber />
							</Form.Item>
							<Form.Item label='P' name='cpoP'>
								<InputNumber />
							</Form.Item>
							<Form.Item label='O' name='cpoO'>
								<InputNumber />
							</Form.Item>
							<Form.Item label='Total' name='cpoTotal'>
								<InputNumber />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label='C' name='ceoC'>
								<InputNumber />
							</Form.Item>
							<Form.Item label='E' name='ceoE'>
								<InputNumber />
							</Form.Item>
							<Form.Item label='O' name='ceoO'>
								<InputNumber />
							</Form.Item>
							<Form.Item label='Total' name='ceoTotal'>
								<InputNumber />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Row>
		</>
	)
}

const mapStateToProps = (state) => {
	return {
		cpoCeoRatios: state.odontology.data.cpoCeoRatios,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		update: (value) => dispatch(setCpoCeoRatios(value)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(OdoCpoCeoRatioTab)
