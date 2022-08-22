import { useState } from "react"

const useCustomSearch=(value)=>{
  const [inputText, setInputText] = useState(value)

  const resetValue=()=>{
    setInputText('')
  }
  
  return {
    inputText,
    resetValue
  }
}
export {useCustomSearch}