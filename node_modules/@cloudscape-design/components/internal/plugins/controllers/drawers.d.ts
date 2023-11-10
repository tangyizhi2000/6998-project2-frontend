import { DrawerItem } from '../../../app-layout/drawer/interfaces';
export type DrawerConfig = Omit<DrawerItem, 'content' | 'trigger'> & {
    orderPriority?: number;
    defaultActive?: boolean;
    trigger: {
        iconSvg: string;
    };
    mountContent: (container: HTMLElement) => void;
    unmountContent: (container: HTMLElement) => void;
};
export type DrawersRegistrationListener = (drawers: Array<DrawerConfig>) => void;
export interface DrawersApiPublic {
    registerDrawer(config: DrawerConfig): void;
}
export interface DrawersApiInternal {
    clearRegisteredDrawers(): void;
    onDrawersRegistered(listener: DrawersRegistrationListener): () => void;
}
export declare class DrawersController {
    private drawers;
    private drawersRegistrationListener;
    scheduleUpdate: () => void;
    registerDrawer: (config: DrawerConfig) => void;
    onDrawersRegistered: (listener: DrawersRegistrationListener) => () => void;
    clearRegisteredDrawers: () => void;
    installPublic(api?: Partial<DrawersApiPublic>): DrawersApiPublic;
    installInternal(internalApi?: Partial<DrawersApiInternal>): DrawersApiInternal;
}
//# sourceMappingURL=drawers.d.ts.map