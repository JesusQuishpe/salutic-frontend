import { Form } from 'antd'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux/es/hooks/useDispatch'

export default function useLifeStyleForm(data, action) {
	const [form] = Form.useForm()
	const dispatch = useDispatch()
	const onValuesChange = (_, values) => {
		dispatch(action(values))
	}

	useEffect(() => {
		form.setFieldsValue({
			...data,
		})
	}, [data])

	return {
		form,
		onValuesChange,
	}
}
