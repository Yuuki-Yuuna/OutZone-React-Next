import { createContext } from 'react'
import { Appearance } from '~/type'

export interface ThemeChangeContextType {
  appearance: Appearance
  changeAppearance: () => void
}
export const ThemeChangeContext = createContext<ThemeChangeContextType>({
  appearance: 'light',
  changeAppearance: () => {}
})
