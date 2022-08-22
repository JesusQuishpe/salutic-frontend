import React, { useEffect } from 'react'
import { Form, Row, Col, Input, Checkbox } from 'antd'
import { connect } from 'react-redux/es/exports'
import { setFamilyHistory } from '../../../store/slices/odontology/odontologySlice'

const { TextArea } = Input

const loadFamilyHistoryCheckBoxes = (diseaseList) => {
	let checkboxes = []
	if (!diseaseList) return 'No se pudo cargar los antecedentes'
	checkboxes = diseaseList.map((disease) => {
		return (
			<Row key={disease.id}>
				<Checkbox value={disease.id}>{disease.name}</Checkbox>
			</Row>
		)
	})
	return checkboxes
}

const loadPathologiesCheckBoxes = (pathologies) => {
	let checkboxes = []
	if (!pathologies) return 'No se pudo cargar las patologias'
	checkboxes = pathologies.map((pat) => {
		return (
			<Row key={pat.id}>
				<Checkbox value={pat.id}>{pat.name}</Checkbox>
			</Row>
		)
	})
	return checkboxes
}

const OdoFamilyHistoryTab = ({ data, update }) => {
	const [form] = Form.useForm()

	useEffect(() => {
		if (data.familyHistory) {
			const dataForEdit = {
				id: data.familyHistory.id,
				stoTestId: data?.stomatognathicTest?.id,
				familyHistoryDescription: data.familyHistory.description,
				pathologiesDescription: data.stomatognathicTest.description,
				selectedFamilyHistory: data.familyHistory.details.map(
					(detail) => detail.diseaseId
				),
				selectedPathologies: data.stomatognathicTest.details.map(
					(detail) => detail.patId
				),
			}
			form.setFieldsValue(dataForEdit)
		}
	}, [data])

	const onValuesChange = (_, values) => {
		update({ ...form.getFieldsValue() })
	}

	return (
		<>
			<div>
				<div>
					<h5>Antecedentes personales y familiares </h5>
					<Form
						form={form}
						layout='vertical'
						initialValues={{
							id: null,
							familyHistoryDescription: '',
							selectedFamilyHistory: [],
							pathologiesDescription: '',
							selectedPathologies: [],
						}}
						onValuesChange={onValuesChange}
					>
						<Form.Item noStyle hidden name='id'>
							<Input type='hidden' />
						</Form.Item>
						<Form.Item noStyle hidden name='stoTestId'>
							<Input type='hidden' />
						</Form.Item>
						<Row gutter={20}>
							<Col span={12}>
								<Form.Item
									label='Describir los antecedentes'
									name='familyHistoryDescription'
								>
									<TextArea rows={4} maxLength={300} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label='Seleccione los antecedentes'
									name='selectedFamilyHistory'
								>
									<Checkbox.Group>
										{loadFamilyHistoryCheckBoxes(
											data.diseaseList
										)}
									</Checkbox.Group>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={20}>
							<Col span={12}>
								<Form.Item
									label='Describir las patologías'
									name='pathologiesDescription'
								>
									<TextArea rows={4} maxLength={300} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='selectedPathologies'
									label='Selecciones las patologias'
								>
									<Checkbox.Group>
										{loadPathologiesCheckBoxes(
											data.pathologies
										)}
									</Checkbox.Group>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</div>
			</div>
		</>
	)
}

const mapStateToProps = (state) => {
	return {
		data: state.odontology.data,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		update: (value) => dispatch(setFamilyHistory(value)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(OdoFamilyHistoryTab)
