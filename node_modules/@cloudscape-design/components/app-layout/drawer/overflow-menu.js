// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import InternalButtonDropdown from '../../button-dropdown/internal';
export default function OverflowMenu({ items, onItemClick, customTriggerBuilder, ariaLabel }) {
    return (React.createElement(InternalButtonDropdown, { items: items.map(item => {
            var _a;
            return ({
                id: item.id,
                text: ((_a = item.ariaLabels) === null || _a === void 0 ? void 0 : _a.content) || 'Content',
                iconName: item.trigger.iconName,
                iconSvg: item.trigger.iconSvg,
                badge: item.badge,
            });
        }), onItemClick: onItemClick, ariaLabel: ariaLabel, variant: "icon", customTriggerBuilder: customTriggerBuilder, expandToViewport: true }));
}
//# sourceMappingURL=overflow-menu.js.map