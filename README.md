# 📝 Real-Time Collaborative Markdown Editor (CRDT-based)

A real-time collaborative Markdown editor built from scratch using a custom **Conflict-free Replicated Data Type (CRDT)** implementation. This project demonstrates how distributed systems can achieve **eventual consistency** without centralized conflict resolution.

---

## 🚀 Features

* ⚡ **Real-time collaboration** across multiple clients
* 🧠 **Custom CRDT (RGA) implementation** for conflict-free editing
* 🔁 **Deterministic convergence** under concurrent edits
* 🧩 **Redux-based state management** for CRDT state
* 🌐 **WebSocket-based communication** for low-latency sync
* 📝 **Markdown preview rendering**
* 👥 **Live cursor & selection presence** (multi-user awareness)
*  💾 Persistent document storage

---

## 🧠 Why This Project?

Building a collaborative editor is deceptively hard.

A naive approach (sending full document updates or index-based edits) fails under concurrency:

```
User A inserts at index 5
User B inserts at index 5
→ Different final states ❌
```

This project solves that using a **CRDT**, ensuring:

* No conflicts
* No central merge logic
* All clients eventually converge to the same state

---

## 🧩 Core Idea: RGA (Replicated Growable Array)

Instead of editing text by position, each character is:

* Assigned a **unique ID**
* Linked to a **left neighbor**

### Example:

```
Initial:
A → B → C

Two users insert concurrently after B:

User 1: X
User 2: Y

Result (deterministic order):
A → B → X → Y → C
```

### Why this works:

* Operations are **commutative**
* Ordering is resolved **locally using IDs**
* No need for locks or server-side merging

---

## 🏗️ Architecture

```
        ┌──────────────┐
        │   Client A   │
        │ (Monaco +    │
        │  Redux CRDT) │
        └──────┬───────┘
               │ WebSocket
               ▼
        ┌──────────────┐
        │    Server    │
        │ (Relay only) │
        └──────┬───────┘
               │ WebSocket
               ▼
        ┌──────────────┐
        │   Client B   │
        │ (Monaco +    │
        │  Redux CRDT) │
        └──────────────┘
```

### Key principles:

* 🧠 **Client is the source of truth**
* 🔁 Server only **relays operations**
* ⚡ Edits are applied **optimistically**

---

## 🔄 Data Flow

### Local Edit

```
User types → Monaco event
 → Convert to CRDT operation
 → Update Redux (local state)
 → Send operation via WebSocket
```

### Remote Edit

```
Receive operation → Apply to CRDT
 → Update Redux
 → UI re-renders automatically
```

---

## 🧱 CRDT Data Model

Each character node:

```js
{
  id: { client: "A", clock: 1 },
  char: "H",
  deleted: false,
  left: null
}
```

### Key properties:

* **ID** → uniquely identifies element
* **left** → establishes ordering
* **deleted** → tombstone (preserves structure)

---

## ✂️ Operations

### Insert

```js
insert({
  id,
  char,
  left
})
```

* Insert after `left`
* Resolve conflicts using deterministic ID ordering

---

### Delete

```js
delete({ id })
```

* Marks node as deleted (tombstone)
* Does not remove it physically

---

## 👥 Cursor Presence

* Tracks `{ start, end }` offsets per user
* Broadcasts via WebSocket
* Rendered using Monaco decorations

---

## ⚙️ Tech Stack

* **Frontend:** Next.js, React
* **Editor:** Monaco Editor
* **State:** Redux
* **Realtime:** WebSockets
* **Algorithm:** Custom CRDT (RGA)

---

## ⚠️ Limitations

This is a learning-focused implementation. Known limitations:

* O(n) insertion due to array-based ordering
* Tombstones accumulate (no garbage collection)
* Cursor positions are not CRDT-transformed (may drift slightly)
* No persistence layer (in-memory only)

---

## 🔮 Future Improvements

* 🌳 Tree-based indexing (like Yjs)
* 🧹 Garbage collection for tombstones

---

## 📚 Learnings

This project helped me deeply understand:

* Distributed system consistency models
* Real-time system design tradeoffs
* State synchronization across clients
* Editor internals and diff handling

---

## 💡 Inspiration

Inspired by collaborative editors like:

* Google Docs
* Notion
* Figma
