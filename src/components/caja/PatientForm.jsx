import {
	Button,
	Card,
	Col,
	DatePicker,
	Form,
	Input,
	message,
	Row,
	Select,
} from 'antd'
import moment from 'moment'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import LoaderContext from '../../contexts/LoaderContext'
import { axiosErrorHandler } from '../../handlers/axiosErrorHandler'
import { PatientService } from '../../services/PatientService'
import { ContentNotFound } from '../not-found/ContentNotFound'

const { Option } = Select

export const PatientForm = () => {
	const { openLoader, closeLoader } = useContext(LoaderContext)
	const [form] = Form.useForm()
	const { patientId } = useParams()
	const [notFound, setNotFound] = useState(false)
	const isEdit = !!patientId

	const initialForm = {
		identification: '',
		name: '',
		lastname: '',
		birthDate: null,
		age: 0,
		gender: null,
		cellphone: '',
		address: '',
		province: null,
		city: null,
	}

	const handleSubmit = async (values) => {
		console.log(values)

		try {
			const birthDate = values.birthDate
				? moment(values.birthDate).format('YYYY-MM-DD')
				: null
			if (isEdit) {
				openLoader('Actualizando...')
				await PatientService.updatePatient(
					{ ...values, birthDate },
					parseInt(patientId)
				)
				message.success('Paciente actualizado correctamente')
			} else {
				openLoader('Creando...')
				await PatientService.createPatient({
					...values,
					birthDate,
					attended: true,
				})
				message.success('Paciente creado correctamente')
				form.resetFields()
			}
		} catch (error) {
			console.log(error)
		} finally {
			closeLoader()
		}
	}

	const birthDateChange = (value) => {
		const age = !value ? 0 : moment().diff(value, 'years', false)
		form.setFieldsValue({
			...form.getFieldsValue(),
			age,
		})
	}

	const onValuesChange = (value, values) => {
		const key = Object.keys(value)[0]
		if (key === 'name' || key === 'lastname') {
			form.setFieldsValue({
				fullname: values.name + ' ' + values.lastname,
			})
		}
	}

	const loadPatient = async (patientId) => {
		try {
			openLoader('Cargando...')
			const patient = await PatientService.getById(patientId)
			console.log(patient)
			const birthDate = patient.birthDate
				? moment(patient.birthDate)
				: null

			form.setFieldsValue({
				...patient,
				birthDate,
			})
		} catch (error) {
			console.log(error)
			const { status } = axiosErrorHandler(error)
			if (status && status === 404) {
				setNotFound(true)
			}
		} finally {
			closeLoader()
		}
	}

	useEffect(() => {
		if (isEdit) {
			loadPatient(parseInt(patientId))
		}
	}, [])

	if (notFound) {
		return <ContentNotFound />
	}

	return (
		<>
			<Card
				title={isEdit ? 'Actualizar paciente' : 'Nuevo paciente'}
				type='inner'
			>
				<Form
					//style={{ width: "700px" }}
					form={form}
					name='basic'
					labelCol={{
						span: 6,
					}}
					wrapperCol={{
						span: 12,
					}}
					initialValues={{
						...initialForm,
					}}
					onFinish={handleSubmit}
					//onFinishFailed={onFinishFailed}
					autoComplete='off'
					onValuesChange={onValuesChange}
				>
					<Row justify='end'>
						<Form.Item>
							<Button type='primary' htmlType='submit'>
								{isEdit ? 'Actualizar' : 'Guardar'}
							</Button>
						</Form.Item>
					</Row>
					<Form.Item
						label='C??dula'
						name='identification'
						rules={[
							{
								required: true,
								message: 'Ingresa un n??mero de c??dula!',
							},
						]}
					>
						<Input maxLength={10} />
					</Form.Item>
					<Form.Item
						label='Nombres'
						name='name'
						rules={[
							{
								required: true,
								message: 'Ingrese los nombres del paciente!',
							},
						]}
					>
						<Input maxLength={50} />
					</Form.Item>
					<Form.Item
						label='Apellidos'
						name='lastname'
						rules={[
							{
								required: true,
								message: 'Ingrese los apellidos del paciente!',
							},
						]}
					>
						<Input maxLength={50} />
					</Form.Item>
					<Form.Item label='Nombre completo' name='fullname'>
						<Input disabled />
					</Form.Item>
					<Form.Item
						label='Fecha de nacimiento'
						style={{ marginBottom: 0 }}
					>
						<Row gutter={10}>
							<Col span={12}>
								<Form.Item noStyle name='birthDate'>
									<DatePicker
										placeholder='Selecciona la fecha'
										style={{ width: '100%' }}
										format='DD/MM/YYYY'
										onChange={birthDateChange}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name='age'>
									<Input disabled />
								</Form.Item>
							</Col>
						</Row>
					</Form.Item>

					<Form.Item
						name='gender'
						label='Sexo'
						rules={[
							{
								required: true,
								message: 'El campo es requerido',
							},
						]}
					>
						<Select
							placeholder='Selecciona un g??nero'
							//onChange={this.onGenderChange}
							allowClear
						>
							<Option value='Masculino'>Masculino</Option>
							<Option value='Femenino'>Femenino</Option>
						</Select>
					</Form.Item>

					<Form.Item label='Tel??fono' name='cellphone'>
						<Input maxLength={20} />
					</Form.Item>
					<Form.Item label='Domicilio' name='address'>
						<Input maxLength={150} />
					</Form.Item>

					<Form.Item name='province' label='Provincia'>
						<Select
							placeholder='Selecciona una provincia'
							//onChange={this.onGenderChange}
							allowClear
						>
							<Option value='El Oro'>El Oro</Option>
							<Option value='Azuay'>Azuay</Option>
							<Option value='Bol??var'>Bol??var</Option>
							<Option value='Ca??ar'>Ca??ar</Option>
							<Option value='Carchi'>Carchi</Option>
							<Option value='Chimborazo'>Chimborazo</Option>
							<Option value='Cotopaxi'>Cotopaxi</Option>
							<Option value='Esmeraldas'>Esmeraldas</Option>
							<Option value='Gal??pagos'>Gal??pagos</Option>
							<Option value='Guayas'>Guayas</Option>
							<Option value='Imbabura'>Imbabura</Option>
							<Option value='Loja'>Loja</Option>
							<Option value='Los Rios'>Los Rios</Option>
							<Option value='Manabi'>Manabi</Option>
							<Option value='Morona Santiago'>
								Morona Santiago
							</Option>
							<Option value='Napo'>Napo</Option>
							<Option value='Orellana'>Orellana</Option>
							<Option value='Pastaza'>Pastaza</Option>
							<Option value='Pichincha'>Pichincha</Option>
							<Option value='Santa Elena'>Santa Elena</Option>
							<Option value='Santo Domingo'>Santo Domingo</Option>
							<Option value='Sucumb??os'>Sucumb??os</Option>
							<Option value='Tungurahua'>Tungurahua</Option>
							<Option value='Zamora'>Zamora</Option>
						</Select>
					</Form.Item>

					<Form.Item name='city' label='Ciudad'>
						<Select
							placeholder='Selecciona una ciudad'
							//onChange={this.onGenderChange}
							allowClear
						>
							<Option value='Machala'>Machala</Option>
							<Option value='Arenilla'>Arenillas</Option>
							<Option value='Atahualpa'>Atahualpa</Option>
							<Option value='Balsas'>Balsas</Option>
							<Option value='Chilla'>Chilla</Option>
							<Option value='El Guabo'>El Guabo</Option>
							<Option value='Guayaquil'>Guayaquil</Option>
							<Option value='Huaquillas'>Huaquillas</Option>
							<Option value='Las Lajas'>Las Lajas</Option>
							<Option value='Marcabeli'>Marcabeli</Option>
							<Option value='Pasaje'>Pasaje</Option>
							<Option value='Pi??as'>Pi??as</Option>
							<Option value='Portovelo'>Portovelo</Option>
							<Option value='Santa Rosa'>Santa Rosa</Option>
							<Option value='Zaruma'>Zaruma</Option>
						</Select>
					</Form.Item>
				</Form>
			</Card>
		</>
	)
}
