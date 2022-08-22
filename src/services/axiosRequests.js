import axios from 'axios'
import { snakelizeKeys } from '../utils/functions'
import { responseBody } from './responseBody'

async function axiosGet(url) {
	const response = await axios.get(url)
	return responseBody(response)
}

async function axiosPost(url, data) {
	let dataSnaked = null
	if (data instanceof FormData) {
		const newData = JSON.parse(data.get('data'))
		data.set('data', JSON.stringify(snakelizeKeys(newData)))
		dataSnaked = data
	} else {
		dataSnaked = snakelizeKeys(data)
	}
	const response = await axios.post(url, dataSnaked)
	return responseBody(response)
}

async function axiosPut(url, data) {
	const dataSnaked = snakelizeKeys(data)
	const response = await axios.put(url, dataSnaked)
	return responseBody(response)
}
async function axiosDelete(url) {
	const response = await axios.delete(url)
	return responseBody(response)
}
export { axiosGet, axiosPost, axiosPut, axiosDelete }
