import React from 'react'
import '../../css/Calculator.css'
import { Button, Card } from 'antd'
const calculatorBtns = [
	['1', '2', '3', '(', ')'],
	['4', '5', '6', '+', '-'],
	['7', '8', '9', '*', '/'],
	['0', '.', 'Limpiar'],
]

const flatSingle = (arr) => [].concat(...arr)

export const Calculator = ({ onChangeFormula }) => {
	return (
		<Card title='Calculadora'>
			<div className='calculator-wrapper'>
				{flatSingle(calculatorBtns).map((btnText, index) => {
					const isSign = [
						'*',
						'/',
						'+',
						'-',
						'(',
						')',
						'Limpiar',
					].some((signo) => signo === btnText)
					const isCleanButton = btnText === 'Limpiar'

					return (
						<Button
							key={index}
							className={`calculator-button ${
								isCleanButton ? 'clean-button' : ''
							}`}
							type={isSign ? 'primary' : 'default'}
							onClick={() => onChangeFormula(btnText)}
						>
							{btnText}
						</Button>
					)
				})}
			</div>
		</Card>
	)
}
