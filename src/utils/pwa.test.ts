import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildPwaBuilderUrl, detectPwaPlatform, getInstallActionMode } from './pwa.ts';

describe('PWA utilities', () => {
  it('detects standalone mode via media query or iOS navigator.standalone', () => {
    const a = detectPwaPlatform('Mozilla/5.0 (Linux; Android 14)', true, false);
    assert.equal(a.isStandalone, true);
    assert.equal(a.isAndroid, true);
    assert.equal(a.isIOS, false);

    const b = detectPwaPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', false, true);
    assert.equal(b.isStandalone, true);
    assert.equal(b.isIOS, true);
  });

  it('selects correct install action mode across installed, Chromium, iOS, and fallback browsers', () => {
    assert.equal(getInstallActionMode({ isInstalled: true, isInstallable: true, isIOS: false }), 'hidden');
    assert.equal(getInstallActionMode({ isInstalled: false, isInstallable: true, isIOS: false }), 'native-prompt');
    assert.equal(getInstallActionMode({ isInstalled: false, isInstallable: false, isIOS: true }), 'ios-guide');
    assert.equal(getInstallActionMode({ isInstalled: false, isInstallable: false, isIOS: false }), 'manual-guide');
  });

  it('builds a properly encoded PWABuilder reportcard URL', () => {
    const url = buildPwaBuilderUrl('https://example.run.app/');
    assert.equal(url, 'https://www.pwabuilder.com/reportcard?site=https%3A%2F%2Fexample.run.app');
  });
});
