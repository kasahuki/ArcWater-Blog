<template>
  <!-- From Uiverse.io by codebykay101 -->
  <div class="container">
    <div data-text="Notice" style="--r:-15;" class="glass">
      <svg xmlns="http://www.w3.org/2000/svg" height="3rem" style="color: #f5777b;"
        viewBox="0 0 20 20"><!-- Icon from Pepicons Pop! by CyCraft - https://github.com/CyCraft/pepicons/blob/dev/LICENSE -->
        <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
          <path d="M0 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm18 0H2v11h16z" />
          <path
            d="M5.75 9.5a.75.75 0 0 1 .75-.75h7a.75.75 0 0 1 0 1.5h-7a.75.75 0 0 1-.75-.75m-1 3a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75m1 3a.75.75 0 0 1 .75-.75h7a.75.75 0 0 1 0 1.5h-7a.75.75 0 0 1-.75-.75m5.664-12.672a2 2 0 0 0-2.828 0l-3.879 3.88a1 1 0 1 1-1.414-1.415l3.879-3.879a4 4 0 0 1 5.656 0l3.88 3.879a1 1 0 0 1-1.415 1.414z" />
        </g>
      </svg>
    </div>
    <div data-text="Code-Ex" style="--r:5;" class="glass" @click="$router.push('/code')">
      <svg xmlns="http://www.w3.org/2000/svg" height="5rem" viewBox="0 0 32 32">
        <path fill="#fc44ac"
          d="m20.42 21.157l2.211 2.211L30 16l-7.369-7.369l-2.211 2.212L25.58 16Zm-8.84-10.314L9.369 8.631L2 16l7.369 7.369l2.211-2.211L6.42 16Zm5.831-3.166l1.6.437l-4.42 16.209l-1.6-.437z" />
      </svg>
    </div>
    <div data-text="Music" style="--r:25;" class="glass" @click="$router.push('/music')">
      <svg xmlns="http://www.w3.org/2000/svg" height="3rem" style="color: #f7d316;"
        viewBox="0 0 24 24"><!-- Icon from Solar by 480 Design - https://creativecommons.org/licenses/by/4.0/ -->
        <path fill="currentColor"
          d="m12.75 12.508l8.5-3.4v5.653a3.25 3.25 0 1 0 1.5 2.74V7.945c0-1.143 0-2.101-.08-2.865a8 8 0 0 0-.04-.315c-.078-.522-.214-1.008-.479-1.415a2.2 2.2 0 0 0-.62-.63l-.007-.005c-.708-.47-1.503-.437-2.322-.228c-.792.202-1.774.613-2.978 1.117l-2.094.876c-.565.236-1.043.437-1.418.644c-.4.22-.743.48-1.001.868s-.366.805-.415 1.259c-.046.426-.046.945-.046 1.557v7.952a3.25 3.25 0 1 0 1.5 2.74zM7.75 2a.75.75 0 0 0-1.5 0v5.76a3.25 3.25 0 1 0 1.5 2.74V5.005c.699.504 1.53.745 2.25.745a.75.75 0 0 0 0-1.5a2.44 2.44 0 0 1-1.488-.552c-.434-.357-.762-.9-.762-1.698" />
      </svg>
    </div>

  </div>

</template>


<script>
</script>
<style>
.container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container .glass {
  position: relative;
  width: 180px;
  height: 200px;
  background: linear-gradient(#fff2, transparent);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 25px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.5s;
  border-radius: 10px;
  margin: 0 -45px;
  backdrop-filter: blur(10px);
  transform: rotate(calc(var(--r) * 1deg));
}

.container:hover .glass {
  transform: rotate(0deg);
  margin: 0 10px;
}

.container .glass::before {
  content: attr(data-text);
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.container .glass svg {
  font-size: 2.5em;
  fill: #fff;
}
</style>