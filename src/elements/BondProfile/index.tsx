import * as React from 'react'
import { useAppSelector } from '../../hooks/redux'
import { styleDivFromTheme } from '../../themes'
import Tabs from '../Tabs'
import Bond from '../../types/Bond'
import BondChart from '../BondChart'
import './BondProfile.css'

interface BondProfileProps {
  bond: Bond
}
type ChartType = 'BuySell' | 'Volume'

const BondProfile: React.FC<BondProfileProps> = ({ bond }) => {
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
      </div>
      <div className='bondProfileProps'>
        <div><b>Brought YTD:</b> <span className='bondProfileBuy'>20,000,000</span></div>
        <div><b>Sold YTD:</b> <span className='bondProfileSell'>10,00,000</span></div>
      </div>
      <div className='bondProfileProps'>
        <div><b>Last Bid:</b> <span className='bondProfileBuy'>19-10-2023</span></div>
        <div><b>Last Buy:</b> <span className='bondProfileBuy'>17-10-2023</span></div>
        <div><b>Last Offer:</b> <span className='bondProfileSell'>16-09-2023</span></div>
        <div><b>Last Sell:</b> <span className='bondProfileSell'>11-09-2023</span></div>
      </div>
      <div className='bondProfileCharts'>
        <Tabs tabs={focusChart} activeTab={activeChart} onSelect={setActiveChart} />
        <BondChart type={activeChart} bond={bond} />
      </div>
    </div>

  )
}

export default BondProfile