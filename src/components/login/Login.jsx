import { Button, Col, Form, Input, Row } from 'antd'
import LogoSoftware from '../../assets/png/logo-software.png'
import useUser from '../../hooks/useUser'

export const Login = () => {
	const [form] = Form.useForm()
	const { login } = useUser()

	const onFinish = () => {
		const { email, password } = form.getFieldsValue()
		console.log(email, password)
		try {
			login(email, password)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Row justify='center' align='middle' style={{ minHeight: '100vh' }}>
			<Col>
				<Form
					form={form}
					style={{ width: '700px' }}
					name='basic'
					labelCol={{
						span: 6,
					}}
					wrapperCol={{
						span: 16,
					}}
					onFinish={onFinish}
					//  onFinishFailed={onFinishFailed}
					autoComplete='on'
				>
					<Row justify='center' className='mb-3'>
						<Col>
							<img
								src={LogoSoftware}
								width={300}
								alt='Logo.png'
							/>
						</Col>
					</Row>
					<Form.Item
						label='Correo electrónico'
						name='email'
						rules={[
							{
								required: true,
								message: 'Ingresa un correo electrónico!',
							},
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label='Contraseña'
						name='password'
						rules={[
							{
								required: true,
								message: 'Ingresa una contraseña!',
							},
						]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item
						wrapperCol={{
							offset: 6,
							span: 16,
						}}
					>
						<Button type='primary' htmlType='submit'>
							Iniciar sesión
						</Button>
					</Form.Item>
				</Form>
			</Col>
		</Row>
	)
}
