import { Box, BoxProps } from '@chakra-ui/react'

const Section: React.FC<BoxProps> = (props) => {
  return (
    <Box
      rounded="base"
      border="1px"
      borderColor="gray.200"
      padding="3"
      {...props}
    />
  )
}

export default Section
