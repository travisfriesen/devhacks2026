import { NavView } from "@/store/useAppStore";

declare global {
    interface Window {
        electronAPI: {
            onNavView: (callback: (view: NavView) => void) => void;
            openFile: () => Promise<string | undefined>;
            saveFile: (filepath: string, content: string) => Promise<void>;
            removeAllListeners: (channel: string) => void;
        };
    }
}

export {};
