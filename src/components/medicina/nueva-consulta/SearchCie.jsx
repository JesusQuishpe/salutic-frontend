import { Modal, Table } from 'antd'
import React from 'react'
import { useFetchCies } from '../../../hooks/useFetchCies'
import CustomSearch from '../../qr/CustomSearch'

export const SearchCie = ({ visible, setParentCie, closeModal }) => {
	const {
		cies,
		loading,
		columns,
		rowSelection,
		rowSelected,
		handleSearch,
		handleReload,
		updatePage,
	} = useFetchCies()

	const onOk = () => {
		console.log(rowSelected)
		setParentCie(rowSelected)
		closeModal()
	}

	return (
		<Modal
			title='Seleccionar enfermedad-CIE'
			visible={visible}
			onCancel={closeModal}
			width={700}
			onOk={onOk}
		>
			<CustomSearch
				placeholder='Ingrese el nombre de la enfermedad'
				onSearch={handleSearch}
				onReload={handleReload}
				showQrButton={false}
				allowClear={true}
			/>
			<Table
				rowSelection={{
					type: 'radio',
					...rowSelection,
				}}
				columns={columns}
				dataSource={cies?.result}
				size='small'
				rowKey={(record) => record.id}
				pagination={{
					pageSize: cies?.pagination?.perPage,
					position: ['bottomRight'],
					total: cies?.pagination?.total,
					current: cies?.pagination?.currentPage,
					onChange: updatePage,
				}}
				loading={loading}
			/>
		</Modal>
	)
}
