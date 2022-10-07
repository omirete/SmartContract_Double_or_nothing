import { Stack, Button } from "@chakra-ui/react";
import useContractCommands from "./useContractCommands";

const ContractCommands: React.FC = () => {
  const { handleJoin, handleClaimPrize } = useContractCommands();
  return (
    <Stack direction="row" marginTop="3">
      <Button colorScheme="purple" onClick={handleJoin}>
        I want double or nothing!
      </Button>
      <Button colorScheme="teal" onClick={handleClaimPrize}>
        Claim prize
      </Button>
    </Stack>
  );
};

export default ContractCommands;
