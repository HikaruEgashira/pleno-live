"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  FileText,
  Zap,
  Clock,
  Shield,
  Download,
  Server,
  Smartphone,
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
  Globe,
  Database,
  Sparkles,
  Volume2,
  Search,
  Settings,
} from "lucide-react";
import { cn } from "@/packages/lib/cn";

// Types
interface DocSection {
  id: string;
  title: string;
  icon: React.ElementType;
  subsections?: { id: string; title: string }[];
}

// Navigation items
const docSections: DocSection[] = [
  {
    id: "overview",
    title: "概要",
    icon: FileText,
  },
  {
    id: "getting-started",
    title: "インストール",
    icon: Download,
  },
  {
    id: "features",
    title: "機能",
    icon: Zap,
    subsections: [
      { id: "recording", title: "音声録音" },
      { id: "transcription", title: "文字起こし" },
      { id: "ai-summary", title: "AI要約" },
      { id: "note-management", title: "ノート管理" },
      { id: "search", title: "検索" },
    ],
  },
  {
    id: "architecture",
    title: "アーキテクチャ",
    icon: Server,
    subsections: [
      { id: "client-server", title: "クライアント・サーバー構成" },
      { id: "tech-stack", title: "技術スタック" },
    ],
  },
  {
    id: "privacy",
    title: "プライバシー",
    icon: Shield,
  },
];

