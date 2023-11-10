import React from 'react';
import { DrawerItem } from '../drawer/interfaces';
import { DrawerFocusControlRefs } from './use-drawer-focus-control';
export interface DrawerResizeProps {
    activeDrawer: DrawerItem | undefined;
    activeDrawerSize: number;
    onActiveDrawerResize: (detail: {
        id: string;
        size: number;
    }) => void;
    drawersRefs: DrawerFocusControlRefs;
    isToolsOpen: boolean;
    drawersMaxWidth: number;
}
declare function useResize(drawerRefObject: React.RefObject<HTMLDivElement>, { activeDrawer, activeDrawerSize, onActiveDrawerResize, drawersRefs, isToolsOpen, drawersMaxWidth }: DrawerResizeProps): {
    resizeHandle: JSX.Element;
    drawerSize: number;
};
export default useResize;
//# sourceMappingURL=use-resize.d.ts.map