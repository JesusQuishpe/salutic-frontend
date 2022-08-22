import { Button, Form, Input, Modal, Select, Spin } from 'antd'
import React, { useEffect, useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { CieService } from '../../../services/CieService'
import { debounce } from 'lodash'
import { generateUniqueId } from '../../../utils/functions'

const { Option } = Select

const getOptionsCie = (data) => {
	return data.map((cie) => ({
		label: cie.disease,
		value: cie.id,
	}))
}

const initialForm = {
	type: null,
	description: '',
	cie: null,
}

export const OdoDiagnosticModal = ({ cies, modalParams, closeModal }) => {
	const [form] = Form.useForm()
	const [options, setOptions] = useState([])
	const [fetching, setFetching] = useState(false)

	const debounceSearch = useMemo(() => {
		const searchCie = (value) => {
			setOptions([])
			setFetching(true)
			CieService.searchCieByName(value)
				.then((results) => {
					setOptions(getOptionsCie(results))
				})
				.finally(() => {
					setFetching(false)
				})
		}
		return debounce(searchCie, 800)
	}, [])

	const onCancel = () => {
		form.resetFields(['type', 'description', 'cie'])
		closeModal()
	}

	const onFinish = (values) => {
		const newData = {
			description: values.description,
			type: values.type,
			cie: values.cie.label,
			cieId: values.cie.value,
			rowId: modalParams.isEdit
				? modalParams.data.rowId
				: generateUniqueId(),
		}
		console.log(newData)
		if (modalParams.isEdit) {
			modalParams.editDiagnostic(newData)
		} else {
			modalParams.addDiagnostic(newData)
		}
		onCancel()
	}

	useEffect(() => {
		setOptions(getOptionsCie(cies)) //Los cies viene tanto para nueva consulta o para actualizar
	}, [])

	useEffect(() => {
		if (modalParams.data) {
			const { data } = modalParams
			form.setFieldsValue({
				type: data.type,
				description: data.description,
				cie: { label: data.cie, value: data.cieId },
			})
		}
	}, [modalParams])

	return (
		<Modal
			title='Agregar diagnostico'
			forceRender
			visible={modalParams.show}
			onCancel={onCancel}
			okText='Guardar'
			cancelText='Cancelar'
			footer={[
				<Button key='cancel' onClick={closeModal}>
					Cancelar
				</Button>,
				<Button
					key='submit'
					type='primary'
					onClick={() => {
						form.validateFields()
							.then((values) => {
								onFinish(values)
							})
							.catch((info) => {
								console.log('Validate Failed:', info)
							})
					}}
				>
					Guardar
				</Button>,
			]}
		>
			<Form form={form} layout='vertical' initialValues={initialForm}>
				<Form.Item
					label='Tipo'
					name='type'
					rules={[
						{
							required: true,
							message: 'El campo es requerido',
						},
					]}
				>
					<Select placeholder='Seleccione el tipo de diagnóstico'>
						<Option value='Presuntivo'>Presuntivo</Option>
						<Option value='Definitivo'>Definitivo</Option>
					</Select>
				</Form.Item>
				<Form.Item
					label='Descripción'
					name='description'
					rules={[
						{
							required: true,
							message: 'El campo es requerido',
						},
					]}
				>
					<Input.TextArea rows={5} />
				</Form.Item>
				<Form.Item
					label='Cie'
					name='cie'
					rules={[
						{
							required: true,
							message: 'El campo es requerido',
						},
					]}
				>
					<Select
						showSearch
						labelInValue
						placeholder='Busque una enfermedad'
						filterOption={false}
						onSearch={debounceSearch}
						notFoundContent={
							fetching ? <Spin size='small' /> : null
						}
						options={options}
					/>
				</Form.Item>
			</Form>
		</Modal>
	)
}
const mapStateToProps = (state) => {
	return {
		cies: state.odontology.data.cies,
	}
}

export default connect(mapStateToProps, null)(OdoDiagnosticModal)
