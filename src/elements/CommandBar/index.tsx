import * as React from 'react'
import { styleFromTheme } from "../../themes"
import { DataSource, Matcher, SourceItem, defaultComparison, numberComparisons, stringComparisons, Nemonic } from 'multi-source-select'
import MultiSelect from 'multi-source-select'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { extractDate, getSize, isSize } from '../../utils'
import { fetchBondsAndCache } from '../../services/bondsService'
import Bond from '../../types/Bond'
import { setContext } from '../../store/contextSlice'
import { getColumn, getFilterType } from '../../types/AgFilter'
import './CommandBar.css'


interface CommandBarProps {
  onCommand: (command: string, matchers?: Matcher[]) => void
}

type Operation = (bond: any) => boolean

const regionCountry = [
  'AMEA',
  'APAC',
  'EMEA',
  'ASIA (EX. NEAR EAST)',
  'BALTICS',
  'C.W. OF IND. STATES',
  'EASTERN EUROPE',
  'LATIN AMER. & CARIB',
  'NEAR EAST ',
  'NORTHERN AFRICA',
  'NORTHERN AMERICA',
  'OCEANIA',
  'SUB-SAHARAN AFRICA',
  'WESTERN EUROPE',
  'Afghanistan',
  'Bangladesh',
  'Bhutan',
  'Brunei',
  'Burma',
  'Cambodia',
  'China',
  'East Timor',
  'Hong Kong',
  'India',
  'Indonesia',
  'Iran',
  'Japan',
  'Korea, North',
  'Korea, South',
  'Laos',
  'Macau',
  'Malaysia',
  'Maldives',
  'Mongolia',
  'Nepal',
  'Pakistan',
  'Philippines',
  'Singapore',
  'Sri Lanka',
  'Taiwan',
  'Thailand',
  'Vietnam',
  'Estonia',
  'Latvia',
  'Lithuania',
  'Armenia',
  'Azerbaijan',
  'Belarus',
  'Georgia',
  'Kazakhstan',
  'Kyrgyzstan',
  'Moldova',
  'Russia',
  'Tajikistan',
  'Turkmenistan',
  'Ukraine',
  'Uzbekistan',
  'Albania',
  'Bosnia & Herzegovina',
  'Bulgaria',
  'Croatia',
  'Czech Republic',
  'Hungary',
  'Macedonia',
  'Poland',
  'Romania',
  'Serbia',
  'Slovakia',
  'Slovenia',
  'Anguilla',
  'Antigua & Barbuda',
  'Argentina',
  'Aruba',
  'Bahamas, The',
  'Barbados',
  'Belize',
  'Bolivia',
  'Brazil',
  'British Virgin Is.',
  'Cayman Islands',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Cuba',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'El Salvador',
  'French Guiana',
  'Grenada',
  'Guadeloupe',
  'Guatemala',
  'Guyana',
  'Haiti',
  'Honduras',
  'Jamaica',
  'Martinique',
  'Mexico',
  'Montserrat',
  'Netherlands Antilles',
  'Nicaragua',
  'Panama',
  'Paraguay',
  'Peru',
  'Puerto Rico',
  'Saint Kitts & Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Suriname',
  'Trinidad & Tobago',
  'Turks & Caicos Is',
  'Uruguay',
  'Venezuela',
  'Virgin Islands',
  'Bahrain',
  'Cyprus',
  'Gaza Strip',
  'Iraq',
  'Israel',
  'Jordan',
  'Kuwait',
  'Lebanon',
  'Oman',
  'Qatar',
  'Saudi Arabia',
  'Syria',
  'Turkey',
  'United Arab Emirates',
  'West Bank',
  'Yemen',
  'Algeria',
  'Egypt',
  'Libya',
  'Morocco',
  'Tunisia',
  'Western Sahara',
  'Bermuda',
  'Canada',
  'Greenland',
  'St Pierre & Miquelon',
  'United States',
  'American Samoa',
  'Australia',
  'Cook Islands',
  'Fiji',
  'French Polynesia',
  'Guam',
  'Kiribati',
  'Marshall Islands',
  'Micronesia, Fed. St.',
  'N. Mariana Islands',
  'Nauru',
  'New Caledonia',
  'New Zealand',
  'Palau',
  'Papua New Guinea',
  'Samoa',
  'Solomon Islands',
  'Tonga',
  'Tuvalu',
  'Vanuatu',
  'Wallis and Futuna',
  'Angola',
  'Benin',
  'Botswana',
  'Burkina Faso',
  'Burundi',
  'Cameroon',
  'Cape Verde',
  'Central African Rep.',
  'Chad',
  'Comoros',
  'Congo, Dem. Rep.',
  'Congo, Repub. of the',
  'Cote d\'Ivoire',
  'Djibouti',
  'Equatorial Guinea',
  'Eritrea',
  'Ethiopia',
  'Gabon',
  'Gambia, The',
  'Ghana',
  'Guinea',
  'Guinea-Bissau',
  'Kenya',
  'Lesotho',
  'Liberia',
  'Madagascar',
  'Malawi',
  'Mali',
  'Mauritania',
  'Mauritius',
  'Mayotte',
  'Mozambique',
  'Namibia',
  'Niger',
  'Nigeria',
  'Reunion',
  'Rwanda',
  'Saint Helena',
  'Sao Tome & Principe',
  'Senegal',
  'Seychelles',
  'Sierra Leone',
  'Somalia',
  'South Africa',
  'Sudan',
  'Swaziland',
  'Tanzania',
  'Togo',
  'Uganda',
  'Zambia',
  'Zimbabwe',
  'Andorra',
  'Austria',
  'Belgium',
  'Denmark',
  'Faroe Islands',
  'Finland',
  'France',
  'Germany',
  'Gibraltar',
  'Greece',
  'Guernsey',
  'Iceland',
  'Ireland',
  'Isle of Man',
  'Italy',
  'Jersey',
  'Liechtenstein',
  'Luxembourg',
  'Malta',
  'Monaco',
  'Netherlands',
  'Norway',
  'Portugal',
  'San Marino',
  'Spain',
  'Sweden',
  'Switzerland',
  'United Kingdom'
]

