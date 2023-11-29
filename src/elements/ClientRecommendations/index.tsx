import * as React from 'react'
import { useAppSelector } from '../../hooks/redux'
import { styleDivFromTheme } from '../../themes'
import { ClientRecommendation, getClientRecommendations } from './clientRecommendationsList'
import Recommendation from '../Recommendation'
import './ClientRecommendations.css'


interface ClientRecommendationsProps {
  clientBond: string
  isBond?: boolean
  onItemSelected: (item: string | null, justActivity: boolean) => void
}

const ClientRecommendations: React.FC<ClientRecommendationsProps> = ({ clientBond, onItemSelected, isBond }) => {
  const [selected, setSelected] = React.useState<string | null>(null)
  const theme = useAppSelector((state) => state.theme.theme)
  const [recommendations, setRecommendations] = React.useState<ClientRecommendation[]>([])

  const selectItem = (isin: string | null, singleClick: boolean) => {
    setSelected(isin)
    onItemSelected(isin, !singleClick)
  }

  React.useEffect(() => {
    setRecommendations(getClientRecommendations(isBond))
  }, [clientBond, isBond])

  return (
    <div
      className='clientRecommendationsMain'
      style={styleDivFromTheme(theme)}
    >
      <div className='clientRecommendationsList'>
        {
          recommendations.map(rec =>
            <Recommendation
              type={!isBond ? 'Client' : 'Bond'}
              recommendation={rec} key={rec.isin}
              onSelected={selectItem}
              selected={selected}
            />
          )
        }
      </div>

    </div>
  )
}

export default ClientRecommendations