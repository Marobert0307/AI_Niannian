import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "念念｜记住上下文，陪你把事情做成",
  description: "从提醒、日程到语音对话，念念会带着上下文继续陪你推进每一件事。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
