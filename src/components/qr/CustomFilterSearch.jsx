import { Button, Card, DatePicker, Form, Input } from 'antd'
import React, { forwardRef, useImperativeHandle } from 'react'
import { parseDate } from '../../utils/functions'

const CustomFilterSearch = (
	{
		placeholder,
		allowClear,
		onSearch,
		cardType,
		identificationHidden = false,
	},
	ref
) => {
	const [form] = Form.useForm()
	const formWatch = Form.useWatch([], form)

	const parseValues = (values) => {
		return {
			startDate: parseDate(values.startDate, 'YYYY-MM-DD'),
			endDate: parseDate(values.endDate, 'YYYY-MM-DD'),
			identification: values.identification,
		}
	}

	const handleFinish = (values) => {
		onSearch(parseValues(values))
	}

	useImperativeHandle(
		ref,
		() => ({
			setFieldValue: (field, value) => form.setFieldValue(field, value),
			values: parseValues(form.getFieldsValue()),
		}),
		[formWatch]
	)

	return (
		<Card
			title='Parámetros de búsqueda'
			style={{ marginBottom: '20px' }}
			type={cardType}
		>
			<Form
				form={form}
				layout='inline'
				onFinish={handleFinish}
				initialValues={{
					startDate: null,
					endDate: null,
					identification: '',
				}}
			>
				<Form.Item label='Fecha inicial' name='startDate'>
					<DatePicker
						placeholder='Selecciona la fecha'
						style={{ width: 200 }}
						format='DD/MM/YYYY'
					/>
				</Form.Item>
				<Form.Item label='Fecha final' name='endDate'>
					<DatePicker
						placeholder='Selecciona la fecha'
						style={{ width: 200 }}
						format='DD/MM/YYYY'
					/>
				</Form.Item>
				{!identificationHidden && (
					<Form.Item
						label='Cédula'
						name='identification'
						rules={[
							{
								required: true,
								message: 'El campo es requerido',
							},
						]}
					>
						<Input
							placeholder={placeholder}
							allowClear={allowClear}
						/>
					</Form.Item>
				)}
				<Form.Item>
					<Button type='primary' htmlType='submit'>
						Buscar
					</Button>
				</Form.Item>
			</Form>
		</Card>
	)
}
export default forwardRef(CustomFilterSearch)
