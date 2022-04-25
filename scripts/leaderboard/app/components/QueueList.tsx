import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Link,
  Tooltip,
  Text,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { BiMessageDots } from "react-icons/bi";
import { queue_status } from "@prisma/client";
import dayjs from "dayjs";

export const QueueList = ({
  queues,
}: {
  queues: {
    createdAt: string;
    status: queue_status;
    vrtUrl: string | null;
    duration: number | null;
    message: string | null;
    score: number | null;
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
              <Th isNumeric>Score</Th>
              <Th>VRT</Th>
            </Tr>
          </Thead>
          <Tbody>
            {queues.map(
              (
                { createdAt, status, vrtUrl, duration, score, message },
                index
              ) => (
                <Tr key={index}>
                  <Td>{dayjs(createdAt).format("MM/DD HH:mm")}</Td>
                  <Td>
                    <Stack direction={["column", "row"]}>
                      <Text
                        color={useColorModeValue(
                          `${statusColor(status)}.500`,
                          `${statusColor(status)}.600`
                        )}
                      >
                        {status}
                      </Text>
                      {message && (
                        <Tooltip label={message} fontSize="md">
                          <span>
                            <BiMessageDots size="1.4rem" />
                          </span>
                        </Tooltip>
                      )}
                    </Stack>
                  </Td>
                  <Td isNumeric>
                    {duration !== null ? `${duration.toLocaleString()} s` : "-"}
                  </Td>
                  <Td>{score !== null ? `${score} pt` : "-"}</Td>
                  <Td>
                    {vrtUrl?.startsWith("http") ? (
                      <Link href={vrtUrl} download color="teal.500">
                        download
                      </Link>
                    ) : null}
                  </Td>
                </Tr>
              )
            )}
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
