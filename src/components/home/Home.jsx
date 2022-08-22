import {
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	ScheduleOutlined,
	DesktopOutlined,
	MedicineBoxOutlined,
	ExperimentOutlined,
	ReconciliationOutlined,
	ToolOutlined,
	LogoutOutlined,
} from '@ant-design/icons'
import { Button, Layout, Menu, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { ModuleService } from '../../services/ModuleService'
import useUser from '../../hooks/useUser'
import { useLoader } from '../../hooks/useLoader'
import { CustomSpin } from '../antd/CustomSpin'

const { Header, Sider, Content } = Layout

function getItem(label, key, icon, children) {
	return {
		key,
		icon,
		children,
		label,
	}
}

export const Home = () => {
	const { user, logout } = useUser()

	const [modules, setModules] = useState([])
	const [collapsed, setCollapsed] = useState(false)

	const getIcon = (name) => {
		if (name === 'Caja') return <DesktopOutlined />
		if (name === 'Enfermeria') return <ReconciliationOutlined />
		if (name === 'Medicina') return <MedicineBoxOutlined />
		if (name === 'Laboratorio') return <ExperimentOutlined />
		if (name === 'Mantenimiento') return <ToolOutlined />
		if (name === 'Odontologia') return <ScheduleOutlined />
		if (name === 'Cerrar') return <LogoutOutlined />
	}

	const buildItems = (modules, permissions = []) => {
		if (!modules) return []
		const items = modules.map((module) => {
			const submodules = permissions.filter(
				(per) => per.module.parentId === module.id
			)
			const children = submodules
				? submodules.map((sub) => {
						return getItem(
							<NavLink to={sub.module.path}>
								{sub.module.name}
							</NavLink>,
							`sub-${sub.module.id}`
						)
				  })
				: []

			return getItem(
				module.name,
				`mod-${module.id}`,
				getIcon(module.name),
				children
			)
		})

		return items
	}

	const loadModules = () => {
		ModuleService.getModules()
			.then((modules) => {
				setModules(modules)
			})
			.catch((err) => console.log(err))
	}

	useEffect(() => {
		loadModules()
	}, [])

	const handleLogoutClick = () => {
		logout()
	}
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider
				breakpoint='md'
				collapsedWidth='60'
				onBreakpoint={(broken) => {
					console.log(broken)
					setCollapsed(broken)
				}}
				onCollapse={(collapsed, type) => {
					console.log(collapsed, type)
				}}
				trigger={null}
				collapsible
				collapsed={collapsed}
			>
				<div className='logo' />
				<Menu
					theme='dark'
					mode='inline'
					defaultSelectedKeys={['1']}
					items={buildItems(modules, user?.permissions)}
				/>
			</Sider>
			<Layout className='site-layout'>
				<Header
					className='site-layout-background'
					style={{
						padding: 0,
					}}
				>
					{React.createElement(
						collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
						{
							className: 'trigger',
							onClick: () => setCollapsed(!collapsed),
						}
					)}
					<Button type='link' onClick={handleLogoutClick}>
						Cerrar sesión
					</Button>
				</Header>
				<Content
					className='site-layout-content-background'
					style={{
						margin: '24px 16px',
						padding: 24,
						minHeight: 280,
					}}
				>
					<Outlet />
					<CustomSpin />
				</Content>
			</Layout>
		</Layout>
	)
}
