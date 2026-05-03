export const initialState = {
  run: {
    id: null,
    query: "",
    status: "idle",
    startTime: null,
    endTime: null,
    finalOutput: null,
  },
  tasks: {},
  taskOrder: [],
};

export function runReducer(state, event) {
  switch (event.type) {
    case "run_started":
      return {
        ...state,
        run: {
          id: event.run_id,
          query: event.query,
          status: "running",
          startTime: Date.now(),
          endTime: null,
          finalOutput: null,
        },
      };

    case "task_spawned": {
      const newTask = {
        id: event.task_id,
        label: event.label,
        agent: event.agent,
        status: "running",
        outputs: [],
        error: null,
        parallel_group: event.parallel_group || null,
      };

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [event.task_id]: newTask,
        },
        taskOrder: [...state.taskOrder, event.task_id],
      };
    }

    case "partial_output": {
      const task = state.tasks[event.task_id];
      if (!task) return state;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [event.task_id]: {
            ...task,
            outputs: [...task.outputs, event.content],
          },
        },
      };
    }

    case "task_update": {
      const task = state.tasks[event.task_id];
      if (!task) return state;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [event.task_id]: {
            ...task,
            status: event.status,
            error: event.error || null,
          },
        },
      };
    }

    case "run_complete":
      return {
        ...state,
        run: {
          ...state.run,
          status: "complete",
          endTime: Date.now(),
          finalOutput: event.output,
        },
      };

    default:
      return state;
  }
}