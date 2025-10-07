import { findParent } from '@root/utils/dom';

export function filterNonGameAreaEvents(
    e: HTMLElement | EventTarget | null | undefined,
) {
    return !!findParent(e as HTMLElement, (el) => el.id === 'game-area');
}

