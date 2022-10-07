import { Box, Heading, Highlight, Link, Text } from "@chakra-ui/react";
import WalletConnection from "./WalletConnection";

const Header: React.FC = () => {
  return (
    <>
      <Box paddingX="3" paddingY="2" borderBottom="2px" borderColor="purple">
        <Heading color="purple.900">Double or nothing!</Heading>
        <Heading size="md" color="purple">
          Smart contract
        </Heading>
        <WalletConnection />
      </Box>
      <Box marginTop="2" paddingX="3" paddingTop="2">
        <Highlight
          query={["0.01 ETH"]}
          styles={{ px: "1", py: "1", bg: "orange.100" }}
        >
          By sending 0.01 ETH to this Smart Contract, you have a 50% chance of
          doubling your coins and a 50% chance of getting nothing. Money supply
          is guaranteed because the other half of the prize is provided by
          another address competing for the odds against you.
        </Highlight>
        <Text marginTop="2">Will you risk it? 🤔</Text>
        <Text marginTop="2">
          See smart contract{" "}
          <Link href="#" color="purple.400">
            source code
          </Link>{" "}
          and{" "}
          <Link href="#" color="purple.400">
            deployment transaction
          </Link>
          .
        </Text>
      </Box>
    </>
  );
};

export default Header;
