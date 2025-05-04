<template>
  <MusicTop :topMusics="topMusics" />
  <div class="music-player">
    <!-- 搜索和排序区域 -->
    <div class="search-filter">
      <el-input v-model="searchParams.keyword" placeholder="搜索音乐" clearable @clear="handleSearch"
        @keyup.enter="handleSearch" class="search-input">
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>

      <el-radio-group v-model="searchParams.filterCondition" @change="handleSearch">
        <el-radio-button :label="1">按时间</el-radio-button>
        <el-radio-button :label="0">按热度</el-radio-button>
      </el-radio-group>
    </div>

    <!-- Dashboard -->
    <div class="dashboard" :class="{ 'playing': isPlaying }">
      <div class="album-art">
        <el-image :src="currentSong.cover || '/placeholder.svg?height=80&width=80'" fit="cover" class="album-cover" />
      </div>
      <div class="player-controls">
        <div class="song-info">
          <h3>{{ currentSong.musicName || 'No song selected' }}</h3>
          <p>播放次数：{{ currentSong.listenTimes || '' }}</p>
        </div>
        <div class="controls">
          <el-button circle :icon="Previous" @click="previousSong" class="control-btn" />
          <el-button circle :icon="isPlaying ? Pause : Play" @click="togglePlay" class="play-btn" />
          <el-button circle :icon="Next" @click="nextSong" class="control-btn" />
        </div>
        <div class="playback-modes">
          <el-tooltip content="Sequential Play">
            <el-button :type="playMode === 'sequential' ? 'primary' : 'default'" circle :icon="Sort"
              @click="setPlayMode('sequential')" class="mode-btn" />
          </el-tooltip>
          <el-tooltip content="Loop Play">
            <el-button :type="playMode === 'loop' ? 'primary' : 'default'" circle :icon="RefreshRight"
              @click="setPlayMode('loop')" class="mode-btn" />
          </el-tooltip>
          <el-tooltip content="Shuffle Play">
            <el-button :type="playMode === 'shuffle' ? 'primary' : 'default'" circle :icon="DCaret"
              @click="setPlayMode('shuffle')" class="mode-btn" />
          </el-tooltip>
        </div>
      </div>
      <div class="progress-container">
        <span class="time">{{ formatTime(currentTime) }}</span>
        <el-slider v-model="currentTime" :max="duration" @change="seekTo" class="progress-bar" />
        <span class="time">{{ formatTime(duration) }}</span>
      </div>
    </div>

    <!-- View Toggle -->
    <div class="view-toggle">
      <el-radio-group v-model="viewMode" size="large">
        <el-radio-button label="list">
          <el-icon>
            <List />
          </el-icon> List View
        </el-radio-button>
        <el-radio-button label="grid">
          <el-icon>
            <Grid />
          </el-icon> Grid View
        </el-radio-button>
      </el-radio-group>
    </div>

    <!-- Music List -->
    <div class="music-container" :class="viewMode" v-loading="loading" :style="{
      '--bg-image': currentSong.cover ? `url(${currentSong.cover})` : 'url(/default-bg.jpg)'
    }">
      <!-- List View -->
      <el-table v-if="viewMode === 'list'" :data="songs" style="width: 100%" @row-click="playSong"
        :highlight-current-row="true" :current-row-key="currentSong.id">
        <!-- 序号列 -->
        <el-table-column width="60" align="center">
          <template #default="scope">
            <div class="song-index">
              <span v-if="currentSong.id !== scope.row.id">{{ scope.$index + 1 }}</span>
              <el-icon v-else class="playing-icon">
                <VideoPlay />
              </el-icon>
            </div>
          </template>
        </el-table-column>

        <!-- 歌曲信息列 -->
        <el-table-column label="歌曲" min-width="300">
          <template #default="scope">
            <div class="song-info-cell">
              <el-image :src="scope.row.cover" class="song-cover" fit="cover">
                <template #error>
                  <div class="image-placeholder">
                    <el-icon>
                      <Headset />
                    </el-icon>
                  </div>
                </template>
              </el-image>
              <div class="song-details">
                <div class="song-name">{{ scope.row.musicName }}</div>
                <div class="play-count">播放次数: {{ scope.row.listenTimes }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- 创建时间列 -->
        <el-table-column label="创建时间" width="180" align="center">
          <template #default="scope">
            {{ new Date(scope.row.createTime).toLocaleDateString() }}
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column width="70" align="center">
          <template>
            <el-dropdown trigger="click">
              <el-button type="text" :icon="MoreFilled" class="more-btn"></el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :icon="Plus">添加到播放列表</el-dropdown-item>
                  <el-dropdown-item :icon="Star">收藏</el-dropdown-item>
                  <el-dropdown-item :icon="Share">分享</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- Grid View -->
      <div v-else class="grid-view">
        <div v-for="song in songs" :key="song.id" class="song-card" :class="{ 'active': currentSong.id === song.id }"
          @click="playSong(song)" :style="{ backgroundImage: `url(${song.cover || '/default-cover.jpg'})` }">
          <div class="song-card-overlay">
            <div class="song-card-info">
              <h4>{{ song.musicName }}</h4>
              <p>播放次数：{{ song.listenTimes }}</p>
            </div>
            <el-icon v-if="currentSong.id === song.id" class="playing-indicator">
              <VideoPlay />
            </el-icon>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination v-model:current-page="searchParams.pageNum" v-model:page-size="searchParams.pageSize"
          :page-sizes="[12, 24, 36, 48]" :total="total" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  VideoPlay,
  CaretRight as Play,
  VideoPause as Pause,
  ArrowLeft as Previous,
  ArrowRight as Next,
  RefreshRight,
  DCaret,
  Sort,
  List,
  Grid,
  Search,
  Headset,
  MoreFilled,
  Plus,
  Star,
  Share
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import MusicTop from '@/components/MusicTop.vue';
import { musicSearchService } from '@/api/music';

// 搜索参数
const searchParams = ref({
  filterCondition: 1, // 1-按时间, 0-按热度
  keyword: '',
  pageNum: 1,
  pageSize: 12
});

// 数据状态
const songs = ref([]);
const topMusics = ref([]);
const total = ref(0);
const loading = ref(false);

// Player state
const currentSong = ref({});
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const playMode = ref('sequential'); // 'sequential', 'loop', 'shuffle'
const viewMode = ref('list'); // 'list' or 'grid'

// Audio element (simulated for this example)
let audioInterval;

// 音频实例
const audioRef = ref(null);

// Methods
const playSong = async (song) => {
  try {
    currentSong.value = song;

    if (audioRef.value) {
      // 设置新的音频源
      audioRef.value.src = song.musicUrl;
      // 加载音频
      await audioRef.value.load();
      // 播放
      await audioRef.value.play();
      isPlaying.value = true;
    }
  } catch (error) {
    console.error('播放失败:', error);
    ElMessage.error('音乐播放失败，请稍后重试');
  }
};

const handleSongEnd = async () => {
  if (playMode.value === 'loop') {
    // 单曲循环
    await playSong(currentSong.value);
  } else {
    // 顺序播放或随机播放
    await nextSong();
  }
};

const togglePlay = async () => {
  if (!currentSong.value.id && songs.value.length > 0) {
    await playSong(songs.value[0]);
    return;
  }

  try {
    if (audioRef.value) {
      if (isPlaying.value) {
        await audioRef.value.pause();
      } else {
        await audioRef.value.play();
      }
      isPlaying.value = !isPlaying.value;
    }
  } catch (error) {
    console.error('播放控制失败:', error);
    ElMessage.error('播放控制失败，请稍后重试');
  }
};

const nextSong = async () => {
  if (!currentSong.value.id) return;

  let nextIndex;
  if (playMode.value === 'shuffle') {
    nextIndex = Math.floor(Math.random() * songs.value.length);
  } else {
    const currentIndex = songs.value.findIndex(song => song.id === currentSong.value.id);
    nextIndex = (currentIndex + 1) % songs.value.length;
  }

  await playSong(songs.value[nextIndex]);
};

const previousSong = async () => {
  if (!currentSong.value.id) return;

  let prevIndex;
  if (playMode.value === 'shuffle') {
    prevIndex = Math.floor(Math.random() * songs.value.length);
  } else {
    const currentIndex = songs.value.findIndex(song => song.id === currentSong.value.id);
    prevIndex = (currentIndex - 1 + songs.value.length) % songs.value.length;
  }

  await playSong(songs.value[prevIndex]);
};

const seekTo = (value) => {
  if (audioRef.value) {
    audioRef.value.currentTime = value;
    currentTime.value = value;
  }
};

const setPlayMode = (mode) => {
  playMode.value = mode;
};

const formatTime = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// 加载音乐列表
const loadMusicList = async () => {
  try {
    loading.value = true;
    const response = await musicSearchService(searchParams.value);
    const { data } = response;

    if (data && data.result) {
      songs.value = data.result;
      total.value = data.total || data.result.length;


    } else {
      songs.value = [];
      total.value = 0;
      topMusics.value = [];
    }
  } catch (error) {
    console.error('加载音乐失败:', error);
    ElMessage.error('加载音乐列表失败');
  } finally {
    loading.value = false;
  }
};
const loadTopMusic = async () => {
  // 设置热门音乐(前5首)
  if (songs.value.length > 0) {
    topMusics.value = [...songs.value]
      .sort((a, b) => b.listenTimes - a.listenTimes)
      .slice(0, 5);
  }
}

// 搜索处理
const handleSearch = () => {
  searchParams.value.pageNum = 1;
  loadMusicList();
};

// 分页处理
const handleSizeChange = (val) => {
  searchParams.value.pageSize = val;
  searchParams.value.pageNum = 1;
  loadMusicList();
};

const handleCurrentChange = (val) => {
  searchParams.value.pageNum = val;
  loadMusicList();
};

// Initialize with first song
onMounted(async () => {
  // 创建音频实例
  audioRef.value = new Audio();

  // 监听音频事件
  audioRef.value.addEventListener('timeupdate', () => {
    currentTime.value = audioRef.value.currentTime;
  });

  audioRef.value.addEventListener('loadedmetadata', () => {
    duration.value = audioRef.value.duration;
  });

  audioRef.value.addEventListener('ended', handleSongEnd);

  // 加载音乐列表
  await loadMusicList();
  await loadTopMusic();
});

// 清理事件监听
onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.removeEventListener('timeupdate', () => { });
    audioRef.value.removeEventListener('loadedmetadata', () => { });
    audioRef.value.removeEventListener('ended', handleSongEnd);
    audioRef.value.pause();
    audioRef.value = null;
  }
});
</script>

