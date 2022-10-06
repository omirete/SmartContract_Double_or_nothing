import { Box, ListItem, Text, UnorderedList } from '@chakra-ui/react'
import { useContext } from 'react'
import { ContractDataContext } from '../useContractData'

const Participants: React.FC = () => {
  const { contractData } = useContext(ContractDataContext)
  return (
    <Box marginTop="2">
      {contractData.participants_awaiting.length > 0 && (
        <>
          <Text>
            The following address has already joined the bet and is currently
            waiting for an "opponent". If you join now, a winner will be
            automatically selected and thus you will immediately know if you
            have won or not.
          </Text>
          <UnorderedList>
            {contractData.participants_awaiting.map((p, i) => (
              <ListItem key={i}>{p}</ListItem>
            ))}
          </UnorderedList>
        </>
      )}
      {contractData.participants_awaiting.length === 0 && (
        <>
          <Text>
            There is currently no one else inscribed in the bet awaiting for an
            opponent. You will be the first :).
          </Text>
          <Text marginTop="2">
            After you join, the smart contract will wait until another address
            joins the bet and then choose a winner.
          </Text>
        </>
      )}
    </Box>
  )
}

export default Participants
