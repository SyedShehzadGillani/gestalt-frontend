import { useState } from "react";
import { Play, Pause, SkipForward } from "lucide-react";
import type { MediaItem } from "./media-types";

type Props = { item: MediaItem };

export function FileLBVideoPlayer({ item }: Props) {
  const [playing, setPlaying] = useState(false);

  if (!playing) {
    return (
      <div className="vb-video-poster" onClick={() => setPlaying(true)} role="button" tabIndex={0}>
        <div className="vb-video-play-ring">
          <Play size={36} />
        </div>
        <div className="vb-video-title">{item.name}</div>
        <div className="vb-video-hint">{item.duration ?? "0:00"} · Click to play</div>
      </div>
    );
  }

  return (
    <div className="vb-video-player">
      <div className="vb-video-frame">Video playing: {item.name}</div>
      <div className="vb-video-controls">
        <button
          type="button"
          className="vb-iconbtn"
          onClick={() => setPlaying(false)}
          aria-label="Pause"
        >
          <Pause size={16} />
        </button>
        <div className="vb-video-progress">
          <div className="vb-video-progress-fill" />
        </div>
        <span style={{ color: "var(--vb-t4)", fontSize: 9 }}>0:52 / {item.duration ?? "2:30"}</span>
        <button type="button" className="vb-iconbtn" aria-label="Next">
          <SkipForward size={14} />
        </button>
      </div>
    </div>
  );
}
