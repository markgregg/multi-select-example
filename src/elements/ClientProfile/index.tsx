import * as React from 'react'
import { useAppSelector } from '../../hooks/redux'
import { styleDivFromTheme } from '../../themes'
import './ClientProfile.css'
import Tabs from '../Tabs'
import Chart from '../Chart'

interface ClientProfileProps {
  client: string
  phase: number
}
type ChartType = 'BuySell' | 'Volume' | 'HitRatio'

const ClientProfile: React.FC<ClientProfileProps> = ({ client, phase }) => {
  const [activeChart, setActiveChart] = React.useState<ChartType>('BuySell')
  const theme = useAppSelector((state) => state.theme.theme)

  const focusChart: ChartType[] = [
    'BuySell',
    'Volume',
    'HitRatio'
  ]

  return (
    <div
      className='clientProfileMain'
      style={styleDivFromTheme(theme)}
    >
      <div className='clientProfileProps'>
        <div><b>Client:</b> {client}</div>
        <div><b>Contact:</b> Mrs Joanna Moore</div>
        <div><b>Location:</b> London</div>
      </div>
      <div className='clientProfileProps'>
        <div><b>Brought YTD:</b> <span className='clientProfileBuy'>20,000,000</span></div>
        <div><b>Sold YTD:</b> <span className='clientProfileSell'>10,00,000</span></div>
      </div>
      <div className='clientProfileProps'>
        <div><b>Last Bid:</b> 19-10-2023</div>
        <div><b>Last Buy:</b> 17-10-2023</div>
        <div><b>Last Offer:</b> 16-09-2023</div>
        <div><b>Last Sell:</b> 11-09-2023</div>
      </div>
      {
        phase >= 4 &&
        <div className='clientProfileCharts'>
          <Tabs tabs={focusChart} activeTab={activeChart} onSelect={setActiveChart} />
          <Chart type={activeChart} client={client} />
        </div>
      }
    </div>

  )
}

export default ClientProfile