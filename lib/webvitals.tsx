"use client"
import { useReportWebVitals } from 'next/web-vitals';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

const reportMetric: Parameters<typeof useReportWebVitals>[0] = ({ name, value, id, rating, navigationType }) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[WebVital] ${name}:`, {
      value,
      rating,
      page: window.location.pathname,
    });
  }

  if (typeof window.gtag !== 'function') return;
  window.gtag('event', name, {
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    event_category: 'Web Vitals',
    event_label: id,
    metric_rating: rating,
    navigation_type: navigationType,
    page_path: window.location.pathname,
    non_interaction: true,
  });
};

export default function WebVitals() {
  useReportWebVitals(reportMetric);
  return null;
}