<style scoped>
.music-player {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f7;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* Dashboard */
.dashboard {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.dashboard.playing {
  background: linear-gradient(135deg, #f2f2f2, #ffffff);
}

.player-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.album-art {
  margin-right: 20px;
  display: flex;
  align-items: center;
}

.album-cover {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.song-info {
  flex: 1;
}

.song-info h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
}

.song-info p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #86868b;
}

.controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-btn {
  color: #1d1d1f;
  background-color: #f5f5f7;
  border: none;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background-color: #e5e5ea;
}

.play-btn {
  width: 44px;
  height: 44px;
  background-color: #fa2f5a;
  color: white;
  border: none;
}

.play-btn:hover {
  background-color: #e02a51;
}

.playback-modes {
  display: flex;
  gap: 8px;
}

.mode-btn {
  font-size: 12px;
  border: none;
  background-color: #f5f5f7;
}

.mode-btn.el-button--primary {
  background-color: #fa2f5a;
  color: white;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.progress-bar {
  flex: 1;
}

.time {
  font-size: 12px;
  color: #86868b;
  min-width: 40px;
}

/* View Toggle */
.view-toggle {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

/* Music List */
.music-container {
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  overflow: hidden;
  padding: 20px;
  min-height: 400px;
}

.music-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: var(--bg-image);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  opacity: 0.1;
  z-index: -1;
}

.song-index {
  font-size: 14px;
  color: #909399;
}

.playing-icon {
  color: #409EFF;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.6;
  }
}

/* Grid View */
.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.song-card {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.song-card:hover {
  transform: translateY(-5px);
}

.song-card:hover .song-card-overlay {
  opacity: 1;
}

.song-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0.6) 30%,
      rgba(0, 0, 0, 0.2) 60%,
      rgba(0, 0, 0, 0) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.song-card-info {
  color: white;
  z-index: 1;
}

.song-card-info h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-card-info p {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}

.playing-indicator {
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #409EFF;
  border-radius: 50%;
  padding: 8px;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

/* 激活状态 */
.song-card.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 3px solid #409EFF;
  border-radius: 12px;
  z-index: 1;
}

.song-card.active .song-card-overlay {
  opacity: 1;
  background: linear-gradient(to top,
      rgba(64, 158, 255, 0.8) 0%,
      rgba(64, 158, 255, 0.6) 30%,
      rgba(64, 158, 255, 0.2) 60%,
      rgba(64, 158, 255, 0) 100%);
}

/* 表格样式 */
.song-info-cell {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
}

.song-cover {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  color: #909399;
}

.song-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.song-name {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}

.play-count {
  font-size: 13px;
  color: #909399;
}

.more-btn {
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.more-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* 表格全局样式覆盖 */
:deep(.el-table) {
  --el-table-border-color: transparent;
  --el-table-header-bg-color: transparent;
  --el-table-row-hover-bg-color: rgba(245, 247, 250, 0.7);
  border-radius: 8px;
  overflow: hidden;
  background: transparent;
}

:deep(.el-table::before),
:deep(.el-table__inner-wrapper::before) {
  display: none;
}

:deep(.el-table th) {
  font-weight: 500;
  color: #606266;
  height: 60px;
  background-color: transparent;
  border: none;
}

:deep(.el-table td) {
  padding: 16px 0;
  border: none;
  background: transparent;
}

:deep(.el-table .el-table__row) {
  height: 80px;
  background: transparent;
  transition: all 0.3s ease;
}

:deep(.el-table .el-table__row:hover) {
  background-color: rgba(245, 247, 250, 0.7);
  backdrop-filter: blur(10px);
}

/* 表格行激活状态 */
:deep(.el-table .current-row) {
  background: rgba(64, 158, 255, 0.1) !important;
  backdrop-filter: blur(10px);
}

/* 列表中的歌曲信息样式 */
.song-info-cell {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
}

.song-info-cell .song-cover {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.song-info-cell .song-cover::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  border-radius: 8px;
}

/* 更多按钮样式 */
.more-btn {
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.more-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* 分页容器样式 */
.pagination {
  margin-top: 32px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 搜索和筛选区域样式 */
.search-filter {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}
</style>