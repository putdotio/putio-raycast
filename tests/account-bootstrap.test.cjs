const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");
const React = require("react");
const { act, create } = require("react-test-renderer");

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

function fixture() {
  let token = "first-token";
  const calls = [];
  const toasts = [];
  let preferences = 0;
  const host = {
    Action: (props) => React.createElement("action", props),
    ActionPanel: (props) => React.createElement("actions", props),
    Detail: ({ actions, ...props }) => React.createElement("detail", props, actions),
    Icon: { ArrowClockwise: "retry", Gear: "preferences" },
    Toast: { Style: { Failure: "failure" } },
    environment: { commandMode: "view", launchType: "user" },
    LaunchType: { Background: "background" },
    showToast: (options) => {
      toasts.push(options);
      return Promise.resolve();
    },
    openExtensionPreferences: () => {
      preferences += 1;
      return Promise.resolve();
    },
    getPreferenceValues: () => ({ token }),
  };
  class Client {
    setToken(value) {
      this.token = value;
    }
    Account = {
      Info: () => {
        const request = deferred();
        calls.push({ client: this, request });
        return request.promise;
      },
    };
  }
  function evaluate(code, filename, overrides) {
    const mod = { exports: {} };
    const realRequire = createRequire(filename);
    const localRequire = (name) => (Object.hasOwn(overrides, name) ? overrides[name] : realRequire(name));
    vm.runInThisContext(`(function(require, module, exports) {${code}\n})`, { filename })(
      localRequire,
      mod,
      mod.exports,
    );
    return mod.exports;
  }
  const utilsPath = require.resolve("@raycast/utils");
  const utils = evaluate(fs.readFileSync(utilsPath, "utf8"), utilsPath, { "@raycast/api": host });
  function source(relative, overrides = {}) {
    const filename = path.resolve(__dirname, "../src", relative);
    const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
        target: ts.ScriptTarget.ES2022,
      },
      fileName: filename,
    }).outputText;
    return evaluate(code, filename, { "@raycast/api": host, ...overrides });
  }
  const localizer = source("api/localizeError.ts");
  const auth = source("api/withPutioClient.tsx", {
    "@raycast/utils": utils,
    "@putdotio/api-client": Client,
    "./localizeError": localizer,
    "../utils": source("utils/index.ts"),
  });
  function Content() {
    return React.createElement("account", {
      info: auth.getPutioAccountInfo(),
      client: auth.getPutioClient(),
    });
  }
  function Command() {
    return auth.withPutioClient(React.createElement(Content));
  }
  let root;
  return {
    calls,
    toasts,
    auth,
    setToken(value) {
      token = value;
    },
    async mount() {
      await act(async () => {
        root = create(React.createElement(Command));
      });
    },
    async render() {
      await act(async () => {
        root.update(React.createElement(Command));
      });
    },
    async dispose() {
      if (root) await act(async () => root.unmount());
    },
    async succeed(index, info) {
      await act(async () => calls[index].request.resolve({ data: { info } }));
    },
    async fail(index, error) {
      await act(async () => calls[index].request.reject(error));
    },
    async action(title) {
      await act(async () => {
        root.root
          .findAllByType("action")
          .find((action) => action.props.title === title)
          .props.onAction();
      });
    },
    get detail() {
      return root.root.findByType("detail").props;
    },
    get account() {
      return root.root.findByType("account").props;
    },
    get preferences() {
      return preferences;
    },
  };
}

test("initial pending becomes a localized network failure with retry and preferences", async () => {
  const app = fixture();
  try {
    await app.mount();
    assert.equal(app.detail.isLoading, true);
    await app.fail(0, new Error("private network detail"));
    assert.ok(!app.detail.isLoading);
    assert.match(app.detail.markdown, /Something went wrong/);
    assert.doesNotMatch(app.detail.markdown, /private network detail/);
    await app.action("Open Extension Preferences");
    assert.equal(app.preferences, 1);
    await app.action("Retry");
    assert.equal(app.detail.isLoading, true);
    const info = { username: "first", settings: {} };
    await app.succeed(1, info);
    assert.equal(app.account.info, info);
    assert.equal(app.account.client, app.calls[1].client);
    assert.equal(app.account.client.token, "first-token");
  } finally {
    await app.dispose();
  }
});

test("401 shows the existing authorization localization without indefinite loading", async () => {
  const app = fixture();
  try {
    await app.mount();
    await app.fail(0, { status: "ERROR", status_code: 401, error_type: "Unauthorized", error_message: "fixture" });
    assert.ok(!app.detail.isLoading);
    assert.match(app.detail.markdown, /You are not authorized/);
    assert.equal(app.toasts.length, 1);
  } finally {
    await app.dispose();
  }
});

test("missing account information becomes a recoverable failure", async () => {
  const app = fixture();
  try {
    await app.mount();
    await app.succeed(0, null);
    assert.ok(!app.detail.isLoading);
    assert.match(app.detail.markdown, /Something went wrong/);
    await app.action("Retry");
    assert.equal(app.calls.length, 2);
  } finally {
    await app.dispose();
  }
});

test("token change resets bootstrap and ignores the old pending account response", async () => {
  const app = fixture();
  try {
    await app.mount();
    app.setToken("second-token");
    await app.render();
    assert.equal(app.detail.isLoading, true);
    const second = { username: "second", settings: {} };
    await app.succeed(1, second);
    await app.succeed(0, { username: "old", settings: {} });
    assert.equal(app.account.info, second);
    assert.equal(app.auth.getPutioAccountInfo(), second);
    assert.equal(app.account.client, app.calls[1].client);
    assert.equal(app.account.client.token, "second-token");
  } finally {
    await app.dispose();
  }
});

test("a changed credential cannot reuse the previous account while loading or failed", async () => {
  const app = fixture();
  try {
    await app.mount();
    await app.succeed(0, { username: "first", settings: {} });
    app.setToken("second-token");
    assert.throws(() => app.auth.getPutioClient(), /authenticated/);
    await app.render();
    assert.equal(app.detail.isLoading, true);
    await app.fail(1, new Error("offline"));
    assert.ok(!app.detail.isLoading);
    assert.throws(() => app.auth.getPutioAccountInfo(), /authenticated/);
  } finally {
    await app.dispose();
  }
});

test("retry reads changed preferences without a host rerender", async () => {
  const app = fixture();
  try {
    await app.mount();
    await app.fail(0, new Error("offline"));
    await app.action("Open Extension Preferences");
    app.setToken("second-token");
    await app.action("Retry");
    assert.equal(app.detail.isLoading, true);
    assert.equal(app.calls[1].client.token, "second-token");
    const info = { username: "second", settings: {} };
    await app.succeed(1, info);
    assert.equal(app.account.info, info);
    assert.equal(app.account.client.token, "second-token");
  } finally {
    await app.dispose();
  }
});

for (const completion of ["success", "failure"]) {
  test(`pending ${completion} refreshes changed preferences without a host rerender`, async () => {
    const app = fixture();
    try {
      await app.mount();
      app.setToken("second-token");
      if (completion === "success") {
        await app.succeed(0, { username: "old", settings: {} });
      } else {
        await app.fail(0, new Error("old request failed"));
      }
      assert.equal(app.detail.isLoading, true);
      assert.equal(app.calls[1].client.token, "second-token");
      assert.equal(app.toasts.length, 0);
      const info = { username: "second", settings: {} };
      await app.succeed(1, info);
      assert.equal(app.account.info, info);
      assert.equal(app.account.client, app.calls[1].client);
    } finally {
      await app.dispose();
    }
  });
}
