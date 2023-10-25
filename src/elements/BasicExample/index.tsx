import * as React from 'react'
import { Theme, styleCodeFromTheme, styleFromTheme } from "../../themes"
import { DataSource, Matcher, defaultComparison, numberComparisons, stringComparisons } from 'multi-source-select'
import Help from '../Help'
import MultiSelect from 'multi-source-select'
import './BasicExample.css'

interface BasicExampleProps {
  theme: Theme
}

const dataSource: DataSource[] = [
  {
    name: 'list',
    title: 'list of strings',
    comparisons: defaultComparison,
    precedence: 1,
    source: ['asdas', 'assda', 'loadsp'],
  },
  {
    name: 'promise',
    title: 'Promise list',
    comparisons: defaultComparison,
    precedence: 3,
    source: async (text) => {
      return new Promise((resolve) => {
        setTimeout(
          () =>
            resolve(
              ['delayed', 'aploked', 'loadsp'].filter((item) =>
                item.includes(text),
              ),
            ),
          250,
        )
      })
    },
  },
  {
    name: 'function',
    title: 'Functions',
    comparisons: numberComparisons,
    match: (text: string) => !isNaN(Number(text)),
    value: (text: string) => Number.parseInt(text),
  },
  {
    name: 'regex',
    title: 'Regular Expression',
    comparisons: stringComparisons,
    precedence: 2,
    match: /^[a-zA-Z]{2,}$/,
    value: (text: string) => text,
  },
]

const BasicExample: React.FC<BasicExampleProps> = ({ theme }) => {
  const [matchers, setMatchers] = React.useState<Matcher[]>()

  return (
    <div>
      <div className='mainMultiselectContainer'>
        <div className='mainMultiselect'>
          <MultiSelect
            matchers={matchers}
            dataSources={dataSource}
            onMatchersChanged={setMatchers}
            styles={styleFromTheme(theme)}
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

export default BasicExample