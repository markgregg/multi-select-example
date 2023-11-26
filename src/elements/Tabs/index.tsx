import "./Tabs.css"
import { useAppSelector } from '../../hooks/redux'
import { styleHeaderFromTheme } from '../../themes'

interface TabsProps<T extends string> {
  tabs: T[]
  activeTab: T
  onSelect: (tab: T) => void
}

const Tabs = <T extends string>(props: TabsProps<T>) => {
  const {
    tabs,
    activeTab,
    onSelect
  } = props
  const theme = useAppSelector((state) => state.theme.theme)

  return (
    <div className='tabsTabDiv'
      style={styleHeaderFromTheme(theme)}
    >
      {
        tabs.map(tab =>
          <span
            key={tab}
            className={activeTab === tab
              ? theme === 'metallic'
                ? 'tabsItem tabsItemMetallicActive'
                : 'tabsItem tabsItemNormalActive'
              : theme === 'metallic'
                ? 'tabsItem tabsItemMetallic'
                : 'tabsItem tabsItemNormal'
            }
            onClick={() => onSelect(tab)}>
            {tab}
          </span>
        )
      }
    </div>
  )
}

export default Tabs