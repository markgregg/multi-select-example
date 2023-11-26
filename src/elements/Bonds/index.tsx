import * as React from 'react'
import { getAgGridStyle, styleFromTheme } from "../../themes"
import { DataSource, Matcher, SourceItem, defaultComparison, numberComparisons, stringComparisons } from 'multi-source-select'
import MultiSelect from 'multi-source-select'
import { AgGridReact } from "ag-grid-react"
import { fetchBondsAndCache } from '../../services/bondsService'
import Bond from '../../types/Bond'
import { ColDef, IRowNode, RowSelectedEvent } from 'ag-grid-community'
import { createFilter, getColumn } from '../../types/AgFilter'
import { useAppSelector } from '../../hooks/redux'
import { extractDate, getSize, isSize, isUnique } from '../../utils'
import './Bonds.css'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

interface BondsProps {
  onBondSelected: (bond: Bond) => void
}

const Bonds: React.FC<BondsProps> = ({
  onBondSelected
}) => {
  const agGridRef = React.useRef<AgGridReact<Bond> | null>(null)
  const [matchers, setMatchers] = React.useState<Matcher[]>()
  const [rowData, setRowData] = React.useState<Bond[]>()
  const [columnDefs] = React.useState<ColDef<Bond>[]>([
    { field: "isin", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 110 },
    { field: "currency", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "issueDate", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 90 },
    { field: "maturityDate", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 90 },
    { field: "coupon", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "price", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "size", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "side", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "issuer", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 350 },
    { field: "hairCut", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
  ])
  const theme = useAppSelector((state) => state.theme.theme)
  const context = useAppSelector((state) => state.context)

  const findItems = React.useCallback((text: string, field: 'isin' | 'currency' | 'issuer', op: 'and' | 'or' | null): SourceItem[] => {
    const uniqueItems = new Set<string>()
    const callback = (row: IRowNode<Bond>) => {
      if (row.data) {
        const value = row.data[field]
        if (value &&
          value.toUpperCase().includes(text.toUpperCase())) {
          uniqueItems.add(value)
        }
      }
    }
    if (op === 'or') {
      agGridRef.current?.api.forEachLeafNode(callback)
    } else {
      agGridRef.current?.api.forEachNodeAfterFilter(callback)
    }
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
      source: async (text, op) => new Promise((resolve) => {
        setTimeout(
          () =>
            resolve(findItems(text, 'isin', op)
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
      source: async (text, op) => new Promise((resolve) => {
        setTimeout(
          () =>
            resolve(findItems(text, 'currency', op)
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
      searchStartLength: 1,
      precedence: 1,
      selectionLimit: 2,
      match: (text: string) => !isNaN(Number(text)),
      value: (text: string) => Number.parseFloat(text),
    },
    {
      name: 'Size',
      title: 'Size',
      comparisons: numberComparisons,
      precedence: 4,
      searchStartLength: 1,
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
      selectionLimit: 2,
      source: ['BUY', 'SELL']
    },
    {
      name: 'Issuer',
      title: 'Issuer',
      comparisons: stringComparisons,
      precedence: 1,
      ignoreCase: true,
      selectionLimit: 2,
      match: /^[a-zA-Z ]{2,}$/,
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
      source: async (text, op) => new Promise((resolve) => {
        setTimeout(
          () =>
            resolve(findItems(text, 'issuer', op)
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
      name: 'Axes',
      title: 'Axes',
      comparisons: numberComparisons,
      precedence: 6,
      selectionLimit: 1,
      source: ['Axed', 'Run', 'Axe & Run', 'Not Axed']
    },
  ],
    [findItems]
  )

  const matchersChanged = React.useCallback((newMatchers: Matcher[]) => {
    const sources = newMatchers.filter(m => !m.changing).map(m => m.source).filter(isUnique)
    sources.forEach(source => {
      const column = getColumn(source)
      const values = newMatchers.filter(m => m.source === source && !m.changing)
      const filter = createFilter(values)
      const instance = agGridRef.current?.api?.getFilterInstance(column)
      if (instance) {
        instance?.setModel(filter)
      }
    })
    columnDefs.map(source => source.field).filter(field => field && !sources.find(src => getColumn(src) === field))
      .forEach(field => {
        if (field) {
          const instance = agGridRef.current?.api?.getFilterInstance(field)
          if (instance) {
            instance?.setModel(null)
          }
        }
      })
    agGridRef.current?.api?.onFilterChanged()
    setMatchers(newMatchers)
  }, [columnDefs])


  React.useEffect(() => {
    fetchBondsAndCache()
      .then(setRowData)
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

  React.useEffect(() => {
    if (!context.matchers.find(m => m.source === 'Channel' && (m.text === 'Red' || m.text === 'Blue'))) {
      matchersChanged(context.matchers.filter(m => m.source !== 'Channel'))
    }
  }, [context.matchers, matchersChanged])

  const rowSelected = (event: RowSelectedEvent<Bond>) => {
    if (event.data?.isin) {
      onBondSelected(event.data)
    }
  }

  return (
    <div className='mainBlotter'>
      <div className='mainMultiselect'>
        <MultiSelect
          matchers={matchers}
          dataSources={dataSource}
          onMatchersChanged={matchersChanged}
          styles={styleFromTheme(theme)}
          maxDropDownHeight={120}
          showCategories={false}
          hideToolTip={false}
          operators='AgGrid'
        />
      </div>
      <div
        className="ag-theme-alpine agBondsGrid"
        style={getAgGridStyle(theme)}
      >
        <AgGridReact<Bond>
          ref={agGridRef}
          rowData={rowData}
          onRowSelected={rowSelected}
          rowSelection='single'
          rowMultiSelectWithClick={true}
          columnDefs={columnDefs}>
        </AgGridReact>
      </div>
    </div>

  )
}

export default Bonds