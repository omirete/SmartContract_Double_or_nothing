import { Box, Stack } from "@chakra-ui/react";
import { useContext } from "react";
import KPI from "../../../components/KPI";
import { ContractDataContext } from "../useContractData";

const PlayerStats: React.FC = () => {
  const { contractData } = useContext(ContractDataContext);
  if (contractData.player_stats) {
    return (
      <Box width="full">
        <Stack direction="row" gap="2">
          <KPI
            value={contractData.player_stats.times_participated}
            name="# participations"
            width="full"
            rounded="base"
            border="1px"
            borderColor="gray.100"
            shadow="sm"
            textColor="gray.600"
          />
          <KPI
            value={contractData.player_stats.times_won}
            name="# wins"
            width="full"
            rounded="base"
            border="1px"
            borderColor="gray.100"
            shadow="sm"
            textColor="gray.600"
          />
          <KPI
            value={contractData.player_stats.pending_claims}
            name="Pending claims (ETH)"
            width="full"
            rounded="base"
            border="1px"
            borderColor="gray.100"
            shadow="sm"
            textColor="gray.600"
          />
          <KPI
            value={contractData.player_stats.total_earnings}
            name="Total earnings (ETH)"
            width="full"
            rounded="base"
            border="1px"
            borderColor="gray.100"
            shadow="sm"
            textColor="gray.600"
          />
        </Stack>
      </Box>
    );
  } else {
    return <></>;
  }
};

export default PlayerStats;
