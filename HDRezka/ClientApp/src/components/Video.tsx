import React, { useState, useEffect, useRef, useContext } from "react";
import useEventListener from '@use-it/event-listener';
import { MediaData } from "../store/types";
import ActionService from "../store/ActionService";
import { ContextApp } from "../store/reducer";
import Hls from "hls.js";

interface VideoProps {
    data: MediaData;
    streamUrl: string;
    startCountDownHandler?: (videoRef: React.RefObject<HTMLVideoElement>) => void;
    setVideoOverlayVisible?: (flag: boolean) => void;
    refreshLinks: () => void;
    children?: React.ReactNode;
}

const Video = ({ data, streamUrl, startCountDownHandler, setVideoOverlayVisible, refreshLinks, children }: VideoProps) => {

    console.log("Video rendered");

    const positionAutoSaveInterval: number = 30;

    const videoRef = useRef<HTMLVideoElement>(null);

    const { dispatch } = useContext(ContextApp);

    const [currentPositionUpdated, setCurrentPositionUpdated] = useState<boolean>(false);

    const [updateEnabled, setUpdateEnabled] = useState<boolean>(true);

    useEffect(() => {
        let hls: Hls | undefined;
  
        // Check for Media Source support
        if (Hls.isSupported()) {
          hls = initPlayer();
        }
  
        return () => {
          hls?.destroy();
        };
      },[streamUrl]);

    useEffect(() => {
        const interval = setInterval(() => {

            if (updateEnabled) {
                ActionService.updateMediaDataHandler(data, dispatch);
            }

        }, positionAutoSaveInterval * 1000);

        return () => {
            clearInterval(interval);
        };
    }, [data, dispatch, updateEnabled]);

    const initPlayer = (): Hls => {
        const newHls = new Hls({
            enableWorker: true,
            maxBufferLength: 30,
            lowLatencyMode: true,  
            autoStartLoad: true,
            debug: false,
        });
  
        if (videoRef.current != null) {
          newHls.attachMedia(videoRef.current);
        }
  
        newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
          newHls.loadSource(streamUrl);
          newHls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoRef.current?.play().catch(() => {              
              console.error(
                "Unable to autoplay prior to user interaction with the dom.",
              );
            });
          });
        });
  
        newHls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.MEDIA_ERROR:                
                console.error("fatal media error encountered, try to recover");
                newHls.recoverMediaError();
                break;
              case Hls.ErrorTypes.NETWORK_ERROR:                
                console.error("fatal network error encountered", data);
                break;
              default:
                // cannot recover
                newHls.destroy();
                break;
            }
          }
        });
  
        return newHls;
      };

    const setFullScreen = () => {
        if (videoRef.current && videoRef.current.webkitRequestFullScreen) {
            videoRef.current.webkitRequestFullScreen();
        } else if (videoRef.current && videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen();
        }
    }

    const refreshLinksHandler = () => {
        setUpdateEnabled(false);
        refreshLinks();
    }

    useEventListener('keydown', (event: React.KeyboardEvent) => {
        switch (event.which) {
            case 403:
                setFullScreen();
                break;

            case 404:
                refreshLinksHandler();
                break;

            default:
                break;
        }
    });


    const onCanPlayHandler = (e: React.SyntheticEvent) => {
        if (videoRef.current && !currentPositionUpdated) {
            videoRef.current.currentTime = data.media.currentTime;
            setCurrentPositionUpdated(true);
            setUpdateEnabled(true);
        }
    }

    const fullScreenHandler = (e: React.MouseEvent) => {
        setFullScreen();
        typeof setVideoOverlayVisible === "function" && setVideoOverlayVisible(false);
    }

    const onTimeUpdatedHandler = (e: React.SyntheticEvent) => {

        if (videoRef.current && currentPositionUpdated) {
            data.media.currentTime = videoRef.current.currentTime;
            typeof startCountDownHandler === "function" && startCountDownHandler(videoRef);
        }
    }

    const onErrorHandler = (e: React.SyntheticEvent) => {

        if (videoRef.current?.networkState === 3) {
            // refreshLinksHandler();
        }
    }

    return (<React.Fragment>
        <span className="video-buttons">
            <button onClick={fullScreenHandler}>Full screen (A)</button>&nbsp;<button onClick={refreshLinksHandler}>Refresh (B)</button>
        </span>        
        <div className="video-container">
        {Hls.isSupported() 
            ? 
            <video className="video" ref={videoRef} autoPlay onCanPlay={onCanPlayHandler} onTimeUpdate={onTimeUpdatedHandler} onError={onErrorHandler} controls />
            :
            <video className="video" ref={videoRef} autoPlay onCanPlay={onCanPlayHandler} onTimeUpdate={onTimeUpdatedHandler} onError={onErrorHandler} controls src={streamUrl}>
                <source src={streamUrl} type="video/mp4" />
            </video>}
            {children}
        </div>
    </React.Fragment>);
}

export default Video;
