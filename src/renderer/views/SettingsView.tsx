import React from 'react';
import ExternalLink from '../components/ExternalLink';

export default function SettingsView() {
  return (
    <section className="p-4" data-testid="settings-view">
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
      <p>Coming soon...</p>
    </section>
  );
}
