import { SimpleLinear2DFn } from '@root/proto/utils/linear-2d';
import { Point } from '@root/proto/utils/point';
import { floatToInt } from '@root/utils/math';
import {
    callAndClearUnsubscribeFns,
    type UnsubscribeFns,
} from '@root/utils/sub';
import type { Ticker } from '@root/utils/ticker';

export class FPS {
    private unsubs: UnsubscribeFns = [];

    elements: HTMLDivElement[] = [];
    data: number[] = [];
    fps_el: HTMLDivElement;
    fps_to_color = {
        r: new SimpleLinear2DFn(new Point(0, 255), new Point(60, 0)),
        g: new SimpleLinear2DFn(new Point(0, 0), new Point(60, 255)),
    };
    fps_count = 0;
    fps_count_rolling = 0;
    private tick_count = 0;
    private tick_time_cumulative = 0;

    constructor(
        public container: HTMLDivElement,
        private ticker: Ticker,
    ) {
        // this.container = document.createElement('div');
        // this.container.style.position = 'absolute';
        // this.container.style.top = '0px';
        // this.container.style.right = '0px';
        // this.container.style.display = 'flex';
        // this.container.style.flex = 'column';
        // this.container.style.height = '40px';
        // this.container.style.width = '60px';
        this.fps_el = document.createElement('div');
        this.fps_el.style.position = 'relative';
        this.fps_el.style.fontSize = '8px';
        this.fps_el.style.lineHeight = '8px';
        this.fps_el.style.top = '0px';
        this.fps_el.style.right = '0px';
        this.fps_el.style.padding = '1px';
        this.fps_el.style.width = '100%';
        this.fps_el.style.textAlign = 'right';
        this.fps_el.style.color = '#ffffff';
        this.fps_el.style.backgroundColor = 'rgba(0,0,0,0.2)';
        this.fps_el.innerText = '0';
        this.container.appendChild(this.fps_el);
        const elementsContainer = document.createElement('div');
        elementsContainer.style.position = 'relative';
        elementsContainer.style.bottom = '0px';
        elementsContainer.style.left = '0px';
        elementsContainer.style.display = 'flex';
        elementsContainer.style.height = '30px';
        elementsContainer.style.width = '60px';
        this.container.appendChild(elementsContainer);
        for (let i = 0; i < 20; i++) {
            this.data.push(i);
            const el = document.createElement('div');
            el.style.height = `${(i * 100) / 60}%`;
            el.style.width = `3px`;
            el.style.bottom = '0px';
            el.style.backgroundColor = `#${this.fps_to_color.r.calc(i).toString(16)}${this.fps_to_color.g.calc(i).toString(16)}00`;
            this.elements.push(el);
            elementsContainer.appendChild(el);
        }
        const interval = setInterval(() => {
            this.data.splice(0, 1);
            this.data.push(this.fps_count);
            this.fps_count = this.fps_count_rolling;
            this.fps_count_rolling = 0;
            const tickTime = this.tick_time_cumulative / this.tick_count;
            this.fps_el.innerText = `${floatToInt(tickTime)}ms ${this.fps_count} fps`;
            for (let i = 0; i < this.data.length; i++) {
                this.elements[i].style.height = `${(this.data[i] * 100) / 60}%`;
                let fpsNormalized = this.data[i];
                if (fpsNormalized > 60) {
                    fpsNormalized = 60;
                } else if (fpsNormalized < 0) {
                    fpsNormalized = 0;
                }
                const fpsColor = [
                    this.fps_to_color.r.calc(fpsNormalized).toString(16),
                    this.fps_to_color.g.calc(fpsNormalized).toString(16),
                ];
                if (fpsColor[0].length === 1) {
                    fpsColor[0] = '0' + fpsColor[0];
                } else if (fpsColor[0].length > 2) {
                    fpsColor[0] = fpsColor[0].slice(0, 2);
                }
                if (fpsColor[1].length === 1) {
                    fpsColor[1] = '0' + fpsColor[1];
                } else if (fpsColor[1].length > 2) {
                    fpsColor[1] = fpsColor[1].slice(0, 2);
                }
                this.elements[i].style.backgroundColor =
                    `#${fpsColor[0]}${fpsColor[1]}00`;
            }
        }, 1000);
        const interval2 = setInterval(() => {
            this.tick_count = 0;
            this.tick_time_cumulative = 0;
            this.fps_el.innerText = `${floatToInt(this.ticker.tte)}ms ${this.fps_count} fps`;
        }, 200);
        this.unsubs.push(
            this.ticker.subscribe((_, __, tickTime) => {
                this.fps_count_rolling++;
                this.tick_count++;
                this.tick_time_cumulative += tickTime;
            }),
            () => {
                clearInterval(interval);
                clearInterval(interval2);
            },
        );
    }

    destroy() {
        callAndClearUnsubscribeFns(this.unsubs);
    }
}
