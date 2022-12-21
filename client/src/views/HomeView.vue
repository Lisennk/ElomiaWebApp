<script>

import axios from "axios";

export default {
  components: {
  },
  data: () => ({
    issueDescription: 'I am feeling stressed out. The cause of my tension is people wanting too much from me. I think people want so much from me because I am too nice. I mean that I have problems setting boundaries. Yes, I feel anxious when I try to set boundaries because then people begin to get mad at me.',
    steps: [

    ],
    currentStepIndex: 0,
    isLoading: false,
  }),
  computed: {
    currentStep() {
      return this.steps[this.currentStepIndex];
    },

    nextStep() {
      return this.steps[this.currentStepIndex + 1];
    }
  },
  methods: {
    start() {

      if (this.issueDescription.length < 200) {
        alert(`Please, provide a more informative description`);
      }

      this.isLoading = true;
      axios.post(`https://webapp.api.elomia.com/selfAnalysis/steps/all/create`, {
        text: this.issueDescription.trim()
      }).then(response => {

        console.log(response);
        this.isLoading = false;

        const awarenessBlock = response.data.data.awarenessBlock;
        const supportBlock = response.data.data.supportBlock;
        const improvementBlock = response.data.data.improvementBlock;

        console.log({
          awarenessBlock,
          supportBlock,
          improvementBlock
        })

        this.steps.push({
          type: 'text',
          text: 'Okay. Before we begin, I want to let you know that not all of my responses are accurate. I\'m not here to replace in-person assistance or medical intervention. But I can help you understand your issue and maybe find a solution.'
        });

        this.steps.push({
          type: 'text',
          text: `First, let\'s look more closely at the problem you described.\nI will ask about ${awarenessBlock.length} questions, and you will need to write a detailed answer to each one.`
        });

        for (let i = 0; i < awarenessBlock.length; i++) {
          const question = awarenessBlock[i];
          this.steps.push({
            type: 'question',
            question: question,
            description: i < 3 ? 'Write down every thought that comes into your mind. The more the better.' : 'To find a solution, even the smallest details are important.',
            needsPersonalization: i !== 0 ? (i === 1 ? true :Math.random() > 0.4) : false,
            answer: '',
          })
        }

        this.steps.push({
          type: 'text',
          text: supportBlock
        });

        this.steps.push({
          type: 'text',
          text: `Now let\'s try to figure out how you can solve this problem. At this step, you need to answer ${improvementBlock.length} more questions. Try to think deeply and use your imagination. Every idea you come up with will bring you closer to the solution. And remember — there are no wrong answers here.`
        });

        for (let i = 0; i < improvementBlock.length; i++) {
          const question = improvementBlock[i];
          this.steps.push({
            type: 'question',
            question: question,
            description: i < 3 ? 'There are no wrong answers here. Every idea you come up with brings us closer to the solution.' : 'Think deep and use your imagination.',
            needsPersonalization: Math.random() > 0.5,
            answer: '',
          })
        }

        this.steps.push({
          type: 'question',
          question: 'Thanks for the answers. I hope it\'s more clear to you now what to do next. Please tell me, was this conversation helpful to you?'
        });

        this.steps.push({
          type: 'question',
          question: 'Have any new steps emerged in your mind to solve this problem? If so, tell me what you came up with.'
        });

        this.steps.push({
          type: 'text',
          text: `Thanks for the feedback! You can use this tool at any time. To start a new session, just refresh the page.`,
        });

      }).catch(e => {
        console.log(e);
        alert(`Error: ${e.message}`);
       // window.location.reload();
      })
    },

    continue() {

      if (this.currentStep.question && !this.currentStep.answer) {
        alert(`Please, write a response to the question`);
        return;
      }

      if (this.nextStep) {
        if (false) {

          this.isLoading = true;

          let chatHistory = [];

          chatHistory.push({
            author: 'user',
            text: this.issueDescription
          });

          const questionsWithAnswers = this.steps.filter(step => step.type === 'question' && step.answer);
          questionsWithAnswers.forEach(question => {

            chatHistory.push({
              author: 'bot',
              text: question.question
            });

            chatHistory.push({
              author: 'user',
              text: question.answer
            });

          });

          axios.post(`https://webapp.api.elomia.com/selfAnalysis/question/personalize`, {
            question: this.nextStep.question,
            chatHistory
          }).then(response => {

            if (response) {
              const prefix = response.data.data;
              this.nextStep.question = `${prefix}\n${this.nextStep.question}`;
            }

            this.isLoading = false;
            this.currentStepIndex++;

          }).catch((e) => {

              this.isLoading = false;
              this.currentStepIndex++;

            });

        } else {

          if (this.currentStep.type === 'question') {
            this.isLoading = true;
            setTimeout(() => {
              this.currentStepIndex++;
              this.isLoading = false;
            }, Math.random() * 5000);
          } else {
            this.currentStepIndex++;
          }
        }
      }
    }
  },
  mounted() {
  }
}
</script>

<template>
  <v-layout>
    <v-main>
      <div class="progressContainer" v-if="this.steps.length > 0">
        <div class="progressBar" :style="{width: `${Math.round((this.currentStepIndex/this.steps.length)*100)}%`}"></div>
      </div>
      <div class="home">
        <div class="step" v-if="steps.length === 0">
          <div class="avatar"></div>
          <div class="question mt-4">
            How can I help you?
          </div>
          <div class="description">Describe your issue with 5-10 sentences</div>
          <div class="input mt-4">
            <v-textarea variant="solo" v-model="issueDescription" :disabled="isLoading" :loading="isLoading"></v-textarea>
            <v-btn color="black" size="x-large" @click="start" :loading="isLoading">Start session</v-btn>
          </div>
        </div>
        <div class="step" v-else>
          <div class="avatar"></div>
          <div class="question mt-4" v-if="currentStep.type === 'question'">
            {{currentStep.question}}
          </div>
          <div class="text" v-if="currentStep.type === 'text'">
            {{currentStep.text}}
          </div>
          <div class="description" v-if="currentStep.type === 'question'">
            {{currentStep.description}}
          </div>
          <div class="input mt-4" v-if="currentStep.type === 'question'">
            <v-textarea :disabled="isLoading" :loading="isLoading" variant="solo" v-model="currentStep.answer"></v-textarea>
          </div>
          <v-btn color="black" size="x-large" :loading="isLoading" @click="this.continue()">Continue</v-btn>
        </div>
      </div>
    </v-main>
  </v-layout>
</template>

<style lang="scss">
.progressContainer {
  background: #e3e3e3;
  height: 1rem;
  transition: all 2s ease-out;

  .progressBar {
    height: 100%;
    width:10%;
    background: black;
    transition: all 2s ease-out;
  }
}
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  .step {
    padding: 1.25rem;
    width: 100%;
    max-width: 48rem;

    .text {
      font-size: 1.4rem;
      margin-top: 2rem;
      margin-bottom: 2rem;
      white-space: pre-wrap;
    }

    .avatar {
      width: 4rem;
      height: 4rem;
      border-radius: 100%;
      border: 0.65rem #262626 solid;
      background: transparent;

      animation-name: loading;
      animation-duration: 1.5s;
      animation-iteration-count: infinite;
      animation-fill-mode: both;
    }

    .question {
      font-size: 1.45rem;
      white-space: pre-wrap;
    }

    .description {
      color: gray;
      margin-top: 0.85rem;
    }
  }
}

/* Keyframes */
@keyframes loading {
  0% { opacity: 1; }
  50% { opacity: 0.65; }
  100% { opacity: 1; }
}

</style>
