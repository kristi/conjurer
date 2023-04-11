import { observer } from "mobx-react-lite";
import { Box, Grid, GridItem, HStack, Heading, VStack } from "@chakra-ui/react";
import Ruler from "@/modules/components/Ruler";
import { useStore } from "@/modules/common/types/StoreContext";
import { action } from "mobx";
import Layer from "@/modules/components/Layer";
import TimeMarker from "@/modules/components/TimeMarker";
import TimerReadout from "@/modules/components/TimerReadout";
import TimerControls from "@/modules/components/TimerControls";
import { useRef } from "react";
import Controls from "@/modules/components/Controls";

export default observer(function Timeline() {
  const { timer, uiStore } = useStore();
  const rulerBoxRef = useRef<HTMLDivElement>(null);

  return (
    <Grid
      templateAreas={`"timerControls  controls"
                      "timer          ruler"
                      "layersHeader   layers"`}
      gridTemplateColumns="150px 1fr"
      fontWeight="bold"
    >
      <GridItem area="timerControls">
        <HStack my={2} width="100%" justify="center">
          <TimerControls />
        </HStack>
      </GridItem>
      <GridItem area="controls">
        <HStack my={2} width="100%">
          <Controls />
        </HStack>
      </GridItem>
      <GridItem area="timer">
        <Box height={9} bgColor="gray.500">
          <TimerReadout />
        </Box>
      </GridItem>
      <GridItem area="ruler">
        <Box
          ref={rulerBoxRef}
          position="relative"
          height={9}
          bgColor="gray.500"
          onClick={action((e) => {
            if (rulerBoxRef.current)
              timer.globalTime = uiStore.xToTime(
                e.clientX - rulerBoxRef.current.getBoundingClientRect().x,
              );
          })}
        >
          <Ruler />
          <TimeMarker />
        </Box>
      </GridItem>
      <GridItem area="layersHeader">
        <VStack height="100%" justify="center">
          <Heading userSelect="none" size="md">
            Layer
          </Heading>
        </VStack>
      </GridItem>
      <GridItem area="layers">
        <Layer />
      </GridItem>
    </Grid>
  );
});
