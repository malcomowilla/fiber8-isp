import React, {useReducer, useRef} from 'react';
import {useMap} from '@vis.gl/react-google-maps';

import reducer, {
  useDrawingManagerEvents,
  useOverlaySnapshots,
  DrawingActionKind
} from './un-redo.js';

export const UndoRedoControl = ({drawingManager}) => {
  const map = useMap();

  const [state, dispatch] = useReducer(reducer, {
    past: [],
    now: [],
    future: []
  });

  // We need this ref to prevent infinite loops in certain cases.
  // For example when the radius of circle is set via code (and not by user interaction)
  // the radius_changed event gets triggered again. This would cause an infinite loop.
  // This solution can be improved by comparing old vs. new values. For now we turn
  // off the "updating" when snapshot changes are applied back to the overlays.
  const overlaysShouldUpdateRef = useRef(false);

  useDrawingManagerEvents(drawingManager, overlaysShouldUpdateRef, dispatch);
  useOverlaySnapshots(map, state, overlaysShouldUpdateRef);

  return (
    <div className="drawing-history flex gap-2">
      <button
        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => dispatch({type: DrawingActionKind.UNDO})}
        disabled={!state.past.length}
        title="Undo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20"
          viewBox="0 -960 960 960"
          width="20">
          <path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z" />
        </svg>
      </button>
      <button
        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => dispatch({type: DrawingActionKind.REDO})}
        disabled={!state.future.length}
        title="Redo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20"
          viewBox="0 -960 960 960"
          width="20">
          <path d="M396-200q-97 0-166.5-63T160-420q0-94 69.5-157T396-640h252L544-744l56-56 200 200-200 200-56-56 104-104H396q-63 0-109.5 40T240-420q0 60 46.5 100T396-280h284v80H396Z" />
        </svg>
      </button>
    </div>
  );
};