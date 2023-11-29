import { MutliSelectStyles } from 'multi-source-select'

export type Theme = 'none' | 'metallic'
export const themes: Theme[] = [
  'none',
  'metallic'
]

export const metallicTheme: MutliSelectStyles = {
  mutliSelect: {
    borderBottom: '#0F0F0F 1px solid',
    borderRight: '#0F0F0F 1px solid',
    borderTop: 'lightgray 1px solid',
    borderLeft: 'lightgray 1px solid',
    background: 'rgb(16, 16, 24)',
    color: 'lightgray'
  },
  input: {
    backgroundColor: 'transparent',
    color: 'lightgray'
  },
  optionsList: {
    borderBottom: '#0F0F0F 1px solid',
    borderRight: '#0F0F0F 1px solid',
    borderTop: 'lightgray 1px solid',
    borderLeft: 'lightgray 1px solid',
    background: 'rgb(16, 16, 24)',
    color: 'lightgray'
  },
  activeOption: {
    background: '	#1560BD',
  },
  optionCategory: {
    background: '#0F0F0F'
  },
  matcherView: {
    backgroundColor: '#666666',
    borderRadius: '4px'
  },
  matcherToolTip: {
    borderBottom: '#0F0F0F 1px solid',
    borderRight: '#0F0F0F 1px solid',
    borderTop: 'lightgray 1px solid',
    borderLeft: 'lightgray 1px solid',
    background: 'rgb(16, 16, 24)',
  },
  errorMessage: {
    borderBottom: '#0F0F0F 1px solid',
    borderRight: '#0F0F0F 1px solid',
    borderTop: 'lightgray 1px solid',
    borderLeft: 'lightgray 1px solid',
  }
}

export const bodyStyleFromTheme = (theme: string): React.CSSProperties | undefined => {
  if (theme === 'metallic') {
    return {
      background: 'rgb(16, 16, 24)',
      color: 'lightgray'
    }
    return undefined
  }
}

export const styleFromTheme = (theme: string): MutliSelectStyles | undefined => {
  if (theme === 'metallic') {
    return metallicTheme
  }
  return undefined
}

export const getAgGridStyle = (theme: string): any => {
  if (theme === 'metallic') {
    return {
      '--ag-foreground-color': 'lightgray',
      '--ag-background-color': 'rgb(16, 16, 24)',
      '--ag-header-foreground-color': 'lightgray',
      '--ag-header-background-color': 'rgb(16, 16, 24)',
      '--ag-odd-row-background-color': 'rgb(32, 32, 32)',
      '--ag-header-column-resize-handle-color': '#666666'
    }
  }
  return {}
}

export const styleDivFromTheme = (theme: string): any => {
  if (theme === 'metallic') {
    return {
      background: 'rgb(16, 16, 24)',
      color: 'lightgray'
    }
  }
  return {}
}

export const selectionClassFromTheme = (theme: string): any => {
  if (theme === 'metallic') {
    return {
      background: 'rgb(16, 16, 24)',
      color: 'lightgray'
    }
  }
  return {}
}

export const styleHeaderFromTheme = (theme: string): any => {
  if (theme === 'metallic') {
    return {
      backgroundColor: 'rgb(16, 16, 24)',
      color: 'lightgray'
    }
  }
  return {}
}