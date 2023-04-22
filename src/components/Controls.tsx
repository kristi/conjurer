import { useEffect } from "react";
import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { observer } from "mobx-react-lite";
import { IconButton, Select } from "@chakra-ui/react";
import { RiZoomInLine, RiZoomOutLine } from "react-icons/ri";
import { BsSoundwave, BsGearFill } from "react-icons/bs";
import { AiOutlineLineChart } from "react-icons/ai";
import { FaFolderOpen } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { useStore } from "@/src/types/StoreContext";
import { action, runInAction } from "mobx";
import {
  AUDIO_BUCKET_NAME,
  AUDIO_BUCKET_PREFIX,
  AUDIO_BUCKET_REGION,
} from "@/src/utils/audio";

export default observer(function Controls() {
  const store = useStore();
  const { uiStore, audioStore } = store;

  useEffect(() => {
    if (audioStore.audioInitialized) return;
    runInAction(() => {
      audioStore.audioInitialized = true;
    });

    // get list of objects from s3 bucket using aws sdk
    const s3 = new S3Client({
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: "us-east-2" },
        identityPoolId: "us-east-2:343f9a70-6bf5-40f3-b21d-1376f65bb4be",
      }),
      region: AUDIO_BUCKET_REGION,
    });
    const listObjectsCommand = new ListObjectsCommand({
      Bucket: AUDIO_BUCKET_NAME,
      Prefix: AUDIO_BUCKET_PREFIX,
    });
    s3.send(listObjectsCommand).then(
      action((data) => {
        data.Contents?.forEach((object) => {
          const audioFile = object.Key?.split("/")[1];
          if (audioFile) audioStore.availableAudioFiles.push(audioFile);
        });
      })
    );
  }, [audioStore]);

  return (
    <>
      <IconButton
        aria-label="Zoom in"
        height={6}
        icon={<RiZoomInLine size={17} />}
        onClick={action(() => uiStore.zoomIn())}
      />
      <IconButton
        aria-label="Zoom out"
        height={6}
        icon={<RiZoomOutLine size={17} />}
        onClick={action(() => uiStore.zoomOut())}
      />
      <IconButton
        aria-label="Toggle waveform style"
        height={6}
        icon={<BsSoundwave size={17} />}
        onClick={action(() => uiStore.toggleWavesurfer())}
      />
      <IconButton
        aria-label="Toggle performance"
        height={6}
        icon={<AiOutlineLineChart size={17} />}
        onClick={action(() => uiStore.togglePerformance())}
      />
      <IconButton
        aria-label="Settings"
        height={6}
        icon={<BsGearFill size={17} />}
        onClick={action(() => {
          // TODO
        })}
      />
      <Select
        size="xs"
        width={60}
        value={audioStore.selectedAudioFile}
        onChange={action((e) => {
          audioStore.selectedAudioFile = e.target.value;
        })}
      >
        {audioStore.availableAudioFiles.map((audioFile) => (
          <option key={audioFile} value={audioFile}>
            {audioFile}
          </option>
        ))}
      </Select>
      <IconButton
        aria-label="Save"
        height={6}
        icon={<FiSave size={17} />}
        onClick={() => store.saveToLocalStorage("arrangement")}
      />
      <IconButton
        aria-label="Open"
        height={6}
        icon={<FaFolderOpen size={17} />}
        onClick={store.loadFromLocalStorage}
      />
    </>
  );
});
