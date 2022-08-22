import { message } from 'antd'
import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosErrorHandler } from '../handlers/axiosErrorHandler'
import { UserService } from '../services/UserService'

const UserContext = createContext()

const UserProvider = ({ children }) => {
	const navigate = useNavigate()
	const localUser = window.localStorage.getItem('user')
	const userJSON = JSON.parse(localUser)
	const [user, setUser] = useState(userJSON)
	const [loading, setLoading] = useState(false)

	const isLogged = Boolean(user)

	const login = (email, password) => {
		setLoading(true)
		UserService.login(email, password)
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
		login,
		logout,
	}

	return <UserContext.Provider value={data}>{children}</UserContext.Provider>
}

export { UserProvider }
export default UserContext
