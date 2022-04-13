import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { queue_status } from "@prisma/client";

export const QueueList = ({
  queues,
}: {
  queues: {
    createdAt: string;
    status: queue_status;
    duration: number | null;
  }[];
}) => {
  return (
    <Box w="full">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Registered</Th>
              <Th>Status</Th>
              <Th isNumeric>Duration</Th>
            </Tr>
          </Thead>
          <Tbody>
            {queues.map(({ createdAt, status, duration }, index) => (
              <Tr key={index}>
                <Td>{createdAt}</Td>
                <Td
                  color={useColorModeValue(
                    `${statusColor(status)}.500`,
                    `${statusColor(status)}.600`
                  )}
                >
                  {status}
                </Td>
                <Td isNumeric>
                  {duration !== null ? `${duration.toLocaleString()} s` : "-"}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const statusColor = (status: queue_status) => {
  if (status === "WAITING") return "gray";
  if (status === "RUNNING") return "yellow";
  if (status === "DONE") return "green";
  return "red";
};
