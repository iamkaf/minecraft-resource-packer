import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Button, Dropdown, Swap, ThemeController } from '../../src/renderer/components/daisy/actions';
import {
  Avatar,
  Badge,
  Card,
  Carousel,
  ChatBubble,
  Countdown,
  Diff,
  Kbd,
  List,
  Stat,
  Status,
  Table,
  Timeline,
} from '../../src/renderer/components/daisy/display';
import {
  Alert,
  Loading,
  Progress,
  RadialProgress,
  Skeleton,
  Toast,
  Tooltip,
} from '../../src/renderer/components/daisy/feedback';
import {
  Calendar,
  Checkbox,
  Fieldset,
  FileInput,
  Filter,
  FilterBadge,
  InputField,
  Label,
  Radio,
  Range,
  Rating,
  Select,
  Textarea,
  Toggle,
} from '../../src/renderer/components/daisy/input';
import {
  Divider,
  Footer,
  Hero,
  Indicator,
  Join,
  Mask,
  Stack,
} from '../../src/renderer/components/daisy/layout';
import {
  Breadcrumbs,
  Dock,
  Link,
  Menu,
  Navbar,
  Pagination,
  Steps,
  Tab,
} from '../../src/renderer/components/daisy/navigation';
import {
  Blockquote,
  Code,
  H1,
  H2,
  H3,
  Paragraph,
  Prose,
} from '../../src/renderer/components/daisy/typography';

interface Case {
  name: string;
  Component: React.ComponentType<any>;
  props: Record<string, any>;
  selector?: string; // optional CSS selector under root
  expectedClasses?: string[];
  expectedAttrs?: Record<string, string>;
}

