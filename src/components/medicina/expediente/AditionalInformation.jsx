import { Col, Form, Input, Row, Select } from 'antd'
import React, { useEffect } from 'react'
import { setAditionalInformation } from '../../../store/slices/expedient/expedientSlice'
import { connect } from 'react-redux'
const { Option } = Select

const AditionalInformation = ({ data, update }) => {
	const [form] = Form.useForm()

	useEffect(() => {
		if (data.patient) {
			form.setFieldsValue({ ...data.patient })
		}
	}, [])

	const onValuesChange = (_, values) => {
		update({ ...values })
	}

	return (
		<Form
			name='form-adicional'
			labelCol={{
				span: 6,
			}}
			wrapperCol={{
				span: 18,
			}}
			form={form}
			onValuesChange={onValuesChange}
		>
			<Row gutter={20}>
				<Col span={12}>
					<Form.Item label='Ocupación' name='occupation'>
						<Input />
					</Form.Item>
					<Form.Item label='Estado civil' name='maritalStatus'>
						<Input />
					</Form.Item>
					<Form.Item label='Procedencia' name='origin'>
						<Input />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label='Nombre madre' name='motherName'>
						<Input />
					</Form.Item>
					<Form.Item label='Nombre padre' name='fatherName'>
						<Input />
					</Form.Item>
					<Form.Item label='Nombre pareja' name='coupleName'>
						<Input />
					</Form.Item>
				</Col>
			</Row>
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
		update: (value) => dispatch(setAditionalInformation(value)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AditionalInformation)
