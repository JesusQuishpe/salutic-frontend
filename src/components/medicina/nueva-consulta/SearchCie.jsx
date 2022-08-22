import { Button, Col, Input, Modal, Pagination, Row, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useFetchCies } from '../../../hooks/useFetchCies'
import { CieService } from '../../../services/CieService'
import { addKeyForAntDTables } from '../../../utils/functions'

export const SearchCie = ({ visible, setParentCie, closeModal }) => {
	/*const [cies, setCies] = useState([])
	const [page, setPage] = useState(1)
	
	const [loading, setLoading] = useState(false)

	const loadCies = async (page) => {
		const data = await CieService.getCies(page)
		console.log(data)
		setCies(data)
	}*/

	const [cieSelected, setCieSelected] = useState(null)
	const {
		cies,
		loading,
		handleSearch,
		handleReload,
		searchValue,
		updateSearchValue,
		updatePage,
	} = useFetchCies()

	const columns = [
		{
			title: 'Código',
			dataIndex: 'code',
			width: 150,
			ellipsis: true,
		},
		{
			title: 'Nombre',
			dataIndex: 'disease',
			ellipsis: true,
		},
	]

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			console.log(
				`selectedRowKeys: ${selectedRowKeys}`,
				'selectedRows: ',
				selectedRows
			)
			const cie = selectedRows[0]
			setCieSelected(cie)
		},
	}

	/*useEffect(() => {
		loadCies(page)
	}, [])

	const onSearch = async (value) => {
		try {
			setLoading(true)
			setCieSelected(null)
			const data = await CieService.searchCieByDiseasePagination(value, 1)
			console.log(data)
			setCies(data)
		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
	}*/

	const onOk = () => {
		console.log(cieSelected)
		setParentCie(cieSelected)
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
			<Row gutter={10}>
				<Col flex={5}>
					<Input.Search
						onSearch={() => handleSearch()}
						placeholder='Buscar por nombre'
						style={{ marginBottom: '10px' }}
						value={searchValue}
						onChange={(e) => updateSearchValue(e.target.value)}
					/>
				</Col>
				<Col flex={'none'}>
					<Button onClick={handleReload}>Recargar</Button>
				</Col>
			</Row>
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
					pageSize: 10,
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
