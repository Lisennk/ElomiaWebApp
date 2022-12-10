<script setup>
import Chat from "../components/Chat.vue";
</script>

<template>
  <v-layout>
    <v-app-bar :elevation="1" dense>
      <v-app-bar-title>Session</v-app-bar-title>
      <template v-slot:append>
        <v-btn icon="mdi-close" href="/"></v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <Chat />
    </v-main>
  </v-layout>
</template>
