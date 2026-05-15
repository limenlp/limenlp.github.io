import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const TITLE_LINE1 = 'Building trustworthy AI';
const TITLE_LINE2 = '— by people who actually check.';
const EYEBROW = 'LIME @ USC';
const SUBTITLE = 'Language · Intelligence · Modeling · Evaluation';

export const GET: APIRoute = async () => {
  // Load fonts (Inter regular + extrabold) and the g1 mascot image from local files.
  const [interRegular, interBold, g1Buffer] = await Promise.all([
    readFile(path.resolve('./src/og-fonts/Inter-Regular.ttf')),
    readFile(path.resolve('./src/og-fonts/Inter-ExtraBold.ttf')),
    readFile(path.resolve('./public/images/lab/g1.png')),
  ]);
  const g1DataUrl = `data:image/png;base64,${g1Buffer.toString('base64')}`;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '80px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f5f9ec 60%, #e6f0cd 100%)',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', maxWidth: 700 },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 22,
                      fontWeight: 400,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: '#3f5d1b',
                      marginBottom: 28,
                    },
                    children: EYEBROW,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 64,
                      fontWeight: 800,
                      lineHeight: 1.05,
                      letterSpacing: '-0.03em',
                      color: '#1f242e',
                    },
                    children: TITLE_LINE1,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 64,
                      fontWeight: 800,
                      lineHeight: 1.05,
                      letterSpacing: '-0.03em',
                      color: '#1f242e',
                      marginTop: 8,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'baseline',
                    },
                    children: [
                      {
                        type: 'span',
                        props: { style: { color: '#669920' }, children: TITLE_LINE2 },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 26,
                      fontWeight: 400,
                      color: '#4d5a74',
                      marginTop: 36,
                      letterSpacing: '0.02em',
                    },
                    children: SUBTITLE,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 360,
                height: 360,
              },
              children: [
                {
                  type: 'img',
                  props: { src: g1DataUrl, width: 360, height: 360 },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: interBold, weight: 800, style: 'normal' },
      ],
    }
  );

  const resvg = new Resvg(svg, { background: 'white', fitTo: { mode: 'width', value: 1200 } });
  const pngBuffer = resvg.render().asPng();

  return new Response(new Uint8Array(pngBuffer), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
