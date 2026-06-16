import { Routes, Route } from 'react-router-dom'
import { ConfigProvider, App as AntdApp, theme as antdTheme } from 'antd'
import { useTheme } from '@/context/ThemeContext'
import HomePage from '@/pages/HomePage/index.tsx'
import ProjectPage from '@/pages/ProjectPage/index.tsx'
import './styles/themes.less'

export default function App() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          borderRadius: 6,
          colorBgBase: isDark ? '#1a1a24' : '#ffffff',
          colorBgContainer: isDark ? '#1a1a24' : '#ffffff',
          colorBgElevated: isDark ? '#1e1e2a' : '#ffffff',
          colorBorder: isDark ? '#2a2a3a' : '#e8e8ec',
          colorText: isDark ? '#e8e8ec' : '#1a1a1a',
          colorTextSecondary: isDark ? '#8888a0' : '#888888',
          colorPrimary: isDark ? '#4fc3f7' : '#1677ff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: 13,
        },
        components: {
          List: { colorSplit: 'transparent' },
          Tree: {
            colorBgContainer: 'transparent',
            nodeHoverBg: isDark ? '#2e2e40' : '#f0f0f2',
            nodeSelectedBg: isDark ? '#1a3a5c' : '#e8f4ff',
          },
          Button: {
            colorBgContainer: isDark ? '#2a2a3a' : '#ffffff',
            colorBorder: isDark ? '#2a2a3a' : '#e8e8ec',
            defaultColor: isDark ? '#e8e8ec' : '#1a1a1a',
          },
          Input: {
            colorBgContainer: isDark ? '#0d0d14' : '#ffffff',
          },
          Modal: {
            contentBg: isDark ? '#1a1a24' : '#ffffff',
            headerBg: isDark ? '#1a1a24' : '#ffffff',
          },
          Select: {
            optionSelectedBg: isDark ? '#2e2e40' : '#f0f0f2',
          },
        },
      }}
    >
      <AntdApp>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:projectId" element={<ProjectPage />} />
        </Routes>
      </AntdApp>
    </ConfigProvider>
  )
}
