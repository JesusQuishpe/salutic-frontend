import { Col, Input, Tree, Typography } from 'antd'
import React, { useState } from 'react'

const { Title } = Typography

const isNodeParent = (node) => node.children

function searchInNode(node, matchingTitle, expandedKeys = []) {
	const titleLower = node.title.toLowerCase()
	const matchingTitleLower = matchingTitle.toLowerCase()

	if (!isNodeParent(node) && titleLower.includes(matchingTitleLower)) {
		return expandedKeys
	} else if (node.children) {
		expandedKeys.push(node.key)
		let i
		let result = null
		for (i = 0; result == null && i < node.children.length; i++) {
			result = searchInNode(node.children[i], matchingTitle, expandedKeys)
		}
		return result
	}
	return null
}

const TestTree = ({
	defaultTreeData,
	treeData,
	showLaboratorioInfo,
	onNodeClick,
	updateSearchValue,
}) => {
	const [expandedKeys, setExpandedKeys] = useState([])
	//const [searchValue, setSearchValue] = useState('')
	const [autoExpandParent, setAutoExpandParent] = useState(true)

	const onChangeSearchTree = (e) => {
		const { value: title } = e.target
		let expands = []
		defaultTreeData.forEach((node) => {
			console.log(node)
			const expandedKeysSearch = searchInNode(node, title)
			if (expandedKeysSearch) {
				expands = [...expands, ...expandedKeysSearch]
			}
		})
		console.log(expands)
		setExpandedKeys(expands)
		updateSearchValue(title)
		setAutoExpandParent(true)
	}

	const onExpand = (newExpandedKeys) => {
		setExpandedKeys(newExpandedKeys)
		setAutoExpandParent(false)
	}

	return (
		<Col span={8}>
			<Title level={4} type='secondary'>
				Pruebas de laboratorio
			</Title>
			<div>
				<Input.Search
					allowClear
					style={{ width: '100%', marginBottom: 8 }}
					placeholder='Buscar prueba'
					onChange={onChangeSearchTree}
					disabled={!showLaboratorioInfo}
				/>

				<Tree
					showIcon
					treeData={treeData}
					onExpand={onExpand}
					expandedKeys={expandedKeys}
					autoExpandParent={autoExpandParent}
					onDoubleClick={onNodeClick}
					style={{
						maxHeight: '500px',
						overflow: 'auto',
					}}
					disabled={!showLaboratorioInfo}
				/>
			</div>
		</Col>
	)
}

export default React.memo(TestTree)
