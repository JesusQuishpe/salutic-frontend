import {
	Button,
	Card,
	Form,
	Input,
	message,
	Row,
	TimePicker,
	//Upload,
} from 'antd'
import React, { useEffect } from 'react'
//import { UploadOutlined } from '@ant-design/icons'
import moment from 'moment'
import { CompanyService } from '../../services/CompanyService'
import { parseHour } from '../../utils/functions'
import useUser from '../../hooks/useUser'
import { useLoader } from '../../hooks/useLoader'
import { axiosErrorHandler } from '../../handlers/axiosErrorHandler'

/*const normFile = (e) => {
	console.log('Upload event:', e)

	if (Array.isArray(e)) {
		return e
	}

	return e?.fileList
}*/

export const CompanyForm = () => {
	const { openLoader, closeLoader } = useLoader()
	const { user } = useUser()
	const [form] = Form.useForm()

	const initialForm = {
		longName: '',
		shortName: '',
		email: '',
		address: '',
		phone: '',
		startHour: null,
		endHour: null,
		//logo: null,
	}

	const onFinish = async (values) => {
		try {
			openLoader('Guardando cambios...')
			const endHour = parseHour(values.endHour)
			const startHour = parseHour(values.startHour)
			//const logo = values.logo ? values.logo[0].originFileObj : null
			const { longName, shortName, email, phone, address } = values
			//const data={ ...values,logo, startHour, endHour }
			const data = new FormData()
			data.append('_method', 'PUT') //enviamos el metodo para que laravel identifique que es put
			//data.append('logo', logo)
			data.append(
				'data',
				JSON.stringify({
					companyId: user.companyId,
					longName,
					shortName,
					email,
					phone,
					address,
					startHour,
					endHour,
				})
			)
			//console.log(data);
			const response = await CompanyService.updateCompany(
				data,
				user.companyId
			)
			console.log(response)
			message.success('Datos guardados correctamente')
		} catch (error) {
			console.log(error)
			const { message: errorMessage } = axiosErrorHandler(error)
			message.error(errorMessage)
		} finally {
			closeLoader()
		}
	}

	const loadCompanyInfo = async (id) => {
		try {
			openLoader('Cargando...')
			const data = await CompanyService.getById(id)
			form.setFieldsValue({
				longName: data.longName,
				shortName: data.shortName,
				email: data.email,
				address: data.address,
				phone: data.phone,
				startHour: data.startHour
					? moment(data.startHour, 'H:m:s')
					: null,
				endHour: data.endHour ? moment(data.endHour, 'H:m:s') : null,
				//logo: null,
			})
			console.log(data)
		} catch (error) {
			console.log(error)
			const { message: errorMessage } = axiosErrorHandler(error)
			message.error(errorMessage)
		} finally {
			closeLoader()
		}
	}

	useEffect(() => {
		if (user) {
			loadCompanyInfo(user.companyId)
		}
	}, [user])

	return (
		<Card title='Información de la empresa' type='inner'>
			<Form
				form={form}
				labelCol={{
					span: 5,
				}}
				wrapperCol={{
					span: 17,
				}}
				initialValues={initialForm}
				onFinish={onFinish}
			>
				<Row justify='end' style={{ marginBottom: '20px' }}>
					<Button type='primary' htmlType='submit'>
						Guardar cambios
					</Button>
				</Row>
				<Form.Item
					label='Nombre completo de la clinica'
					name='longName'
					rules={[
						{ required: true, message: 'El campo es requerido' },
					]}
				>
					<Input maxLength={100} />
				</Form.Item>
				<Form.Item
					label='Nombre corto de la clinica'
					extra='Max. 20 caracteres'
					name='shortName'
					rules={[
						{ required: true, message: 'El campo es requerido' },
					]}
				>
					<Input maxLength={20} />
				</Form.Item>
				{/*<Form.Item
					label='Logo'
					name='logo'
					valuePropName='fileList'
					getValueFromEvent={normFile}
				>
					<Upload
						//action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
						listType='picture'
						//fileList={fileList}
						//onPreview={handlePreview}
						//onChange={handleChange}
						maxCount={1}
						name='logo'
					>
						<Button icon={<UploadOutlined />}>
							Click para subir
						</Button>
					</Upload>
      </Form.Item>*/}
				<Form.Item
					label='Dirección'
					name='address'
					rules={[
						{ required: true, message: 'El campo es requerido' },
					]}
				>
					<Input maxLength={150} />
				</Form.Item>
				<Form.Item
					label='Teléfono'
					name='phone'
					rules={[
						{ required: true, message: 'El campo es requerido' },
					]}
				>
					<Input maxLength={10} />
				</Form.Item>

				<Form.Item
					label='Correo electrónico'
					name='email'
					rules={[
						{ required: true, message: 'El campo es requerido' },
					]}
				>
					<Input maxLength={150} />
				</Form.Item>

				<Form.Item
					label='Hora de inicio'
					name='startHour'
					rules={[
						{ required: true, message: 'El campo es requerido' },
					]}
				>
					<TimePicker
						use12Hours
						format='h:mm a'
						placeholder='Selecciona la hora'
					/>
				</Form.Item>
				<Form.Item
					label='Hora de cierre'
					name='endHour'
					rules={[
						{ required: true, message: 'El campo es requerido' },
					]}
				>
					<TimePicker
						use12Hours
						format='h:mm a'
						placeholder='Selecciona la hora'
					/>
				</Form.Item>
			</Form>
		</Card>
	)
}
