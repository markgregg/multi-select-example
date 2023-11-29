
export interface ClientRecommendation {
  isin: string
  client: string
  side: 'BUY' | 'SELL'
  score: number
  reason: string
  isAxe?: boolean
}

export const getClientRecommendations = (isBond?: boolean): ClientRecommendation[] => {

  const max = Math.floor((Math.random() * (isBond ? 5 : 13))) + 1;
  return recommendationsList.filter((_, i) => i < max)
}

export const recommendationsList: ClientRecommendation[] = [
  {
    "isin": "FR0013213683",
    "client": "ALD",
    "side": 'BUY',
    "score": 99.3355,
    "reason": "Traded on 27-11-2023",
    "isAxe": true
  },
  {
    "isin": "XS1848875172",
    "client": "BNP Paribas",
    "side": 'BUY',
    "score": 95.0436,
    "reason": "RFQ on 24-11-2023",
  },
  {
    "isin": "IT0004026420",
    "client": "Barclays",
    "side": 'SELL',
    "score": 93.2313,
    "reason": "RFQ on 22-11-2023",
    "isAxe": true
  },
  {
    "isin": "XS1586702679",
    "client": "HSBC",
    "side": 'BUY',
    "score": 88.915,
    "reason": "Traded XS1848875172 on 24-11-2023",
  },
  {
    "isin": "XS1582205040",
    "client": "Jeffries",
    "side": 'SELL',
    "score": 87.5371,
    "reason": "RFQ XS1848875172 on 24-11-2023",
    "isAxe": true
  },
  {
    "isin": "XS1627193359",
    "client": "BNG Bank N.V",
    "side": 'SELL',
    "score": 84.3726,
    "reason": "RFQ XS1843675172 on 24-11-2023",
    "isAxe": true
  },
  {
    "isin": "XS1637093508",
    "client": "La Banque Postale",
    "side": 'SELL',
    "score": 80.2618,
    "reason": "RFQ XS1843675172 on 24-11-2023",
  },
  {
    "isin": "XS2329761956",
    "client": "The Toronto-Dominion Bank",
    "side": 'BUY',
    "score": 77.8946,
    "reason": "Holding 100000 on 24-10-2023",
  },
  {
    "isin": "XS2337449214",
    "client": "Hypo Vorarlberg Bank AG",
    "side": 'BUY',
    "score": 74.8946,
    "reason": "Holding 200000 on 24-11-2023",
  },
  {
    "isin": "XS2534785865",
    "client": "Shell International Finance BV",
    "side": 'SELL',
    "score": 69.3726,
    "reason": "RFQ XS1843675172 on 24-11-2023",
    "isAxe": true
  },
  {
    "isin": "XS2539948948",
    "client": "Nederlandse Waterschapsbank N.V.",
    "side": 'SELL',
    "score": 63.2618,
    "reason": "RFQ XS1843675172 on 24-11-2023",
  },
  {
    "isin": "XS2539932785",
    "client": "Norddeutsche Landesbank -Girozentrale-",
    "side": 'BUY',
    "score": 57.8946,
    "reason": "Holding 100000 on 24-10-2023",
  },
  {
    "isin": "XS2540998304",
    "client": "Bankinter S.A.",
    "side": 'BUY',
    "score": 54.8946,
    "reason": "Holding 200000 on 24-11-2023",
  },
]
