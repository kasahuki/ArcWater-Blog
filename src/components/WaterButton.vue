<template>
  <button class="button" :style="{ scale: scale }">
    <div class="bg"></div>
    <svg class="splash" width="342" height="208" viewBox="0 0 342 208" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M48.5 102.3C48.5 102.3 36.2 92.5 24.8 98.7C13.4 104.9 3 98.7 3 98.7" stroke-width="3"
        stroke-linecap="round"></path>
      <path d="M290.5 102.3C290.5 102.3 302.8 92.5 314.2 98.7C325.6 104.9 339 96.2 339 96.2" stroke-width="3"
        stroke-linecap="round"></path>
      <path d="M278.5 68.2C278.5 68.2 284.3 54.1 298.7 52.8C313.1 51.5 315.5 42.3 315.5 42.3" stroke-opacity="0.4"
        stroke-width="3" stroke-linecap="round"></path>
      <path d="M278.5 141.7C278.5 141.7 284.3 155.8 298.7 157.1C313.1 158.4 315.5 167.6 315.5 167.6"
        stroke-opacity="0.4" stroke-width="3" stroke-linecap="round"></path>
      <path d="M225.3 60.8C225.3 60.8 221.5 45.2 231.2 35.6C240.9 26 239.8 19.5 239.8 19.5" stroke-width="3"
        stroke-linecap="round"></path>
      <path d="M225.3 153.2C225.3 153.2 221.5 168.8 231.2 178.4C240.9 188 239.8 194.5 239.8 194.5" stroke-width="3"
        stroke-linecap="round"></path>
    </svg>

    <div class="wrap">
      <svg class="path" width="221" height="42" viewBox="0 0 221 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M182.674 2H203C211.837 2 219 9.16344 219 18V24C219 32.8366 211.837 40 203 40H18C9.16345 40 2 32.8366 2 24V18C2 9.16344 9.16344 2 18 2H47.8855"
          stroke-width="3" stroke-linecap="round"></path>
      </svg>

      <div class="outline"></div>
      <div class="content">
        <span class="char state-1">
          <span style="--i: 1" data-label="N">N</span>
          <span style="--i: 2" data-label="e">e</span>
          <span style="--i: 3" data-label="w">w</span>
          <span style="--i: 4" data-label=" ">&nbsp;</span>
          <span style="--i: 5" data-label="P">P</span>
          <span style="--i: 6" data-label="o">o</span>
          <span style="--i: 7" data-label="s">s</span>
          <span style="--i: 8" data-label="t">t</span>
        </span>

        <div class="icon">
          <div></div>
        </div>

        <span class="char state-2">
          <span style="--i: 1" data-label="s">s</span>
          <span style="--i: 2" data-label="h">h</span>
          <span style="--i: 3" data-label="a">a</span>
          <span style="--i: 4" data-label="r">r</span>
          <span style="--i: 5" data-label="e">e</span>
          <span style="--i: 6" data-label=" ">&nbsp;</span>
          <span style="--i: 7" data-label="i">i</span>
          <span style="--i: 8" data-label="d">d</span>
          <span style="--i: 9" data-label="e">e</span>
          <span style="--i: 10" data-label="a">a</span>
        </span>
      </div>
    </div>
  </button>

</template>
<script setup>
import { ref } from 'vue'
defineProps({
  scale: {
    type: Number,
    default: 1
  }
})
</script>


<style scoped>
.button {
  --white: #e6f3ff;
  --blue-100: #b1d4fd;
  --blue-200: #90c2ff;
  --blue-300: #89b8f2;
  --blue-400: #2668e2;
  --blue-500: #2b4583;
  --radius: 18px;

  border-radius: var(--radius);
  outline: none;
  cursor: pointer;
  font-size: 23px;
  font-family: Arial;
  background: transparent;
  letter-spacing: -1px;
  border: 0;
  position: relative;
  width: 220px;
  height: 80px;
  transform: rotate(357deg) skewX(-2deg);

}

.bg {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  filter: blur(1px);
}

.bg::before,
.bg::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: calc(var(--radius) * 1.1);
  background: var(--blue-500);
}

