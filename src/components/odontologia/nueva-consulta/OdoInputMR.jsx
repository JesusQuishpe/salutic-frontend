import React, { useEffect, useState } from 'react'
import { Input } from 'antd'
import { setMovilitiesRecessions } from '../../../store/slices/odontology/odontologySlice'
import { connect } from 'react-redux'

const OdoInputMR = ({ id, pos, type, valueOfDetail, update }) => {
	const [value, setValue] = useState('')

	const handleOnInput = (e) => {
		const newParams = {
			id,
			pos,
			type,
			value: e.target.value,
		}
		update(newParams)
		setValue(e.target.value)
	}

	useEffect(() => {
		setValue(valueOfDetail)
	}, [valueOfDetail])

	return (
		<Input
			type='text'
			maxLength={1}
			style={{ height: '30px', textAlign: 'center' }}
			value={value}
			onInput={handleOnInput}
		/>
	)
}

const mapDispatchToProps = (dispatch) => {
	return {
		update: (value) => dispatch(setMovilitiesRecessions(value)),
	}
}

export default connect(null, mapDispatchToProps)(OdoInputMR)
