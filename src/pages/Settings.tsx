import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { PRESET_PALETTES, DISPLAY_FONTS, UI_FONTS, FontSize } from "@/utils/applyTheme";

const FONT_SIZE_OPTIONS: { label: string; value: FontSize }[] = [
    { label: "Small", value: "sm" },
    { label: "Medium", value: "md" },
    { label: "Large", value: "lg" },
];

const Settings = () => {
    const {
        themePreset,
        setThemePreset,
        fontSize,
        setFontSize,
        uiFont,
        setUiFont,
        displayFont,
        setDisplayFont,
        dailyGoal,
        setDailyGoal,
    } = useAppStore();

    return (
        <div className="p-8 max-w-3xl mx-auto space-y-10">
            {/* Page title */}
            <div>
                <h1 className="text-2xl font-semibold text-primary">Settings</h1>
                <p className="mt-1 text-sm text-primary/50">
                    Customise the look and feel of the app.
                </p>
            </div>

            {/* ── Colour Palette ─────────────────────────────────────── */}
            <section className="space-y-3">
                <h2 className="text-xs font-semibold tracking-widest text-primary/40 uppercase">
                    Colour Palette
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PRESET_PALETTES.map((preset) => {
                        const active = preset.name === themePreset;
                        return (
                            <button
                                key={preset.name}
                                onClick={() => setThemePreset(preset.name)}
                                className={[
                                    "p-3 border text-left transition-all",
                                    active
                                        ? "border-secondary ring-1 ring-secondary"
                                        : "border-outline/30 hover:border-secondary/60",
                                ].join(" ")}
                                style={{ backgroundColor: "var(--color-paper)" }}
                            >
                                <span className="block text-sm text-primary mb-2 font-medium">
                                    {preset.name}
                                </span>
                                <div className="flex gap-1.5">
                                    {(
                                        [
                                            "background",
                                            "primary",
                                            "secondary",
                                            "tertiary",
                                            "paper",
                                        ] as const
                                    ).map((key) => (
                                        <span
                                            key={key}
                                            className="w-5 h-5 border border-outline/20 flex-shrink-0"
                                            style={{
                                                backgroundColor:
                                                    preset.palette[key],
                                            }}
                                        />
                                    ))}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* ── Font Size ───────────────────────────────────────────── */}
            <section className="space-y-3">
                <h2 className="text-xs font-semibold tracking-widest text-primary/40 uppercase">
                    Font Size
                </h2>
                <div className="flex gap-2">
                    {FONT_SIZE_OPTIONS.map((opt) => {
                        const active = opt.value === fontSize;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => setFontSize(opt.value)}
                                className={[
                                    "px-5 py-2 border text-sm transition-all",
                                    active
                                        ? "bg-secondary text-paper border-secondary"
                                        : "border-outline/30 text-primary hover:border-secondary/60",
                                ].join(" ")}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* ── UI Font ─────────────────────────────────────────────── */}
            <section className="space-y-3">
                <h2 className="text-xs font-semibold tracking-widest text-primary/40 uppercase">
                    UI Font
                </h2>
                <p className="text-xs text-primary/40">
                    Controls buttons, labels, and body text.
                </p>
                <div className="flex flex-wrap gap-2">
                    {UI_FONTS.map((f) => {
                        const active = f.value === uiFont;
                        return (
                            <button
                                key={f.value}
                                onClick={() => setUiFont(f.value)}
                                className={[
                                    "px-5 py-2 border text-sm transition-all",
                                    active
                                        ? "bg-secondary text-paper border-secondary"
                                        : "border-outline/30 text-primary hover:border-secondary/60",
                                ].join(" ")}
                                style={{ fontFamily: f.value }}
                            >
                                {f.label}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* ── Display Font ────────────────────────────────────────── */}
            <section className="space-y-3">
                <h2 className="text-xs font-semibold tracking-widest text-primary/40 uppercase">
                    Display Font
                </h2>
                <p className="text-xs text-primary/40">
                    Controls headings (h1–h6).
                </p>
                <div className="flex flex-wrap gap-2">
                    {DISPLAY_FONTS.map((f) => {
                        const active = f.value === displayFont;
                        return (
                            <button
                                key={f.value}
                                onClick={() => setDisplayFont(f.value)}
                                className={[
                                    "px-5 py-2 border text-sm transition-all",
                                    active
                                        ? "bg-secondary text-paper border-secondary"
                                        : "border-outline/30 text-primary hover:border-secondary/60",
                                ].join(" ")}
                                style={{ fontFamily: f.value }}
                            >
                                {f.label}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* ── Daily Goal ──────────────────────────────────────────── */}
            <section className="space-y-3">
                <h2 className="text-xs font-semibold tracking-widest text-primary/40 uppercase">
                    Daily Goal
                </h2>
                <p className="text-xs text-primary/40">
                    Number of cards to review per day.
                </p>
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        min={1}
                        max={500}
                        value={dailyGoal}
                        onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            if (!isNaN(v) && v >= 1) setDailyGoal(v);
                        }}
                        className="w-24 px-3 py-2 border border-outline/30 bg-paper text-primary text-sm focus:outline-none focus:border-secondary"
                    />
                    <span className="text-sm text-primary/50">cards / day</span>
                </div>
            </section>
        </div>
    );
};

export default Settings;
