import * as React from 'react'
import { ClientRecommendation } from '../ClientRecommendations/clientRecommendationsList'
import { GiSharpAxe } from "react-icons/gi";
import './Recommendation.css'

interface RecommendationProps {
  type: 'Client' | 'Bond'
  recommendation: ClientRecommendation
  onSelected: (isin: string | null, justActivity: boolean) => void
  selected: string | null
}

const Recommendation: React.FC<RecommendationProps> = ({ type, recommendation, onSelected, selected }) => {

  const getColour = (score: number) => {
    const getGreen = (score: number) => {
      const green = Math.round(0 + (score * 4) - 220)
      return green < 50 ? 50 : green
    }
    return `rgb(${Math.round(0 + (score / 20))}, ${getGreen(score)}, ${Math.round(0 + (score / 20))})`
  }

  return (
    <div
      className='recommandationMain'
      onDoubleClick={() => onSelected((type === 'Client' ? recommendation.isin : recommendation.client) ?? null, false)}
      onClick={() => onSelected((type === 'Client' ? recommendation.isin : recommendation.client) ?? null, true)}
      style={{
        border: selected === recommendation.isin || selected === recommendation.client ? '1px dashed green' : undefined,
        fontSize: type === 'Bond' ? 'x-small' : 'small'
      }}
    >
      <div className='recommandationAxe'>
        {
          type === 'Client' && recommendation.isAxe &&
          <GiSharpAxe />
        }
      </div>
      {
        type === 'Client'
          ? <div style={{ width: 100 }}>{recommendation.isin}</div>
          : <div style={{ width: 100 }}>{recommendation.client}</div>
      }
      <div style={{ width: 50 }}>{recommendation.side}</div>
      <div style={{ width: 70 }} ><div style={{ backgroundColor: getColour(recommendation.score), color: 'white', width: 50 }}>{recommendation.score}</div></div>
      <div>{recommendation.reason}</div>
    </div>
  )
}

export default Recommendation
