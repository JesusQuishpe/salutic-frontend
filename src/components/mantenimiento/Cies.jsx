import { Button, Modal, Row, Space, Table } from 'antd'
import React from 'react'
import { useFetchCies } from '../../hooks/useFetchCies'
import CustomSearch from '../qr/CustomSearch'
import { CieModal } from './CieModal'

export const Cies = () => {
	const {
		columns,
		loading,
		rowSelection,
		cies,
		show,
		modalParams,
		loadCies,
		handleSearch,
		handleReload,
		handleAddClick,
		handleEditClick,
		handleDeleteClick,
		openModalConfirmation,
		closeModalConfirmation,
		closeModal,
		updatePage,
		updateRowSelected,
	} = useFetchCies()

	return (
		<>
			<h2 className='mb-3'>CIE 10</h2>
			<CustomSearch
				placeholder='Ingrese el nombre de la enfermedad'
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
				dataSource={cies?.result}
				rowKey={(record) => record.id}
				loading={loading}
				rowSelection={{
					type: 'radio',
					...rowSelection,
				}}
				pagination={{
					total: cies?.pagination?.total,
					current: cies?.pagination?.currentPage,
					pageSize: cies?.pagination?.perPage,
					showSizeChanger: false,
					onChange: updatePage,
				}}
			/>
			<CieModal
				cieModalParams={modalParams}
				loadCies={loadCies}
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
