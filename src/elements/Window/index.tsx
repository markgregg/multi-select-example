import * as React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import Button from '../Button'
import { useAppSelector } from '../../hooks/redux'
import { styleHeaderFromTheme } from '../../themes'
import './Window.css'


type WindowProps = {
  children?: React.ReactNode
  title: string
  visible?: boolean
  onHide?: () => void
}

const Window: React.FC<WindowProps> = ({
  children, title, onHide
}) => {
  const theme = useAppSelector((state) => state.theme.theme)

  return (
    <div className='windowMain'>
      <div
        className='windowToolBar'
        style={styleHeaderFromTheme(theme)}
      >
        {
          onHide && <Button
            Icon={AiOutlineClose}
            onClick={onHide}
          />
        }
        {title}
      </div>
      {children}
    </div>
  )
}

export default Window