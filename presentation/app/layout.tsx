import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WAKIE — 让上下文在正确的时间回来",
  description: "一个有情感、有遗忘、与时间相连的个人上下文系统。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
