import React from 'react';
import {Composition} from 'remotion';
import {GardeningVideo} from './GardeningVideo';
import {VIDEO_CONFIG} from './videoConfig';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id={VIDEO_CONFIG.id}
      component={GardeningVideo}
      width={VIDEO_CONFIG.width}
      height={VIDEO_CONFIG.height}
      fps={VIDEO_CONFIG.fps}
      durationInFrames={VIDEO_CONFIG.durationInFrames}
    />
  );
};
