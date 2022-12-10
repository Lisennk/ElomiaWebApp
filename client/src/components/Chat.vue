<script>
import axios from "axios";
import SendIcon from 'vue-material-design-icons/Send.vue';
import RefreshIcon from 'vue-material-design-icons/Refresh.vue';
import EditIcon from 'vue-material-design-icons/Pencil.vue';

export default {
  components: {
    SendIcon,
    RefreshIcon,
    EditIcon,
  },
  data: () => ({
    axios,
    chatHistory: [
      {
        id: 1,
        text: 'Hi. How can I help you?\nI am very\nSmart chatbot',
        author: 'bot',
        showWarning: false,
      },
      {
        id: 2,
        text: 'I am depressed\nand hopeless',
        author: 'user',
        showWarning: true,
      },
      {
        id: 3,
        text: 'I am sorry to hear that. Why do you feel depressed? I am here for you.',
        author: 'bot',
        showWarning: true,
      },
    ],
    loading: false,
    sessionStarted: false,
  }),
  computed: {
  },
  methods: {
    send() {
      this.sessionStarted = true;
      window.scrollTo(0, document.body.scrollHeight);
      this.saveNewUserMessage();
      this.loading = true;
      axios.post(`https://agi.chat/conversation/response/create`, {
        chatHistory: this.chatHistory
      }).then(response => {
        this.loading = false;
        console.log(response.data.response.text);
        this.saveNewBotMessage(response.data.response.text);
      }).catch(e => {
        this.loading = false;
        console.log(e);
      });
    },

    async retry() {
      this.chatHistory = this.chatHistory.slice(0, this.chatHistory.length - 1);
      await this.send();
    },

    /**
     * Saves new bot message
     * @param text
     */
    saveNewBotMessage(text) {
      this.chatHistory.push({
        author: 'bot',
        text
      })
    },

    /**
     * Adds user message to the chat history
     */
    saveNewUserMessage() {
      const userMessage = this.$refs.input.innerText;
      if (!userMessage.trim()) return;

      this.chatHistory.push({
        text: userMessage,
        author: 'user'
      });

      this.$refs.input.innerText = '';
    }
  },
  mounted() {
  }
}
</script>

<template>
  <div class="session">
    <div class="chatHistory">
      <template v-for="(message, index) in chatHistory">
        <div :class="{
          message: true,
          received: message.author === 'bot',
          sent: message.author === 'user',
        }">
            <div :class="{
              avatar: true,
              bot: message.author === 'bot',
              user:  message.author === 'user'
            }"></div>

            <div class="text">
              {{message.text}}

              <div class="warning" v-if="message.showWarning && index === chatHistory.length - 1">
                <div class="title">Warning</div>
                <div class="text">AI can produce wrong responses and is not intended to be a substitute for in-person assistance, medical intervention, or crisis service.</div>
              </div>
            </div>

            <div class="controls">
              <div class="control" v-if="message.author === 'user'">
                <button class="button editButton" @click="editMessage(message.id)">
                  <EditIcon/>
                </button>
                </div>
              <div class="control" v-if="message.author === 'bot'">
                <button class="button retryButton" @click="refreshMessage(message.id)">
                  <RefreshIcon/>
                </button>
              </div>
            </div>
        </div>
      </template>
    </div>
    <div class="bottomContainer">
      <button v-if="sessionStarted" @click="retry" class="retry">
        <refresh-icon /> Try again
      </button>
      <div class="inputContainer">
        <div ref="input" contenteditable="true" class="textarea"></div>
        <button @click="send">
          <send-icon />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.session {
  background: #faf5f2;
  height: 100vh;

  .chatHistory {
    padding: 1.25rem;
    margin: 0 auto;
    max-width: 48rem;

    .message {
      max-width: 85%;
      width: fit-content;
      margin: 0.5rem 0;
      display: flex;
      white-space: pre-line;

      .controls {

        .control {
          padding-left: 1rem;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;


          .button {
            border: 0;
            border-radius: 100%;
            color: #727272;
            font-size: 0;
            padding: 0.5rem;
            margin: 0;
            max-height: 50px;
            max-width: 50px;
            background: #f4ece7;


            &:hover {
              background: #f3e2d7;
              cursor: pointer;
              color: black;
            }

            &:active {
              opacity: 0.5;
              cursor: pointer;
            }
          }
        }
      }

      .avatar {
        &.bot {
          width: 2rem;
          height: 2rem;
          border-radius: 100%;
          background: #fa9874;
        }
      }

      .text {
        padding: 0.5rem .875rem;
        border-radius: 0.85rem;
        display: block;
      }

      &.sent {
        margin-left: auto;

        .text {
          background: #fcd5c6;
          color: #642b19;
        }
      }

      &.received {
        margin-right: auto;

        &:last-of-type {
          flex-direction: column;
          max-width: 100%;

          .avatar {
            width: 3rem;
            height: 3rem;
          }

          .controls {
            display: none;
          }

          .warning {
            font-size: 0.9rem;
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 0;
            background: rgba(241, 230, 224, 0.66);

            .title {
              font-weight: bold;
              color: #bf8765;
            }

            .title, .text {
              font-size: 0.9rem;
            }

            .text {
              margin-top: 0.25rem;
            }
          }

          .text {
            background: none;
            font-size: 1.25rem;
            margin-left: 0;
            padding: 0;
            margin-top: 1rem;
          }
        }

        .text {
          background: #fff;
          margin-left: 10px;
        }
      }
    }
  }

  .bottomContainer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 2rem;

    .retry {
      border: 1px solid #565869;
      padding: 0.75rem;
      margin: 0 auto 2rem auto;
      border-radius: 0.8rem;
      color: white;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      background: #343541;

      &:hover {
        cursor: pointer;
        color: rgba(255, 255, 255, 0.77);
      }

      &:active {
        margin-bottom: 1.85rem;
      }

      .material-design-icon {
        font-size: 0rem;
        margin-right: 0.33rem;
      }
    }

    .inputContainer {
      margin: 0 auto;
      border-radius: 0.35rem;
      max-width: 48rem;
      background: #ffffff;
      border-color: #20212380;
      box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
      display: flex;
    }
  }

  .inputContainer {
    margin: 0 auto;
    max-width: 48rem;
    background: #40414f;
    border-color: #20212380;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    display: flex;

    .textarea {
      padding: 1rem;
      flex-grow: 1;
      outline: 0px solid transparent;
      background: transparent;
      border: 0;
      color: white;
      resize: none;
      font-size: 1rem;
    }

    button {
      background: transparent;
      border: none;
      padding: 1rem 1.25rem;
      color: #8e8ea0;
    }
  }

  .inputContainer > .inputContainer > button {
    background: transparent;
    border: none;
    padding: 1rem 1.25rem;
    color: #8e8ea0;

    &:hover {
      color: white;
      cursor: pointer;
    }
  }

  .inputContainer > button:hover {
    color: white;
    cursor: pointer;
  }
}

</style>