const textCondition = (matcher: Matcher): Operation => {
  const field = getColumn(matcher.source)
  switch (matcher.comparison) {
    case '!':
      return (bond) => (bond[field] as string) !== matcher.value
    case '*':
      return (bond) => (bond[field] as string).includes(matcher.value as string)
    case '!*':
      return (bond) => !(bond[field] as string).includes(matcher.value as string)
    case '>*':
      return (bond) => (bond[field] as string).startsWith(matcher.value as string)
    case '<*':
      return (bond) => (bond[field] as string).endsWith(matcher.value as string)
    default:
      return (bond) => bond[field] === matcher.value
  }
}

const numberCondition = (matcher: Matcher): Operation => {
  const field = getColumn(matcher.source)
  switch (matcher.comparison) {
    case '!':
      return (bond) => bond[field] === matcher.value
    case '>':
      return (bond) => bond[field] > matcher.value
    case '<':
      return (bond) => bond[field] < matcher.value
    case '>=':
      return (bond) => bond[field] >= matcher.value
    case '<=':
      return (bond) => bond[field] <= matcher.value
    default:
      return (bond) => bond[field] === matcher.value
  }
}

const dateCondition = (matcher: Matcher): Operation => {
  const field = getColumn(matcher.source)
  switch (matcher.comparison) {
    case '!':
      return (bond) => bond[field] === matcher.value
    case '>':
      return (bond) => bond[field] > matcher.value
    case '<':
      return (bond) => bond[field] < matcher.value
    case '>=':
      return (bond) => bond[field] >= matcher.value
    case '<=':
      return (bond) => bond[field] <= matcher.value
    default:
      return (bond) => bond[field] === matcher.value
  }
}

const operator = (matcher: Matcher, comp1: Operation, comp2: Operation): Operation => {
  switch (matcher.operator.toLowerCase()) {
    case 'or':
    case '|':
      return (bond) => comp1(bond) || comp2(bond)
  }
  return (bond) => comp1(bond) && comp2(bond)
}

const operation = (matcher: Matcher): Operation => {
  switch (getFilterType(matcher.source)) {
    case 'date':
      return dateCondition(matcher)
    case 'number':
      return numberCondition(matcher)
  }
  return textCondition(matcher)
}

const getPredicate = (matchers: Matcher[]): Operation | null => {
  let op: Operation | null = null
  matchers.filter(matcher =>
    matcher.comparison !== '(' &&
    matcher.comparison !== ')' &&
    !matcher.changing &&
    matcher.source !== 'Channel'
  ).forEach(matcher => {
    const currentOp = operation(matcher)
    op = (op !== null)
      ? operator(matcher, op, currentOp)
      : currentOp
  })
  return op
}

