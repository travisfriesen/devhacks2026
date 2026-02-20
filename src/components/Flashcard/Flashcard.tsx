import React from 'react'
import { IFlashcardProps } from './Flashcard.types'

const Flashcard: React.FC<IFlashcardProps> = (props) => {
  const { question, answer, flipped, onClick } = props;
  return (
    <div onClick={onClick} style={{ 
      border: '1px solid black', 
      padding: '20px', 
      width: '200px', 
      height: '100px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      cursor: 'pointer'
    }}>
      {flipped ? answer : question}
    </div>
  )
}

export default Flashcard
