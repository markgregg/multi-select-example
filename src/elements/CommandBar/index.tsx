import * as React from 'react'
import { styleCodeFromTheme, styleFromTheme } from "../../themes"
import { DataSource, Matcher, SourceItem, defaultComparison, numberComparisons, stringComparisons } from 'multi-source-select'
import Help from '../Help'
import MultiSelect from 'multi-source-select'
import { useAppDispatch, useAppSelector } from '../../hooks/redxux'
import { extractDate, getSize, isSize } from '../../utils'
import { fetchBondsAndCache } from '../../services/bondsService'
import Bond from '../../types/Bond'
import { setContext } from '../../store/contextSlice'
import './CommandBar.css'


interface CommandBarProps {
  onTrade: (matchers: Matcher[]) => void
}

const CommandBar: React.FC<CommandBarProps> = ({ onTrade }) => {
  const [matchers, setMatchers] = React.useState<Matcher[]>()
  const theme = useAppSelector((state) => state.theme.theme)
  const [bonds, setBonds] = React.useState<Bond[]>([])

  const dispatch = useAppDispatch()

  const findItems = React.useCallback((text: string, field: 'isin' | 'currency' | 'issuer'): SourceItem[] => {
    const uniqueItems = new Set<string>()
    bonds.forEach(bond => {
      const value = bond[field];
      if (value &&
        value.toUpperCase().includes(text.toUpperCase())) {
        uniqueItems.add(value);
      }
    })
    let items = [...uniqueItems].sort();
    if (items.length > 10) {
      items = items?.slice(10)
    }
    return items
  }, [bonds])

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
      name: 'HairCut',
      title: 'Hair Cut',
      comparisons: numberComparisons,
      precedence: 1,
      selectionLimit: 2,
      match: (text: string) => !isNaN(Number(text)),
      value: (text: string) => Number.parseFloat(text),
    },
    {
      name: 'Price',
      title: 'Price',
      comparisons: numberComparisons,
      precedence: 4,
      selectionLimit: 2,
      match: (text: string) => !isNaN(Number(text)),
      value: (text: string) => Number.parseFloat(text),
    },
    {
      name: 'Size',
      title: 'Size',
      comparisons: numberComparisons,
      precedence: 4,
      selectionLimit: 2,
      match: (text: string) => isSize(text),
      value: (text: string) => getSize(text),
    },
    {
      name: 'Side',
      title: 'Side',
      comparisons: stringComparisons,
      precedence: 4,
      ignoreCase: true,
      selectionLimit: 1,
      source: ['BUY', 'SELL']
    },
    {
      name: 'Issuer',
      title: 'Issuer',
      comparisons: stringComparisons,
      precedence: 1,
      ignoreCase: true,
      selectionLimit: 2,
      match: /^[a-zA-Z]{2,}$/,
      value: (text: string) => text,
    },
    {
      name: 'Issuer2',
      title: 'Issuer',
      comparisons: defaultComparison,
      precedence: 1,
      ignoreCase: false,
      searchStartLength: 3,
      selectionLimit: 2,
      source: async (text) => new Promise((resolve) => {
        setTimeout(
          () =>
            resolve(findItems(text, 'issuer')
            ),
          5,
        )
      })
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
      name: 'IssueDate',
      title: 'Issue Date',
      comparisons: numberComparisons,
      precedence: 3,
      selectionLimit: 2,
      match: /^[0-9]{0,2}[yYmM]$/,
      value: (text: string) => extractDate(text),
    },
    {
      name: 'TradeDate',
      title: 'Trade Date',
      comparisons: numberComparisons,
      precedence: 4,
      selectionLimit: 2,
      match: /^[0-9]{0,2}[yYmM]$/,
      value: (text: string) => extractDate(text),
    },
    {
      name: 'Client',
      title: 'Client',
      comparisons: defaultComparison,
      precedence: 4,
      ignoreCase: false,
      searchStartLength: 3,
      selectionLimit: 2,
      source: async (text) => new Promise((resolve) => {
        setTimeout(
          () =>
            resolve(findItems(text, 'issuer')
            ),
          5,
        )
      })
    },
    {
      name: 'Actions',
      title: 'Actions',
      comparisons: numberComparisons,
      ignoreCase: true,
      precedence: 99,
      selectionLimit: 1,
      source: ['TRADE']
    },
  ],
    [findItems]
  )

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

  const trade = () => {
    if (matchers?.find(matcher => matcher.text.toLowerCase() === 'trade')) {
      const tradeMatchers = matchers.filter(matcher => matcher.source.toLowerCase() !== 'actions')
      onTrade(tradeMatchers)
    } else {
      const contextMatchers = matchers?.filter(m => m.source !== 'TradeDate' && m.source !== 'Client') ?? []
      if (contextMatchers.length > 0) {
        dispatch(setContext(contextMatchers))
      }
    }
    setMatchers([])
  }

  return (
    <div>
      <div className='mainMultiselectContainer'>
        <div className='mainMultiselect'>
          <MultiSelect
            matchers={matchers}
            dataSources={dataSource}
            onMatchersChanged={setMatchers}
            styles={styleFromTheme(theme)}
            onComplete={trade}
          />
        </div>
        <Help theme={theme} />
      </div>
      {
        theme !== 'none' &&
        <div className='styleContainer'>
          <div className='mainStyle'>
            <pre className='styleCode'>{styleCodeFromTheme(theme)}</pre>
          </div>
        </div>
      }

    </div>
  )
}

export default CommandBar