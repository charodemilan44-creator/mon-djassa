import { Composition } from "remotion";
import { Promo, PROMO_DURATION } from "./Promo";
import { Pub, PUB_DURATION } from "./pub/Pub";

export const RemotionRoot = () => (
  <>
    <Composition id="MonDjassaPromo" component={Promo} durationInFrames={PROMO_DURATION} fps={30} width={1080} height={1920} />
    <Composition id="MonDjassaPub60" component={Pub} durationInFrames={PUB_DURATION} fps={30} width={1080} height={1920} />
  </>
);
