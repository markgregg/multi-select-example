import * as React from 'react'
import Draggable from 'react-draggable';
import './FloatingMenu.css'


export type Perspective = 'Client' | 'Bond'
export type ClientDetail = 'Holdings' | 'Interests' | 'Recommendations'

interface FloatingMenuProps {
  currentPerspective: Perspective
  onSelectOption: (perspective: Perspective) => void
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ currentPerspective, onSelectOption }) => {
  const [dragging, setDragging] = React.useState<boolean>(false)

  return (
    <Draggable
      onStart={() => { setTimeout(() => setDragging(true), 250) }}
      onStop={() => { setTimeout(() => setDragging(false), 250) }}
      defaultPosition={{ x: 1400, y: -50 }}
    >
      <div
        className="floatingMenu"
      >
        {
          currentPerspective === 'Client'
            ? <div onClick={() => !dragging && onSelectOption('Bond')}>Axe</div>
            : <div onClick={() => !dragging && onSelectOption('Client')}>Client</div>
        }
      </div>
    </Draggable>
  )
}

export default FloatingMenu
