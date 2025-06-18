import React, { useState } from 'react';
import ExternalLink from '../components/common/ExternalLink';
import { Menu } from '../components/daisy/navigation';
import GeneralSettings from './settings/GeneralSettings';
import AppearanceSettings from './settings/AppearanceSettings';
import ShortcutSettings from './settings/ShortcutSettings';

export default function SettingsView() {
  const [tab, setTab] = useState<'general' | 'appearance' | 'shortcuts'>(
    'general'
  );
  return (
    <section className="p-4 flex gap-4" data-testid="settings-view">
      <aside className="w-48">
        <Menu className="bg-base-200 rounded-box" data-testid="settings-nav">
          <li>
            <button
              type="button"
              className={tab === 'general' ? 'active' : ''}
              onClick={() => setTab('general')}
            >
              General
            </button>
          </li>
          <li>
            <button
              type="button"
              className={tab === 'appearance' ? 'active' : ''}
              onClick={() => setTab('appearance')}
            >
              Appearance
            </button>
          </li>
          <li>
            <button
              type="button"
              className={tab === 'shortcuts' ? 'active' : ''}
              onClick={() => setTab('shortcuts')}
            >
              Keyboard Shortcuts
            </button>
          </li>
        </Menu>
      </aside>
      <div className="flex-1">
        <div className="flex items-center mb-2 gap-2">
          <h2 className="font-display text-xl flex-1">Settings</h2>
          <ExternalLink
            href="https://minecraft.wiki/w/Options"
            aria-label="Help"
            className="btn btn-circle btn-ghost btn-sm"
          >
            ?
          </ExternalLink>
        </div>
        {tab === 'general' && <GeneralSettings />}
        {tab === 'appearance' && <AppearanceSettings />}
        {tab === 'shortcuts' && <ShortcutSettings />}
      </div>
    </section>
  );
}
