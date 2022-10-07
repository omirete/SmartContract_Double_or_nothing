import {
  Box,
  Heading,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useContext } from "react";
import { ContractDataContext } from "../useContractData";

const PreviousWinners: React.FC = () => {
  const { contractData } = useContext(ContractDataContext);
  return (
    <Box marginTop="3">
      <Heading size="sm">Previous winners:</Heading>
      <TableContainer marginTop="3">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Block #</Th>
              <Th>Winner</Th>
              <Th>Transaction</Th>
            </Tr>
          </Thead>
          <Tbody>
            {contractData.winners_list.map((w) => (
              <Tr key={w.txHash}>
                <Td>{w.blockNr}</Td>
                <Td>
                  <Link
                    href={`https://etherscan.io/address/${w.address}`}
                    isExternal
                    color="teal.500"
                  >
                    {w.address}
                  </Link>
                </Td>
                <Td>
                  <Link
                    href={`https://etherscan.io/tx/${w.txHash}`}
                    isExternal
                    color="teal.500"
                  >
                    {w.txHash}
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PreviousWinners;