.bg::before {
  filter: blur(5px);
  transition: all 0.3s ease;
  box-shadow:
    -7px 6px 0 0 rgb(75 95 155 / 40%),
    -14px 12px 0 0 rgb(75 95 155 / 30%),
    -21px 18px 4px 0 rgb(75 95 155 / 25%),
    -28px 24px 8px 0 rgb(75 95 155 / 15%),
    -35px 30px 12px 0 rgb(75 95 155 / 12%),
    -42px 36px 16px 0 rgb(75 95 155 / 8%),
    -56px 42px 20px 0 rgb(75 95 155 / 5%);
}

.wrap {
  border-radius: inherit;
  overflow: hidden;
  height: 100%;
  transform: translate(6px, -6px);
  padding: 3px;
  background: linear-gradient(to bottom,
      var(--blue-100) 0%,
      var(--blue-400) 100%);
  position: relative;
  transition: all 0.3s ease;
}

.outline {
  position: absolute;
  overflow: hidden;
  inset: 0;
  opacity: 0;
  outline: none;
  border-radius: inherit;
  transition: all 0.4s ease;
}

.outline::before {
  content: "";
  position: absolute;
  inset: 2px;
  width: 120px;
  height: 300px;
  margin: auto;
  background: linear-gradient(to right,
      transparent 0%,
      white 50%,
      transparent 100%);
  animation: spin 3s linear infinite;
  animation-play-state: paused;
}

.content {
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  position: relative;
  height: 100%;
  gap: 16px;
  border-radius: calc(var(--radius) * 0.85);
  font-weight: 600;
  transition: all 0.3s ease;
  background: linear-gradient(to bottom,
      var(--blue-300) 0%,
      var(--blue-400) 100%);
  box-shadow:
    inset -2px 12px 11px -5px var(--blue-200),
    inset 1px -3px 11px 0px rgb(0 0 0 / 35%);
}

.content::before {
  content: "";
  inset: 0;
  position: absolute;
  z-index: 10;
  width: 80%;
  top: 45%;
  bottom: 35%;
  opacity: 0.7;
  margin: auto;
  background: linear-gradient(to bottom, transparent, var(--blue-400));
  filter: brightness(1.3) blur(5px);
}