const cases: Case[] = [
  {
    name: 'Button',
    Component: Button,
    props: { children: 'Click', variant: 'secondary', size: 'lg', 'data-testid': 'daisy-button', className: 'extra' },
    expectedClasses: ['btn-secondary', 'btn-lg', 'extra'],
  },
  {
    name: 'Dropdown',
    Component: Dropdown,
    props: { label: 'Menu', variant: 'primary', size: 'sm', className: 'extra', children: <li>Item</li> },
    selector: '.btn',
    expectedClasses: ['btn-primary', 'btn-sm'],
  },
  {
    name: 'Swap',
    Component: Swap,
    props: { onContent: 'On', offContent: 'Off', className: 'extra' },
    expectedClasses: ['swap', 'extra'],
  },
  {
    name: 'ThemeController',
    Component: ThemeController,
    props: { 'data-testid': 'theme-controller' },
  },
  {
    name: 'Avatar',
    Component: Avatar,
    props: { src: 'a.png', className: 'extra', 'data-testid': 'avatar' },
    expectedClasses: ['extra'],
  },
  {
    name: 'Badge',
    Component: Badge,
    props: { children: 'Hi', variant: 'accent', size: 'lg', id: 'b1', className: 'extra' },
    expectedClasses: ['badge-accent', 'badge-lg', 'extra'],
    expectedAttrs: { id: 'b1' },
    selector: '[data-testid="badge"]',
  },
  {
    name: 'Card',
    Component: Card,
    props: { title: 'Title', variant: 'accent', size: 'compact', id: 'c1', className: 'extra', children: 'Body', 'data-testid': 'card' },
    expectedClasses: ['bg-accent', 'card-compact', 'extra'],
    expectedAttrs: { id: 'c1' },
  },
  {
    name: 'Carousel',
    Component: Carousel,
    props: { className: 'extra', id: 'car1', children: <div>Item</div>, 'data-testid': 'carousel' },
    expectedClasses: ['extra'],
    expectedAttrs: { id: 'car1' },
  },
  {
    name: 'ChatBubble',
    Component: ChatBubble,
    props: { className: 'extra', id: 'cb1', children: 'Hi', 'data-testid': 'chat-bubble' },
    expectedClasses: ['extra'],
    expectedAttrs: { id: 'cb1' },
  },
  {
    name: 'Countdown',
    Component: Countdown,
    props: { value: 10, className: 'extra', id: 'cd1', 'data-testid': 'countdown' },
    expectedClasses: ['extra'],
    expectedAttrs: { id: 'cd1' },
  },
  {
    name: 'Diff',
    Component: Diff,
    props: { before: 'a', after: 'b', className: 'extra', id: 'd1', 'data-testid': 'diff' },
    expectedClasses: ['extra'],
    expectedAttrs: { id: 'd1' },
  },
  {
    name: 'Kbd',
    Component: Kbd,
    props: { children: 'A', 'data-testid': 'kbd' },
  },
  {
    name: 'List',
    Component: List,
    props: { className: 'extra', id: 'l1', children: <li>Item</li>, 'data-testid': 'list' },
    expectedClasses: ['extra'],
    expectedAttrs: { id: 'l1' },
  },
  {
    name: 'Stat',
    Component: Stat,
    props: { title: 'T', value: 'V', className: 'extra', id: 's1', 'data-testid': 'stat' },
    expectedClasses: ['extra'],
    expectedAttrs: { id: 's1' },
  },
  {
    name: 'Status',
    Component: Status,
    props: { className: 'extra', id: 'st1', 'data-testid': 'status' },
    expectedClasses: ['extra'],
    expectedAttrs: { id: 'st1' },
  },
  {
    name: 'Table',
    Component: Table,
    props: { className: 'extra', id: 'tbl1', head: <tr><th>H</th></tr>, children: <tr><td>A</td></tr>, 'data-testid': 'table' },
    expectedClasses: ['extra'],
    expectedAttrs: { id: 'tbl1' },
  },
  {
    name: 'Timeline',
    Component: Timeline,
    props: { className: 'extra', id: 'tl1', children: <li>Step</li>, 'data-testid': 'timeline' },
    expectedClasses: ['extra'],
    expectedAttrs: { id: 'tl1' },
  },
  {
    name: 'Alert',
    Component: Alert,
    props: { variant: 'success', size: 'lg', className: 'extra', children: 'done', 'data-testid': 'alert' },
    expectedClasses: ['alert-success', 'alert-lg', 'extra'],
    selector: '[role="alert"]',
  },
  {
    name: 'Loading',
    Component: Loading,
    props: { loadingStyle: 'dots', size: 'lg', className: 'extra', 'data-testid': 'loading' },
    expectedClasses: ['loading-dots', 'loading-lg', 'extra'],
  },
  {
    name: 'Progress',
    Component: Progress,
    props: { value: 30, max: 100, color: 'accent', className: 'extra', 'data-testid': 'progress' },
    expectedClasses: ['progress-accent', 'extra'],
    selector: undefined,
  },
  {
    name: 'RadialProgress',
    Component: RadialProgress,
    props: { value: 70, size: '4rem', className: 'extra', 'data-testid': 'radial-progress' },
    expectedClasses: ['extra'],
    expectedAttrs: { 'aria-valuenow': '70' },
  },
  {
    name: 'Skeleton',
    Component: Skeleton,
    props: { width: '2rem', height: '1rem', className: 'extra', id: 'sk1', 'data-testid': 'skeleton' },
    expectedClasses: ['extra'],
    expectedAttrs: { id: 'sk1' },
  },
  {
    name: 'Toast',
    Component: Toast,
    props: { position: 'top', className: 'extra', id: 'toast1', children: <span>hello</span>, 'data-testid': 'toast' },
    expectedClasses: ['toast-top', 'extra'],
    expectedAttrs: { id: 'toast1' },
  },
  {
    name: 'Tooltip',
    Component: Tooltip,
    props: { tip: 'info', position: 'bottom', id: 'tip1', className: 'extra', children: <button>btn</button>, 'data-testid': 'tooltip' },
    expectedClasses: ['tooltip-bottom', 'extra'],
    expectedAttrs: { 'data-tip': 'info', id: 'tip1' },
  },
  {
    name: 'Calendar',
    Component: Calendar,
    props: { 'data-testid': 'cal' },
  },
  {
    name: 'Checkbox',
    Component: Checkbox,
    props: { variant: 'success', size: 'lg', 'data-testid': 'cb', className: 'extra' },
    expectedClasses: ['checkbox-success', 'checkbox-lg', 'extra'],
  },
  {
    name: 'Fieldset',
    Component: Fieldset,
    props: { 'data-testid': 'fs', children: 'content' },
  },
  {
    name: 'FileInput',
    Component: FileInput,
    props: { variant: 'primary', size: 'sm', 'data-testid': 'file', className: 'extra' },
    expectedClasses: ['file-input-primary', 'file-input-sm', 'extra'],
  },
  {
    name: 'Filter',
    Component: Filter,
    props: { 'data-testid': 'flt', children: 'f' },
  },
  {
    name: 'FilterBadge',
    Component: FilterBadge,
    props: { label: 'Test', selected: true, variant: 'secondary', 'data-testid': 'filter-badge' },
    expectedClasses: ['badge-secondary'],
    selector: '[role="button"]',
  },
  {
    name: 'InputField',
    Component: InputField,
    props: { variant: 'accent', size: 'lg', className: 'extra', 'data-testid': 'inp' },
    expectedClasses: ['input-accent', 'input-lg', 'extra'],
  },
  {
    name: 'Label',
    Component: Label,
    props: { 'data-testid': 'lab', children: 'L' },
  },
  {
    name: 'Radio',
    Component: Radio,
    props: { variant: 'warning', size: 'sm', 'data-testid': 'radio' },
    expectedClasses: ['radio-warning', 'radio-sm'],
  },
  {
    name: 'Range',
    Component: Range,
    props: { variant: 'error', size: 'xs', className: 'extra', 'data-testid': 'rng' },
    expectedClasses: ['range-error', 'range-xs', 'extra'],
  },
  {
    name: 'Rating',
    Component: Rating,
    props: { 'data-testid': 'rate', children: '*' },
  },
  {
    name: 'Select',
    Component: Select,
    props: { variant: 'primary', size: 'sm', className: 'extra', 'data-testid': 'sel', children: <option>1</option> },
    expectedClasses: ['select-primary', 'select-sm', 'extra'],
  },
  {
    name: 'Textarea',
    Component: Textarea,
    props: { variant: 'secondary', size: 'xs', className: 'extra', 'data-testid': 'ta' },
    expectedClasses: ['textarea-secondary', 'textarea-xs', 'extra'],
  },
  {
    name: 'Toggle',
    Component: Toggle,
    props: { variant: 'info', size: 'xl', 'data-testid': 'tog' },
    expectedClasses: ['toggle-info', 'toggle-xl'],
  },
  {
    name: 'Divider',
    Component: Divider,
    props: { children: 'content', 'data-testid': 'divider' },
    expectedClasses: ['divider'],
  },
  {
    name: 'Footer',
    Component: Footer,
    props: { children: 'foot', 'data-testid': 'footer' },
    expectedClasses: ['footer'],
  },
  {
    name: 'Hero',
    Component: Hero,
    props: { children: 'hero', 'data-testid': 'hero' },
    expectedClasses: ['hero'],
  },
  {
    name: 'Indicator',
    Component: Indicator,
    props: { item: <span>!</span>, children: 'child', 'data-testid': 'indicator' },
    expectedClasses: ['indicator'],
    selector: undefined,
  },
  {
    name: 'Join',
    Component: Join,
    props: { children: <input type="text" />, 'data-testid': 'join' },
    expectedClasses: ['join'],
  },
  {
    name: 'Mask',
    Component: Mask,
    props: { type: 'mask-squircle', children: <img src="test.png" alt="" />, 'data-testid': 'mask' },
    expectedClasses: ['mask', 'mask-squircle'],
  },
  {
    name: 'Stack',
    Component: Stack,
    props: { children: <div>One</div>, 'data-testid': 'stack' },
    expectedClasses: ['stack'],
  },
  {
    name: 'Breadcrumbs',
    Component: Breadcrumbs,
    props: { children: <li><a>Home</a></li>, 'data-testid': 'breadcrumbs' },
    expectedClasses: ['breadcrumbs'],
  },
  {
    name: 'Dock',
    Component: Dock,
    props: { children: <button>One</button>, 'data-testid': 'dock' },
    expectedClasses: ['dock'],
  },
  {
    name: 'Link',
    Component: Link,
    props: { href: '#', children: 'Test', 'data-testid': 'link' },
    expectedClasses: ['link'],
    expectedAttrs: { href: '#' },
  },
  {
    name: 'Menu',
    Component: Menu,
    props: { variant: 'accent', size: 'lg', children: <li>Item</li>, 'data-testid': 'menu' },
    expectedClasses: ['menu', 'menu-accent', 'menu-lg'],
  },
  {
    name: 'Navbar',
    Component: Navbar,
    props: { children: <div>Content</div>, 'data-testid': 'navbar' },
    expectedClasses: ['navbar'],
  },
  {
    name: 'Pagination',
    Component: Pagination,
    props: { children: <button className="btn">1</button>, 'data-testid': 'pagination' },
    expectedClasses: ['join'],
  },
  {
    name: 'Steps',
    Component: Steps,
    props: { children: <li className="step">1</li>, 'data-testid': 'steps' },
    expectedClasses: ['steps'],
  },
  {
    name: 'Tab',
    Component: Tab,
    props: { children: 'Tab 1', 'data-testid': 'tab' },
    expectedClasses: ['tab'],
    selector: '[role="tab"]',
  },
  {
    name: 'Blockquote',
    Component: Blockquote,
    props: { children: 'Quote', 'data-testid': 'blockquote' },
    expectedClasses: [],
  },
  {
    name: 'Code',
    Component: Code,
    props: { children: 'const x=1;', 'data-testid': 'code' },
    expectedClasses: ['font-mono'],
  },
  {
    name: 'H1',
    Component: H1,
    props: { children: 'Title', 'data-testid': 'h1' },
    expectedClasses: ['text-3xl', 'font-bold'],
  },
  {
    name: 'H2',
    Component: H2,
    props: { children: 'Subtitle', 'data-testid': 'h2' },
    expectedClasses: ['text-2xl', 'font-bold'],
  },
  {
    name: 'H3',
    Component: H3,
    props: { children: 'Heading', 'data-testid': 'h3' },
    expectedClasses: ['text-xl', 'font-bold'],
  },
  {
    name: 'Paragraph',
    Component: Paragraph,
    props: { variant: 'accent', size: 'lg', className: 'extra', children: 'Text', 'data-testid': 'paragraph' },
    expectedClasses: ['text-accent', 'text-lg', 'extra'],
  },
  {
    name: 'Prose',
    Component: Prose,
    props: { children: <p>text</p>, 'data-testid': 'prose' },
    expectedClasses: ['prose'],
  },
];

describe('daisy wrappers', () => {
  it.each(cases)('$name forwards props', ({ Component, props, selector, expectedClasses = [], expectedAttrs = {} }) => {
    const { container } = render(<Component {...props} />);
    const target = selector ? (container.querySelector(selector) as HTMLElement) : props['data-testid'] ? screen.getByTestId(props['data-testid']) : (container.firstElementChild as HTMLElement);
    for (const cls of expectedClasses) {
      expect(target).toHaveClass(cls);
    }
    for (const [key, value] of Object.entries(expectedAttrs)) {
      expect(target).toHaveAttribute(key, value);
    }
    expect(target).toBeInTheDocument();
  });
});
