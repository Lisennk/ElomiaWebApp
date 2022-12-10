<template>
  <div class="load-icon center">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style scoped>
/* Load Icon */
.load-icon {
  width: 50px;
  height: 32px;

}
.load-icon span {
  display: inline-block;
  background: #6e6e6e;
  width: 20%;
  height: 10px;
  border-radius: 100px;
  margin-left: 5px;
}

/* Animation */
.load-icon span {
  animation-name: loading;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}
.load-icon span:nth-of-type(2) {
  animation-delay: .2s;
}
.load-icon span:nth-of-type(3) {
  animation-delay: .4s;
}

/* Keyframes */
@keyframes loading {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}

/* This isn't needed, just styling pen. */
body {
  font-family: sans-serif;
  background: #ddd;
}

</style>