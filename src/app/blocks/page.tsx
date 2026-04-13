import type { Metadata } from "next";

import { BlocksPageContent } from "./blocks-content";

export const metadata: Metadata = {
  description: "이더리움 메인넷의 최신 블록 목록을 조회합니다.",
  title: "최신 블록 | Ethereum Explorer",
};

/**
 * 최신 블록 목록 페이지.
 *
 * 서버 컴포넌트로서 메타데이터를 제공하고,
 * 실제 데이터 페칭은 클라이언트 컴포넌트에서 처리합니다.
 * (TanStack Query를 사용한 CSR 방식)
 */
export default function BlocksPage() {
  return <BlocksPageContent />;
}
