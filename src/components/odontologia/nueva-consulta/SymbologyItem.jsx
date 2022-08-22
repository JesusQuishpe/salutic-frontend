import React from 'react'
import { setOptionSelected } from '../../../store/slices/odontology/odontologySlice'
import { connect } from 'react-redux'

function getImage(path) {
	return new URL(`../../../assets/svg/${path}`, import.meta.url).href
}

const SymbologyItem = ({ id, name, path, isSelected, update }) => {
	const handleClick = (e) => {
		e.stopPropagation()
		const newData = {
			data: {
				id,
				name,
				path,
			},
			type: 'symbology',
		}
		update(newData)
	}

	/*const getImage = (path) => {
		import('../../../assets/svg/' + path).then((res) => {
			setImage(res.default)
		})
	}*/

	return (
		<>
			<div
				className={`symbology ${isSelected ? 'selected' : null}`}
				onClick={handleClick}
			>
				<img src={getImage(path)} />
				<span>{name}</span>
			</div>
		</>
	)
}

const mapDispatchToProps = (dispatch) => {
	return {
		update: (value) => dispatch(setOptionSelected(value)),
	}
}

export default connect(null, mapDispatchToProps)(SymbologyItem)
