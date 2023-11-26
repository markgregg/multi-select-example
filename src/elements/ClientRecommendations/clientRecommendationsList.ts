export interface ClientRecommendations {
  isin: string
  side: 'BUY' | 'SELL'
  score: number
  reason: string
}

export const clientRecommendationsList: ClientRecommendations[] = [
  {
    "isin": "FR0013213683",
    "side": 'BUY',
    "score": 99.3355,
    "reason": "Traded on 27-11-2023",
  },
  {
    "isin": "XS1848875172",
    "side": 'BUY',
    "score": 95.0436,
    "reason": "RFQ on 24-11-2023",
  },
  {
    "isin": "IT0004026420",
    "side": 'SELL',
    "score": 93.2313,
    "reason": "RFQ on 22-11-2023",
  },
  {
    "isin": "XS1586702679",
    "side": 'BUY',
    "score": 88.915,
    "reason": "Traded XS1848875172 on 24-11-2023",
  },
  {
    "isin": "XS1582205040",
    "side": 'SELL',
    "score": 87.5371,
    "reason": "RFQ XS1848875172 on 24-11-2023",
  },
  {
    "isin": "XS1627193359",
    "side": 'SELL',
    "score": 84.3726,
    "reason": "RFQ XS1843675172 on 24-11-2023",
  },
  {
    "isin": "XS1637093508",
    "side": 'SELL',
    "score": 80.2618,
    "reason": "RFQ XS1843675172 on 24-11-2023",
  },
  {
    "isin": "XS2329761956",
    "side": 'BUY',
    "score": 77.8946,
    "reason": "Holding 100000 on 24-10-2023",
  },
  {
    "isin": "XS2337449214",
    "side": 'BUY',
    "score": 77.8946,
    "reason": "Holding 200000 on 24-11-2023",
  },
]