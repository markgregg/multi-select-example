import * as React from 'react'
import { useAppSelector } from '../../hooks/redux'
import { getAgGridStyle, styleDivFromTheme, styleFromTheme } from '../../themes'
import { ClientInterest, clientInterestList } from './clientInterests'
import { AgGridReact } from "ag-grid-react"
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import EnterInterest from '../EnterInterest'
import Interest, { defaultInterest } from '../../types/Interest'
import { IoMdAddCircle } from "react-icons/io";
import Button from '../Button'
import MultiSelect, { Matcher } from 'multi-source-select'
import './ClientInterests.css'



interface ClientProfileProps {
  interest: Interest | null
  onClearInterests: () => void
  onSelectInterest: (interest: ClientInterest) => void
}

const ClientInterests: React.FC<ClientProfileProps> = ({
  interest,
  onClearInterests,
  onSelectInterest
}) => {
  const theme = useAppSelector((state) => state.theme.theme)
  const [matchers, setMatchers] = React.useState<Matcher[]>()
  const [showInterest, setShowInterest] = React.useState<boolean>(false)
  const [columnDefs] = React.useState<ColDef<ClientInterest>[]>([
    { field: "date", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "isin", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 110 },
    { field: "side", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "maturityFrom", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "maturityTo", filter: 'agDateColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "size", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "couponFrom", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "couponTo", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "industry", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 110 },
  ])

  const closeInterests = () => {
    setShowInterest(false)
    onClearInterests()
  }

  const selectInterest = (event: RowDoubleClickedEvent<ClientInterest>) => {
    if (event.data) {
      onSelectInterest(event.data)
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
          rowData={clientInterestList}
          onRowDoubleClicked={selectInterest}
          rowSelection='single'
          rowMultiSelectWithClick={true}
          columnDefs={columnDefs}>
        </AgGridReact>
      </div>
      {
        (interest || showInterest) &&
        <EnterInterest interest={interest ?? defaultInterest} onClose={closeInterests} />
      }
      {
        !showInterest && !interest &&
        <div className='clientInterestFloating'>
          <Button Icon={IoMdAddCircle} onClick={() => setShowInterest(true)} />
        </div>
      }
    </div>
  )
}

export default ClientInterests