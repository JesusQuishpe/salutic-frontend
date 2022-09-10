import { message } from 'antd'
import { createContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { axiosErrorHandler } from '../handlers/axiosErrorHandler'
import { UserService } from '../services/UserService'

const UserContext = createContext()

const UserProvider = ({ children }) => {
	const navigate = useNavigate()
	const location = useLocation()
	const localUser = window.localStorage.getItem('user')
	const userJSON = JSON.parse(localUser)
	const [user, setUser] = useState(userJSON)
	const [loading, setLoading] = useState(false)
	const [hasPermission, setHasPermission] = useState(null)

	const isLogged = Boolean(user)
	const permissions = user?.permissions || []
	console.log(user)

	const pathsWithAccess = permissions.map((per) => per.module.path)

	const login = (username, password) => {
		setLoading(true)
		UserService.login(username, password)
			.then((user) => {
				console.log(user)
				//const newUser = camelizeKeys(user)
				window.localStorage.setItem('user', JSON.stringify(user))
				setUser(user)
				navigate('/')
			})
			.catch((err) => {
				console.log(err)
				const { message: errorMessage } = axiosErrorHandler(err)
				message.error(errorMessage)
			})
			.finally(() => setLoading(false))
	}

	const logout = () => {
		window.localStorage.removeItem('user')
		setUser(null)
		navigate('/login', { replace: true })
	}

	const data = {
		user,
		loading,
		isLogged,
		hasPermission,
		login,
		logout,
	}

	useEffect(() => {
		console.log(location)
		if (location.pathname === '/') {
			setHasPermission(true)
		} else {
			const value = pathsWithAccess.some((path) =>
				location.pathname.includes(path)
			)
			console.log('Tiene permiso: ', value)
			setHasPermission(value)
		}
	}, [location, user])

	return <UserContext.Provider value={data}>{children}</UserContext.Provider>
}

export { UserProvider }
export default UserContext
