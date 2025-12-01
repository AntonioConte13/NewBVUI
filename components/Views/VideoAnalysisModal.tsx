
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Play, Pause, PenTool, Circle, ArrowRight, Eraser, 
  Mic, Maximize2, MessageSquare, Send, FastForward, Rewind, 
  Video as VideoIcon, ChevronLeft, MoreHorizontal, ImagePlus, 
  Settings, Download, Trash2, StopCircle, Edit3, Square, AlertTriangle
} from 'lucide-react';
import { VideoSubmission, SquadMember, Annotation } from '../../types';

interface VideoAnalysisModalProps {
  video: VideoSubmission;
  player: SquadMember;
  onClose: () => void;
}

// Mock Comparison Videos
const REF_VIDEOS = [
  { id: 'ref1', title: 'Pro Model: Hip Separation', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
  { id: 'ref2', title: 'Past Session: May 12', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' }
];

// Helper for "object-fit: contain" math to render video on canvas correctly
const getContainRect = (srcW: number, srcH: number, targetW: number, targetH: number, offsetX = 0) => {
  if (!srcW || !srcH) return { x: offsetX, y: 0, w: targetW, h: targetH };
  const srcRatio = srcW / srcH;
  const targetRatio = targetW / targetH;
  
  let w, h, x, y;
  
  if (targetRatio > srcRatio) {
      // Target is wider than source: limit by height
      h = targetH;
      w = srcW * (targetH / srcH);
      y = 0;
      x = (targetW - w) / 2;
  } else {
      // Target is taller/narrower: limit by width
      w = targetW;
      h = srcH * (targetW / srcW);
      x = 0;
      y = (targetH - h) / 2;
  }
  
  return { x: x + offsetX, y, w, h };
};

export const VideoAnalysisModal: React.FC<VideoAnalysisModalProps> = ({ video, player, onClose }) => {
  // --- Video State ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const compareVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  
  // --- Analysis State ---
  const [compareMode, setCompareMode] = useState(false);
  const [selectedRefVideo, setSelectedRefVideo] = useState(REF_VIDEOS[0]);
  const [showTools, setShowTools] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // --- Recording State (Screen + Mic) ---
  const [isRecording, setIsRecording] = useState(false);
  const [isCanvasCompositing, setIsCanvasCompositing] = useState(false); // Fallback mode
  const [recordTime, setRecordTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // --- Drawing State ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [drawingMode, setDrawingMode] = useState<'none' | 'line' | 'arrow' | 'circle' | 'free'>('free');
  const [strokeColor, setStrokeColor] = useState('#ef4444'); // Default Red
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{x:number, y:number}[]>([]);

  // --- Chat/Notes State ---
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'Coach', text: 'Watch your front foot plant here. You\'re opening up too early.', time: '0:04' }
  ]);

  // Comparison Options
  const comparisonOptions = [
      ...REF_VIDEOS,
      ...(player.videos?.filter(v => v.id !== video.id).map(v => ({
          id: v.id,
          title: `User: ${v.title}`,
          url: v.url
      })) || [])
  ];

  // --- Handlers: Video ---

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        compareVideoRef.current?.pause();
      } else {
        videoRef.current.play();
        compareVideoRef.current?.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      if (compareVideoRef.current) compareVideoRef.current.currentTime = time;
    }
  };

  const changeSpeed = () => {
    const newSpeed = playbackSpeed === 1.0 ? 0.5 : playbackSpeed === 0.5 ? 0.25 : 1.0;
    setPlaybackSpeed(newSpeed);
    if (videoRef.current) videoRef.current.playbackRate = newSpeed;
    if (compareVideoRef.current) compareVideoRef.current.playbackRate = newSpeed;
  };

  // --- Handlers: Recording ---

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => setRecordTime(t => t + 1), 1000);
    } else {
      setRecordTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecord = async () => {
    if (isRecording) {
      // Stop Recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      setIsCanvasCompositing(false);
    } else {
      // Start Recording
      try {
        let finalStream: MediaStream;

        // Strategy A: Native Screen Sharing (Desktop)
        // We wrap this in a try/catch block to handle mobile devices where getDisplayMedia is missing
        try {
            if (!navigator.mediaDevices?.getDisplayMedia) {
                throw new Error("getDisplayMedia not supported");
            }
            
            const displayStream = await navigator.mediaDevices.getDisplayMedia({ 
                video: { width: { ideal: 1920 }, height: { ideal: 1080 } }, 
                audio: false 
            });
            const audioStream = await navigator.mediaDevices.getUserMedia({ 
                audio: { echoCancellation: true, noiseSuppression: true } 
            });
            
            finalStream = new MediaStream([
                ...displayStream.getVideoTracks(),
                ...audioStream.getAudioTracks()
            ]);
            
        } catch (displayError) {
            console.warn("Screen share unavailable, falling back to Canvas Composition.", displayError);
            
            // Strategy B: Canvas Composition (Mobile Fallback)
            // 1. Get Microphone
            const audioStream = await navigator.mediaDevices.getUserMedia({ 
                audio: { echoCancellation: true, noiseSuppression: true } 
            });

            // 2. Enable Composition Mode (Starts Render Loop)
            setIsCanvasCompositing(true);
            
            // 3. Capture Stream from Canvas
            if (!canvasRef.current) throw new Error("Canvas not initialized");
            
            // Note: captureStream might require 'any' cast in some TS configs, usually standard now.
            const canvasStream = (canvasRef.current as any).captureStream(30); // 30 FPS

            finalStream = new MediaStream([
                ...canvasStream.getVideoTracks(),
                ...audioStream.getAudioTracks()
            ]);
        }

        // Setup Recorder
        const recorder = new MediaRecorder(finalStream, { mimeType: 'video/webm' });
        mediaRecorderRef.current = recorder;
        recordedChunks.current = [];

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.current.push(event.data);
            }
        };

        recorder.onstop = () => {
            finalStream.getTracks().forEach(track => track.stop());
            const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `Analysis-${player.name}-${Date.now()}.webm`;
            a.click();
            URL.revokeObjectURL(url);
            setIsCanvasCompositing(false);
        };

        // Handle stream stop externally (e.g. user clicks "Stop Sharing" browser UI)
        finalStream.getVideoTracks()[0].onended = () => {
             if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                 mediaRecorderRef.current.stop();
                 setIsRecording(false);
                 setIsCanvasCompositing(false);
             }
        };

        recorder.start();
        setIsRecording(true);

      } catch (err) {
        console.error("Recording init failed", err);
        setPermissionDenied(true);
        setIsCanvasCompositing(false);
        setIsRecording(false);
      }
    }
  };

  // --- Handlers: Rendering / Drawing ---

  // Main Render Function
  const renderCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // 1. Background / Clear
      if (isCanvasCompositing) {
          // In fallback mode, we must draw the background and videos manually
          ctx.fillStyle = '#111827'; // Match bg-gray-900
          ctx.fillRect(0, 0, width, height);
      } else {
          // In normal mode, canvas is transparent overlay
          ctx.clearRect(0, 0, width, height);
      }

      // 2. Draw Videos (Only needed in fallback composition mode)
      if (isCanvasCompositing) {
          if (compareMode) {
              // Split Screen
              if (videoRef.current) {
                  const rect = getContainRect(videoRef.current.videoWidth, videoRef.current.videoHeight, width / 2, height, 0);
                  ctx.drawImage(videoRef.current, rect.x, rect.y, rect.w, rect.h);
              }
              if (compareVideoRef.current) {
                  const rect = getContainRect(compareVideoRef.current.videoWidth, compareVideoRef.current.videoHeight, width / 2, height, width / 2);
                  ctx.drawImage(compareVideoRef.current, rect.x, rect.y, rect.w, rect.h);
              }
              // Draw divider
              ctx.beginPath();
              ctx.moveTo(width / 2, 0);
              ctx.lineTo(width / 2, height);
              ctx.strokeStyle = 'rgba(255,255,255,0.1)';
              ctx.lineWidth = 1;
              ctx.stroke();
          } else {
              // Single Screen
              if (videoRef.current) {
                  const rect = getContainRect(videoRef.current.videoWidth, videoRef.current.videoHeight, width, height, 0);
                  ctx.drawImage(videoRef.current, rect.x, rect.y, rect.w, rect.h);
              }
          }
      }

      // 3. Draw Annotations
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 4;

      annotations.forEach(ann => {
          ctx.strokeStyle = ann.color;
          drawShape(ctx, ann.type, ann.points);
      });

      // 4. Draw Current Path (Active Drawing)
      if (isDrawing && currentPath.length > 0) {
          ctx.strokeStyle = strokeColor;
          drawShape(ctx, drawingMode, currentPath);
      }
  };

  const drawShape = (ctx: CanvasRenderingContext2D, type: string, points: {x:number, y:number}[]) => {
      if (points.length < 2 && type !== 'circle') return;
      
      ctx.beginPath();
      if (type === 'free') {
          ctx.moveTo(points[0].x, points[0].y);
          for(let i=1; i<points.length; i++) ctx.lineTo(points[i].x, points[i].y);
          ctx.stroke();
      } else if (type === 'line') {
          ctx.moveTo(points[0].x, points[0].y);
          const end = points[points.length-1];
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
      } else if (type === 'arrow') {
          const start = points[0];
          const end = points[points.length - 1];
          const headLen = 20;
          const angle = Math.atan2(end.y - start.y, end.x - start.x);
          
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(end.x, end.y);
          ctx.lineTo(end.x - headLen * Math.cos(angle - Math.PI / 6), end.y - headLen * Math.sin(angle - Math.PI / 6));
          ctx.lineTo(end.x - headLen * Math.cos(angle + Math.PI / 6), end.y - headLen * Math.sin(angle + Math.PI / 6));
          ctx.lineTo(end.x, end.y);
          ctx.fillStyle = ctx.strokeStyle;
          ctx.fill();
      } else if (type === 'circle') {
          const start = points[0];
          const end = points[points.length - 1];
          const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
          ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
          ctx.stroke();
      }
  };

  // Render Loop Effect
  useEffect(() => {
    // If compositing (recording), we need a continuous loop to capture video frames
    if (isCanvasCompositing) {
        const loop = () => {
            renderCanvas();
            animationFrameRef.current = requestAnimationFrame(loop);
        };
        loop();
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    } else {
        // If not compositing, just render when state changes
        renderCanvas();
    }
  }, [isCanvasCompositing, annotations, currentPath, isDrawing, compareMode]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
        if (containerRef.current && canvasRef.current) {
            canvasRef.current.width = containerRef.current.offsetWidth;
            canvasRef.current.height = containerRef.current.offsetHeight;
            renderCanvas();
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, [containerRef.current, compareMode]);


  // Drawing Input Handlers
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      if (drawingMode === 'none') return;
      setIsDrawing(true);
      const pos = getPointerPos(e);
      if (pos) setCurrentPath([pos]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      const pos = getPointerPos(e);
      if (!pos) return;

      if (drawingMode === 'free') {
          setCurrentPath(prev => [...prev, pos]);
      } else {
          setCurrentPath(prev => [prev[0], pos]);
      }
  };

  const stopDrawing = () => {
      if (!isDrawing) return;
      setIsDrawing(false);
      if (currentPath.length > 1) {
          setAnnotations(prev => [...prev, {
              id: `a-${Date.now()}`,
              type: drawingMode as any,
              color: strokeColor,
              points: currentPath,
              timestamp: currentTime
          }]);
      }
      setCurrentPath([]);
  };

  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
      if (!canvasRef.current) return null;
      const rect = canvasRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    setMessages([...messages, {
        id: `m-${Date.now()}`,
        sender: 'Coach',
        text: messageInput,
        time: formatTime(currentTime)
    }]);
    setMessageInput('');
  };

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black flex flex-col overflow-hidden">
      
      {/* Permission Error Modal */}
      <AnimatePresence>
        {permissionDenied && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
            >
                <div className="bg-white p-8 rounded-3xl max-w-sm text-center shadow-2xl">
                    <div className="w-16 h-16 bg-duo-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="text-duo-red" size={32} />
                    </div>
                    <h3 className="text-xl font-extrabold text-duo-gray-800 mb-2">Permission Denied</h3>
                    <p className="text-sm font-medium text-duo-gray-500 mb-6">
                        Access to your camera or microphone is required to record analysis feedback. Please check your browser settings.
                    </p>
                    <button 
                        onClick={() => setPermissionDenied(false)} 
                        className="w-full bg-duo-gray-100 hover:bg-duo-gray-200 text-duo-gray-800 py-3 rounded-xl font-extrabold uppercase transition-colors"
                    >
                        Dismiss
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* =======================
          TOP NAVIGATION BAR
      ======================== */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 pt-6 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
         
         {/* Left: Back & Record */}
         <div className="pointer-events-auto flex items-center gap-4">
            <button 
                onClick={onClose} 
                className="p-2 rounded-full text-white hover:bg-white/20 transition-all backdrop-blur-md"
            >
                <ChevronLeft size={28} />
            </button>
            <button 
                onClick={toggleRecord}
                className="group relative flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-all"
            >
                <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${isRecording ? 'bg-transparent' : 'bg-red-600 border-red-600'}`}>
                    <div className={`rounded-full transition-all ${isRecording ? 'w-3 h-3 bg-red-500 animate-pulse' : 'w-full h-full bg-red-600'}`}></div>
                </div>
                {isRecording && <span className="absolute left-full ml-2 text-red-500 text-xs font-mono font-bold whitespace-nowrap">{formatTime(recordTime)}</span>}
            </button>
            <div className="flex flex-col">
                 <h2 className="text-white font-extrabold text-sm drop-shadow-md leading-tight">{video.title}</h2>
                 <span className="text-white/60 text-xs font-mono">{formatTime(currentTime)}</span>
            </div>
         </div>
         
         {/* Right: Tools & Menu */}
         <div className="pointer-events-auto flex items-center gap-3">
            <button 
                onClick={() => setCompareMode(!compareMode)} 
                className={`p-2 rounded-full backdrop-blur-md transition-all ${compareMode ? 'bg-duo-blue text-white' : 'text-white hover:bg-white/20'}`}
                title="Compare Mode"
            >
                <ImagePlus size={24} />
            </button>
            <button 
                onClick={() => setShowTools(!showTools)} 
                className={`p-2 rounded-full backdrop-blur-md transition-all ${showTools ? 'bg-duo-blue text-white' : 'text-white hover:bg-white/20'}`}
                title="Drawing Tools"
            >
                <Edit3 size={24} />
            </button>
            <button className="p-2 rounded-full text-white hover:bg-white/20 backdrop-blur-md transition-all">
                <MoreHorizontal size={24} />
            </button>
         </div>
      </div>

      {/* =======================
          MAIN VIDEO AREA
      ======================== */}
      <div className="flex-1 relative bg-gray-900 flex flex-col items-center justify-center overflow-hidden">
             
         {/* Container for Video + Canvas + Compare */}
         <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
            
            {/* Primary Video */}
            <div className={`relative w-full h-full flex items-center justify-center transition-all duration-300 ${compareMode ? 'w-[50%]' : 'w-full'}`}>
                <video 
                    ref={videoRef}
                    src={video.url}
                    className="max-h-full max-w-full object-contain"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                    loop
                    crossOrigin="anonymous"
                    muted={isMuted}
                    playsInline
                />
            </div>

            {/* Comparison Video (Side-by-Side) */}
            {compareMode && (
                 <div className="relative w-[50%] h-full flex items-center justify-center bg-black border-l border-white/10">
                     <div className="absolute top-4 left-4 right-4 z-30">
                        <select 
                            className="w-full bg-black/60 text-white text-xs font-bold p-2 rounded-lg border border-white/20 backdrop-blur-sm focus:outline-none cursor-pointer appearance-none"
                            onChange={(e) => {
                                const found = comparisonOptions.find(v => v.id === e.target.value);
                                if (found) setSelectedRefVideo(found);
                            }}
                            value={selectedRefVideo.id}
                        >
                            {comparisonOptions.map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
                        </select>
                     </div>
                     <video 
                        ref={compareVideoRef}
                        src={selectedRefVideo.url}
                        className="max-h-full max-w-full object-contain"
                        loop
                        muted
                        crossOrigin="anonymous"
                        playsInline
                     />
                 </div>
            )}

            {/* Drawing Canvas Overlay - Covers entire container */}
            {/* z-20 puts it above videos. When fallback recording, we paint videos ONTO this canvas. */}
            <canvas
                ref={canvasRef}
                className={`absolute inset-0 z-20 touch-none ${drawingMode !== 'none' ? 'cursor-crosshair' : ''}`}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
         </div>

         {/* Floating Drawing Toolbar */}
         <AnimatePresence>
            {showTools && (
                <motion.div 
                    initial={{ opacity: 0, y: -20, x: 20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-24 right-4 z-40 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex flex-col gap-4 shadow-2xl"
                >
                    <div className="flex flex-col gap-2">
                        {[
                            { id: 'free', icon: <PenTool size={20} /> },
                            { id: 'line', icon: <Square size={20} className="rotate-45" /> }, // Line approximation
                            { id: 'arrow', icon: <ArrowRight size={20} /> },
                            { id: 'circle', icon: <Circle size={20} /> },
                        ].map(tool => (
                            <button
                                key={tool.id}
                                onClick={() => setDrawingMode(tool.id as any)}
                                className={`p-3 rounded-xl transition-all ${drawingMode === tool.id ? 'bg-duo-blue text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                            >
                                {tool.icon}
                            </button>
                        ))}
                    </div>
                    
                    <div className="h-px w-full bg-white/20"></div>

                    <div className="flex flex-col gap-2 items-center">
                        {['#ef4444', '#eab308', '#22c55e', '#3b82f6', '#ffffff'].map(color => (
                            <button
                                key={color}
                                onClick={() => setStrokeColor(color)}
                                className={`w-6 h-6 rounded-full border-2 transition-transform ${strokeColor === color ? 'border-white scale-125' : 'border-transparent hover:scale-110'}`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>

                    <div className="h-px w-full bg-white/20"></div>

                    <button 
                        onClick={() => setAnnotations([])}
                        className="p-3 rounded-xl text-gray-400 hover:text-duo-red hover:bg-duo-red/10 transition-colors"
                        title="Clear All"
                    >
                        <Trash2 size={20} />
                    </button>
                </motion.div>
            )}
         </AnimatePresence>

      </div>

      {/* =======================
          BOTTOM CONTROLS BAR
      ======================== */}
      <div className="absolute bottom-0 left-0 right-0 z-50 p-6 pb-8 bg-gradient-to-t from-black/90 via-black/70 to-transparent pointer-events-none">
         <div className="pointer-events-auto w-full max-w-3xl mx-auto flex flex-col gap-4">
            
            {/* Scrubber */}
            <div className="flex items-center gap-3 w-full group">
                <input 
                    type="range"
                    min={0}
                    max={duration}
                    step={0.01}
                    value={currentTime}
                    onChange={handleScrub}
                    className="flex-1 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                />
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={togglePlay}
                        className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10"
                    >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                    </button>
                    
                    <div className="flex items-center gap-4 text-white/80">
                         <button onClick={() => { if(videoRef.current) videoRef.current.currentTime -= 5 }} className="hover:text-white transition-colors">
                            <Rewind size={24} />
                         </button>
                         <button onClick={() => { if(videoRef.current) videoRef.current.currentTime += 5 }} className="hover:text-white transition-colors">
                            <FastForward size={24} />
                         </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                     <button 
                        onClick={changeSpeed}
                        className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-bold font-mono hover:bg-white/20 backdrop-blur-md"
                     >
                        {playbackSpeed}x
                     </button>
                     <button 
                        onClick={() => setChatOpen(true)}
                        className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
                     >
                         <MessageSquare size={24} />
                     </button>
                </div>
            </div>

         </div>
      </div>

      {/* =======================
          SIDEBAR (Desktop/Drawer Chat) 
      ======================== */}
      <AnimatePresence>
        {(chatOpen) && (
            <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="absolute right-0 top-0 bottom-0 z-[130] w-80 bg-gray-900 border-l border-gray-800 flex flex-col shadow-2xl"
            >
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/95 backdrop-blur">
                    <div className="flex items-center gap-2">
                        <MessageSquare size={16} className="text-duo-blue" />
                        <span className="text-xs font-extrabold text-white uppercase tracking-wider">Coach Notes</span>
                    </div>
                    <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-900">
                    {messages.length === 0 && (
                        <div className="text-center mt-10 opacity-40">
                            <Mic size={32} className="mx-auto mb-2" />
                            <p className="text-xs font-bold text-gray-300">No notes yet.</p>
                        </div>
                    )}
                    {messages.map(msg => (
                        <div key={msg.id} className="bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-700">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-extrabold text-duo-blue uppercase">{msg.sender}</span>
                                <span className="text-[10px] font-mono text-gray-400 bg-black/30 px-1.5 py-0.5 rounded">{msg.time}</span>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed font-medium">{msg.text}</p>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-800 bg-gray-900">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Add timestamped note..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-4 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-duo-blue transition-colors"
                        />
                        <button 
                            onClick={handleSendMessage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-duo-blue p-1 transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
