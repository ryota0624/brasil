export type RivaldoStoreJSON = {
  name: string,
  json: any[],
}


export interface Store {
  addChangeListener: (fn: (state: RivaldoStoreJSON[]) => void) => void
}