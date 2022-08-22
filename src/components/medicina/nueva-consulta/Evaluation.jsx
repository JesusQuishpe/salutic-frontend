import { Form, Input } from 'antd'
import React, { useEffect } from 'react'

const Evaluation = ({ data, update }) => {
	const [form] = Form.useForm()

	const onValuesChange = (_, values) => {
		update(values)
	}

	useEffect(() => {
		if (data) {
			console.log('EVALUATION')
			form.setFieldsValue({
				laboratoryStudies: data?.laboratoryStudies,
				diagnostics: data?.diagnostics,
				treatments: data?.treatments,
			})
		}
	}, [data])

	return (
		<div>
			<Form
				form={form}
				labelCol={{
					span: 5,
				}}
				onValuesChange={onValuesChange}
				initialValues={{
					laboratoryStudies: '',
					diagnostics: '',
					treatments: '',
				}}
			>
				<Form.Item
					label='Estudios de laboratorio'
					name='laboratoryStudies'
				>
					<Input.TextArea
						rows={5}
						placeholder='Detalle los estudios a solicitar'
					></Input.TextArea>
				</Form.Item>
				<Form.Item label='Diagnósticos' name='diagnostics'>
					<Input.TextArea rows={5}></Input.TextArea>
				</Form.Item>
				<Form.Item label='Tratamientos' name='treatments'>
					<Input.TextArea rows={5}></Input.TextArea>
				</Form.Item>
			</Form>
		</div>
	)
}
export default React.memo(Evaluation)
