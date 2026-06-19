export interface WorksheetAnalyticsAdapter {
  recordView: (worksheetId: string) => Promise<void>;
  recordDownload: (worksheetId: string) => Promise<void>;
}

export const worksheetAnalytics: WorksheetAnalyticsAdapter = {
  recordView: async () => Promise.resolve(),
  recordDownload: async () => Promise.resolve(),
};
