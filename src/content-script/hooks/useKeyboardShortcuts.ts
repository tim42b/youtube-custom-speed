import { useEventListener } from "usehooks-ts";
import { getBezelText } from "../utils";
import { formatShortcut } from "@/utils/keyboardShortcut";
import { useStorage } from "@/hooks/useStorage";
import useSetSpeed from "./useSetSpeed";

const ElementsToIgnore = [
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "EMBED",
  "YTD-COMMENTBOX",
  "YT-LIVE-CHAT-RENDERER",
  "YTD-PDG-BUY-FLOW-RENDERER",
];

function useKeyboardShortcuts() {
  const { decreaseSpeed, increaseSpeed, setSpeed } = useSetSpeed();
  const [speedShortcuts] = useStorage(
    "speedShortcuts",
    {} as Record<string, string>,
  );

  const triggerShortcutUi = (newSpeed: number) => {
    const bezelText = getBezelText();
    if (!bezelText) return;

    bezelText.innerText = `${newSpeed}x`;
  };

  useEventListener("keydown", (event) => {
    if (!event.target || !(event.target instanceof HTMLElement)) return;

    const isInput = event.target.closest(ElementsToIgnore.join(",")) !== null;
    if (isInput) return;

    const combo = formatShortcut(event);
    const matched = Object.entries(speedShortcuts).find(
      ([, sc]) => sc === combo,
    );
    if (matched) {
      const speed = parseFloat(matched[0]);
      setSpeed(speed);
      triggerShortcutUi(speed);
      return;
    }

    if (event.shiftKey && ["Comma", "Period"].includes(event.code)) {
      const speedFunction =
        event.code === "Comma" ? decreaseSpeed : increaseSpeed;

      const newSpeed = speedFunction();
      triggerShortcutUi(newSpeed);
    }
  });
}

export default useKeyboardShortcuts;
