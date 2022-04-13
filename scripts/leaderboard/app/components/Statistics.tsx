import {
  Box,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode, useMemo } from "react";
import { BsSpeedometer } from "react-icons/bs";
import { BiMedal } from "react-icons/bi";
import { FaHandshake } from "react-icons/fa";
import { useTeamContext } from "~/components/contexts/UserAndTeam";

interface StatsCardProps {
  title: string;
  stat: ReactNode;
  icon: ReactNode;
}

function StatsCard(props: StatsCardProps) {
  const { title, stat, icon } = props;
  return (
    <Stat px={{ base: 2, md: 4 }} py={"5"} borderWidth={2} rounded={"lg"}>
      <Flex justifyContent={"space-between"}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={"medium"} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          my={"auto"}
          color={useColorModeValue("gray.800", "gray.200")}
          alignContent={"center"}
        >
          {icon}
        </Box>
      </Flex>
    </Stat>
  );
}

type Props = {
  scores: { id: string; data: { score: number }[] }[];
};

export const Statistics = ({ scores }: Props) => {
  const teamId = useTeamContext()?.id ?? "";
  const { score, rank } = useMemo(
    () => statistics(scores, teamId),
    [scores, teamId]
  );

  return (
    <Box pt={5}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        <StatsCard
          title={"Team"}
          stat={
            <Text fontSize="3xl" as="span" pr={2}>
              {useTeamContext()?.name}
            </Text>
          }
          icon={<FaHandshake size={"2.5em"} />}
        />
        <StatsCard
          title={"Score"}
          stat={
            <>
              <Text fontSize="3xl" as="span" pr={2}>
                {score ?? "-"}
              </Text>
              pt
            </>
          }
          icon={<BsSpeedometer size={"2.5em"} />}
        />
        <StatsCard
          title={"Ranking"}
          stat={
            <>
              <Text fontSize="3xl" as="span" pr={2}>
                {rank ?? "-"}
              </Text>
              {ordinalStr(rank)}
            </>
          }
          icon={<BiMedal size={"3em"} />}
        />
      </SimpleGrid>
    </Box>
  );
};

const ordinalStr = (num: number | null): string => {
  return `${num}`.endsWith("1")
    ? "st"
    : `${num}`.endsWith("2")
    ? "nd"
    : `${num}`.endsWith("3")
    ? "rd"
    : "th";
};

const statistics = (
  scores: Props["scores"],
  teamId: string
): { score: number; rank: number | null } => {
  if (!scores.find(({ id }) => id === teamId)) return { score: 0, rank: null };
  const sorted = scores
    .map(({ id, data }) => {
      const [{ score } = { score: 0 }] = data.slice(-1);
      return { id, score };
    })
    .sort(({ score: a }, { score: b }) => (a < b ? 1 : -1));
  const index = sorted.findIndex(({ id }) => id === teamId);
  if (index < 0) return { rank: null, score: 0 };
  return {
    rank: sorted[index].score > 0 ? index + 1 : null,
    score: sorted[index].score,
  };
};