const CommandBar: React.FC<CommandBarProps> = ({
  onCommand,
}) => {
  const theme = useAppSelector((state) => state.theme.theme)
  const [bonds, setBonds] = React.useState<Bond[]>([])

  const dispatch = useAppDispatch()

  const findItems = React.useCallback((text: string, field: 'isin' | 'currency' | 'issuer', op: 'and' | 'or' | null, matchers?: Matcher[]): SourceItem[] => {
    const uniqueItems = new Set<string>()
    const predicate = matchers && op !== 'or' ? getPredicate(matchers) : null
    bonds.forEach(bond => {
      if (!predicate || predicate(bond)) {
        const value = bond[field]
        if (value &&
          value.toUpperCase().includes(text.toUpperCase())) {
          uniqueItems.add(value)
        }
      }
    })
    let items = [...uniqueItems].sort()
    if (items.length > 10) {
      items = items?.slice(10)
    }
    return items
  }, [bonds])

  const functions = React.useMemo<Nemonic[]>(() => [
    {
      name: 'Interest',
      requiredDataSources: ['Client', 'Side'],
      optionalDataSources: ['Coupon', 'Size', 'MaturityDate', 'CountryRegion', 'Industry', 'ISIN2']
    },
    {
      name: 'Client'
    },
    {
      name: 'Bond',
    },
    {
      name: 'Recommendations',
    },
    {
      name: 'Interests',
    },
    {
      name: 'Profile',
    },
    {
      name: 'Clear'
    }
  ], [])

  const dataSource = React.useMemo<DataSource[]>(() => [
    {
      name: 'ISIN',
      title: 'ISIN Code',
      comparisons: defaultComparison,
      precedence: 3,
      ignoreCase: true,
      searchStartLength: 1,
      selectionLimit: 2,
      source: async (text, op, matchers) => new Promise((resolve) => {
        setTimeout(
          () =>
            resolve(findItems(text, 'isin', op, matchers)
            ),
          5,
        )
      })
    },
    {
      name: 'ISIN2',
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
      source: async (text, op, matchers) => new Promise((resolve) => {
        setTimeout(
          () =>
            resolve(findItems(text, 'currency', op, matchers)
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
      precedence: 4,
      selectionLimit: 2,
      functional: true,
      match: (text: string) => !isNaN(Number(text)),
      value: (text: string) => Number.parseFloat(text),
    },
    {
      name: 'Size',
      title: 'Size',
      comparisons: numberComparisons,
      precedence: 4,
      selectionLimit: 2,
      match: (text: string) => isSize(text),
      value: (text: string) => getSize(text),
    },
    {
      name: 'Side',
      title: 'Side',
      comparisons: stringComparisons,
      precedence: 9,
      ignoreCase: true,
      selectionLimit: 1,
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
      source: async (text, op, matchers) => new Promise((resolve) => {
        setTimeout(
          () =>
            resolve(findItems(text, 'issuer', op, matchers)
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
      name: 'TradeDate',
      title: 'Trade Date',
      comparisons: numberComparisons,
      precedence: 4,
      selectionLimit: 2,
      functional: true,
      match: /^[0-9]{0,2}[yYmM]$/,
      value: (text: string) => extractDate(text),
    },
    {
      name: 'Client',
      title: 'Client',
      comparisons: defaultComparison,
      precedence: 5,
      ignoreCase: false,
      searchStartLength: 2,
      selectionLimit: 1,
      functional: true,
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
      name: 'CountryRegion',
      title: 'Country Region',
      comparisons: stringComparisons,
      precedence: 4,
      ignoreCase: true,
      selectionLimit: 1,
      searchStartLength: 2,
      functional: true,
      source: regionCountry
    },
    {
      name: 'Industry',
      title: 'Industry',
      comparisons: stringComparisons,
      precedence: 8,
      ignoreCase: true,
      searchStartLength: 2,
      functional: true,
      source: [
        'Energy',
        'Materials',
        'Industrials',
        'Consumer',
        'Health',
        'Financials',
        'Technology',
        'Communications',
        'Utilities'
      ]
    },
    {
      name: 'Channel',
      title: 'Channel',
      comparisons: stringComparisons,
      precedence: 10,
      ignoreCase: true,
      searchStartLength: 2,
      source: [
        'Red',
        'Green',
        'Blue'
      ]
    },
  ],
    [findItems]
  )

  React.useEffect(() => {
    fetchBondsAndCache()
      .then(setBonds)
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

  const handleAction = (matchers: Matcher[], func?: string) => {
    if (func) {
      const valueMatchers = matchers.filter(matcher => matcher.source.toLowerCase() !== 'actions')
      onCommand(func, valueMatchers)
    } else {
      const contextMatchers = matchers?.filter(m => m.source !== 'TradeDate' && m.source !== 'Client') ?? []
      if (contextMatchers.length > 0) {
        dispatch(setContext(contextMatchers))
      }
    }
  }

  return (
    <div>
      <div className='mainMultiselectContainer'>
        <div className='mainMultiselect'>
          <MultiSelect
            dataSources={dataSource}
            functions={functions}
            styles={styleFromTheme(theme)}
            onComplete={handleAction}
            onCompleteError={(func, missing) => alert(`${func} is missing ${missing.toString()}`)}
            showCategories={true}
            hideToolTip={false}
          />
        </div>
      </div>
    </div>
  )
}

export default CommandBar