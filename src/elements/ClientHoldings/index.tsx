import * as React from 'react'
import { useAppSelector } from '../../hooks/redux'
import { getAgGridStyle, styleDivFromTheme, styleFromTheme } from '../../themes'
import { ClientHolding, clientHoldingsList } from './ClientHoldings'
import { AgGridReact } from "ag-grid-react"
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import MultiSelect, { Matcher } from 'multi-source-select'
import { currencyValueStyle } from '../../types/AgFilter'
import './ClientHoldings.css'



interface ClientProfileProps {
  client?: string
  bond?: string
  onItemSelected?: (item: string | null, justActivity: boolean) => void
}

const ClientHoldings: React.FC<ClientProfileProps> = ({ client, onItemSelected, bond }) => {
  const agGridRef = React.useRef<AgGridReact<ClientHolding> | null>(null)
  const theme = useAppSelector((state) => state.theme.theme)
  const [matchers, setMatchers] = React.useState<Matcher[]>()
  const [columnDefs] = React.useState<ColDef<ClientHolding>[]>([
    { field: "company", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: bond ? 80 : 120, hide: !bond },
    { field: "isin", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 110, hide: !client },
    { field: "position", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 70, cellStyle: currencyValueStyle },
    { field: "changeValue", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 60, cellStyle: currencyValueStyle },
    { field: "change", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 60 },
    { field: "postingDate", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "changeFromDate", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 80 }
  ])

  React.useEffect(() => {
    const filter = {
      filterType: 'text',
      filter: client ?? bond,
      type: 'equals'
    }
    const instance = agGridRef.current?.api?.getFilterInstance(client ? 'company' : 'isin')
    if (instance) {
      instance?.setModel(filter)
    }
    agGridRef.current?.api?.onFilterChanged()
  }, [client, bond])

  const selectRow = (event: RowDoubleClickedEvent<ClientHolding>, singleClick = false) => {
    if (event.data?.isin && onItemSelected) {
      onItemSelected(client ? event.data.isin : event.data.company, !singleClick)
    }
  }

  return (
    <div
      className='clientInterestsMain'
      style={styleDivFromTheme(theme)}
    >
      <div className='mainMultiselect'>
        <MultiSelect
          matchers={matchers}
          dataSources={[]}
          onMatchersChanged={setMatchers}
          styles={styleFromTheme(theme)}
          maxDropDownHeight={120}
          showCategories={false}
          hideToolTip={false}
          operators='AgGrid'
        />
      </div>
      <div
        className="ag-theme-alpine agInterestsGrid"
        style={getAgGridStyle(theme)}
      >
        <AgGridReact
          ref={agGridRef}
          rowData={clientHoldingsList}
          onRowDoubleClicked={selectRow}
          onRowClicked={e => selectRow(e, true)}
          rowSelection='single'
          rowMultiSelectWithClick={true}
          columnDefs={columnDefs}>
        </AgGridReact>
      </div>
    </div>
  )
}

export default ClientHoldings