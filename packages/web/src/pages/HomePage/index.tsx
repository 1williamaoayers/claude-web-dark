import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spin, App as AntdApp, Tooltip, Modal, Button, Input } from 'antd'
import {
  FolderOpenOutlined,
  BranchesOutlined,
  PlusOutlined,
  RightOutlined,
  LoadingOutlined,
  HomeOutlined,
  CheckCircleFilled,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons'
import { api, type ProjectInfo } from '@/http/index'
import TerminalPanel from '@/components/Terminal/index.tsx'
import FullSpin from '@/components/FullSpin'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useTheme } from '@/context/ThemeContext'
import './index.less'

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1) return '刚刚'
  if (m < 60) return `${m} 分钟前`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} 小时前`
  return `${Math.floor(h / 24)} 天前`
}

function ProjectCard({ project, onClick }: { project: ProjectInfo; onClick: () => void }) {
  const name = project.cwd.split('/').pop() || project.cwd
  const parentPath = project.cwd.split('/').slice(0, -1).join('/')

  return (
    <div className="projectCard" onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="projectCard-icon">
          <FolderOpenOutlined style={{ color: 'var(--c-primary)', fontSize: 16 }} />
        </div>
        <div style={{ overflow: 'hidden', paddingRight: 8 }}>
          <div className="projectCard-name">{name}</div>
          <div className="projectCard-path">
            <Tooltip title={parentPath}>{parentPath}</Tooltip>
          </div>
        </div>
      </div>

      <div className="projectCard-meta">
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <BranchesOutlined style={{ fontSize: 11 }} />
          <span>{project.sessionCount} 个会话</span>
        </div>
        <div className="projectCard-time">
          {project.updatedAt ? timeAgo(project.updatedAt) : '从未'}
        </div>
      </div>
    </div>
  )
}

function DirPicker({ selected, onSelect }: { selected: string; onSelect: (path: string) => void }) {
  const [currentPath, setCurrentPath] = useState('')
  const [dirs, setDirs] = useState<{ name: string; path: string }[]>([])
  const [loadingPath, setLoadingPath] = useState<string | null>(null)
  const css = (v: string) => `var(${v})`

  async function navigate(path?: string) {
    const target = path ?? ''
    setLoadingPath(target || '__root__')
    try {
      const res = await api.listDirs(path)
      setCurrentPath(res.path)
      setDirs(res.dirs)
    } finally {
      setLoadingPath(null)
    }
  }

  useEffect(() => { navigate() }, [])

  const segments = currentPath ? currentPath.split('/').filter(Boolean) : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {selected && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px',
          background: css('--c-primary-bg'), border: `1px solid ${css('--c-primary-border')}`,
          borderRadius: 6, fontSize: 12, color: css('--c-primary-text'),
        }}>
          <CheckCircleFilled style={{ color: css('--c-primary') }} />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selected}
          </span>
        </div>
      )}

      <div style={{
        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2,
        padding: '4px 8px', background: css('--c-bg2'), border: `1px solid ${css('--c-border')}`,
        borderRadius: 6, fontSize: 12,
      }}>
        <span
          onClick={() => navigate()}
          style={{ cursor: 'pointer', padding: '2px 4px', borderRadius: 4, color: css('--c-text1') }}
          onMouseEnter={e => (e.currentTarget.style.background = css('--c-bg-hover'))}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <HomeOutlined style={{ fontSize: 12 }} /> /
        </span>
        {segments.map((seg, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <RightOutlined style={{ fontSize: 10, color: css('--c-text2') }} />
            <span
              onClick={() => navigate('/' + segments.slice(0, i + 1).join('/'))}
              style={{
                cursor: 'pointer', padding: '2px 4px', borderRadius: 4, color: css('--c-text1'),
                fontWeight: i === segments.length - 1 ? 600 : 400,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = css('--c-bg-hover'))}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {seg.length > 14 ? seg.slice(0, 12) + '…' : seg}
            </span>
          </span>
        ))}
      </div>

      {dirs.length === 0 && <div style={{ textAlign: 'center', color: css('--c-text2'), padding: '8px 0', fontSize: 12 }}>暂无子目录</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 300, overflowY: 'auto' }}>
        {dirs.map((dir) => (
          <div
            key={dir.path}
            onClick={() => onSelect(dir.path)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
              borderRadius: 6, cursor: 'pointer', fontSize: 12,
              background: selected === dir.path ? css('--c-bg-selected') : 'transparent',
            }}
            onMouseEnter={e => { if (selected !== dir.path) e.currentTarget.style.background = css('--c-bg-hover') }}
            onMouseLeave={e => { if (selected !== dir.path) e.currentTarget.style.background = 'transparent' }}
          >
            <FolderOpenOutlined style={{ color: css('--c-primary'), fontSize: 14 }} />
            <span style={{ color: css('--c-text0') }}>{dir.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { theme, toggle } = useTheme()
  const css = (v: string) => `var(${v})`
  const [projects, setProjects] = useState<ProjectInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  async function loadProjects() {
    setLoading(true)
    try {
      const list = await api.listProjects()
      setProjects(list)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProjects() }, [])

  return (
    <div className="homePage">
      {loading ? (
        <FullSpin />
      ) : (
        <>
          <div className="homePage-content">
            <div className="homePage-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="homePage-header-title">Claude Web</div>
                <div className="homePage-header-subtitle">
                  Claude Code Agent <code>v0.1.1</code>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Tooltip title={theme === 'dark' ? '切换亮色' : '切换暗黑'}>
                  <Button
                    size="small"
                    icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
                    onClick={toggle}
                  />
                </Tooltip>
                <Button color="primary" variant="filled" icon={<PlusOutlined />} onClick={() => setShowModal(true)}>
                  添加项目
                </Button>
              </div>
            </div>

            {projects.length > 0 && (
              <Input.Search
                placeholder="筛选项目..."
                allowClear
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ margin: '10px 40px 4px', width: isMobile ? 'calc(100% - 80px)' : 300 }}
              />
            )}

            <div className="homePage-header-divider" />

            <div className="homePage-grid">
              {projects.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, gap: 10 }}>
                  <div style={{ fontSize: 40 }}>📁</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: css('--c-text1') }}>暂无项目</div>
                  <div style={{ fontSize: 12, color: css('--c-text2'), marginBottom: 16 }}>
                    点击下方按钮，选择项目目录即可开始
                  </div>
                  <Button color="primary" variant="filled" icon={<PlusOutlined />} onClick={() => setShowModal(true)}>
                    添加项目
                  </Button>
                </div>
              ) : (
                (() => {
                  const filtered = search.trim()
                    ? projects.filter((p) => p.cwd.toLowerCase().includes(search.trim().toLowerCase()))
                    : projects
                  return filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', color: css('--c-text2'), paddingTop: 40, fontSize: 13 }}>
                      没有匹配的项目
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                      {filtered.map((p) => (
                        <ProjectCard key={p.id} project={p} onClick={() => navigate(`/project/${p.id}`)} />
                      ))}
                    </div>
                  )
                })()
              )}
            </div>
          </div>

          {!isMobile && (
            <>
              <div className="homePage-divider" />
              <div className="homePage-terminal">
                <TerminalPanel
                  welcomeMessage={[
                    '\x1b[1;36m╔══════════════════════════════════════════════════╗\x1b[0m\r\n',
                    '\x1b[1;36m║         欢迎使用 Claude Web  🤖                  ║\x1b[0m\r\n',
                    '\x1b[1;36m╚══════════════════════════════════════════════════╝\x1b[0m\r\n',
                    '\r\n',
                  ].join('')}
                />
              </div>
            </>
          )}
        </>
      )}

      <Modal
        title="选择项目目录"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setShowModal(false)}>取消</Button>
          </div>
        }
      >
        <DirPicker
          selected=""
          onSelect={async (path) => {
            await api.linkProject(path)
            setShowModal(false)
            loadProjects()
            navigate(`/project/${path.replace(/[/\\]+/g, '-').replace(/-$/, '') || '-'}`)
          }}
        />
      </Modal>
    </div>
  )
}
