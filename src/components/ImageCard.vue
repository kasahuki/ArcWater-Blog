<template>
  <p class="browser-warning">
    If this looks wonky to you it's because this browser doesn't support the CSS
    property 'aspect-ratio'.
  </p>
  <div class="stack">
    <div class="card">
      <div class="image">
        <img :src="url" alt="">
      </div>
    </div>
  </div>

</template>

<script setup>
const prop = defineProps({
  url: {
    type: String
  }
})


</script>

<style scoped lang="less">
img {
  display: block;


}

.stack {
  width: 45%;
  max-width: 300px;
  transition: 0.25s ease;

  &:hover {
    transform: rotate(5deg);

    .card:before {
      transform: translatey(-2%) rotate(-4deg);
    }

    .card:after {
      transform: translatey(2%) rotate(4deg);
    }
  }
}

.card {
  aspect-ratio: 3 / 2;
  border: 4px solid;
  background-color: #fff;
  position: relative;
  transition: 0.15s ease;
  cursor: pointer;
  padding: 5% 5% 15% 5%;
  scale: 0.6;

  &:before,
  &:after {
    content: "";
    display: block;
    position: absolute;
    height: 100%;
    width: 100%;
    border: 4px solid;
    background-color: #fff;
    transform-origin: center center;
    z-index: -1;
    transition: 0.15s ease;
    top: 0;
    left: 0;
  }

  &:before {
    transform: translatey(-2%) rotate(-6deg);
  }

  &:after {
    transform: translatey(2%) rotate(6deg);
  }
}

.image {
  width: 100%;
  border: 4px solid;
  background-color: #eee;
  aspect-ratio: 1 / 1;
  position: relative;
}

.browser-warning {
  margin-bottom: 4rem;
}

@supports (aspect-ratio: 1 / 1) {
  .browser-warning {
    display: none;
  }
}
</style>