.char {
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.char span {
  display: block;
  color: transparent;
  position: relative;
}

.char span:nth-child(5) {
  margin-left: 1px;
}

.char.state-1 span:nth-child(5) {
  margin-right: -1px;
}

.char.state-1 span {
  animation: charAppear 1.2s ease backwards calc(var(--i) * 0.03s);
}

.char.state-1 span::before,
.char span::after {
  content: attr(data-label);
  position: absolute;
  color: var(--white);
  text-shadow: -1px 1px 2px var(--blue-500);
  left: 0;
}

.char span::before {
  opacity: 0;
  transform: translateY(-100%);
}

.char.state-2 {
  position: absolute;
  left: 70px;
}

.char.state-2 span::after {
  opacity: 1;
}

.icon {
  animation: resetArrow 0.8s cubic-bezier(0.7, -0.5, 0.3, 1.2) forwards;
  z-index: 10;
}

.icon div,
.icon div::before,
.icon div::after {
  height: 3px;
  border-radius: 1px;
  background-color: var(--white);
}

.icon div::before,
.icon div::after {
  content: "";
  position: absolute;
  right: 0;
  transform-origin: center right;
  width: 14px;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.icon div {
  position: relative;
  width: 24px;
  box-shadow: -2px 2px 5px var(--blue-400);
  transform: scale(0.9);
  background: linear-gradient(to bottom, var(--white), var(--blue-100));
  animation: swingArrow 1s ease-in-out infinite;
  animation-play-state: paused;
}

.icon div::before {
  transform: rotate(44deg);
  top: 1px;
  box-shadow: 1px -2px 3px -1px var(--blue-400);
  animation: rotateArrowLine 1s linear infinite;
  animation-play-state: paused;
}

.icon div::after {
  bottom: 1px;
  transform: rotate(316deg);
  box-shadow: -2px 2px 3px 0 var(--blue-400);
  background: linear-gradient(200deg, var(--white), var(--blue-100));
  animation: rotateArrowLine2 1s linear infinite;
  animation-play-state: paused;
}

.path {
  position: absolute;
  z-index: 12;
  bottom: 0;
  left: 0;
  right: 0;
  stroke-dasharray: 150 480;
  stroke-dashoffset: 150;
  pointer-events: none;
}

.splash {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  stroke-dasharray: 60 60;
  stroke-dashoffset: 60;
  transform: translate(-15%, -33%);
  stroke: var(--blue-300);
}

/* STATES and ANIMATIONS remain the same as original */
.button:hover .words {
  opacity: 1;
}

.button:hover .words span {
  animation-play-state: running;
}

.button:hover .char.state-1 span::before {
  animation: charAppear 0.7s ease calc(var(--i) * 0.03s);
}

.button:hover .char.state-1 span::after {
  opacity: 1;
  animation: charDisappear 0.7s ease calc(var(--i) * 0.03s);
}

.button:hover .wrap {
  transform: translate(8px, -8px);
}

.button:hover .outline {
  opacity: 1;
}

.button:hover .outline::before,
.button:hover .icon div::before,
.button:hover .icon div::after,
.button:hover .icon div {
  animation-play-state: running;
}

.button:active .bg::before {
  filter: blur(5px);
  opacity: 0.7;
  box-shadow:
    -7px 6px 0 0 rgb(75 95 155 / 40%),
    -14px 12px 0 0 rgb(75 95 155 / 25%),
    -21px 18px 4px 0 rgb(75 95 155 / 15%);
}

.button:active .content {
  box-shadow:
    inset -1px 12px 8px -5px rgba(0, 71, 137, 0.4),
    inset 0px -3px 8px 0px var(--blue-200);
}

.button:active .words,
.button:active .outline {
  opacity: 0;
}

.button:active .wrap {
  transform: translate(3px, -3px);
}

.button:active .splash {
  animation: splash 0.8s cubic-bezier(0.3, 0, 0, 1) forwards 0.05s;
}

.button:focus .path {
  animation: path 1.6s ease forwards 0.2s;
}

.button:focus .icon {
  animation: arrow 1s cubic-bezier(0.7, -0.5, 0.3, 1.5) forwards;
}

.char.state-2 span::after,
.button:focus .char.state-1 span {
  animation: charDisappear 0.5s ease forwards calc(var(--i) * 0.03s);
}

.button:focus .char.state-2 span::after {
  animation: charAppear 1s ease backwards calc(var(--i) * 0.03s);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes charAppear {
  0% {
    transform: translateY(50%);
    opacity: 0;
    filter: blur(20px);
  }

  20% {
    transform: translateY(70%);
    opacity: 1;
  }

  50% {
    transform: translateY(-15%);
    opacity: 1;
    filter: blur(0);
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes charDisappear {
  0% {
    transform: translateY(0);
    opacity: 1;
  }

  100% {
    transform: translateY(-70%);
    opacity: 0;
    filter: blur(3px);
  }
}

@keyframes arrow {
  0% {
    opacity: 1;
  }

  50% {
    transform: translateX(60px);
    opacity: 0;
  }

  51% {
    transform: translateX(-200px);
    opacity: 0;
  }

  100% {
    transform: translateX(-128px);
    opacity: 1;
  }
}

@keyframes swingArrow {
  50% {
    transform: translateX(5px) scale(0.9);
  }
}

@keyframes rotateArrowLine {
  50% {
    transform: rotate(30deg);
  }

  80% {
    transform: rotate(55deg);
  }
}

@keyframes rotateArrowLine2 {
  50% {
    transform: rotate(330deg);
  }

  80% {
    transform: rotate(300deg);
  }
}

@keyframes resetArrow {
  0% {
    transform: translateX(-128px);
  }

  100% {
    transform: translateX(0);
  }
}

@keyframes path {
  from {
    stroke: white;
  }

  to {
    stroke-dashoffset: -480;
    stroke: #c6e0fe;
  }
}

@keyframes splash {
  to {
    stroke-dasharray: 2 60;
    stroke-dashoffset: -60;
  }
}
</style>