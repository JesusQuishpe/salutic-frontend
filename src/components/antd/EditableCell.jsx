import { Form, Input } from 'antd'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { EditableContext } from './EditableRow'

export const EditableCell = ({
	title,
	editable,
	children,
	dataIndex,
	record,
	parseCell,
	handleSave,
	...restProps
}) => {
	const [editing, setEditing] = useState(false)
	const inputRef = useRef(null)
	const form = useContext(EditableContext)
	useEffect(() => {
		if (editing) {
			inputRef.current.focus()
		}
	}, [editing])

	const toggleEdit = () => {
		setEditing(!editing)
		form.setFieldsValue({
			[dataIndex]: record[dataIndex],
		})
	}

	const save = async () => {
		try {
			const values = await form.validateFields()
			toggleEdit()
			const data = parseCell
				? { ...record, [dataIndex]: parseCell(values[dataIndex]) }
				: { ...record, ...values }
			handleSave(data, dataIndex)
		} catch (errInfo) {
			console.log('Save failed:', errInfo)
		}
	}

	let childNode = children

	if (editable) {
		childNode = editing ? (
			<Form.Item
				style={{
					margin: 0,
				}}
				name={dataIndex}
				rules={[
					{
						required: true,
						message: `${title} is required.`,
					},
				]}
			>
				<Input ref={inputRef} onPressEnter={save} onBlur={save} />
			</Form.Item>
		) : (
			<div
				className='editable-cell-value-wrap'
				style={{
					paddingRight: 24,
				}}
				onClick={toggleEdit}
			>
				{children}
			</div>
		)
	}

	return <td {...restProps}>{childNode}</td>
}