// Sidebar Component
const Sidebar = ({
  activeSection,
  onSectionChange,
  isMobileOpen,
  onMobileClose,
}: {
  activeSection: string;
  onSectionChange: (id: string) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["features", "architecture"])
  );

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-72 bg-background border-r border-border z-50",
          "transform transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <a href="/website" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-foreground">
              Pleno Transcribe
            </span>
          </a>
          <button
            onClick={onMobileClose}
            className="lg:hidden p-2 rounded-lg hover:bg-surface"
          >
            <X className="h-5 w-5 text-muted" />
          </button>
        </div>

        {/* Back to Home */}
        <div className="p-4 border-b border-border">
          <a
            href="/website"
            className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>ホームに戻る</span>
          </a>
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto h-[calc(100%-120px)]">
          <ul className="space-y-1">
            {docSections.map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedSections.has(section.id);
              const isActive = activeSection === section.id;

              return (
                <li key={section.id}>
                  <button
                    onClick={() => {
                      if (section.subsections) {
                        toggleSection(section.id);
                      }
                      onSectionChange(section.id);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-surface text-foreground"
                        : "text-muted hover:bg-surface hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{section.title}</span>
                    </div>
                    {section.subsections && (
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isExpanded && "rotate-90"
                        )}
                      />
                    )}
                  </button>

                  {/* Subsections */}
                  {section.subsections && isExpanded && (
                    <ul className="mt-1 ml-6 space-y-1">
                      {section.subsections.map((sub) => (
                        <li key={sub.id}>
                          <button
                            onClick={() => onSectionChange(sub.id)}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                              activeSection === sub.id
                                ? "bg-surface text-foreground"
                                : "text-muted hover:bg-surface"
                            )}
                          >
                            {sub.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

// Feature Card for docs
const FeatureDocCard = ({
  id,
  icon: Icon,
  title,
  description,
  details,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  details: string[];
}) => (
  <div
    id={id}
    className="rounded-xl border border-border bg-background p-6 scroll-mt-20"
  >
    <div className="mb-4 inline-flex rounded-lg bg-surface p-3">
      <Icon className="h-6 w-6 text-foreground" />
    </div>
    <h3 className="mb-2 text-lg font-medium text-foreground">{title}</h3>
    <p className="text-muted mb-4">{description}</p>
    <ul className="space-y-2">
      {details.map((detail, i) => (
        <li
          key={i}
          className="flex items-start gap-2 text-sm text-muted"
        >
          <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{detail}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Content Sections
const OverviewSection = () => (
  <section id="overview" className="space-y-6">
    <h1 className="text-3xl font-medium text-foreground">概要</h1>
    <p className="text-lg text-muted">
      Pleno Transcribeは、音声メモをテキストに変換し、
      AIで要約・整理するボイスメモアプリです。
    </p>

    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-border bg-surface p-6">
        <Mic className="h-8 w-8 text-primary mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          簡単録音
        </h3>
        <p className="text-muted">
          ワンタップで録音開始。アイデアを逃しません。
        </p>
      </div>
      <div className="rounded-xl border border-border bg-surface p-6">
        <Sparkles className="h-8 w-8 text-primary mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          AI文字起こし
        </h3>
        <p className="text-muted">
          ElevenLabsの高精度STTで音声を即座にテキスト化。
        </p>
      </div>
    </div>

    <div className="rounded-xl border border-border bg-background p-6">
      <h3 className="text-lg font-medium text-foreground mb-4">
        主な特徴
      </h3>
      <ul className="space-y-3">
        {[
          "高精度な音声文字起こし（ElevenLabs STT）",
          "AIによる自動要約・タイトル生成（Gemini）",
          "録音メモの検索・管理",
          "ライト/ダークモード対応",
          "iOS/Android/Web対応",
        ].map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-3 text-muted"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

const GettingStartedSection = () => (
  <section id="getting-started" className="space-y-6">
    <h1 className="text-3xl font-medium text-foreground">
      インストール
    </h1>

    <div className="space-y-8">
      <div className="rounded-xl border border-border bg-background p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-medium">
            1
          </div>
          <h3 className="text-lg font-medium text-foreground">
            アプリをダウンロード
          </h3>
        </div>
        <p className="text-muted mb-4">
          GitHub Releasesから最新版をダウンロードしてください。
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/HikaruEgashira/pleno-transcribe/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Smartphone className="h-4 w-4" />
            <span>iOS / Android</span>
          </a>
          <a
            href="/website"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background text-foreground text-sm font-medium hover:bg-surface transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span>Web版を使う</span>
          </a>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-medium">
            2
          </div>
          <h3 className="text-lg font-medium text-foreground">
            録音を開始
          </h3>
        </div>
        <p className="text-muted">
          アプリを開いて、録音ボタンをタップするだけ。
          録音が完了すると自動で文字起こしが開始されます。
        </p>
      </div>

      <div className="rounded-xl border border-border bg-background p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-medium">
            3
          </div>
          <h3 className="text-lg font-medium text-foreground">
            AIで要約
          </h3>
        </div>
        <p className="text-muted">
          文字起こし完了後、AIが自動でタイトルと要約を生成。
          ノートとして保存され、いつでも検索・閲覧できます。
        </p>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section id="features" className="space-y-8">
    <h1 className="text-3xl font-medium text-foreground">機能</h1>

    <div className="space-y-8">
      <FeatureDocCard
        id="recording"
        icon={Mic}
        title="音声録音"
        description="高品質な音声録音機能。バックグラウンドでも録音を継続。"
        details={[
          "ワンタップで録音開始・停止",
          "バックグラウンド録音対応",
          "録音中のビジュアルフィードバック",
          "自動保存で録音を失わない",
        ]}
      />

      <FeatureDocCard
        id="transcription"
        icon={Volume2}
        title="文字起こし"
        description="ElevenLabs STTによる高精度な音声認識。"
        details={[
          "日本語・英語対応",
          "高速な処理（リアルタイムに近い速度）",
          "専門用語も高精度で認識",
          "句読点・改行の自動挿入",
        ]}
      />

      <FeatureDocCard
        id="ai-summary"
        icon={Sparkles}
        title="AI要約"
        description="Gemini AIによる自動要約とタイトル生成。"
        details={[
          "録音内容を簡潔に要約",
          "適切なタイトルを自動生成",
          "重要なポイントを抽出",
          "長時間の録音も素早く把握",
        ]}
      />

      <FeatureDocCard
        id="note-management"
        icon={FileText}
        title="ノート管理"
        description="録音メモを整理・管理。"
        details={[
          "ノート一覧表示",
          "詳細画面で全文確認",
          "編集・削除機能",
          "作成日時で並び替え",
        ]}
      />

      <FeatureDocCard
        id="search"
        icon={Search}
        title="検索"
        description="録音内容を全文検索。"
        details={[
          "タイトル・本文の全文検索",
          "インクリメンタルサーチ",
          "検索結果のハイライト表示",
        ]}
      />
    </div>
  </section>
);

const ArchitectureSection = () => (
  <section id="architecture" className="space-y-8">
    <h1 className="text-3xl font-medium text-foreground">
      アーキテクチャ
    </h1>

    <div className="space-y-8">
      <div
        id="client-server"
        className="rounded-xl border border-border bg-background p-6"
      >
        <h2 className="text-xl font-medium text-foreground mb-4">
          クライアント・サーバー構成
        </h2>
        <p className="text-muted mb-4">
          Expo (React Native) クライアントと tRPC バックエンドで構成。
          型安全なAPI通信を実現しています。
        </p>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center py-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <Smartphone className="h-4 w-4" />
            <span className="text-sm font-medium">Expo App</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted rotate-90 md:rotate-0" />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <Server className="h-4 w-4" />
            <span className="text-sm font-medium">tRPC Server</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted rotate-90 md:rotate-0" />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI Services</span>
          </div>
        </div>
      </div>

      <div
        id="tech-stack"
        className="rounded-xl border border-border bg-background p-6"
      >
        <h2 className="text-xl font-medium text-foreground mb-4">
          技術スタック
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-foreground">
                  項目
                </th>
                <th className="text-left py-3 px-4 font-medium text-foreground">
                  選択
                </th>
              </tr>
            </thead>
            <tbody className="text-muted">
              <tr className="border-b border-border">
                <td className="py-3 px-4">フロントエンド</td>
                <td className="py-3 px-4">Expo 54 + React Native 0.81</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-4">バックエンド</td>
                <td className="py-3 px-4">tRPC 11 + Express</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-4">音声認識</td>
                <td className="py-3 px-4">ElevenLabs STT</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-4">AI</td>
                <td className="py-3 px-4">Gemini</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 px-4">スタイリング</td>
                <td className="py-3 px-4">NativeWind (Tailwind CSS)</td>
              </tr>
              <tr>
                <td className="py-3 px-4">言語</td>
                <td className="py-3 px-4">TypeScript</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-6">
        <h2 className="text-xl font-medium text-foreground mb-4">
          ディレクトリ構成
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <Smartphone className="h-5 w-5 mt-0.5 text-muted" />
            <div>
              <h4 className="font-medium text-foreground">app/</h4>
              <p className="text-sm text-muted">
                Expo Router ページ（クライアント）
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Server className="h-5 w-5 mt-0.5 text-muted" />
            <div>
              <h4 className="font-medium text-foreground">apps/server/</h4>
              <p className="text-sm text-muted">tRPC バックエンド</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 mt-0.5 text-muted" />
            <div>
              <h4 className="font-medium text-foreground">packages/</h4>
              <p className="text-sm text-muted">
                共有ライブラリ（components, hooks, lib）
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Settings className="h-5 w-5 mt-0.5 text-muted" />
            <div>
              <h4 className="font-medium text-foreground">packages/infra/</h4>
              <p className="text-sm text-muted">Terraform IaC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const PrivacySection = () => (
  <section id="privacy" className="space-y-6">
    <h1 className="text-3xl font-medium text-foreground">
      プライバシー
    </h1>

    <div className="rounded-xl border border-border bg-background p-6">
      <h2 className="text-xl font-medium text-foreground mb-4">
        データの取り扱い
      </h2>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-500/20 flex-shrink-0 mt-0.5">
            <Shield className="h-3 w-3 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">
              セキュアな処理
            </h4>
            <p className="text-sm text-muted">
              音声データは暗号化されて送信され、処理後は即座に削除されます。
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-500/20 flex-shrink-0 mt-0.5">
            <Shield className="h-3 w-3 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">
              最小限のデータ収集
            </h4>
            <p className="text-sm text-muted">
              文字起こし・要約に必要な音声データのみを処理します。
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-500/20 flex-shrink-0 mt-0.5">
            <Shield className="h-3 w-3 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">
              データの所有権
            </h4>
            <p className="text-sm text-muted">
              録音データと文字起こし結果はすべてあなたのものです。
              いつでも削除できます。
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="rounded-xl border border-border bg-surface p-6">
      <h3 className="text-lg font-medium text-foreground mb-2">
        使用するサービス
      </h3>
      <p className="text-muted text-sm mb-4">
        以下のサードパーティサービスを使用しています：
      </p>
      <ul className="space-y-2 text-sm text-muted">
        <li className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          ElevenLabs - 音声文字起こし
        </li>
        <li className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          Google Gemini - AI要約・タイトル生成
        </li>
      </ul>
    </div>
  </section>
);

// Subsection IDs that should trigger scroll
const subsectionIds = new Set([
  "recording",
  "transcription",
  "ai-summary",
  "note-management",
  "search",
  "client-server",
  "tech-stack",
]);

// Footer Component
const Footer = () => (
  <footer className="border-t border-border py-8 lg:ml-72">
    <div className="max-w-4xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Mic className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-foreground">
            Pleno Transcribe
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted">
          <a
            href="/website"
            className="hover:text-foreground transition-colors"
          >
            ホーム
          </a>
          <a
            href="https://github.com/HikaruEgashira/pleno-transcribe"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  </footer>
);

// Main Component
export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll to subsection when selected
  useEffect(() => {
    if (subsectionIds.has(activeSection)) {
      setTimeout(() => {
        const element = document.getElementById(activeSection);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [activeSection]);

  // Get the main section key for motion animation
  const getMainSectionKey = () => {
    if (
      ["recording", "transcription", "ai-summary", "note-management", "search"].includes(
        activeSection
      )
    ) {
      return "features";
    }
    if (["client-server", "tech-stack"].includes(activeSection)) {
      return "architecture";
    }
    return activeSection;
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />;
      case "getting-started":
        return <GettingStartedSection />;
      case "features":
      case "recording":
      case "transcription":
      case "ai-summary":
      case "note-management":
      case "search":
        return <FeaturesSection />;
      case "architecture":
      case "client-server":
      case "tech-stack":
        return <ArchitectureSection />;
      case "privacy":
        return <PrivacySection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-background border-b border-border z-30 flex items-center px-4">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-surface"
        >
          <Menu className="h-5 w-5 text-muted" />
        </button>
        <span className="ml-3 font-medium text-foreground">
          ドキュメント
        </span>
      </header>

      <div className="flex flex-1">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={(id) => {
            setActiveSection(id);
            setIsMobileMenuOpen(false);
          }}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main content */}
        <main className="flex-1 pt-14 lg:pt-0 lg:ml-72">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <motion.div
              key={getMainSectionKey()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
