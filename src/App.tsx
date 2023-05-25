import React, { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useToggle } from 'ahooks'
import { ThemeProvider, createGlobalStyle } from 'antd-style'
import { App as AntdApp, ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import router from './router'
import { ThemeChangeContext } from './contexts'
import { Appearance } from '~/type'

const App: React.FC = () => {
  const [appearance, { toggle: changeAppearance }] = useToggle<
    Appearance,
    Appearance
  >('light', 'dark')

  return (
    <ConfigProvider locale={zhCN}>
      <ThemeProvider appearance={appearance}>
        <AntdApp>
          <GlobalStyle />
          <ThemeChangeContext.Provider value={{ appearance, changeAppearance }}>
            <Suspense>
              <RouterProvider router={router} />
            </Suspense>
          </ThemeChangeContext.Provider>
        </AntdApp>
      </ThemeProvider>
    </ConfigProvider>
  )
}

export default App

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    color: ${(p) => p.theme.colorText};
    background-color: ${(p) => p.theme.colorBgLayout};
    font-family: ${(p) => p.theme.fontFamily};
    font-size: ${(p) => p.theme.fontSize + 'px'};
  }
`
