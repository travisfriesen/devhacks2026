function heatColor(intensity: number): string {
    if (intensity === 0) return "bg-transparent";
    if (intensity <= 0.25) return "bg-primary/25";
    if (intensity <= 0.5) return "bg-primary/50";
    if (intensity <= 0.75) return "bg-primary/75";
    return "bg-primary";
}

export { heatColor };
