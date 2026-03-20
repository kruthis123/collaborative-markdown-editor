import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ById {
  [id: string]: { // "A-1", "B-3", etc.
    id: { client: string, clock: number }, // { client: "A", clock: 1 }
    char: string, // single character to be inserted
    deleted: boolean, // whether this character has been deleted
    left: string | null // left neighbor id
  }
}

interface CRDTState {
  byId: ById,
  order: Array<string>,  // [ "A-1", "A-2", "B-1" ] denotes order of ops stored in byId
  clientId: string, // client identifier - "A", "B" etc.
  counter: number, // counter tracking number of ops in current client
}

interface MarkdownState {
  markdown: string,
  crdt: CRDTState,
  ui: {
    remoteVersion: number
  }
}

export function idToString(id: { client: string, clock: number }): string {
  return `${id.client}-${id.clock}`;
}

function compareId(a: { client: string, clock: number }, b: { client: string, clock: number}) {
  if (a.clock !== b.clock) return a.clock - b.clock;
  return a.client.localeCompare(b.client);
}

function initializeCRDT(text: string): MarkdownState {
  const byId: ById = {};
  const order: Array<string> = [];

  let prevId = null

  // convert all characters in default input text as operations
  for (let i = 0; i < text.length; i++) {
    const idObj = { client: "init", clock: i };
    const idString = idToString(idObj);

    byId[idString] = {
      id: idObj,
      char: text[i],
      deleted: false,
      left: prevId,
    }

    prevId = idString;

    order.push(idString);
  }

  const markdown = order
    .map(id => byId[id].char)
    .join('');

  return {
    crdt: {
      byId,
      order,
      clientId: "1",
      counter: 0
    },
    markdown,
    ui: {
      remoteVersion: 0
    }
  }
}

function updateCRDTWithNewContent(text: string): { crdt: CRDTState, markdown: string } {
  const result = initializeCRDT(text);
  return {
    crdt: result.crdt,
    markdown: result.markdown
  };
}

const initialState = initializeCRDT("# Hello! Collaborative Markdown Editor");

const markdownSlice = createSlice({
  name: "crdt",
  initialState,
  reducers: {
    applyInsert: (state: MarkdownState, action: PayloadAction<{id: { client: string, clock: number }, char: string, left: string | null }>) => {
      const { id, char, left } = action.payload;
      const idString = idToString(id);

      if (state.crdt.byId[idString]) {
        return;
      }

      state.crdt.byId[idString] = {
        id,
        char,
        deleted: false,
        left
      }

      let index = 0;

      if (left !== null) {
        index = state.crdt.order.indexOf(left) + 1;
      }

      while (index < state.crdt.order.length) {
        const currentIdString = state.crdt.order[index];
        const current = state.crdt.byId[currentIdString];
        if (current.left !== left) break;
        if (compareId(current.id, id) > 0) break;
        index++;
      }

      state.crdt.order.splice(index, 0, idString);

      state.markdown = state.crdt.order
        .filter(id => !state.crdt.byId[id].deleted)
        .map(id => state.crdt.byId[id].char)
        .join('');
    },
    applyDelete: (state: MarkdownState, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;

      if (state.crdt.byId[id]) {
        state.crdt.byId[id].deleted = true;
      }

      state.markdown = state.crdt.order
        .filter(id => !state.crdt.byId[id].deleted)
        .map(id => state.crdt.byId[id].char)
        .join('');
    },
    incrementCounter: (state: MarkdownState) => {
      state.crdt.counter++;
    },
    setClientId: (state: MarkdownState, action: PayloadAction<string>) => {
      state.crdt.clientId = action.payload;
    },
    loadDocument: (state: MarkdownState, action: PayloadAction<{ content: string }>) => {
      const { content } = action.payload;
      const result =  updateCRDTWithNewContent(content);
      state.crdt = result.crdt;
      state.markdown = result.markdown;
    },
    incrementRemoteVersion: (state: MarkdownState) => {
      state.ui.remoteVersion++;
    }
  }
});

export const { applyInsert, applyDelete, incrementCounter, setClientId, loadDocument, incrementRemoteVersion } = markdownSlice.actions;
export default markdownSlice.reducer;