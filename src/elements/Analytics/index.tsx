import * as React from 'react'
import { useAppSelector } from '../../hooks/redux'
import { styleDivFromTheme } from '../../themes'
import './Analytics.css'

interface AnalyticsProps {
}

const Analytics: React.FC<AnalyticsProps> = ({ }) => {
  const theme = useAppSelector((state) => state.theme.theme)


  return (
    <div
      className='clientProfileMain'
      style={styleDivFromTheme(theme)}
    >

    </div>

  )
}

export default Analytics