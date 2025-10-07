export class MetaService {
    static set(options: { title?: string }): void {
        if (options.title) {
            document.title = `${options.title} · Faded: Pollution`;
        } else {
            document.title = 'Faded: Pollution';
        }
    }
}
