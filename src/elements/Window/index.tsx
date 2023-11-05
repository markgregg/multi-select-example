import * as React from 'react'
import { Rnd } from 'react-rnd';
import { AiOutlineClose } from 'react-icons/ai';
import './Window.css'
import Button from '../Button';

interface Size {
  height: number
  width: number
}

interface Position {
  x: number
  y: number
}

type WindowProps = {
  children?: React.ReactNode
  title: string
  visible: boolean
  onHide: () => void
  height: number
  width: number
  x: number
  y: number
};

const Window: React.FC<WindowProps> = ({
  children, title, visible, onHide, height, width, x, y
}) => {

  return (
    <Rnd
      disableDragging={true}
      enableResizing={false}
      size={{ width, height }}
      position={{ x, y }}
    >
      {
        visible && <div className='windowMain'>
          <div className='windowToolBar'>
            <Button
              Icon={AiOutlineClose}
              onClick={onHide}
            />
            {title}
          </div>
          {children}
        </div>
      }
    </Rnd>
  )
}

export default Window