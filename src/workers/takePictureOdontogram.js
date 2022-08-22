import DomToImage from 'dom-to-image'
import { dataURLtoFile } from '../utils/functions'

const takePicture = async () => {
	const image = await DomToImage.toPng(document.getElementById('odontogram'))
	return dataURLtoFile(image, 'odontogram.png')
}

onmessage = function (e) {
	console.log(e.data)
	takePicture().then((imgFile) => {
		console.log('GOLA')
		this.postMessage({ odontogramImage: imgFile })
	})
}
