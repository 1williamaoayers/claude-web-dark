import { Layout, Splitter, Tooltip } from 'antd'
import { HomeOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/context/ThemeContext'
import ChatPanel from '@/components/ChatPanel/index.tsx'
import TerminalPanel from '@/components/Terminal/index.tsx'
import { FileTreePanel } from '@/components/FileTreePanel/index.tsx'
import FullSpin from '@/components/FullSpin'
import SessionList from './components/SessionList'
import RightPanel from './components/RightPanel'
import type { useProjectPage } from './useProjectPage'

function v(name: string) { return `var(${name})` }

const C = {
  bg0: v('--c-bg0'),
  bg1: v('--c-bg1'),
  bg3: v('--c-bg3'),
  text0: v('--c-text0'),
  text1: v('--c-text1'),
  text2: v('--c-text2'),
  sidebar: v('--c-sidebar'),
}

type PageState = ReturnType<typeof useProjectPage>
interface Props extends PageState {}

export default function DesktopLayout(p: Props) {
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()

  return (
    <Layout
      className="projectPage"
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: C.bg0 }}
    >
      {p.preLoading && <FullSpin />}

      {!p.preLoading && (
        <>
          <Splitter layout="vertical" style={{ flex: 1, overflow: 'hidden' }}>
            <Splitter.Panel
              style={{ display: 'flex', flexDirection: 'row', overflow: 'hidden', minHeight: 0 }}
            >
              {/* 左侧工具栏 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32, paddingTop: 8, gap: 4, flexShrink: 0 }}>
                <Tooltip title="返回主页" placement="right">
                  <div
                    onClick={() => navigate('/')}
                    style={{
                      width: 32, height: 32, borderRadius: 6, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      color: C.text1, fontSize: 14,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.text0)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.text1)}
                  >
                    <HomeOutlined />
                  </div>
                </Tooltip>
                <Tooltip title={theme === 'dark' ? '切换亮色' : '切换暗黑'} placement="right">
                  <div
                    onClick={toggle}
                    style={{
                      width: 32, height: 32, borderRadius: 6, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      color: C.text1, fontSize: 14,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.text0)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.text1)}
                  >
                    {theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
                  </div>
                </Tooltip>
              </div>

              <Splitter style={{ flex: 1, overflow: 'hidden' }}>
                <Splitter.Panel
                  defaultSize="14%"
                  min="6%"
                  style={{ display: 'flex', flexDirection: 'column', background: C.bg0, overflow: 'hidden' }}
                >
                  <SessionList
                    projectCwd={p.projectCwd}
                    sessions={p.sessions}
                    activeId={p.activeId}
                    onSelect={p.selectSession}
                    onNew={p.startNewSession}
                    onDelete={p.deleteSession}
                  />
                </Splitter.Panel>

                <Splitter.Panel
                  defaultSize="44%"
                  min="20%"
                  style={{ display: 'flex', flexDirection: 'column', background: C.bg0, overflow: 'hidden' }}
                >
                  <ChatPanel
                    activeId={p.activeId}
                    sessionTitle={p.activeSession?.title}
                    messages={p.messages}
                    msgLoading={p.msgLoading}
                    loading={p.loading}
                    input={p.input}
                    onInputChange={p.setInput}
                    onSend={p.sendMessage}
                    onAbort={p.handleAbort}
                    onPasteImage={p.handlePasteImage}
                    activeProjectID={p.projectId ?? null}
                    pendingQuestion={p.pendingQuestion?.questions ?? null}
                    onResolve={p.handleResolve}
                    bypassPermissions={p.bypassPermissions}
                    onBypassPermissionsChange={p.setBypassPermissions}
                  />
                </Splitter.Panel>

                <Splitter.Panel
                  defaultSize="30%"
                  min="20%"
                  style={{ display: 'flex', flexDirection: 'column', background: C.bg1, overflow: 'hidden' }}
                >
                  <RightPanel
                    projectId={p.projectId ?? ''}
                    rightPanel={p.rightPanel}
                    onPanelChange={p.setRightPanel}
                    fileDiffs={p.fileDiffs}
                    selectedFile={p.selectedFile}
                    fileLoading={p.fileLoading}
                  />
                </Splitter.Panel>

                <Splitter.Panel
                  defaultSize="15%"
                  min="10%"
                  collapsible={{ start: true, end: true, showCollapsibleIcon: true }}
                  style={{ display: 'flex', flexDirection: 'column', background: C.bg0, overflow: 'hidden' }}
                >
                  <FileTreePanel
                    fileTree={p.fileTree}
                    treeSearch={p.treeSearch}
                    onSearchChange={p.setTreeSearch}
                    onSelectFile={p.openFile}
                  />
                </Splitter.Panel>
              </Splitter>
            </Splitter.Panel>

            <Splitter.Panel
              size={p.termOpen ? undefined : 0}
              defaultSize={220}
              min={80}
              max={600}
              style={{ overflow: 'hidden' }}
            >
              <TerminalPanel cwd={p.projectCwd} onClose={() => p.setTermOpen(false)} />
            </Splitter.Panel>
          </Splitter>

          <div
            style={{
              height: 24, background: C.sidebar, borderTop: `1px solid ${C.bg3}`,
              display: 'flex', alignItems: 'center', padding: '0 12px', gap: 12, flexShrink: 0,
            }}
          >
            <span
              onClick={() => p.setTermOpen((v: any) => !v)}
              style={{
                color: p.termOpen ? C.text0 : C.text1, fontSize: 11, cursor: 'pointer',
                userSelect: 'none', display: 'flex', alignItems: 'center', gap: 4,
                padding: '2px 6px', borderRadius: 4,
                background: p.termOpen ? C.bg3 : 'transparent',
              }}
            >
              ⌨ 终端
            </span>
            {p.activeSession && (
              <span style={{ color: C.text2, fontSize: 11, marginLeft: 'auto' }}>
                {p.activeSession.status === 'busy' ? '⟳ 运行中…' : '● 空闲'}
              </span>
            )}
          </div>
        </>
      )}
    </Layout>
  )
}
