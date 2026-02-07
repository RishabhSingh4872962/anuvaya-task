import { TextStyle } from 'react-native'
import { colors } from './colors'

type Font = TextStyle

export const typography: Record<string, Font> = {
  message: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22.5, // 150% of 15
    color: colors.textPrimary,
  },

  timestamp: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 16,
    color: colors.timestamp,
  },
}