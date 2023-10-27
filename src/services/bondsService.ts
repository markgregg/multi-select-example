import Bond from "../types/Bond"

let bondCache: Bond[] = []
export const fetchBondsAndCache = (): Promise<Bond[]> => {
  if (bondCache.length > 0) {
    new Promise<Bond[]>(resolve => resolve(bondCache))
  }

  return getData<Bond[]>('https://multi-select-example.jollyhill-6d8c9464.westeurope.azurecontainerapps.io/api/bonds')
    .then(bonds => {
      bondCache = bonds
      return bonds
    })
}

const getData = <T>(url: string): Promise<T> => {
  return fetch(url, {
    method: 'GET'
  })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error(response.statusText)
      }
    })
}