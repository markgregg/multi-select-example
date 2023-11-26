import * as React from 'react'
import { useAppSelector } from '../../hooks/redux'
import { getAgGridStyle, styleDivFromTheme } from '../../themes'
import { ClientInterest, clientInterestList } from './clientInterests'
import { AgGridReact } from "ag-grid-react"
import { ColDef } from 'ag-grid-community'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import EnterInterest from '../EnterInterest'
import Interest, { defaultInterest } from '../../types/Interest'
import { IoMdAddCircle } from "react-icons/io";
import Button from '../Button'
import './ClientInterests.css'


interface ClientProfileProps {
  interest: Interest | null
  onClearInterests: () => void
}

const ClientInterests: React.FC<ClientProfileProps> = ({
  interest,
  onClearInterests
}) => {
  const theme = useAppSelector((state) => state.theme.theme)
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

  return (
    <div
      className='clientInterestsMain'
      style={styleDivFromTheme(theme)}
    >
      <div
        className="ag-theme-alpine agInterestsGrid"
        style={getAgGridStyle(theme)}
      >
        <AgGridReact
          rowData={clientInterestList}
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