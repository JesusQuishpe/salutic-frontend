import React from 'react'
import useUser from '../../hooks/useUser'
import { WithoutPermission } from './WithoutPermission'

export const VerifyPermissions = ({ children }) => {
	const { hasPermission } = useUser()

	if (hasPermission === null) {
		return ''
	}

	if (hasPermission === false) {
		return <WithoutPermission />
	}

	return children
}
