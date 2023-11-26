import * as React from 'react'
import { useAppSelector } from '../../hooks/redux'
import { getAgGridStyle, styleDivFromTheme } from '../../themes'
import { ClientRecommendations, clientRecommendationsList } from './clientRecommendationsList'
import { AgGridReact } from "ag-grid-react"
import { ColDef } from 'ag-grid-community'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import './ClientRecommendations.css'

const ClientRecommendations: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme)
  const [columnDefs] = React.useState<ColDef<ClientRecommendations>[]>([
    { field: "isin", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 110 },
    { field: "side", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "score", filter: 'agNumberColumnFilter', sortable: true, resizable: true, width: 80 },
    { field: "reason", filter: 'agTextColumnFilter', sortable: true, resizable: true, width: 200 },
  ])

  return (
    <div
      className='clientRecommendationsMain'
      style={styleDivFromTheme(theme)}
    >
      <div
        className="ag-theme-alpine agInterestsGrid"
        style={getAgGridStyle(theme)}
      >
        <AgGridReact
          rowData={clientRecommendationsList}
          columnDefs={columnDefs}>
        </AgGridReact>
      </div>
    </div>
  )
}

export default ClientRecommendations