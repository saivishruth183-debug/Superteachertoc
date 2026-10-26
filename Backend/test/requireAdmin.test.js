import assert from "node:assert/strict";
import test from "node:test";
import jwt from "jsonwebtoken";
import requireAdmin from "../middleware/requireAdmin.js";

const invoke = (authorization) => {
  let status = 200;
  let body;
  let nextCalled = false;
  const req = { headers: { authorization } };
  const res = {
    status(code) {
      status = code;
      return this;
    },
    json(value) {
      body = value;
      return this;
    },
  };

  requireAdmin(req, res, () => {
    nextCalled = true;
  });

  return { status, body, nextCalled, req };
};

test("requires a bearer token", () => {
  process.env.JWT_KEY = "test-secret";
  assert.equal(invoke(undefined).status, 401);
});

test("rejects invalid tokens and non-admin users", () => {
  process.env.JWT_KEY = "test-secret";
  assert.equal(invoke("Bearer invalid").status, 401);
  assert.equal(
    invoke(`Bearer ${jwt.sign({ role: "user" }, process.env.JWT_KEY)}`).status,
    403,
  );
});

test("allows a valid administrator token", () => {
  process.env.JWT_KEY = "test-secret";
  const token = jwt.sign({ id: "admin-id", role: "admin" }, process.env.JWT_KEY);
  const result = invoke(`Bearer ${token}`);

  assert.equal(result.status, 200);
  assert.equal(result.nextCalled, true);
  assert.equal(result.req.user.role, "admin");
});

test("reports missing JWT configuration", () => {
  const previousKey = process.env.JWT_KEY;
  delete process.env.JWT_KEY;
  const result = invoke(`Bearer ${jwt.sign({ role: "admin" }, "test-secret")}`);

  assert.equal(result.status, 503);
  if (previousKey) process.env.JWT_KEY = previousKey;
});
