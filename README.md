# VideoSensor 🎬⚡

> Next-Generation Personal Video Streaming Platform with Adaptive HLS Playback, Cloudflare R2 Zero-Egress Storage, Creator Studio, and Monetization Engine.

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Cloudflare R2](https://img.shields.io/badge/Storage-Cloudflare%20R2-orange.svg)](https://www.cloudflare.com/products/r2/)

---

## 📌 Project Overview

**VideoSensor** is an open-source, personal video streaming platform architected according to the [Hovod Streaming Platform Blueprint](./Hovod_Video_Streaming_Platform_Plan.md). It delivers a consumer video experience similar to YouTube or Vimeo, while providing a self-hosted backend with automated multi-bitrate HLS transcoding, Cloudflare R2 cloud object storage, embeddable players, and display advertising monetization slots.

---

## 🏛️ System Architecture

```text
                           YOUR DOMAIN
                       videosensor.com
                             │
                             ▼
                   ┌───────────────────┐
                   │   PUBLIC CLIENT   │
                   │ React 18 + Vite   │
                   │ Tailwind CSS      │
                   └─────────┬─────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
         Homepage        Watch Page         Studio &
      (Hero, Trends)    (/watch/:id)       Analytics
                             │
                    ┌────────┴────────┐
                    │                 │
              CUSTOM PLAYER     AD MONETIZATION
              (Adaptive HLS)    (Leaderboard/Sidebar)
                    │
                    ▼
             VideoSensor API
           (Node.js / Express)
                    │
         ┌──────────┴──────────┐
         │                     │
    FFmpeg / HLS          Analytics &
 Transcode Pipeline        Engagement
         │
         ▼
   Cloudflare R2 /
  S3 Object Storage
         │
         ▼
      Viewers
 (Zero Egress Fees)
```

---

## ✨ Key Features

### 1. Consumer Streaming Experience
- **Hero Featured Video**: Ambient blurred backdrop, quick stats, play preview, and one-click playback.
- **Dynamic Category Filter**: Filter by Gaming, Tech, Music, Films & Animation, Nature, and Education.
- **Real-Time Search & Sort**: Query video titles, descriptions, channel names, and tags with instant matching.
- **Top Trending Rankings**: Ranked badges (`#1`, `#2`, `#3`) with view counts and publication dates.

### 2. Custom Video Player (HLS Adaptive)
- **Adaptive Bitrate Streaming**: Built on `hls.js` with multi-bitrate fallback (1080p 60fps, 720p, 480p, 360p, Auto).
- **Comprehensive Player Controls**:
  - Scrub bar with buffered indicator and hover timestamp preview
  - Volume slider and quick mute toggle
  - Playback speed switcher (`0.5x`, `0.75x`, `1.0x`, `1.25x`, `1.5x`, `2.0x`)
  - Picture-in-Picture (PiP)
  - Theater Mode (widescreen player expansion)
  - Fullscreen toggle
  - Keyboard shortcuts (`Space`/`K` for play/pause, `F` for fullscreen, `M` for mute, `Arrows` for seek & volume)
- **Interactive Engagement**:
  - Animated Like/Dislike counter
  - Channel subscription with celebration confetti
  - Expandable description with timestamps
  - Real-time interactive comments section

### 3. Embeddable Player Mode
- Dedicated clean player route (`/embed/:id`) optimized for external blog and website `<iframe>` embedding.
- One-click embed code generator in the Share modal.

### 4. Creator Studio & Ingestion Engine
- **Dropzone File Uploader**: Drag & drop support for `.mp4`, `.webm`, `.mov`, `.mkv` files.
- **Transcode Worker Pipeline Visualizer**:
  1. Raw Video Ingestion & Validation
  2. Audio Demuxing & Waveform Generation
  3. Multi-Bitrate HLS Transcoding Ladder (1080p, 720p, 480p, 360p)
  4. Thumbnail Sprites & Poster Generation
  5. Cloudflare R2 / S3 Object Storage Synchronization
  6. CDN Manifest Generation & Live Publication
- **Catalog Management**: Video list with view counts, likes, and deletion actions.

### 5. Creator Monetization & Analytics Hub
- **Metric Cards**: Total Estimated Ad Revenue ($), Total Stream Views, Watch Hours, RPM, and CPM.
- **Interactive Growth Charts**: Area charts visualizing daily revenue and view growth over 7, 30, and 90 days.
- **Placement Breakdown**: Revenue distribution across Display Leaderboards, In-Stream Video Ads, and Sponsored Sidebar cards.
- **AdSense & DMCA Compliance**: Adherence to verified original distribution rights and responsive ad viewport integration.

### 6. Cloudflare R2 & Object Storage Integration
- Zero-egress storage integration via `@aws-sdk/client-s3`.
- Interactive settings panel with **Live Connection Testing** for Cloudflare R2 credentials.
- Automatic fallback to local disk storage (`uploads/`) for local development without cloud dependencies.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) v20 or newer
- [npm](https://www.npmjs.com/) v10 or newer
- [Git](https://git-scm.com/)

### 1. Clone Repository
```bash
git clone https://github.com/sunnysahani070-ops/VideoSensor.git
cd VideoSensor
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Servers
Runs both the backend API (port 5000) and the Vite frontend (port 5173) concurrently:
```bash
npm run dev
```

Visit the application at:
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api/videos`

---

## 📦 Production Deployment

### Option A: Node.js Production Run
```bash
# Build the client bundle
npm run build

# Start the unified server (serves API + static frontend)
npm start
```
Visit `http://localhost:5000`.

---

### Option B: Docker Compose (VPS Deployment)

#### 1. Setup Environment
```bash
cp .env.example .env
# Edit .env with your Cloudflare R2 credentials and domain
```

#### 2. Launch with Cloudflare R2
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

#### 3. Launch Local Stack with MinIO & Redis
```bash
docker compose up -d --build
```
- Web Application: `http://localhost:5000`
- MinIO S3 Console: `http://localhost:9001` (User: `minioadmin` / Pass: `minioadmin`)

---

## ☁️ Cloudflare R2 Configuration Guide

To eliminate cloud egress bandwidth costs, configure Cloudflare R2 in `.env` or via the in-app **Storage Settings** (`/settings`):

1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) > **R2** > **Create bucket**. Name it `videosensor-streams`.
2. Under **R2 API Tokens**, select **Create API Token** with `Object Read & Write` permissions.
3. Configure your `.env`:
   ```env
   STORAGE_MODE=r2
   S3_ENDPOINT=https://<YOUR_ACCOUNT_ID>.r2.cloudflarestorage.com
   S3_BUCKET=videosensor-streams
   S3_ACCESS_KEY_ID=<YOUR_R2_ACCESS_KEY>
   S3_SECRET_ACCESS_KEY=<YOUR_R2_SECRET_KEY>
   S3_PUBLIC_BASE_URL=https://cdn.yourdomain.com
   S3_REGION=auto
   S3_FORCE_PATH_STYLE=false
   ```
4. In Cloudflare DNS, add a CNAME record:
   - Name: `cdn`
   - Target: Connect to your R2 bucket custom domain.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/videos` | List videos with `search`, `category`, `sort` filters |
| `GET` | `/api/videos/:id` | Get video details, related videos, and increment views |
| `POST` | `/api/videos/upload` | Multipart upload for video file, thumbnail, and metadata |
| `POST` | `/api/videos/:id/like` | Like or dislike video |
| `POST` | `/api/videos/:id/comments` | Post a comment on a video |
| `GET` | `/api/videos/:id/job` | Poll video transcode pipeline status |
| `DELETE` | `/api/videos/:id` | Delete a video asset |
| `GET` | `/api/stream/:id/master.m3u8` | Generate adaptive HLS master playlist |
| `GET` | `/api/analytics` | Fetch monetization metrics, RPM, CPM, and chart data |
| `GET` | `/api/settings` | Get storage mode and configuration |
| `POST` | `/api/settings` | Update storage & Cloudflare R2 configuration |
| `POST` | `/api/settings/test-storage` | Test Cloudflare R2 / S3 credentials live |

---

## 📄 License & Attribution

This project is licensed under the [MIT License](LICENSE). Built upon the architectural principles of [Hovod](https://github.com/Synapsr/Hovod) by Synapsr.
