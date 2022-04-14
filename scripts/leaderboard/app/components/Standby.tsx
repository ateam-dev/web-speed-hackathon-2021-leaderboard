import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export const Standby = () => {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Box display="inline-block">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          rounded={"50px"}
          w={"55px"}
          h={"55px"}
          textAlign="center"
        >
          <Text fontSize="6xl">🔥</Text>
        </Flex>
      </Box>
      <Heading
        as="h2"
        size="xl"
        bgGradient="linear(to-r, orange.200, red.500)"
        backgroundClip="text"
        mt={6}
        mb={2}
      >
        COMING SOON!!
      </Heading>
      <Text color={"gray.500"} fontSize="xl">
        Thu Apr 28 2022
      </Text>
    </Box>
  );
};
