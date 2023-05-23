import React, { useContext } from 'react'
import { createStyles } from 'antd-style'
import IconFont from '~/components/icon/IconFont'
import { ThemeChangeContext } from '~/App'

export interface ThemeSwitchProps {
  className: string
  style?: React.CSSProperties
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = (props) => {
  const { styles, cx } = useStyles()
  const { appearance, changeAppearance } = useContext(ThemeChangeContext)

  return (
    <IconFont
      className={cx(styles.switch, props.className)}
      style={props.style}
      type={appearance === 'dark' ? 'sun' : 'moon'}
      onClick={changeAppearance}
    />
  )
}

export default ThemeSwitch

const useStyles = createStyles(({ token, css }) => {
  return {
    switch: css`
      cursor: pointer;

      &:hover {
        color: ${token.colorPrimaryHover};
      }
    `
  }
})
