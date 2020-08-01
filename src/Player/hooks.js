import TrackPlayer, {
  useTrackPlayerEvents,
  TrackPlayerEvents,
  STATE_PLAYING,
} from "react-native-track-player";
import { useEffect, useCallback, useState, useContext } from "react";
import { addToRecentlyPlayed } from "../RecentlyPlayed/utils";
import { SelectedChannelContext, PlayerStateContext } from "../App";

async function setupPlayer() {
  await TrackPlayer.setupPlayer({});
  await TrackPlayer.updateOptions({
    capabilities: [TrackPlayer.CAPABILITY_PLAY, TrackPlayer.CAPABILITY_STOP],
    compactCapabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_STOP,
    ],
  });
}

export function usePlayerSetup() {
  useEffect(() => {
    setupPlayer();
    return () => {
      TrackPlayer.destroy();
    };
  }, []);
}

async function play(channel) {
  const {
    title,
    $: { id },
    xlimage,
    description,
    genre,
  } = channel;
  try {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack && currentTrack.id !== id) {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
    }
    await TrackPlayer.add({
      id,
      url: `https://ice5.somafm.com/${id}-128-mp3`,
      title: title[0],
      artwork: xlimage[0],
      artist: description[0],
      genre: genre[0],
    });

    await TrackPlayer.play();
    await addToRecentlyPlayed(channel);
  } catch (err) {
    console.log(err);
  }
}

async function stop() {
  await TrackPlayer.stop();
}

export function usePlayerControls(selectedChannel, callback) {
  const handlePlay = useCallback(() => {
    if (selectedChannel) {
      play(selectedChannel).then(() => callback(selectedChannel));
    }
  }, [selectedChannel]);

  const handleStop = useCallback(() => {
    stop();
  }, []);

  return [handlePlay, handleStop];
}

const events = [
  TrackPlayerEvents.PLAYBACK_STATE,
  TrackPlayerEvents.PLAYBACK_ERROR,
];

export function usePlayerState() {
  const [playerState, setPlayerState] = useState(0);

  useTrackPlayerEvents(events, (event) => {
    if (event.type === TrackPlayerEvents.PLAYBACK_ERROR) {
      console.warn("An error occurred while playing the current track.");
    }
    if (event.type === TrackPlayerEvents.PLAYBACK_STATE) {
      setPlayerState(event.state);
    }
  });
  return playerState;
}

export function useCurrentPlayingChannel() {
  const [selectedChannel] = useContext(SelectedChannelContext);
  const state = useContext(PlayerStateContext);
  return selectedChannel && state === STATE_PLAYING && selectedChannel.$.id;
}
