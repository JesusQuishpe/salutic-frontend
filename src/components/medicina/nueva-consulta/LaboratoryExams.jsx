import { Col, message, Row, Spin, Table } from 'antd'
import React, { useEffect, useState } from 'react'

import '../../../css/LaboratoryResults.css'
import { axiosErrorHandler } from '../../../handlers/axiosErrorHandler'
import { LaboratoryService } from '../../../services/LaboratoryService'
import { parseDate } from '../../../utils/functions'

export const LaboratoryExams = ({ patientId }) => {
	const [results, setResults] = useState([])
	const [loading, setLoading] = useState(false)
	const [loadingTable, setLoadingTable] = useState(false)
	const resultDataSource = results.map((res) => ({
		key: res.orderId,
		...res,
	}))
	const [areas, setAreas] = useState([])

	const columns = [
		{
			title: 'Fecha',
			dataIndex: 'date',
			render: (_, record) => parseDate(record.date, 'DD/MM/YYYY'),
		},
		{
			title: 'Estudios',
			dataIndex: 'items',
		},
	]

	const rowSelection = {
		onChange: (_, selectedRows) => {
			const record = selectedRows[0]
			loadResultsJSON(record.resultId)
			console.log(selectedRows[0])
		},
	}

	const loadExams = async () => {
		try {
			setLoadingTable(true)
			const data = await LaboratoryService.getResults(patientId)
			console.log(data)
			setResults(data)
		} catch (error) {
			const { message: errorMessage } = axiosErrorHandler(error)
			console.log(error)
			message.error(errorMessage)
		} finally {
			setLoadingTable(false)
		}
	}

	const loadResultsJSON = async (resultId) => {
		try {
			setLoading(true)
			const data = await LaboratoryService.getResultJSONById(resultId)
			console.log(data)
			setAreas(data)
		} catch (error) {
			const { message: errorMessage } = axiosErrorHandler(error)
			console.log(error)
			message.error(errorMessage)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadExams(patientId)
	}, [])

	return (
		<>
			<Row gutter={20}>
				<Col span={10}>
					<Table
						title={() => 'Examenes de laboratorios '}
						columns={columns}
						dataSource={resultDataSource}
						rowSelection={{
							type: 'radio',
							...rowSelection,
						}}
						loading={loadingTable}
					/>
				</Col>
				<Col span={14}>
					<div className='results-header'>
						<span></span>
						<span className='header-col'>Resultados</span>
						<span className='header-col'>Valores Normales</span>
					</div>
					<Spin spinning={loading} style={{ minHeight: 283 }}>
						{areas.map((area) => {
							return (
								<div className='area-wrapper' key={area.id}>
									<span className='area-title'>
										{area.name}
									</span>
									{area.groups.map((group) => {
										return (
											<div
												className='group-wrapper'
												key={group.id}
											>
												<span className='group-title'>
													{group.name}
												</span>
												<div className='tests-wrapper'>
													{group.tests.map((test) => {
														return (
															<div
																key={test.id}
																className='test-row'
															>
																<span className='test-col test-title'>
																	{test.name}
																</span>
																<span className='test-col'>
																	{test.isNumeric
																		? test.numericResult
																		: test.stringResult}
																</span>
																<div className='test-col'>
																	{!test.refValue ? (
																		'indefinido'
																	) : test.refValue ===
																			'M' ||
																	  test.refValue ===
																			'C' ? (
																		test.interpretation
																	) : (
																		<div className='interpretation'>
																			<span>
																				Hombres:{' '}
																				{
																					test.maleInterpretation
																				}
																			</span>
																			<span>
																				Mujeres:{' '}
																				{
																					test.femaleInterpretation
																				}
																			</span>
																		</div>
																	)}
																</div>
															</div>
														)
													})}
												</div>
											</div>
										)
									})}
								</div>
							)
						})}
					</Spin>
				</Col>
			</Row>
		</>
	)
}
