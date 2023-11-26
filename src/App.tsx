import * as React from 'react'
import Select from './elements/Select'
import { Theme, bodyStyleFromTheme, themes } from './themes'
import CommandBar from './elements/CommandBar'
import { useAppDispatch, useAppSelector } from './hooks/redux'
import { setTheme } from './store/themeSlice'
import Window from './elements/Window'
import { setContext } from './store/contextSlice'
import { Matcher } from 'multi-source-select'
import Tabs from './elements/Tabs'
import ActivityBlotter from './elements/ActivityBlotter'
import Clients from './elements/Clients'
import ClientRecommendations from './elements/ClientRecommendations'
import ClientInterests from './elements/ClientInterests'
import ClientProfile from './elements/ClientProfile'
import { clientList } from './elements/Clients/clientList'
import Bonds from './elements/Bonds'
import Bond from './types/Bond'
import BondProfile from './elements/BondProfile'
import Interest from './types/Interest'
import './App.css'

type Focus = 'Daily' | 'Analysis'
type Perspective = 'Client' | 'Bond'
type ClientDetail = 'Profile' | 'Interests' | 'Recommendations'

const App = () => {
  const [activePerspective, setActivePerspective] = React.useState<Perspective>('Client')
  const [activeFocus, setActiveFocus] = React.useState<Focus>('Daily')
  const [activeClient, setActiveClient] = React.useState<ClientDetail>('Profile')
  const [client, setClient] = React.useState<string>(clientList[10])
  const [bond, setBond] = React.useState<Bond>({
    "isin": "FR0013405222",
    "currency": "USD",
    "issueDate": "2019-03-04",
    "maturityDate": "2024-03-04",
    "price": 108.0291,
    "size": 699000,
    "side": "SELL",
    "coupon": 5.655,
    "issuer": "BPCE",
    "hairCut": 21.7
  })
  const [showCategories, setShowCategories] = React.useState<boolean>(false)
  const [hideToolTips, setHideToolTips] = React.useState<boolean>(false)
  const [interest, setInterest] = React.useState<Interest | null>(null)
  const theme = useAppSelector((state) => state.theme.theme)
  const dispatch = useAppDispatch()

  const updateTheme = (theme: Theme) => {
    dispatch(setTheme(theme))
  }

  const focusTabs: Focus[] = [
    'Daily',
    'Analysis'
  ]
  const perspectiveTabs: Perspective[] = [
    'Client',
    'Bond',
  ]
  const clientTabs: ClientDetail[] = [
    'Profile',
    'Recommendations',
    'Interests'
  ]

  const runCommand = (command: string, matchers?: Matcher[]) => {
    if (command === 'Interest' && matchers) {
      const client = matchers.find(m => m.source === 'Client')?.text
      const isin = matchers.find(m => m.source === 'ISIN2')?.text
      const industry = matchers.find(m => m.source === 'Industry')?.text
      const maturityFrom = matchers.find(m => m.source === 'MaturityDate' && m.comparison === '>')?.text
      const maturityTo = matchers.find(m => m.source === 'MaturityDate' && m.comparison === '<')?.text
      const size = matchers.find(m => m.source === 'Size')?.value as number
      const side = matchers.find(m => m.source === 'Side')?.value as ('BUY' | 'SELL')
      const couponFrom = matchers.find(m => m.source === 'Coupon' && m.comparison === '>')?.value as number
      const couponTo = matchers.find(m => m.source === 'Coupon' && m.comparison === '<')?.value as number

      if (client) {
        dispatch(setContext([
          {
            key: 'SELECT-CLIENT',
            operator: 'and',
            comparison: '=',
            source: 'Issuer',
            value: client,
            text: client
          }
        ]))
      }
      setActivePerspective('Client')
      setActiveClient('Interests')
      if (client) {
        selectClient(client)
      }
      setInterest({
        isin,
        maturityFrom,
        maturityTo,
        size,
        side,
        couponFrom,
        couponTo,
        industry
      })

    } else if (command && matchers) {
      const pers: Perspective = command === 'Bond' ? 'Bond' : 'Client'
      const panel: ClientDetail | null = command === 'Recommendations'
        ? 'Recommendations'
        : command === 'Interests'
          ? 'Interests'
          : command === 'Profile'
            ? 'Profile'
            : null
      setActivePerspective(pers)
      if (panel) {
        setActiveClient(panel)
      }
    }
  }

  const selectClient = (client: string) => {
    dispatch(setContext([
      {
        key: 'SELECT-CLIENT',
        operator: 'and',
        comparison: '=',
        source: 'Issuer',
        value: client,
        text: client
      }
    ]))
    setClient(client)
  }

  const selectBond = (bond: Bond) => {
    dispatch(setContext([
      {
        key: 'SELECT-BOND',
        operator: 'and',
        comparison: '=',
        source: 'ISIN',
        value: bond.isin,
        text: bond.isin
      }
    ]))
    setBond(bond)
  }

  return (
    <div
      className='mainBody'
      style={bodyStyleFromTheme(theme)}
    >
      <h2>MutliSelect</h2>
      <div className='mainSelection'>
        <div className='mainTheme'>
          <b>Themes</b>
          <Select
            options={themes}
            selection={theme}
            onSelectOption={updateTheme}
          />
        </div>
        <div className='mainOptions'>
          <label>Show Categories
            <input
              type="checkbox"
              checked={showCategories}
              onChange={e => setShowCategories(e.currentTarget.checked)}
            />
          </label>
          <label>Hide Tooltips
            <input
              type="checkbox"
              checked={hideToolTips}
              onChange={e => setHideToolTips(e.currentTarget.checked)}
            />
          </label>
        </div>
      </div>
      <div
        className='mainContentDiv'
      >
        <CommandBar onCommand={runCommand} showCategories={showCategories} hideToolTips={hideToolTips} />
        <div>
          <Tabs tabs={focusTabs} activeTab={activeFocus} onSelect={setActiveFocus} />
        </div>
        {
          activeFocus === 'Daily'
            ? <div>
              <div className='mainTop'>
                <Tabs tabs={perspectiveTabs} activeTab={activePerspective} onSelect={setActivePerspective} />
                {
                  activePerspective === 'Client'
                    ? <div className='mainPanels'>
                      <div className='mainPanel1'>
                        <Tabs tabs={clientTabs} activeTab={activeClient} onSelect={setActiveClient} />
                        {
                          activeClient === 'Profile'
                            ? <ClientProfile client={client} />
                            : activeClient === 'Recommendations'
                              ? <ClientRecommendations />
                              : <ClientInterests interest={interest} onClearInterests={() => setInterest(null)} />
                        }
                      </div>
                      <div className='mainPanel2'>
                        <Window title='Clients'>
                          <Clients onClientSelected={selectClient} selectedClient={client} />
                        </Window>
                      </div>
                    </div>
                    : <div className='mainPanels'>
                      <div className='mainPanel1'>
                        <Window title='Profile' >
                          <BondProfile bond={bond} />
                        </Window>
                      </div>
                      <div className='mainPanel2'>
                        <Window title='Bonds'>
                          <Bonds onBondSelected={selectBond} />
                        </Window>
                      </div>
                    </div>
                }
              </div>
              <div className='mainActivity'>
                <Window title='Actiity'>
                  <ActivityBlotter />
                </Window>
              </div>
            </div>
            : <div>
            </div>
        }
      </div>


    </div>
  )
}

export default App
