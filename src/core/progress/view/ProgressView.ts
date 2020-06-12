import {View} from '../../corecls/View';

export interface ProgressView extends View {
    setBarWidth(percent: number): void;

    setBarText(text: string): void;

    setMinimumWidth(minimumWidth: number): void;
}
