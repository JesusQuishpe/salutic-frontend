import { Modal, Table } from 'antd'
import React from 'react'
import { useFetchMedicines } from '../../../hooks/useFetchMedicines'
import CustomSearch from '../../qr/CustomSearch'

export const SearchMedicineModal = ({ show, onSubmit, closeModal }) => {
	const {
		searchRef,
		medicines,
		columns,
		loading,
		rowSelection,
		rowSelected,
		updatePage,
		handleSearch,
		handleReload,
	} = useFetchMedicines()

	const handleOk = () => {
		if (!rowSelected) return
		onSubmit({
			medicineName: rowSelected.genericName,
			medicineId: rowSelected.id,
		})
		closeModal()
	}

	return (
		<Modal
			title='Medicamentos'
			visible={show}
			onCancel={closeModal}
			onOk={handleOk}
			width={1000}
		>
			<CustomSearch
				ref={searchRef}
				placeholder='Ingrese el nombre del medicamento'
				onSearch={handleSearch}
				onReload={handleReload}
				showQrButton={false}
				allowClear={true}
			/>
			<Table
				size='small'
				columns={columns}
				dataSource={medicines?.result}
				rowKey={(record) => record.id}
				loading={loading}
				rowSelection={{
					type: 'radio',
					...rowSelection,
				}}
				pagination={{
					total: medicines?.pagination?.total,
					current: medicines?.pagination?.currentPage,
					pageSize: medicines?.pagination?.perPage,
					showSizeChanger: false,
					onChange: updatePage,
				}}
			/>
		</Modal>
	)
}
