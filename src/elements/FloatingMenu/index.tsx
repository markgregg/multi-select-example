import * as React from 'react'
import Draggable from 'react-draggable';
import './FloatingMenu.css'


export type Perspective = 'Client' | 'Bond'
export type ClientDetail = 'Profile' | 'Interests' | 'Recommendations'

interface FloatingMenuProps {
  currentPerspective: Perspective
  onSelectOption: (perspective: Perspective) => void
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ currentPerspective, onSelectOption }) => {
  return (
    <Draggable
      defaultPosition={{ x: 1400, y: -50 }}
    >
      <div
        className="floatingMenu"
      >
        {
          currentPerspective === 'Client'
            ? <div onClick={() => onSelectOption('Bond')}>Bond</div>
            : <div onClick={() => onSelectOption('Client')}>Client</div>
        }
      </div>
    </Draggable>
  )
}

export default FloatingMenu
