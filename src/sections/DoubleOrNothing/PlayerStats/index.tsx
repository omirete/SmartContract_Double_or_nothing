import { Box, Stack } from '@chakra-ui/react'
import { useContext } from 'react'
import { ContractDataContext } from '../useContractData'
import KPI from './KPI'

const PlayerStats: React.FC = () => {
  const { contractData } = useContext(ContractDataContext)
  if (contractData.player_stats) {
    return (
      <Box width="full">
        <Stack direction="row">
          <KPI
            value={contractData.player_stats.times_participated}
            name="# participations"
            width="full"
            rounded="base"
            bg="gray.100"
          />
          <KPI
            value={contractData.player_stats.times_won}
            name="# wins"
            width="full"
            rounded="base"
            bg="gray.100"
          />
          <KPI
            value={contractData.player_stats.pending_claims}
            name="Pending claims (ETH)"
            width="full"
            rounded="base"
            bg="gray.100"
          />
          <KPI
            value={contractData.player_stats.total_earnings}
            name="Total earnings (ETH)"
            width="full"
            rounded="base"
            bg="gray.100"
          />
        </Stack>
      </Box>
    )
  } else {
    return <></>
  }
}

export default PlayerStats
