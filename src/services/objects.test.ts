import { describe, expect, it } from 'vitest';
import { demoMedia } from './demoMedia';
import { fileKind, objectKind, packAppHtml } from './objects';

describe('object files', () => {
  it('detects images, video, audio, pdf, apps, and other files', () => {
    expect(fileKind('sunbeam.svg', 'image/svg+xml')).toBe('image');
    expect(fileKind('loop.gif', '')).toBe('image');
    expect(fileKind('purr.mp4', '')).toBe('video');
    expect(fileKind('clip.webm', 'video/webm')).toBe('video');
    expect(fileKind('meow.wav', '')).toBe('audio');
    expect(fileKind('meow.ogg', 'audio/ogg')).toBe('audio');
    expect(fileKind('book.pdf', '')).toBe('pdf');
    expect(fileKind('index.html', 'text/html')).toBe('app');
    expect(fileKind('notes.txt', 'text/plain')).toBe('file');
    expect(
      objectKind(
        [
          { name: 'style.css', mime: 'text/css' },
          { name: 'index.html', mime: 'text/html' },
        ],
        'style.css',
      ),
    ).toBe('app');
  });

  it('inlines the cat clicker so a sandboxed frame can run it', () => {
    const html = packAppHtml([
      { name: 'index.html', text: demoMedia.indexHtml },
      { name: 'game.js', text: demoMedia.gameJs },
      { name: 'style.css', text: demoMedia.styleCss },
    ]);
    expect(html).toContain('Treats');
    expect(html).toContain('treats += 1');
    expect(html).toContain('#cat');
    expect(html).not.toMatch(/<script[^>]+src=/i);
    expect(html).not.toMatch(/<link[^>]+href=/i);
  });
});