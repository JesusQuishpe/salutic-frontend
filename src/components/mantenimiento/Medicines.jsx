import { Button, Modal, Row, Space, Table } from 'antd'
import React from 'react'
import { useFetchMedicines } from '../../hooks/useFetchMedicines'
import CustomSearch from '../qr/CustomSearch'

import { MedicineModal } from './MedicineModal'

export const Medicines = () => {
	const {
		columns,
		rowSelection,
		medicines,
		modalParams,
		loading,
		searchRef,
		show,
		openModalConfirmation,
		closeModalConfirmation,
		handleAddClick,
		handleEditClick,
		handleDeleteClick,
		closeModal,
		updatePage,
		handleSearch,
		handleReload,
		loadMedicines,
		updateRowSelected,
	} = useFetchMedicines()

	return (
		<>
			<h2 className='mb-3'>Medicamentos</h2>
			<CustomSearch
				ref={searchRef}
				placeholder='Ingrese el nombre del medicamento'
				onSearch={handleSearch}
				onReload={handleReload}
				showQrButton={false}
				allowClear={true}
			/>
			<Row justify='end' style={{ marginBottom: '10px' }}>
				<Space>
					<Button type='primary' onClick={handleAddClick}>
						Agregar
					</Button>
					<Button onClick={handleEditClick}>Editar</Button>
					<Button danger onClick={openModalConfirmation}>
						Eliminar
					</Button>
				</Space>
			</Row>
			<Table
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
			<MedicineModal
				modalParams={modalParams}
				loadMedicines={loadMedicines}
				updateRowSelected={updateRowSelected}
				closeModal={closeModal}
			/>
			<Modal
				visible={show}
				onOk={handleDeleteClick}
				onCancel={closeModalConfirmation}
				title='Confirmación'
			>
				¿Está seguro de eliminar?
			</Modal>
		</>
	)
}
