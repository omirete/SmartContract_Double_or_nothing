import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
} from "@chakra-ui/react";
import { useContext } from "react";
import Section from "../../components/Section";
import { Web3HookContext } from "../../helpers/useWeb3";

const SendTransaction: React.FC = () => {
  const { sendTransaction } = useContext(Web3HookContext);
  return (
    <Section title="Send a transaction" className="mt-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const accountTo: string = (e.target as any).accountTo.value;
          const amount: number = parseFloat((e.target as any).amount.value);
          const unit: "eth" | "gwei" | "wei" = (e.target as any).unit.value;
          sendTransaction(accountTo, amount, unit);
        }}
      >
        <FormControl>
          <FormLabel>To address:</FormLabel>
          <Input
            name="accountTo"
            type="text"
            defaultValue="0x2dc234CF387A129Ce07Cb02618665b7F365d4214"
          />
          <FormHelperText>
            Enter the address to which you want to send coins.
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Amount to send:</FormLabel>
          <Stack direction="row">
            <NumberInput name="amount" step={0.000001} min={0}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>

            <Select name="unit" defaultValue="eth">
              <option value="eth">eth</option>
              <option value="gwei">gwei</option>
              <option value="wei">wei</option>
            </Select>
          </Stack>
          <FormHelperText>
            Enter how many coins you would like to send.
          </FormHelperText>
        </FormControl>
        <Button type="submit" className="mt-3">
          Enviar
        </Button>
      </form>
    </Section>
  );
};

export default SendTransaction;
