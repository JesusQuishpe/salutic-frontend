import { Button, Col, Form, Input, Row } from 'antd'
import { QrcodeOutlined } from '@ant-design/icons'
import QrModalContext from '../../contexts/QrModalContext'
import { useContext } from 'react'

const CustomSearch = ({
	onSearch,
	onReload,
	placeholder,
	allowClear,
	disabled,
	showQrButton = true,
	showReloadButton = true,
}) => {
	const { openModal } = useContext(QrModalContext)
	const [form] = Form.useForm()

	const onReloadClick = () => {
		form.setFieldsValue({ search: '' })
		if (onReload) {
			onReload()
		}
	}

	return (
		<Row gutter={2} wrap={false}>
			<Col flex={5}>
				<Form form={form}>
					<Form.Item name='search'>
						<Input.Search
							onSearch={onSearch}
							placeholder={placeholder}
							allowClear={allowClear}
							disabled={disabled}
						/>
					</Form.Item>
				</Form>
			</Col>
			<Col flex='none'>
				{showQrButton && (
					<Button
						disabled={disabled}
						type='default'
						onClick={openModal}
					>
						<QrcodeOutlined style={{ fontSize: '18px' }} />
					</Button>
				)}
			</Col>
			<Col flex={'none'}>
				{showReloadButton && (
					<Button
						disabled={disabled}
						type='default'
						onClick={onReloadClick}
					>
						Recargar
					</Button>
				)}
			</Col>
		</Row>
	)
}

CustomSearch.displayName = 'CustomSearch'
export default CustomSearch
