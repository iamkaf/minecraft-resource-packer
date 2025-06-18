import React from 'react';
import { Kbd } from '../../components/daisy/display';

export default function ShortcutSettings() {
  return (
    <div className="max-w-md">
      <h3 className="font-semibold mb-2">Project Manager</h3>
      <ul className="list-disc list-inside">
        <li>
          <Kbd>Enter</Kbd> – open all selected projects
        </li>
        <li>
          <Kbd>Delete</Kbd> – remove all selected projects
        </li>
      </ul>
    </div>
  );
}
