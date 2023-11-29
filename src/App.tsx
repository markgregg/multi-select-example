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
import FloatingMenu, { ClientDetail, Perspective } from './elements/FloatingMenu'
import './App.css'
import ClientHoldings from './elements/ClientHoldings'
import { ClientInterest } from './elements/ClientInterests/clientInterests'
import { extractDate } from './utils'
import ToastInsights from './elements/ToastInsights'


type Focus = 'Daily' | 'Analysis'

const phases = [
  { value: 1, text: 'Current' },
  { value: 2, text: 'Qtr 2 2024' },
  { value: 3, text: 'Qtr 3 2024' },
  { value: 4, text: 'Qtr 2 2025' },
  { value: 5, text: 'Qtr 3 2025' }
]

const App = () => {
  const [activePerspective, setActivePerspective] = React.useState<Perspective>('Client')
  const [activeFocus, setActiveFocus] = React.useState<Focus>('Daily')
  const [activeClient, setActiveClient] = React.useState<ClientDetail>('Holdings')
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
  const [interest, setInterest] = React.useState<Interest | null>(null)
  const [phase, setPhase] = React.useState<number>(5)
  const theme = useAppSelector((state) => state.theme.theme)
  const dispatch = useAppDispatch()


  const updateTheme = (theme: Theme) => {
    dispatch(setTheme(theme))
  }

  const focusTabs: Focus[] = phase < 3
    ? [
      'Daily',
    ]
    : [
      'Daily',
      'Analysis'
    ]

  const clientTabs: ClientDetail[] = phase < 2
    ? []
    : phase < 3
      ? [
        'Holdings',
      ]
      : phase < 4
        ? [
          'Holdings',
          'Interests'
        ]
        : [
          'Holdings',
          'Recommendations',
          'Interests'
        ]


  const runCommand = (command: string, matchers?: Matcher[]) => {
    if (command === 'Clear') {
      dispatch(setContext([]))
    } else if (command === 'Interest' && matchers) {
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
            operator: '&',
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
          : command === 'Holdings'
            ? 'Holdings'
            : null
      setActivePerspective(pers)
      if (panel) {
        setActiveClient(panel)
      }
    }
  }

  const selectClient = (client: string | null, fromBond = false, activtyAndChannel = false) => {
    if (client === null) {
      return
    }

    if (fromBond && activtyAndChannel) {
      setActivePerspective('Client')
    }

    dispatch(setContext([
      {
        key: 'SELECT-CLIENT',
        operator: '&',
        comparison: '=',
        source: 'Issuer',
        value: client,
        text: client
      },
      {
        key: 'SELECT-CHANNEL',
        operator: '&',
        comparison: '=',
        source: 'Channel',
        value: 'Green',
        text: 'Green'
      }
    ]))
    if (activtyAndChannel) {
      setClient(client)
    }
  }

  const selectBond = (bond: Bond | string | null, activtyAndChannel = true) => {
    if (bond == null) {
      return
    }

    if (typeof bond === 'string' && activtyAndChannel) {
      setActivePerspective('Bond')
    }

    setTimeout(() => {
      dispatch(setContext([
        {
          key: 'SELECT-BOND',
          operator: '&',
          comparison: '=',
          source: 'ISIN',
          value: typeof bond === 'string' ? bond : bond.isin,
          text: typeof bond === 'string' ? bond : bond.isin,
        },
        {
          key: 'SELECT-CHANNEL',
          operator: '&',
          comparison: '=',
          source: 'Channel',
          value: typeof bond === 'string' && activtyAndChannel ? 'Red' : 'Green',
          text: typeof bond === 'string' && activtyAndChannel ? 'Red' : 'Green'
        }
      ]))
      if (typeof bond !== 'string' && activtyAndChannel) {
        setBond(bond)
      }
    }, 250)
  }

  const addMatcher = (matchers: Matcher[], interest: any, field: string, source: string, comp: string, extract?: (val: string) => any) => {
    const val = interest[field]
    if (val) {
      const updateVal = extract ? extract(val) : val
      matchers.push({
        key: `${field}-Interest`,
        operator: '&',
        comparison: comp,
        source: source,
        value: updateVal,
        text: updateVal
      })
    }
  }

  const selectInterest = (interest: ClientInterest) => {
    const matchers: Matcher[] = []
    addMatcher(matchers, interest, 'isin', 'ISIN', '=')
    //addMatcher(matchers, interest, 'industry', 'Industry', '=')
    addMatcher(matchers, interest, 'side', 'Side', '=')
    addMatcher(matchers, interest, 'size', 'size', '=')
    addMatcher(matchers, interest, 'maturityFrom', 'MaturityDate', '>', extractDate)
    addMatcher(matchers, interest, 'maturityTo', 'MaturityDate', '<', extractDate)
    addMatcher(matchers, interest, 'couponFrom', 'Coupon', '>')
    addMatcher(matchers, interest, 'couponTo', 'Coupon', '<')
    matchers.push({
      key: 'SELECT-CHANNEL',
      operator: '&',
      comparison: '=',
      source: 'Channel',
      value: 'Red',
      text: 'Red'
    })

    setActivePerspective('Bond')
    setTimeout(() => {
      dispatch(setContext(matchers))
    }, 250)
  }

  return (
    <div
      className='mainBody'
      style={bodyStyleFromTheme(theme)}
    >
      <h2>Credit Sales Story board</h2>
      <div className='mainSelection'>
        <div className='mainTheme'>
          <b>Themes</b>
          <Select
            options={themes}
            selection={theme}
            onSelectOption={updateTheme}
          />
        </div>
        <div className='mainPhases'>
          {
            phases.map(ph =>
              <div key={ph.value}>
                <input
                  type="radio"
                  name="phase"
                  checked={ph.value === phase}
                  onClick={() => setPhase(ph.value)} />
                <label>{ph.text}</label>
              </div>
            )
          }
        </div>
      </div>
      <div
        className='mainContentDiv'
      >
        <div style={{ display: 'flex', flexDirection: 'row', columnGap: 5 }}>
          {
            phase > 1 && <>
              <label>Command:</label>
              <div style={{ flexGrow: 1 }}>
                <CommandBar onCommand={runCommand} />
              </div>
            </>
          }
        </div>
        <div>
          <Tabs tabs={focusTabs} activeTab={activeFocus} onSelect={setActiveFocus} />
        </div>
        {
          activeFocus === 'Daily'
            ? <div>
              <div className='mainTop'>
                {
                  activePerspective === 'Client'
                    ? <div className='mainPanels'>
                      <div className='mainPanel1Client'>
                        {
                          phase > 1 && <Window title='Profile'>
                            <ClientProfile client={client} phase={phase} />
                          </Window>
                        }
                      </div>
                      <div className='mainPanel2Client'>
                        <Tabs tabs={clientTabs} activeTab={activeClient} onSelect={setActiveClient} />
                        {
                          phase > 1 &&
                          <>
                            {
                              activeClient === 'Holdings' || phase < 2
                                ? <ClientHoldings client={client} onItemSelected={selectBond} />
                                : activeClient === 'Recommendations' && phase >= 4
                                  ? <ClientRecommendations onItemSelected={selectBond} clientBond={client} />
                                  : <ClientInterests interest={interest} onClearInterests={() => setInterest(null)} onSelectInterest={selectInterest} />
                            }
                          </>
                        }
                      </div>
                      <div className='mainPanel3Client'>
                        {
                          phase > 1 && <Window title='Clients' color='blue'>
                            <Clients onClientSelected={selectClient} selectedClient={client} />
                          </Window>
                        }
                      </div>
                    </div>
                    : <div className='mainPanels'>
                      <div className='mainPanel1'>
                        {
                          phase > 1 && <Window title='Profile'>
                            <BondProfile bond={bond} phase={phase} />
                          </Window>
                        }
                      </div>
                      <div className='mainPanel2'>
                        {
                          phase >= 4 &&
                          <div style={{ height: '50%' }}>

                            <Window title='Recommendations'>
                              <ClientRecommendations onItemSelected={(c, a) => selectClient(c, true, a)} isBond={true} clientBond={bond.isin} />
                            </Window>
                          </div>
                        }
                        <div style={{ height: '50%' }}>
                          {
                            phase > 1 &&
                            <Window title='Holdings'>
                              <ClientHoldings bond={bond.isin} onItemSelected={(c, a) => selectClient(c, true, a)} />
                            </Window>
                          }
                        </div>
                      </div>
                      <div className='mainPanel3'>
                        <Window title='Axes' color='red'>
                          <Bonds onBondSelected={selectBond} />
                        </Window>
                      </div>
                    </div>
                }
              </div>
              <div className='mainActivity'>
                <Window title='Actiity' color='green'>
                  <ActivityBlotter />
                </Window>
              </div>
            </div>
            : <div className='mainAnalysis'>
              <div className='mainAnalysisProperties'>

              </div>
            </div>
        }
      </div>
      <FloatingMenu onSelectOption={setActivePerspective} currentPerspective={activePerspective} />
      {
        phase > 4 && <ToastInsights onItemSelected={(c, b) => {
          if (c) {
            selectClient(c, true, true)
          } else if (b) {
            selectBond(b, true)
          }
        }}
        />
      }
    </div>
  )
}

export default App
