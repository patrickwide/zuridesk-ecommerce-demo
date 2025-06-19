import { Box, Container } from "@chakra-ui/react"

const FormContainer = ({ children }) => {
  return (
    <Container maxW="container.sm" py={8}>
      <Box 
        p={8} 
        bg="white" 
        boxShadow="sm" 
        rounded="lg"
        border="1px"
        borderColor="gray.200"
      >
        {children}
      </Box>
    </Container>
  )
}

export default FormContainer