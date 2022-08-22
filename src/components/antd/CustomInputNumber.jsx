import { InputNumber } from 'antd'
import React from 'react'

export const CustomInputNumber = (props) => {
	return <InputNumber parser={(value) => value.replace('', 0)} {...props} />
}
