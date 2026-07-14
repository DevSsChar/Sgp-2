const REQUEST_TYPE = "AG_REQUEST_SESSION_IMPORT";
const RESPONSE_TYPE = "AG_SESSION_IMPORT_RESULT";
const PING_TYPE = "AG_EXTENSION_PING";
const PONG_TYPE = "AG_EXTENSION_PONG";

window.addEventListener("message", (event) => {
  if (event.source !== window || !event.data?.type) return;

  if (event.data.type === PING_TYPE) {
    window.postMessage(
      {
        type: PONG_TYPE,
        requestId: event.data.requestId,
        ok: true,
      },
      "*"
    );
    return;
  }

  if (event.data.type !== REQUEST_TYPE || !event.data.targetUrl || !event.data.requestId) {
    return;
  }

  chrome.runtime.sendMessage(
    {
      action: "captureSession",
      targetUrl: event.data.targetUrl,
    },
    (response) => {
      const runtimeError = chrome.runtime.lastError;
      window.postMessage(
        {
          type: RESPONSE_TYPE,
          requestId: event.data.requestId,
          ok: !runtimeError && response?.ok,
          session: response?.session,
          error: runtimeError?.message || response?.error || "Session import failed",
        },
        "*"
      );
    }
  );
});
