import React from 'react';
import pkg from '../../../package.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - webpack replaces import with URL string
import iconPath from '../../../resources/icon.png';
import ExternalLink from '../components/ExternalLink';
export default function AboutView() {
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
        <ExternalLink
          className="link link-primary"
          href="https://github.com/iamkaf/minecraft-resource-packer"
        >
          GitHub
        </ExternalLink>
        {' | '}
        <ExternalLink
          className="link link-primary"
          href="https://github.com/iamkaf/minecraft-resource-packer/blob/main/docs/developer-handbook.md"
        >
          Documentation
        </ExternalLink>
      </p>
      <pre className="whitespace-pre-wrap text-sm" data-testid="license">
        {`MIT License\n\nCopyright (c) 2025 Kaf`}
      </pre>
    </section>
  );
}
