import useWeb3, { Web3HookContext } from './helpers/useWeb3'
import { ChakraProvider, Box } from '@chakra-ui/react'
import DoubleOrNothing from './sections/DoubleOrNothing'
import Header from './sections/Header'

function App() {
  const web3hook = useWeb3()
  return (
    <ChakraProvider>
      <Web3HookContext.Provider value={web3hook}>
        <Box padding="5">
          <Header />
          <DoubleOrNothing />
        </Box>
      </Web3HookContext.Provider>
    </ChakraProvider>
  )
}

export default App
