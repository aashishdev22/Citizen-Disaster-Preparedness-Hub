export interface PwaPlatformInfo {
  isStandalone: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

export function detectPwaPlatform(userAgent: string, displayModeStandalone: boolean, navigatorStandalone?: boolean): PwaPlatformInfo {
  const ua = userAgent.toLowerCase();
  const isStandalone = Boolean(displayModeStandalone || navigatorStandalone);
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  return {
    isStandalone,
    isIOS,
    isAndroid,
  };
}

export function getInstallActionMode(params: {
  isInstalled: boolean;
  isInstallable: boolean;
  isIOS: boolean;
}): 'hidden' | 'native-prompt' | 'ios-guide' | 'manual-guide' {
  if (params.isInstalled) return 'hidden';
  if (params.isInstallable) return 'native-prompt';
  if (params.isIOS) return 'ios-guide';
  return 'manual-guide';
}

export function buildPwaBuilderUrl(appOriginUrl: string): string {
  const trimmed = appOriginUrl.trim().replace(/\/+$/, '');
  if (!trimmed) return 'https://www.pwabuilder.com/';
  return `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(trimmed)}`;
}
