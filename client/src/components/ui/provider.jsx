'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'

// Extend the theme to include custom colors, fonts, etc
const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
      },
    }),
  },
  components: {
    Container: {
      baseStyle: {
        maxW: 'container.xl',
        px: { base: 4, md: 6 },
      },
    },
    Card: {
      baseStyle: (props) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          borderRadius: 'lg',
          boxShadow: 'base',
          p: 6,
        },
      }),
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
})

export function Provider({ children, ...props }) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeProvider {...props}>
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  )
}
