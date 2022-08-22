import { Card, Checkbox, Form, Input } from 'antd'
import React from 'react'
import useLifeStyleForm from '../../../hooks/useLifeStyleForm'
import { updateOthers } from '../../../store/slices/expedient/expedientSlice'
import { connect } from 'react-redux'

const { TextArea } = Input

const Others = ({ others, update }) => {
	console.log(others)
	const { form, onValuesChange } = useLifeStyleForm(others, update)

	return (
		<Card title='Otros'>
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
				<Form.Item
					labelCol={{
						span: 24,
					}}
					label='¿Autonomía en el trabajo?'
					valuePropName='checked'
					name='workAuthonomy'
				>
					<Checkbox />
				</Form.Item>

				<Form.Item
					label='¿Turno(s) en el trabajo?'
					labelCol={{
						span: 24,
					}}
					name='workShift'
				>
					<TextArea />
				</Form.Item>
				<Form.Item
					label='¿Qué actividades realiza en el tiempo libre?'
					labelCol={{
						span: 24,
					}}
					name='hobbies'
				>
					<TextArea />
				</Form.Item>
				<Form.Item
					label='Otras situaciones'
					labelCol={{
						span: 24,
					}}
					name='otherSituations'
				>
					<TextArea />
				</Form.Item>
			</Form>
		</Card>
	)
}
const mapStateToProps = (state) => {
	return {
		others: state.expedient.others,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		update: (value) => dispatch(updateOthers(value)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Others)
