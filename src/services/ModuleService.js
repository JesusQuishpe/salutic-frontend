import axios from 'axios'
import { responseBody } from './responseBody'

export const ModuleService = {
	getModules: () => axios.get('modulos').then(responseBody),
	getSingleModule: (id) => axios.get(`modulos/${id}`).then(responseBody),
	createModule: (module) => axios.post('modules', module).then(responseBody),
	updateModule: (id, module) =>
		axios.put(`modules/${id}`, module).then(responseBody),
}
