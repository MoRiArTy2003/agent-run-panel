# Agent Run Panel

A simple React-based UI to simulate and visualize an AI agent workflow using an event-driven architecture.

## Features

* Event-driven state management using useReducer
* Real-time task updates (simulated with setTimeout)
* Streaming outputs (partial results shown live)
* Task lifecycle handling (running, failed, retry, complete)
* Basic parallel task grouping
* Final result summary

## Tech Stack

* React (Vite)
* Tailwind CSS
* JavaScript

## Setup

```bash
npm install
npm run dev
```

## What this project demonstrates

This project focuses on:

* Designing UI from event streams
* Managing complex state transitions
* Handling async flows in frontend

## Future Improvements

* Better visualization of parallel tasks
* Timeline view
* Dependency tracking between tasks
