import { axiosDelete, axiosGet, axiosPost, axiosPut } from './axiosRequests'

/*export default function UserService(){}

UserService.login=async(email:string,password:string):Promise<User>=>{
  const response=await axios.post(END_POINT + "login", {email,password})
  const user=response.data 
  return user
}*/

export const UserService = {
	login: (email, password) => axiosPost('login', { email, password }),
	getUsers: () => axiosGet('usuarios'),
	getById: (id) => axiosGet(`usuarios/${id}`),
	createUser: (data) => axiosPost('usuarios', data),
	updateUser: (data, id) => axiosPut(`usuarios/${id}`, data),
	deleteUser: (id) => axiosDelete(`usuarios/${id}`),
	changePassword: (password, userId) =>
		axiosPut(`usuarios/password-change/${userId}`, { password }),
}
