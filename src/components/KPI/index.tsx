import { CenterProps, Center, Heading, Text, Stack } from "@chakra-ui/react";

export interface KPIProps extends CenterProps {
  value: string | number;
  name: string;
}

const KPI: React.FC<KPIProps> = ({ value, name, ...props }) => {
  return (
    <Center {...props}>
      <Stack paddingY="1">
        <Heading size="lg" textAlign="center">
          {value}
        </Heading>
        <Text align="center">{name}</Text>
      </Stack>
    </Center>
  );
};

export default KPI;
