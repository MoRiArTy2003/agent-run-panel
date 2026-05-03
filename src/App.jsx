import { useEffect, useReducer } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { runReducer, initialState } from "./runReducer";

function App() {
  const [state, dispatch] = useReducer(runReducer, initialState);

  useEffect(() => {
    const events = [
      {
        type: "run_started",
        run_id: "r1",
        query: "Analyse Apple R&D intensity vs peers",
      },

      {
        type: "task_spawned",
        task_id: "t1",
        label: "Fetch Apple data",
        agent: "fetcher",
      },

      { type: "partial_output", task_id: "t1", content: "Fetching filings..." },
      { type: "partial_output", task_id: "t1", content: "Parsing data..." },
      { type: "partial_output", task_id: "t1", content: "Extracting metrics..." },

      {
        type: "task_update",
        task_id: "t1",
        status: "complete",
      },

      {
        type: "task_spawned",
        task_id: "t2",
        label: "Fetch Microsoft data",
        agent: "peer_fetcher",
        parallel_group: "group-1",
      },
      {
        type: "task_spawned",
        task_id: "t3",
        label: "Fetch Google data",
        agent: "peer_fetcher",
        parallel_group: "group-1",
      },

      {
        type: "task_update",
        task_id: "t3",
        status: "failed",
        error: "Rate limit",
      },

      {
        type: "task_update",
        task_id: "t3",
        status: "running",
      },

      {
        type: "task_update",
        task_id: "t2",
        status: "complete",
      },
      {
        type: "task_update",
        task_id: "t3",
        status: "complete",
      },

      {
        type: "run_complete",
        output: {
          summary: "Apple R&D increased compared to peers.",
        },
      },
    ];

    events.forEach((e, i) => {
      setTimeout(() => dispatch(e), i * 1000);
    });
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* Final Output */}
      {state.run.status === "complete" && state.run.finalOutput && (
        <div className="border rounded-lg p-4 mb-4 bg-green-50">
          <h2 className="font-semibold text-green-700 flex items-center gap-2">
            <CheckCircle size={18} /> Final Result
          </h2>
          <p className="mt-2">{state.run.finalOutput.summary}</p>

          {state.run.startTime && state.run.endTime && (
            <p className="text-xs text-gray-500 mt-2">
              Duration: {state.run.endTime - state.run.startTime} ms
            </p>
          )}
        </div>
      )}

      {/* Query */}
      <div className="border rounded-lg p-4 mb-4">
        <h2 className="font-semibold">Query</h2>
        <p className="text-gray-600">{state.run.query}</p>
      </div>

      {/* Tasks */}
      <div>
        <h2 className="font-semibold mb-2">Tasks</h2>

        <div className="space-y-3">
          {state.taskOrder.map((id) => {
            const task = state.tasks[id];
            if (!task) return null;

            return (
              <div key={id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">

                  {/* LEFT */}
                  <div>
                    <p className="font-medium">{task.label}</p>
                    <p className="text-sm text-gray-500">{task.agent}</p>

                    {/* Parallel group (simple) */}
                    {task.parallel_group && (
                      <p className="text-xs text-purple-500">
                        Group: {task.parallel_group}
                      </p>
                    )}

                    {/* Error */}
                    {task.error && (
                      <p className="text-xs text-red-500 mt-1">
                        {task.error} (retrying...)
                      </p>
                    )}

                    {/* Outputs */}
                    {task.outputs.length > 0 && (
                      <div className="mt-2 text-sm space-y-1">
                        {task.outputs.map((o, i) => (
                          <p
                            key={i}
                            className={
                              i === task.outputs.length - 1
                                ? "font-medium"
                                : "text-gray-500"
                            }
                          >
                            • {o}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-2">
                    {task.status === "running" && (
                      <Loader2 className="animate-spin" size={16} />
                    )}
                    {task.status === "complete" && (
                      <CheckCircle size={16} className="text-green-600" />
                    )}
                    {task.status === "failed" && (
                      <XCircle size={16} className="text-red-600" />
                    )}

                    <span className="text-sm capitalize">
                      {task.status}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default App;