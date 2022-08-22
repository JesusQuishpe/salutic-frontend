import { useContext, useEffect, useState } from "react"
import QrModalContext from "../contexts/QrModalContext"
import { CitationService } from "../services/CitationService"


export const useFetchCitations=()=>{
  const [citations, setCitations] = useState(null)
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const { visible } = useContext(QrModalContext)


  const loadCitations = ()=> {
		setLoading(true)
		CitationService.getAllCitations()
			.then((data) => {
				setCitations(data)
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false)
			})
	}

	useEffect(() => {
		loadCitations()
	}, [])

	const onSearch = (identification) => {
		if (!identification) return
		setLoading(true)
		CitationService.getByIdentification(identification)
			.then((data) => {
				console.log(data)
				setCitations(data)
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false)
			})
	}

	const onReload = () => {
		setPage(1)
		loadCitations()
	}

  const updatePage=(page)=>{
    setPage(page)
  }

  return {
    page,
    loading,
    visible,
    citations,
    onSearch,
    onReload,
    updatePage
  }
}