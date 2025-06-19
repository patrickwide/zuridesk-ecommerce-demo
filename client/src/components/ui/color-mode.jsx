import { IconButton, Skeleton, Box } from '@chakra-ui/react'
import { useColorMode as useChakraColorMode } from '@chakra-ui/react'
import * as React from 'react'
import { LuMoon, LuSun } from 'react-icons/lu'

export function ColorModeProvider({ children }) {
  return children;
}

export function useColorMode() {
  return useChakraColorMode();
}

export function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode();
  return colorMode === 'dark' ? dark : light;
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  return colorMode === 'dark' ? <LuMoon /> : <LuSun />;
}

export const ColorModeButton = React.forwardRef(
  function ColorModeButton(props, ref) {
    const { toggleColorMode } = useColorMode();
    return (
      <Box>
        <IconButton
          onClick={toggleColorMode}
          variant='ghost'
          aria-label='Toggle color mode'
          size='sm'
          ref={ref}
          {...props}
          sx={{
            '& svg': {
              width: '1.25rem',
              height: '1.25rem',
            },
          }}
        >
          <ColorModeIcon />
        </IconButton>
      </Box>
    );
  }
);

export const LightMode = React.forwardRef(function LightMode(props, ref) {
  return (
    <Box
      color='gray.800'
      display='contents'
      className='chakra-theme light'
      data-color-palette='gray'
      data-color-scheme='light'
      ref={ref}
      {...props}
    />
  );
});

export const DarkMode = React.forwardRef(function DarkMode(props, ref) {
  return (
    <Box
      color='gray.200'
      display='contents'
      className='chakra-theme dark'
      data-color-palette='gray'
      data-color-scheme='dark'
      ref={ref}
      {...props}
    />
  );
});
