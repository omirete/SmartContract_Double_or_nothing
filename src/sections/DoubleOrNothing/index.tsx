import { Box } from '@chakra-ui/react'
import ContractCommands from './ContractCommands'
import Participants from './Participants'
import PlayerStats from './PlayerStats'
import PreviousWinners from './PreviousWinners'
import useContractData, { ContractDataContext } from './useContractData'

const DoubleOrNothing: React.FC = () => {
  const ContractDataHook = useContractData()
  return (
    <Box marginTop="3" paddingX="3">
      <ContractDataContext.Provider value={ContractDataHook}>
        <PlayerStats />
        <Participants />
        <ContractCommands />
        <PreviousWinners />
      </ContractDataContext.Provider>
    </Box>
  )
}

export default DoubleOrNothing
