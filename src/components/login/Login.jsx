import { Button, Col, Form, Input, Row } from 'antd'
import PrefecturaLogo from '../../assets/png/prefectura-logo.png'
import useUser from '../../hooks/useUser'

export const Login = () => {
	const [form] = Form.useForm()
	const { login } = useUser()

	const onFinish = () => {
		const { username, password } = form.getFieldsValue()
		console.log(username, password)
		try {
			login(username, password)
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
					<Row justify='center' style={{ marginBottom: '10px' }}>
						<Col>
							<img
								src={PrefecturaLogo}
								width={300}
								alt='Logo.png'
							/>
						</Col>
					</Row>
					<Form.Item
						label='Nombre de usuario'
						name='username'
						rules={[
							{
								required: true,
								message: 'Ingresa el nombre de usuario!',
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
