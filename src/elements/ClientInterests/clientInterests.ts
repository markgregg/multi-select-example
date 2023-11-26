export interface ClientInterest {
  date: string
  isin?: string
  maturityFrom?: string
  maturityTo?: string
  side: 'BUY' | 'SELL'
  size?: number
  couponFrom?: number
  couponTo?: number
  industry?: string
}

export const clientInterestList: ClientInterest[] = [
  {
    "date": "20-10-2023",
    "maturityFrom": "20y",
    "maturityTo": "25y",
    "side": 'BUY',
    "industry": "Technology"
  },
  {
    "date": "01-10-2023",
    "isin": "XS1848875172",
    "side": 'SELL',
    "size": 10000000,
  },
  {
    "date": "16-09-2023",
    "isin": "IT0004026420",
    "side": 'SELL',
    "size": 50000000,
  },
  {
    "date": "05-09-2023",
    "maturityFrom": "20y",
    "maturityTo": "25y",
    "side": 'BUY',
    "industry": "Metals"
  },
]