import React from 'react';
import pkg from '../../../package.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - webpack replaces import with URL string
import iconPath from '../../../resources/icon.png';

export default function About() {
  return (
    <section
      className="p-4 flex flex-col gap-4 items-center"
      data-testid="about"
    >
      <img
        src={iconPath as unknown as string}
        alt="App logo"
        className="w-32 h-32"
      />
      <h2 className="font-display text-xl">
        Minecraft Resource Packer v{pkg.version}
      </h2>
      <p>
        <a
          className="link link-primary"
          href="https://github.com/openai/minecraft-resource-packer"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        {' | '}
        <a
          className="link link-primary"
          href="https://github.com/openai/minecraft-resource-packer/blob/main/docs/developer-handbook.md"
          target="_blank"
          rel="noreferrer"
        >
          Documentation
        </a>
      </p>
      <pre className="whitespace-pre-wrap text-sm" data-testid="license">
        {`MIT License\n\nCopyright (c) 2025 Kaf`}
      </pre>
    </section>
  );
}
