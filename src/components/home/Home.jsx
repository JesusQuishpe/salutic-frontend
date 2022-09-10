import {
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	DesktopOutlined,
	MedicineBoxOutlined,
	ExperimentOutlined,
	ToolOutlined,
	LogoutOutlined,
	DownOutlined,
} from '@ant-design/icons'
import { Dropdown, Layout, Menu, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { ModuleService } from '../../services/ModuleService'
import useUser from '../../hooks/useUser'
import { CustomSpin } from '../antd/CustomSpin'
import { VerifyPermissions } from './VerifyPermissions'
import OdontologyIcon from '../icons/OdontologyIcon'
import StethoscopeIcon from '../icons/StethoscopeIcon'
import PrefecturaLogo from '../../assets/png/prefectura-logo.png'

const { Header, Sider, Content } = Layout

function getItem(label, key, icon, children, disabled = false) {
	return {
		key,
		icon,
		children,
		label,
		disabled,
	}
}

export const Home = () => {
	const { user, logout } = useUser()
	const [modules, setModules] = useState([])
	const [collapsed, setCollapsed] = useState(false)

	const getIcon = (name) => {
		if (name === 'Caja') return <DesktopOutlined />
		if (name === 'Enfermeria') return <StethoscopeIcon />
		if (name === 'Medicina') return <MedicineBoxOutlined />
		if (name === 'Laboratorio') return <ExperimentOutlined />
		if (name === 'Mantenimiento') return <ToolOutlined />
		if (name === 'Odontologia') return <OdontologyIcon />
		if (name === 'Cerrar') return <LogoutOutlined />
	}

	const buildItems = (modules, permissions = []) => {
		console.log(modules)
		if (!modules) return []
		const items = modules.map((module) => {
			const children = module.submodules
				? module.submodules.map((sub) => {
						const hasPermission = permissions.some(
							(per) => per.module.path === sub.path
						)
						//console.log(sub.name + ':', hasPermission)
						return getItem(
							<NavLink to={sub.path}>{sub.name}</NavLink>,
							`sub-${sub.id}`,
							undefined,
							undefined,
							!hasPermission
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

	const handleLogoutClick = (e) => {
		e.preventDefault()
		logout()
	}

	const menu = (
		<Menu
			items={[
				{
					key: '1',
					label: <a onClick={handleLogoutClick}>Cerrar sesión</a>,
				},
			]}
		/>
	)

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
				<div className='logo'>
					<img src={PrefecturaLogo} />
				</div>
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
					<Dropdown overlay={menu} className='user-name'>
						<a onClick={(e) => e.preventDefault()}>
							<Space>
								Bienvenid@ {user.name}
								<DownOutlined />
							</Space>
						</a>
					</Dropdown>
				</Header>
				<Content
					className='site-layout-content-background'
					style={{
						margin: '24px 16px',
						padding: 24,
						minHeight: 280,
					}}
				>
					<VerifyPermissions>
						<Outlet />
					</VerifyPermissions>
					<CustomSpin />
				</Content>
			</Layout>
		</Layout>
	)
}
