export interface ColorPalette {
    primary: string;
    secondary: string;
    tertiary: string;
    background: string;
    outline: string;
    paper: string;
}

export type FontSize = "sm" | "md" | "lg";

export const FONT_SIZE_MAP: Record<FontSize, string> = {
    sm: "14px",
    md: "16px",
    lg: "18px",
};

export const UI_FONTS = [
    { label: "Plus Jakarta Sans", value: '"Plus Jakarta Sans", sans-serif' },
    { label: "Lexend", value: '"Lexend", sans-serif' },
];

export const DISPLAY_FONTS = [
    { label: "Lexend", value: '"Lexend", serif' },
    { label: "Plus Jakarta Sans", value: '"Plus Jakarta Sans", sans-serif' },
    { label: "Cormorant", value: '"Cormorant", serif' },
];

export interface ThemePreset {
    name: string;
    palette: ColorPalette;
}

export const PRESET_PALETTES: ThemePreset[] = [
    {
        name: "Default",
        palette: {
            primary: "#23001e",
            secondary: "#b9314f",
            tertiary: "#c77dff",
            background: "#f5f0ff",
            outline: "#230903",
            paper: "#fffdf7",
        },
    },
    {
        name: "Midnight",
        palette: {
            primary: "#e8e0f0",
            secondary: "#c77dff",
            tertiary: "#b9314f",
            background: "#0e0a14",
            outline: "#3d2f55",
            paper: "#1a1225",
        },
    },
    {
        name: "Ocean",
        palette: {
            primary: "#012a4a",
            secondary: "#1a759f",
            tertiary: "#52b788",
            background: "#e8f4f8",
            outline: "#013a63",
            paper: "#f5fbff",
        },
    },
    {
        name: "Sepia",
        palette: {
            primary: "#3b1a00",
            secondary: "#a0522d",
            tertiary: "#c9a84c",
            background: "#fdf6e3",
            outline: "#4a2800",
            paper: "#fffbf0",
        },
    },
    {
        name: "Forest",
        palette: {
            primary: "#1a2e1a",
            secondary: "#4a7c59",
            tertiary: "#a8c680",
            background: "#eef3e8",
            outline: "#243d24",
            paper: "#f6faf2",
        },
    },
];

export interface ThemeSettings {
    themePreset: string;
    fontSize: FontSize;
    uiFont: string;
    displayFont: string;
}

export function applyTheme(settings: ThemeSettings): void {
    const preset =
        PRESET_PALETTES.find((p) => p.name === settings.themePreset) ??
        PRESET_PALETTES[0];
    const root = document.documentElement;

    root.style.setProperty("--color-primary", preset.palette.primary);
    root.style.setProperty("--color-secondary", preset.palette.secondary);
    root.style.setProperty("--color-tertiary", preset.palette.tertiary);
    root.style.setProperty("--color-background", preset.palette.background);
    root.style.setProperty("--color-outline", preset.palette.outline);
    root.style.setProperty("--color-paper", preset.palette.paper);
    root.style.setProperty("--font-ui", settings.uiFont);
    root.style.setProperty("--font-display", settings.displayFont);
    root.style.fontSize = FONT_SIZE_MAP[settings.fontSize];
}
