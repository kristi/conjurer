import { Block } from "@/modules/common/types/Block";
import { PatternParams } from "@/modules/common/types/PatternParams";
import { FRAMES_PER_SECOND } from "@/modules/common/utils/time";
import GradientPattern from "@/modules/patterns/GradientPattern";
import SunCycle from "@/modules/patterns/SunCycle";
import { makeAutoObservable, configure, runInAction } from "mobx";
import { Vector2 } from "three";

// Enforce MobX strict mode, which can make many noisy console warnings, but can help use learn MobX better.
// Feel free to comment out the following if you want to silence the console messages.

configure({
  enforceActions: "always",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
});

export default class Store {
  initialized = false;
  blocks: Block<PatternParams>[] = [];

  // TODO: set up a Timer class
  globalTime = 0;

  // TODO: make this more efficient
  get currentBlock() {
    return this.blocks.find(
      (b) =>
        b.startTime <= this.globalTime &&
        this.globalTime < b.startTime + b.duration,
    );
  }

  constructor() {
    makeAutoObservable(this);

    runInAction(() => this.initialize());
  }

  initialize = () => {
    // Temporary hard-coded blocks
    this.blocks.push(
      new Block(SunCycle()),
      new Block(
        GradientPattern({
          u_blah: {
            name: "Blah",
            value: 0,
          },
          u_a: {
            name: "A",
            value: new Vector2(),
          },
        }),
      ),
    );
    this.blocks[0].setTiming(0, 7);
    this.blocks[1].setTiming(7, 3);
    this.initialized = true;
  };

  tick = () => {
    this.globalTime += 1 / FRAMES_PER_SECOND;
  };
}
