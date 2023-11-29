import * as React from 'react'
import { useAppSelector } from '../../hooks/redux'
import { styleDivFromTheme } from '../../themes'
import { clientList } from './clientList'
import Tabs from '../Tabs'
import './Clients.css'

interface ClientsProps {
  selectedClient: string
  onClientSelected: (client: string) => void
}

const Clients: React.FC<ClientsProps> = ({ selectedClient, onClientSelected }) => {
  const [filter, setFilter] = React.useState<string>('')
  const [selectedOption, setSelectedOption] = React.useState<string>('My Clients')
  const theme = useAppSelector((state) => state.theme.theme)

  const selectClient = (client: string) => {
    onClientSelected(client)
  }

  return (
    <div
      className='clientsMain'
      style={styleDivFromTheme(theme)}
    >
      <Tabs tabs={['My Clients', 'Teams Clients']} activeTab={selectedOption} onSelect={setSelectedOption} />
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        style={{
          border: '1px solid lightgray'
        }}
      />
      <div className='clientsList'>
        {
          clientList.filter(c => filter === '' || c.toLowerCase().includes(filter.toLowerCase()))
            .sort()
            .map(client =>
              <div
                style={{ width: 260, whiteSpace: 'nowrap' }}
                key={client}
                className={selectedClient === client
                  ? theme === 'metallic'
                    ? 'clientsItemMetallicActive'
                    : 'clientsItemNormalActive'
                  : theme === 'metallic'
                    ? 'clientsItemMetallic'
                    : 'clientsItemNormal'
                }
                onClick={() => selectClient(client)}
              >{client}</div>
            )
        }
      </div>
    </div>
  )
}

export default Clients