import _, { isEmpty } from 'lodash'
import moment from 'moment'

const camelizeKeys = (obj) => {
	if (Array.isArray(obj)) {
		return obj.map((v) => camelizeKeys(v))
	} else if (obj != null && obj.constructor === Object) {
		return Object.keys(obj).reduce(
			(result, key) => ({
				...result,
				[_.camelCase(key)]: camelizeKeys(obj[key]),
			}),
			{}
		)
	}
	return obj
}
const snakelizeKeys = (obj) => {
	if (Array.isArray(obj)) {
		return obj.map((v) => snakelizeKeys(v))
	} else if (obj != null && obj.constructor === Object) {
		return Object.keys(obj).reduce(
			(result, key) => ({
				...result,
				[_.snakeCase(key)]: snakelizeKeys(obj[key]),
			}),
			{}
		)
	}
	return obj
}

function mapDataForTableAntDesign(data) {
	if (!data) return []
	return data.map((item) => {
		return {
			key: item.id,
			...item,
		}
	})
}

function roundToTwo(num) {
	return +(Math.round(num + 'e+2') + 'e-2')
}

/**
 * Formatea la fecha y devuelve un string
 * @param {object} date moment object
 */
const parseDate = (date, format) => {
	return date ? moment(date).format(format) : null
}

const parseHour = (date) => {
	return date ? moment(date).format('HH:mm:ss') : null
}
const createDateFromString = (str) => {
	if (!str) return ''
	return moment(str, 'YYYY-MM-DD')
}

const mapNullToZero = (object) => {
	const objectCloned = { ...object }
	for (const key in object) {
		if (Object.hasOwnProperty.call(object, key)) {
			const element = object[key]
			if (element === null) {
				objectCloned[key] = 0
			}
		}
	}
	return objectCloned
}
const pickObject = (object, keys) => {
	return _.pick(object, keys)
}

const addKeyForAntDTables = (data) => {
	if (!data) return []
	return data.map((item) => ({ key: item.id, ...item }))
}

const generateUniqueId = (prefix) => {
	return _.uniqueId(prefix)
}

const getOperands = (formula) => {
	if (!formula || formula === '') return ''
	const exp = /[A-Z]\w+/g
	const matches = formula.match(exp)
	const operands = matches.join(',')
	return operands
}

const isObjectEmpty = (object) => {
	return isEmpty(object)
}

const dataURLtoFile = (dataurl, filename) => {
	return new Promise((resolve, reject) => {
		const arr = dataurl.split(',')
		const mime = arr[0].match(/:(.*?);/)[1]
		const bstr = atob(arr[1])
		let n = bstr.length
		const u8arr = new Uint8Array(n)

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n)
		}

		resolve(new File([u8arr], filename, { type: mime }))
	})
}

export {
	camelizeKeys,
	snakelizeKeys,
	mapDataForTableAntDesign,
	roundToTwo,
	parseDate,
	parseHour,
	mapNullToZero,
	pickObject,
	addKeyForAntDTables,
	generateUniqueId,
	getOperands,
	isObjectEmpty,
	dataURLtoFile,
	createDateFromString,
}
