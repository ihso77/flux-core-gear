import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Sample video URL - replace with your actual video
  const videoSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const handlePlayClick = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }, 100);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsPlaying(false);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      modalRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
      if (e.key === " " && isModalOpen) {
        e.preventDefault();
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
          } else {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const stats = [
    { value: "1ms", label: "Response Time" },
    { value: "50M+", label: "Click Lifespan" },
    { value: "250+", label: "Pro Players" },
    { value: "30+", label: "Countries" },
  ];

  return (
    <section className="relative py-16 sm:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -left-20 top-1/2 w-[500px] h-[500px] rounded-full border border-primary/10"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -right-20 top-1/2 w-[400px] h-[400px] rounded-full border border-primary/10"
        />
      </div>

      <div className="container relative mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ▶
            </motion.span>
            Watch Our Story
          </motion.span>
          
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl mb-4">
            Experience{" "}
            <motion.span
              className="text-gradient-pulse inline-block"
              animate={{
                textShadow: [
                  "0 0 10px hsl(271 81% 56% / 0.2)",
                  "0 0 30px hsl(271 81% 56% / 0.4)",
                  "0 0 10px hsl(271 81% 56% / 0.2)",
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Excellence
            </motion.span>
          </h2>
          
          <p className="max-w-2xl mx-auto font-body text-muted-foreground">
            Discover how we craft premium gaming gear that elevates your gameplay to the next level
          </p>
        </motion.div>

        {/* Video Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-2xl shadow-primary/10 cursor-pointer group"
            onClick={handlePlayClick}
          >
            {/* Video Thumbnail/Preview */}
            <div className="relative aspect-video bg-gradient-to-br from-card via-secondary to-card">
              {/* Animated gradient background */}
              <motion.div
                animate={{
                  background: [
                    "linear-gradient(45deg, hsl(271 81% 56% / 0.1), hsl(239 84% 67% / 0.1))",
                    "linear-gradient(135deg, hsl(239 84% 67% / 0.15), hsl(271 81% 56% / 0.15))",
                    "linear-gradient(45deg, hsl(271 81% 56% / 0.1), hsl(239 84% 67% / 0.1))",
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute inset-0"
              />
              
              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                                    linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Center play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  {/* Pulse rings */}
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-primary/30"
                    style={{ transform: "translate(-50%, -50%)", left: "50%", top: "50%" }}
                  />
                  <motion.div
                    animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    className="absolute inset-0 rounded-full bg-primary/20"
                    style={{ transform: "translate(-50%, -50%)", left: "50%", top: "50%" }}
                  />
                  
                  {/* Play button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative z-10 flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-full gradient-pulse shadow-lg shadow-primary/30"
                  >
                    <Play className="h-10 w-10 text-primary-foreground ml-1" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Corner decorations */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 text-xs font-medium"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400"></span>
                  </span>
                  LIVE
                </motion.div>
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-2">
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm text-xs font-medium text-foreground"
                >
                  2:45
                </motion.span>
              </div>

              {/* Bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card to-transparent" />
            </div>

            {/* Info section */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-xl font-semibold text-foreground mb-2"
              >
                The Nova Story: Crafting Champions
              </motion.h3>
              <p className="font-body text-sm text-muted-foreground">
                Learn about our journey to create the ultimate gaming experience
              </p>
            </div>

            {/* Hover overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-primary/5 transition-opacity duration-300"
            />
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors"
            >
              <motion.div
                className="font-display text-3xl font-bold text-foreground mb-1"
                whileHover={{ color: "hsl(271, 81%, 56%)" }}
              >
                {stat.value}
              </motion.div>
              <div className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.2 }}
              className="relative w-full max-w-6xl"
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseModal}
                className="absolute -top-12 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 text-foreground hover:bg-card transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>

              {/* Video container */}
              <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  className="w-full aspect-video"
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  muted={isMuted}
                  playsInline
                />

                {/* Video controls overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6"
                >
                  {/* Progress bar */}
                  <div
                    className="w-full h-1 bg-white/20 rounded-full mb-4 cursor-pointer overflow-hidden"
                    onClick={handleProgressClick}
                  >
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={togglePlay}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5 ml-0.5" />
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleMute}
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX className="h-5 w-5" />
                        ) : (
                          <Volume2 className="h-5 w-5" />
                        )}
                      </motion.button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleFullscreen}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {isFullscreen ? (
                        <Minimize className="h-5 w-5" />
                      ) : (
                        <Maximize className="h-5 w-5" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VideoSection;
