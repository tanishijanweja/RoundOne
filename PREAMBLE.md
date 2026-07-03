# PREAMBLE

# RoundOne

> An AI-powered live technical interviewing platform that conducts realistic voice interviews, evaluates candidates, and generates actionable interview reports.

---

## Vision

RoundOne aims to recreate the experience of interviewing with a real engineer.

Instead of filling out forms or chatting with a bot, candidates participate in a natural voice conversation where the AI asks follow-up questions, evaluates responses in real time, and produces a structured interview summary.

The long-term goal is to provide an interview experience that feels human while remaining scalable and inexpensive enough for recruiters, startups, and developers.

---

# Core Idea

The interview consists of a real-time voice conversation between the candidate and an AI interviewer.

The application should:

- conduct live voice interviews
- ask contextual follow-up questions
- understand the candidate's responses
- scrape public profile information (GitHub, LinkedIn, resume)
- adapt questions based on candidate background
- generate an interview report after completion

---

# Tech Stack

## Frontend

- React
- TailwindCSS
- WebRTC

## Backend

- Bun

## AI

- OpenAI Realtime API

## Voice

- Speech-to-Text
- Text-to-Speech
- Realtime Voice Models

---

# Architecture Philosophy

There are generally two approaches to building voice agents.

## Traditional Pipeline

```
Speech
    ↓
Speech-to-Text
    ↓
LLM
    ↓
Text-to-Speech
```

Advantages

- cheaper
- modular
- easy to replace providers

Disadvantages

- higher latency
- multiple moving parts
- more complex orchestration

---

## Voice-to-Voice Models

```
Speech
    ↓
Realtime Voice Model
    ↓
Speech
```

Advantages

- extremely low latency
- natural conversations
- simpler interaction flow

Disadvantages

- more expensive
- stronger vendor dependency
- harder to swap providers

---

RoundOne follows the second approach.

The primary objective is creating an interview that feels like talking to a real interviewer rather than optimizing for the absolute lowest infrastructure cost.

---

# Backend Responsibilities

The backend is responsible for:

- authentication
- interview lifecycle
- issuing ephemeral session tokens
- interview orchestration
- profile scraping
- report generation
- persistence
- analytics

The backend should remain the source of truth throughout the interview.

---

# Realtime Communication

Voice communication happens using WebRTC.

The browser communicates with the realtime model while the backend coordinates interview state, manages sessions, and stores conversation data.

This architecture keeps latency low while still allowing the server to control the interview process.

---

# Candidate Context

Before an interview begins, RoundOne should gather as much context as possible about the candidate.

Potential sources include:

- GitHub profile
- LinkedIn profile
- uploaded resume

This information enables the interviewer to ask personalized and technically relevant questions.

---

# Interview Flow

1. Candidate joins interview.
2. Profile information is collected.
3. AI interviewer receives interview context.
4. Voice interview begins.
5. AI asks adaptive follow-up questions.
6. Conversation is recorded.
7. Evaluation is generated.
8. Final report is presented.

---

# Guiding Principles

Every feature should prioritize:

- Low latency
- Natural conversations
- Clean architecture
- Modular components
- Server-controlled interview flow
- Extensible AI prompts
- Easy provider replacement where possible
- Great developer experience

---

# Development Philosophy

RoundOne should be built incrementally.

Focus on getting one complete interview flow working before introducing additional features.

Prioritize simplicity over premature optimization.

Whenever possible:

- keep components composable
- avoid unnecessary abstractions
- build features end-to-end
- optimize only after correctness

The ultimate goal is to make interviewing feel indistinguishable from speaking with a skilled human interviewer.