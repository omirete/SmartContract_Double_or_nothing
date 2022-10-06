import { Box, Button, Text } from '@chakra-ui/react'
import { useContext } from 'react'
import { Web3HookContext } from '../../helpers/useWeb3'

const WalletConnection: React.FC = () => {
  const { account, chain, connect } = useContext(Web3HookContext)
  return (
    <Box fontSize="sm" color="gray.600">
      {!account && (
        <>
          <Text>
            If you would like to play, please connect your wallet first.
          </Text>
          <Button onClick={connect} colorScheme="cyan" marginTop="3">
            Connect to web3
          </Button>
        </>
      )}
      {account && (
        <>
          <Text>Connected to web3 🟢</Text>
          <Text>Chain: {chain ? chain.name : '-'}</Text>
          <Text>Address: {account}</Text>
        </>
      )}
    </Box>
  )
}

export default WalletConnection
