import * as React from 'react'
import Draggable from 'react-draggable';
import { FaInfo } from "react-icons/fa";
import { FaExclamation } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import './ToastInsights.css'


interface ToastInsightsProps {
  onItemSelected: (client?: string, bond?: string) => void
}

const ToastInsights: React.FC<ToastInsightsProps> = ({ onItemSelected }) => {
  const [dragging, setDragging] = React.useState<boolean>(false)

  return (
    <Draggable
      onStart={() => { setTimeout(() => setDragging(true), 250) }}
      onStop={() => { setTimeout(() => setDragging(false), 250) }}
      defaultPosition={{ x: 1210, y: -250 }}
    >
      <div
        className="insightList"
      >
        <div className='toastInsight' onClick={() => !dragging && onItemSelected('BNP Paribas')}>
          <IoIosClose className='toastClose' />
          <FaExclamation className='toastInsightAlert' />
          Missed BNP Paribas trade detected in Trax
        </div>
        <div className='toastInsight' onClick={() => !dragging && onItemSelected(undefined, 'XS1848875172')}>
          <IoIosClose className='toastClose' />
          <FaExclamation className='toastInsightAlert' />
          XS1848875172 has excessive market activity
        </div>
        <div className='toastInsight' onClick={() => !dragging && onItemSelected('ALD')}>
          <IoIosClose className='toastClose' />
          <FaInfo className='toastInsightInfo' />
          No ALD actiity for 35 days
        </div>
        <div className='toastInsight' onClick={() => !dragging && onItemSelected(undefined, 'IT0004026420')}>
          <IoIosClose className='toastClose' />
          <FaInfo className='toastInsightInfo' />
          IT0004026420 most traded yesterday
        </div>
      </div>
    </Draggable>
  )
}

export default ToastInsights
