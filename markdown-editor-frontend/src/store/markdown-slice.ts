import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CRDTState {
  byId: {
    [id: string]: { // "A-1", "B-3", etc.
      id: string, // "A-1", "B-3", etc.
      char: string, // single character to be inserted
      deleted: boolean // whether this character has been deleted
    }
  },
  order: Array<string>,  // [ "A-1", "A-2", "B-1" ] denotes order of ops stored in byId
  clientId: string, // client identifier - "A", "B" etc.
  counter: number, // counter tracking number of ops in current client
}

interface MarkdownState {
  markdown: string,
  crdt: CRDTState
}

function initializeCRDT(text: string, clientId: string): MarkdownState {
  const byId: {
    [id: string]: {
      id: string
      char: string,
      deleted: boolean
    }
  } = {};
  const order: Array<string> = [];
  const counter = 0;

  // convert all characters in default input text as operations
  for (let i = 0; i < text.length; i++) {
    const id = `init-${i}`;

    byId[id] = {
      id,
      char: text[i],
      deleted: false
    }

    order.push(id);
  }

  const markdown = order
    .map(id => byId[id].char)
    .join('');

  return {
    crdt: {
      byId,
      order,
      clientId,
      counter
    },
    markdown
  }
}

const initialState = initializeCRDT("# Hello! Collaborative Markdown Editor", "A");

const markdownSlice = createSlice({
  name: "crdt",
  initialState,
  reducers: {
    applyInsert: (state: MarkdownState, action: PayloadAction<{ index: number, char: string, id: string }>) => {
      const { index, char, id } = action.payload;

      // Fetch the visible order. This will ensure the ids in order array, exactly map to the character present in the document at the same index
      const visibleOrder = state.crdt.order.filter(
        id => !state.crdt.byId[id].deleted
      );

      let insertIndex = 0;
      // Insert the new operations in relative order to ensure the next calculation of visibleOrder still holds true
      if (index !== 0) {
        const leftVisibleId = visibleOrder[index - 1];
        insertIndex = state.crdt.order.indexOf(leftVisibleId) + 1;
      }

      state.crdt.byId[id] = {
        id,
        char,
        deleted: false
      }
      state.crdt.order.splice(insertIndex, 0, id);
      state.markdown = state.crdt.order
        .filter(id => !state.crdt.byId[id].deleted)
        .map(id => state.crdt.byId[id].char)
        .join('');
    },
    applyDelete: (state: MarkdownState, action: PayloadAction<{ index: number, length: number }>) => {
      const { index, length } = action.payload;
      
      // Fetch the visible order. This will ensure the ids in order array, exactly map to the character present in the document at the same index
      const visibleOrder = state.crdt.order.filter(
        id => !state.crdt.byId[id].deleted
      );

      const idsToDelete = visibleOrder.slice(index, index + length);

      idsToDelete.forEach(id => {
        state.crdt.byId[id].deleted = true;
      });

      state.markdown = state.crdt.order
        .filter(id => !state.crdt.byId[id].deleted)
        .map(id => state.crdt.byId[id].char)
        .join('');
    },
    incrementCounter: (state: MarkdownState) => {
      state.crdt.counter++;
    }
  }
});

export const { applyInsert, applyDelete, incrementCounter } = markdownSlice.actions;
export default markdownSlice.reducer;