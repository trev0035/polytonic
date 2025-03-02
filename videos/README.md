# Header Background Video

Place your background video file here with the name `audio-visualizer-bg.mp4`.

## Video Requirements

- Format: MP4
- Resolution: At least 1920x1080 for best quality
- Duration: Ideally 10-30 seconds (will loop automatically)
- Content: Audio visualization, waveforms, or abstract patterns work best
- File size: Keep under 10MB if possible for faster loading

## Where to Find Videos

You can create your own audio visualization video or find free stock videos from sites like:

1. Pexels: https://www.pexels.com/search/videos/audio%20visualization/
2. Pixabay: https://pixabay.com/videos/search/audio%20visualization/
3. Videvo: https://www.videvo.net/search/audio-visualization/

## Alternative Solution

If you don't have a video, you can modify the CSS to use a gradient background instead:

```css
.video-background {
    background: linear-gradient(45deg, #1a1a2e, #6c63ff, #ff6584);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
```

Add this to your CSS file and remove the video element from the HTML if you prefer not to use a video. 