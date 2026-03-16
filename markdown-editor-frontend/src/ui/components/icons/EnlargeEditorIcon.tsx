import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { enlargeEditorPanel, shrinkEditorPanel } from "@/store/panel-view-slice";
import { useCallback } from "react";
import clsx from "clsx";

export default function EnlargeEditorIcon() {
  const isEditorPanelEnlarged = useSelector((state: RootState) => state.panelView.editorPanelEnlarged);
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);
  const dispatch = useDispatch();

  const handleEditorPanelSizing = useCallback(() => {
    if (isEditorPanelEnlarged) {
      dispatch(shrinkEditorPanel());
    } else {
      dispatch(enlargeEditorPanel());
    }
  }, [isEditorPanelEnlarged, dispatch]);

  return (
    <button
      title="Enlarge Editor"
      className={clsx(
        'p-1.5 rounded border-1 hover:border-gray-400',
        {
          'bg-[#6161614d] border-gray-300': isEditorPanelEnlarged && !isDarkTheme,
          'bg-white border-gray-300': !isEditorPanelEnlarged && !isDarkTheme,
          'bg-[#3c3c3c] border-[#3c3c3c]': isEditorPanelEnlarged && isDarkTheme,
          'bg-[#1e1e1e] border-[#3c3c3c]': !isEditorPanelEnlarged && isDarkTheme
        }
      )}
      onClick={handleEditorPanelSizing}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
    </button>
  );
}