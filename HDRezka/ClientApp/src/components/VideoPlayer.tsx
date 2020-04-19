import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = (props: any) => {

    const playerRef = useRef<HTMLVideoElement>(null);

    const videoSrc = props.src;

    useEffect(() => {

        const player = videojs(playerRef.current, { controls: true, autoplay: true, muted: false }, () => {
            player.src(videoSrc);
        });

        return () => {
            player.dispose();
        };
    }, [videoSrc]);

    return (
        <div data-vjs-player>
            <video ref={playerRef} className="video-js vjs-16-9" playsInline />
        </div>
    );
};

export default VideoPlayer;