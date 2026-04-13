import type { Metadata } from "next";

import { BlockDetailContent } from "./block-detail-content";

type BlockDetailPageProps = {
  params: Promise<{
    number: string;
  }>;
};

export async function generateMetadata({ params }: BlockDetailPageProps): Promise<Metadata> {
  const { number } = await params;

  return {
    description: `이더리움 메인넷 블록 #${number}의 상세 정보를 조회합니다.`,
    title: `블록 #${number} | Ethereum Explorer`,
  };
}

/**
 * 블록 상세 페이지.
 *
 * 서버 컴포넌트로서 동적 메타데이터를 제공하고,
 * 실제 데이터 페칭은 클라이언트 컴포넌트에서 처리합니다.
 */
export default async function BlockDetailPage({ params }: BlockDetailPageProps) {
  const { number } = await params;

  return <BlockDetailContent blockNumberParam={number} />;
}
