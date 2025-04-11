<template>
  <div class="travel-experience">
    <!-- Background video with water overlay effect -->
    <div class="background-container">
      <div class="water-overlay"></div>
    </div>

    <!-- Main content -->
    <div class="content-container">
      <img src="../assets/image/water.png" alt="" style="position: relative; left: -3rem; bottom: -8rem;">

      <!-- Hero section -->
      <div class="hero-section">
        <h3 class="subtitle">
          <span v-for="(char, index) in subtitleChars" :key="index" :style="{ animationDelay: `${index * 0.05}s` }"
            class="char-animation">
            {{ char }}
          </span>
        </h3>

        <h1 class="title">
          <div class="title-line">
            <span v-for="(char, index) in titleLine1" :key="`line1-${index}`"
              :style="{ animationDelay: `${0.5 + index * 0.04}s` }" class="char-animation">
              {{ char }}
            </span>
          </div>
          <div class="title-line">
            <span v-for="(char, index) in titleLine2" :key="`line2-${index}`"
              :style="{ animationDelay: `${1.0 + index * 0.04}s` }" class="char-animation">
              {{ char }}
            </span>
          </div>
          <div class="title-line">
            <span v-for="(char, index) in titleLine3" :key="`line3-${index}`"
              :style="{ animationDelay: `${1.5 + index * 0.04}s` }" class="char-animation">
              {{ char }}
            </span>
          </div>
        </h1>


      </div>

      <!-- Airplane image with parallax effect -->
      <div class="airplane-container" ref="airplaneContainer">
        <div class="airplane" :style="{ transform: `translate(${planeX}px, ${planeY}px)` }">

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// Text animation data
const subtitleText = "ArcWater";
const subtitleChars = computed(() => subtitleText.split(''));

const titleLine1 = computed(() => "Record".split(''));
const titleLine2 = computed(() => "The Magic Of".split(''));
const titleLine3 = computed(() => "Experience".split(''));

// Button hover state
const buttonHovered = ref(false);

// Airplane parallax effect
const planeX = ref(0);
const planeY = ref(0);
const airplaneContainer = ref(null);

// Handle mouse move for parallax effect
const handleMouseMove = (e) => {
  if (!airplaneContainer.value) return;

  const rect = airplaneContainer.value.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const moveX = (e.clientX - centerX) / 30;
  const moveY = (e.clientY - centerY) / 30;

  planeX.value = moveX;
  planeY.value = moveY;
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove);

  // Add water ripple effect
  const waterOverlay = document.querySelector('.water-overlay');
  setInterval(() => {
    const ripple = document.createElement('div');
    ripple.classList.add('water-ripple');
    ripple.style.left = `${Math.random() * 100}%`;
    ripple.style.top = `${Math.random() * 100}%`;
    waterOverlay.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 4000);
  }, 2000);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style scoped>
.travel-experience {
  position: relative;
  width: 100%;
  height: 70vh;
  overflow: hidden;
  font-family: 'Poppins', sans-serif;
  color: #fff;
  border-radius: 1.5rem;
  margin-bottom: 2.5rem;


}

/* Background with water effect */
.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a4da2, #05c3de);
  z-index: -2;
}

.water-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=3540&auto=format&fit=crop') center/cover;
  opacity: 0.2;
  z-index: -1;
}

.water-ripple {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 4s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }

  100% {
    transform: scale(100);
    opacity: 0;
  }
}

/* Content layout */
.content-container {
  position: relative;

  width: 100%;
  height: 100%;
  padding: 2rem;
  display: grid;
  grid-template-columns: 80px 1fr 1fr;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    "timeline hero airplane"
    "timeline knowmore knowmore";
}

/* Timeline navigation */
.timeline {
  grid-area: timeline;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.timeline-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.timeline-item.active .timeline-dot {
  background-color: #fff;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
}

.timeline-label {
  position: absolute;
  left: 24px;
  font-size: 12px;
  opacity: 0.7;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 30%;
  left: 40px;
  height: 40%;
  width: 1px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));
}

/* Hero section */
.hero-section {
  grid-area: hero;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 2rem;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  opacity: 0.8;
  color: #ffffff;
}

.title {
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 9rem;
  color: #cbd811;
}

.title-line {
  display: block;
  overflow: hidden;
}

.char-animation {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  animation: charAppear 0.5s forwards;
}

@keyframes charAppear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}




/* Responsive adjustments */
@media (max-width: 768px) {


  .title {
    font-size: 2.5rem;
  }

  .airplane {
    position: relative;
    height: 200px;
  }

  .destination-card {
    width: 80px;
    height: 80px;
  }
}
</style>