import { Box, Heading, Text } from "@chakra-ui/react";
import { PrimaryButton } from "~/components/atoms/Button";

export const StatusPage = ({
  status,
  statusText,
}: {
  status: number;
  statusText: string;
}) => {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, green.400, green.600)"
        backgroundClip="text"
      >
        {status}
      </Heading>
      <Text fontSize="xl" color={"gray.500"} mt={3} mb={2}>
        {statusText}
      </Text>
      <Text color={"gray.500"} mb={6}>
        Please inform the management team of any unexpected errors.
      </Text>

      <a href="/dashboard">
        <PrimaryButton>Go to Dashboard</PrimaryButton>
      </a>
    </Box>
  );
};
