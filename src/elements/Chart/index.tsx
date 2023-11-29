import * as React from 'react'
import Highcharts, { Options } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useAppSelector } from '../../hooks/redux'
import { styleDivFromTheme, styleFromTheme } from '../../themes'
import MultiSelect, { DataSource, Matcher, SourceItem, defaultComparison, numberComparisons, stringComparisons } from 'multi-source-select'
import { extractDate } from '../../utils'
import Bond from '../../types/Bond'
import { fetchBondsAndCache } from '../../services/bondsService'
import './Chart.css'
import Select from '../Select'


interface ChartProps {
  type: 'BuySell' | 'Volume' | 'HitRatio',
  client: string
}

const Chart: React.FC<ChartProps> = ({ type, client }) => {
  const theme = useAppSelector((state) => state.theme.theme)
  const [chartOptions, setChartOptions] = React.useState<Options>({
    chart: {
      type: 'column',
      height: 260,
    },
    title: {
      text: 'Buy/Sell Ratio 2023',
      align: 'left',
      style: { fontSize: 'large' }
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      crosshair: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [
      {
        type: 'column',
        name: 'Buy',
        data: [23, 12, 11, 47, 52, 21, 18, 2, 9, 28],
        color: 'blue'
      },
      {
        type: 'column',
        name: 'Sell',
        data: [8, 8, 9, 23, 32, 12, 2, 5, 1, 15],
        color: 'red'
      }
    ]
  })
  const [bonds, setBonds] = React.useState<Bond[]>([])
  const [matchers, setMatchers] = React.useState<Matcher[]>()
  const [breakdown, setBreakdown] = React.useState<string>('Date')

  React.useEffect(() => {
    fetchBondsAndCache()
      .then(setBonds)
      .catch(error => {
        if (typeof error === 'string') {
          console.log(error)
        } else if (error instanceof Error) {
          console.log(error.message)
          console.log(error.stack)
        } else {
          console.log(error.toString())
        }
      })
  }, [])

  const findItems = React.useCallback((text: string, field: 'isin' | 'currency' | 'issuer'): SourceItem[] => {
    const uniqueItems = new Set<string>()
    bonds.forEach(bond => {
      const value = bond[field]
      if (value &&
        value.toUpperCase().includes(text.toUpperCase())) {
        uniqueItems.add(value)
      }
    })
    let items = [...uniqueItems].sort()
    if (items.length > 10) {
      items = items?.slice(10)
    }
    return items
  }, [])

  const dataSource = React.useMemo<DataSource[]>(() => [
    {
      name: 'ISIN',
      title: 'ISIN Code',
      comparisons: defaultComparison,
      precedence: 3,
      ignoreCase: true,
      searchStartLength: 1,
      selectionLimit: 2,
      source: async (text) => new Promise((resolve) => {
        setTimeout(
          () =>
            resolve(findItems(text, 'isin')
            ),
          5,
        )
      })
    },
    {
      name: 'Currency',
      title: 'Currency Code',
      comparisons: defaultComparison,
      precedence: 2,
      ignoreCase: true,
      selectionLimit: 2,
      source: async (text) => new Promise((resolve) => {
        setTimeout(
          () =>
            resolve(findItems(text, 'currency')
            ),
          5,
        )
      })
    },
    {
      name: 'Coupon',
      title: 'Coupon',
      comparisons: numberComparisons,
      precedence: 1,
      selectionLimit: 2,
      match: (text: string) => !isNaN(Number(text)),
      value: (text: string) => Number.parseFloat(text),
    },
    {
      name: 'MaturityDate',
      title: 'Maturity Date',
      comparisons: numberComparisons,
      precedence: 4,
      selectionLimit: 2,
      match: /^[0-9]{0,2}[yYmM]$/,
      value: (text: string) => extractDate(text),
    },
    {
      name: 'ActivityDate',
      title: 'Activity Date',
      comparisons: numberComparisons,
      precedence: 4,
      selectionLimit: 2,
      match: /^[-][0-9]{0,2}[yYmM]$/,
      value: (text: string) => extractDate(text),
    },
    {
      name: 'Industry',
      title: 'Industry',
      comparisons: stringComparisons,
      precedence: 4,
      ignoreCase: true,
      searchStartLength: 2,
      source: [
        'Energy',
        'Materials',
        'Industrials',
        'Consumer',
        'Health',
        'Financials',
        'Technology',
        'Communications',
        'Utilities'
      ]
    },
  ],
    [findItems]
  )

  React.useEffect(() => {
    const buys: number[] = []
    const sells: number[] = []
    for (let i = 0; i < 8; i++) {
      buys.push(type === 'Volume'
        ? Math.floor(Math.random() * 145) * 100000
        : type === 'BuySell'
          ? Math.floor(Math.random() * 55)
          : Math.floor(Math.random() * 35) + 20)
      sells.push(type === 'Volume'
        ? Math.floor(Math.random() * 145) * 100000
        : type === 'BuySell'
          ? Math.floor(Math.random() * 55)
          : Math.floor(Math.random() * 20))
    }

    setChartOptions({
      chart: {
        type: 'column',
        height: 260
      },
      title: {
        text: `${type} by ${breakdown}`,
        align: 'left',
        style: { fontSize: 'large' }
      },
      xAxis: {
        categories: breakdown === 'Date'
          ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
          : [
            'Energy',
            'Materials',
            'Industrials',
            'Consumer',
            'Health',
            'Financials',
            'Technology',
            'Communications',
            'Utilities'
          ],
        crosshair: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          type: 'column',
          name: type === 'BuySell' ? 'Buy' : type === 'Volume' ? 'Brought' : 'Quoted',
          data: buys,
          color: type === 'HitRatio' ? 'red' : 'blue'
        },
        {
          type: 'column',
          name: type === 'BuySell' ? 'Sell' : type === 'Volume' ? 'Sold' : 'Traded',
          data: sells,
          color: type === 'HitRatio' ? 'blue' : 'red'
        }
      ]
    })
  }, [type, matchers, client, breakdown])

  const updateMatchers = (m: Matcher[]) => {
    setMatchers(m)
  }

  return (
    <div
      className='chartMain'
      style={styleDivFromTheme(theme)}
    >
      <div className='chartOptions'>
        <div style={{ paddingLeft: 5, paddingRight: 5 }}>Breakdown</div>
        <Select options={['Date', 'Industry', 'Maturity', 'Region']} selection={breakdown} onSelectOption={setBreakdown} />
        <div style={{ paddingLeft: 10, paddingRight: 5 }}>filter</div>
        <div style={{ flexGrow: 1 }}>
          <MultiSelect
            dataSources={dataSource}
            styles={styleFromTheme(theme)}
            showCategories={false}
            hideToolTip={true}
            matchers={matchers}
            onMatchersChanged={updateMatchers}
          />
        </div>
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  )
}

export default Chart