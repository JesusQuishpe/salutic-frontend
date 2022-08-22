export const getOdontogramImageFile = (node, setOdontogramImage) => {
	//console.log(url)
	const url = new URL(
		`/src/workers/takePictureOdontogram.js`,
		import.meta.url
	).href
	console.log(url)
	const worker = new Worker('/src/workers/takePictureOdontogram.js', {
		type: 'module',
	})
	console.log('WORL')
	worker.onmessage = function (e) {
		console.log(e.data)
		const { odontogramImage } = e.data
		setOdontogramImage(odontogramImage)
		worker.terminate()
	}
	worker.postMessage('HOLA')
}
