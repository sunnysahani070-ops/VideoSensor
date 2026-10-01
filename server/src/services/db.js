import pg from 'pg';
import { initialVideos } from '../data/seedVideos.js';

const { Pool } = pg;

let pool = null;
let isConnected = false;

// Fallback in-memory store if no DATABASE_URL is provided
let memoryVideos = [...initialVideos];

export function getDbConnection() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return null;

  if (!pool) {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false
      },
      max: 10,
      idleTimeoutMillis: 30000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected Postgres database error:', err);
    });
  }

  return pool;
}

export async function initDatabase() {
  const db = getDbConnection();
  if (!db) {
    console.log('⚡ No DATABASE_URL provided. Running with in-memory & local fallback database.');
    return;
  }

  try {
    const client = await db.connect();
    console.log('🐘 Connected to PostgreSQL database successfully!');
    isConnected = true;

    // Create tables if they do not exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id VARCHAR(100) PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        thumbnail TEXT,
        video_url TEXT,
        hls_url TEXT,
        duration INTEGER,
        duration_formatted VARCHAR(50),
        views BIGINT DEFAULT 0,
        likes BIGINT DEFAULT 0,
        dislikes BIGINT DEFAULT 0,
        category VARCHAR(100),
        tags TEXT[],
        channel JSONB,
        monetization JSONB,
        resolutions TEXT[],
        visibility VARCHAR(50) DEFAULT 'public',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS comments (
        id VARCHAR(100) PRIMARY KEY,
        video_id VARCHAR(100) REFERENCES videos(id) ON DELETE CASCADE,
        author VARCHAR(100),
        avatar TEXT,
        content TEXT,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Check if table is empty; if so, seed initial videos
    const countRes = await client.query('SELECT COUNT(*) FROM videos');
    const count = parseInt(countRes.rows[0].count, 10);

    if (count === 0) {
      console.log('🌱 Seeding initial videos into PostgreSQL database...');
      for (const v of initialVideos) {
        await client.query(`
          INSERT INTO videos (
            id, title, description, thumbnail, video_url, hls_url,
            duration, duration_formatted, views, likes, dislikes,
            category, tags, channel, monetization, resolutions, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        `, [
          v.id, v.title, v.description, v.thumbnail, v.videoUrl, v.hlsUrl,
          v.duration, v.durationFormatted, v.views, v.likes, v.dislikes,
          v.category, v.tags, JSON.stringify(v.channel), JSON.stringify(v.monetization),
          v.resolutions, v.createdAt
        ]);

        if (v.comments && v.comments.length > 0) {
          for (const c of v.comments) {
            await client.query(`
              INSERT INTO comments (id, video_id, author, avatar, content, likes, created_at)
              VALUES ($1, $2, $3, $4, $5, $6, NOW())
            `, [c.id, v.id, c.author, c.avatar, c.content, c.likes || 0]);
          }
        }
      }
      console.log('✅ Initial seed data inserted into PostgreSQL!');
    }

    client.release();
  } catch (err) {
    console.error('Failed to initialize PostgreSQL database, falling back to local memory store:', err.message);
    isConnected = false;
  }
}

// Database helper functions
export async function getVideos({ search, category, sort = 'trending', limit }) {
  const db = getDbConnection();
  if (isConnected && db) {
    let query = 'SELECT * FROM videos WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      params.push(category);
      query += ` AND LOWER(category) = LOWER($${params.length})`;
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      query += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(description) LIKE $${params.length})`;
    }

    if (sort === 'trending') {
      query += ' ORDER BY views DESC';
    } else if (sort === 'newest') {
      query += ' ORDER BY created_at DESC';
    } else if (sort === 'popular') {
      query += ' ORDER BY likes DESC';
    }

    if (limit) {
      params.push(parseInt(limit, 10));
      query += ` LIMIT $${params.length}`;
    }

    const res = await db.query(query, params);
    return res.rows.map(mapRowToVideo);
  }

  // Memory fallback
  let result = [...memoryVideos];
  if (category && category !== 'All') {
    result = result.filter(v => v.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(v => 
      v.title.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q)
    );
  }
  if (sort === 'trending') result.sort((a, b) => b.views - a.views);
  else if (sort === 'newest') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  else if (sort === 'popular') result.sort((a, b) => b.likes - a.likes);
  if (limit) result = result.slice(0, parseInt(limit, 10));

  return result;
}

export async function getVideoById(id) {
  const db = getDbConnection();
  if (isConnected && db) {
    const res = await db.query('SELECT * FROM videos WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;

    const video = mapRowToVideo(res.rows[0]);

    // Fetch comments
    const commentsRes = await db.query('SELECT * FROM comments WHERE video_id = $1 ORDER BY created_at DESC', [id]);
    video.comments = commentsRes.rows.map(c => ({
      id: c.id,
      author: c.author,
      avatar: c.avatar,
      content: c.content,
      likes: c.likes,
      createdAt: c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recently'
    }));

    return video;
  }

  return memoryVideos.find(v => v.id === id) || null;
}

export async function incrementViews(id) {
  const db = getDbConnection();
  if (isConnected && db) {
    await db.query('UPDATE videos SET views = views + 1 WHERE id = $1', [id]);
    return;
  }

  const v = memoryVideos.find(v => v.id === id);
  if (v) v.views = (v.views || 0) + 1;
}

export async function updateLike(id, action = 'like') {
  const db = getDbConnection();
  if (isConnected && db) {
    const field = action === 'like' ? 'likes' : 'dislikes';
    const res = await db.query(
      `UPDATE videos SET ${field} = ${field} + 1 WHERE id = $1 RETURNING likes, dislikes`,
      [id]
    );
    return res.rows[0];
  }

  const v = memoryVideos.find(v => v.id === id);
  if (v) {
    if (action === 'like') v.likes = (v.likes || 0) + 1;
    else v.dislikes = (v.dislikes || 0) + 1;
    return { likes: v.likes, dislikes: v.dislikes };
  }
  return { likes: 0, dislikes: 0 };
}

export async function insertComment(videoId, comment) {
  const db = getDbConnection();
  if (isConnected && db) {
    await db.query(`
      INSERT INTO comments (id, video_id, author, avatar, content, likes, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `, [comment.id, videoId, comment.author, comment.avatar, comment.content, comment.likes || 0]);
    return comment;
  }

  const v = memoryVideos.find(v => v.id === videoId);
  if (v) {
    v.comments = [comment, ...(v.comments || [])];
  }
  return comment;
}

export async function insertVideo(video) {
  const db = getDbConnection();
  if (isConnected && db) {
    await db.query(`
      INSERT INTO videos (
        id, title, description, thumbnail, video_url, hls_url,
        duration, duration_formatted, views, likes, dislikes,
        category, tags, channel, monetization, resolutions, visibility, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    `, [
      video.id, video.title, video.description, video.thumbnail, video.videoUrl, video.hlsUrl,
      video.duration, video.durationFormatted, video.views, video.likes, video.dislikes,
      video.category, video.tags, JSON.stringify(video.channel), JSON.stringify(video.monetization),
      video.resolutions, video.visibility, video.createdAt
    ]);
  }

  memoryVideos = [video, ...memoryVideos];
  return video;
}

export async function removeVideo(id) {
  const db = getDbConnection();
  if (isConnected && db) {
    await db.query('DELETE FROM videos WHERE id = $1', [id]);
  }

  const idx = memoryVideos.findIndex(v => v.id === id);
  if (idx !== -1) memoryVideos.splice(idx, 1);
  return true;
}

function mapRowToVideo(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    thumbnail: row.thumbnail,
    videoUrl: row.video_url,
    hlsUrl: row.hls_url,
    duration: row.duration,
    durationFormatted: row.duration_formatted,
    views: parseInt(row.views, 10),
    likes: parseInt(row.likes, 10),
    dislikes: parseInt(row.dislikes, 10),
    category: row.category,
    tags: row.tags || [],
    channel: typeof row.channel === 'string' ? JSON.parse(row.channel) : row.channel,
    monetization: typeof row.monetization === 'string' ? JSON.parse(row.monetization) : row.monetization,
    resolutions: row.resolutions || ['1080p', '720p', '480p'],
    visibility: row.visibility || 'public',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    comments: []
  };
}
