import * as React from 'react'
import { useAppSelector } from '../../hooks/redux'
import { styleDivFromTheme } from '../../themes'
import Tabs from '../Tabs'
import Bond from '../../types/Bond'
import BondChart from '../BondChart'
import './BondProfile.css'

interface BondProfileProps {
  bond: Bond
  phase: number
}
type ChartType = 'BuySell' | 'Volume'

const BondProfile: React.FC<BondProfileProps> = ({ bond, phase }) => {
  const [activeChart, setActiveChart] = React.useState<ChartType>('BuySell')
  const theme = useAppSelector((state) => state.theme.theme)

  const focusChart: ChartType[] = [
    'BuySell',
    'Volume'
  ]

  return (
    <div
      className='bondProfileMain'
      style={styleDivFromTheme(theme)}
    >
      <div className='bondProfileProps'>
        <div><b>ISIN:</b> {bond.isin}</div>
        <div className='bondProfileLimit'><b>issuer:</b> {bond.issuer}</div>
      </div>
      <div className='bondProfileProps'>
        <div><b>Maturity:</b> {bond.issueDate}</div>
        <div><b>Coupon:</b> {bond.coupon}</div>
        <div><b>RV:</b> NNNN</div>
      </div>
      <div className='bondProfileProps'>
        <div><b>Brought YTD:</b> <span className='bondProfileBuy'>20,000,000</span></div>
        <div><b>Sold YTD:</b> <span className='bondProfileSell'>10,00,000</span></div>
      </div>
      <div className='bondProfileProps'>
        <div><b>Last Bid:</b> 19-10-2023</div>
        <div><b>Last Buy:</b> 17-10-2023</div>
        <div><b>Last Offer:</b> 16-09-2023</div>
        <div><b>Last Sell:</b> 11-09-2023</div>
      </div>
      {
        phase >= 4 && <div className='bondProfileCharts'>
          <Tabs tabs={focusChart} activeTab={activeChart} onSelect={setActiveChart} />
          <BondChart type={activeChart} bond={bond} />
        </div>
      }
    </div>

  )
}

export default BondProfile